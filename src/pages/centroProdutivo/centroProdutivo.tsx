/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Modal,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import { GridActionsCellItem, GridRowId, DataGrid } from "@mui/x-data-grid";
import { useState, useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AiFillEdit } from 'react-icons/ai'
import { BsFillTrashFill } from 'react-icons/bs'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import {
  cadastrarCentro,
  editarCentro,
  excluirCentro,
  listarCentro,
  cadastrarNotaAluno,
  listarAlunasCentro,
  gerarRelatorio,
} from '../../services/centroProdutivo'
import { queryClient } from '../../services/queryClient'
import Navbarlog from '../../shared/components/NavbarLogada/navbarLogada'
import PrimaryButton from '../../shared/components/PrimaryButton/PrimaryButton'
import ActionButton from '../../shared/components/ActionButton/ActionButton'
import Sidebar from '../../shared/components/Sidebar/sidebar'
import DataTable from '../../shared/components/TablePagination/tablePagination'
import { CentrosCadastrarDTO } from './dtos/CentrosCadastrar.dto'
import { CentrosListarDTO } from './dtos/CentrosListar.dto'
import { NotaAlunoCadastrarDTO } from './dtos/NotaAlunoCadastrarDTO'
import { AuthContext } from '../../context/AuthProvider'
import ValueMask from '../../shared/components/Masks/ValueMask'


function transformDate(date: any) {
  const parts = date.split('/')
  const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`
  return transformedDate
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: ${(props) => props.theme.colors.grey};
  display: inline-flex;
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const DivButtons = styled.div`
  width: 85%;
  display: inline-flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 0 auto;
  padding-top: 30px;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`

const FormText = styled.h1`
  color: #525252;
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  padding-bottom: 25px;
`

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  padding: '50px',
  height: '75%',
  overflow: 'hidden',
  overflowY: 'scroll',
}

const styleBigBox = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  height: '85%',
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  padding: '25px',
  overflow: 'hidden',
  overflowY: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '30px',
}

const styleBoxForm = {
  overflowY: 'scroll',
  height: '90%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'top',
  alignItems: 'center',
  marginBottom: '100px',
  gap: '20px',
}
const styleFormMiniBox = {
  margin: '5px',
}

export function CentroProdutivo() {
  const [listaDeAlunas, setListaDeAlunas] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selectionModel:any) => {
    setSelectedRows(selectionModel);
  };

  const handleCellValueChange = (params:any) => {
    const updatedRows = listaDeAlunas.map((row:any) => {
      if (row.id === params.id) {
        return { ...row, [params.field]: params.value };
      }
      return row;
    });

    setListaDeAlunas(updatedRows);
  };

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleOpenConfirmation = () => setOpenConfirmation(true)
  const handleCloseConfirmation = () => setOpenConfirmation(false)
  const methods = useForm()
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedCentro, setSelectedCentro] = useState(null)
  const [Centro, setCentro] = useState(Object)
  const [id, setId] = useState<GridRowId>(0)
  const [openEdit, setOpenEdit] = useState(false)
  const [dataTable, setDataTable] = useState(Array<Object>)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods
  const { role } = useContext(AuthContext)
  const [openExportar, setOpenExportar] = useState(false)
  const handleOpenExportar = () => {
    setOpenExportar(true)
    console.log('Abrir tela de exportação')
  }
  const handleCloseExportar = () => {
    setOpenExportar(false)
    console.log('Fechar tela de exportação')
  }
  interface formData {
    nome: string
    comentario: string
    frequencia: number
    nota: number
    qtdProduzida: number
    qtdDesejada: number
  }
  const [formDataArray, setFormDataArray] = useState<formData[]>([])

  const handleAddForm = () => {
    setFormDataArray([...formDataArray, {} as formData])
  }

  const [openAgendar, setOpenAgendar] = useState(false)
  const handleOpenAgendar = () => {
    setOpenAgendar(true)
    console.log('Abrir tela de agendamento')
  }
  const handleCloseAgendar = () => {
    setOpenAgendar(false)
    console.log('Fechar tela de agendamento')
  }

  // const registerNotaAluno = async (data: any) => {
  //   const NotaAluno = {
  //     nome: data.nome,
  //     comentario: data.comentario,
  //     frequencia: data.frequencia,
  //     nota: data.frequencia,
  //     qtdProduzida: data.qtdProduzida,
  //     qtdDesejada: data.qtdDesejada,
  //   } as NotaAlunoCadastrarDTO;

  //   const response: any = await cadastrarNotaAluno(NotaAluno);

  //   if (response.status === 201) {
  //     setOpen(false);
  //     queryClient.invalidateQueries("listar_NotaAluno");
  //     toast.success("Nota do aluno cadastrada com sucesso!");
  //   }
  // }

  const carregarAlunasDoCentro= async (idDoCentro: any) => {
    const response = await listarAlunasCentro(idDoCentro);
    const temp: any[] = [];
    response.data.forEach((value: any, index: number) => {
      temp.push({
        id: index,
        nome_aluno: value.nome,
        login: value.login,
        confirmado: value.confirmado,
        centroId: value.status,
      });
    });
    setListaDeAlunas(temp);
  };

  const salvarDadosRelatorio = async(dadosAlunas:any)=>{
    const response = await gerarRelatorio(dadosAlunas);

    if (response.status === 201) {
      //setOpen(false)
      //queryClient.invalidateQueries('listar_centro')
      toast.success('Dados do relatorio salvos com sucesso!')
    } else {
      toast.error('Campos inválidos')
    }

  }

  const registerCentro = async (data: any) => {
    const dataFormatada = transformDate(data.data_agendada)
    const centro = {
      data_agendada: dataFormatada,
      descricao: data.descricao,
      status: data.status,
      turno: data.turno,
    } as CentrosCadastrarDTO
    console.log(data)
    const response = await cadastrarCentro(centro);

    if (response.status === 201) {
      setOpen(false)
      queryClient.invalidateQueries('listar_centro')
      toast.success('Centro cadastrado com sucesso!')
    } else {
      toast.error('Campos inválidos')
    }
  }

  useQuery('listar_centro', async () => {
    const response = await listarCentro()

    const temp: CentrosListarDTO[] = []
    response.data.forEach((value: CentrosListarDTO, index: number) => {
      console.log(value)
      temp.push({
        id: value.id,
        data_agendada: value.data_agendada,
        descricao: value.descricao,
        status: value.status,
        turno: value.turno,
      })
    })
    setDataTable(temp)
  })

  const deletarCentro = async () => {
    const response = await excluirCentro(id.toString())

    if (response.status === 204) {
      toast.success('Centro excluído com sucesso!')
    } else {
      toast.error('Erro ao excluir urso')
    }

    handleCloseConfirmation()
    await queryClient.invalidateQueries('listar_centro')
  }
  const carregarCentro = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element
      }
    })
    const centro = response as CentrosListarDTO
    setCentro(centro)
    console.log("Carregando o centro: "+centro.id);
    setValue('idEdit', centro.id)
    setValue('data_agendadaEdit', centro.data_agendada)
    setValue('descricaoEdit', centro.descricao)
    setValue('statusEdit', centro.status)
    setValue('turnoEdit', centro.turno)
    setOpenEdit(true)
  }

  const editCentro = async (data: any) => {
    const centroEditado = {
      id: Centro.id,
      data_agendada: data.data_agendadaEdit,
      descricao: data.descricaoEdit,
      status: data.statusEdit,
      turno: data.turnoEdit,
    }

    const response = await editarCentro(
      centroEditado.id.toString(),
      centroEditado
    )
    if (response.status === 201) {
      try {
        await queryClient.invalidateQueries('listar_centro')
        setOpenEdit(false)
        toast.success('Centro editado com sucesso!')
      } catch (error) {
        toast.error('Campos inválidos')
      }
    }
  }

  const columnsTableAlunasNoCentro = [
    { field: 'nome_aluno', headerName: 'Nome da Aluna', flex: 2 },
    {
      field: 'comentario',
      headerName: 'Comentario',
      flex: 2,
      renderCell: (params:any) => (
        <TextField
          value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'comentario', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Frequencia',
      flex: 1,
      renderCell: (params:any) => (
        <TextField
          value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'status', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'nota',
      headerName: 'Nota',
      flex: 1,
      renderCell: (params:any) => (
        <TextField
          value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'nota', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'quantidade_produzida',
      headerName: 'Qtd Produzida',
      flex: 1,
      renderCell: (params:any) => (
        <TextField
          value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'quantidade_produzida', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'quantidade_desejada',
      headerName: 'Qtd Desejada',
      flex: 1,
      renderCell: (params:any) => (
        <TextField
          value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'quantidade_desejada', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
  ];

  const columnsTableCentros = [
    { field: 'id', headerName: 'Código', flex: 1 },
    { field: 'descricao', headerName: 'Descrição', flex: 2 },
    { field: 'data_agendada', headerName: 'Data de Alocação', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'turno', headerName: 'Turno', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      type: 'actions',
      flex: 3,
      getActions: (params: { id: GridRowId }) => [
        <IconButton
          key='editar'
          id='meu-grid-actions-cell-item'
          data-testid='teste-editar'
          onClick={async () => {
            carregarCentro(params.id)
          }}
        >
          <AiFillEdit size={20} />
          <Typography variant='body2'></Typography>
        </IconButton>,

        <IconButton
          key='excluir'
          data-testid='teste-excluir'
          onClick={() => {
            setId(params.id)
            handleOpenConfirmation()
          }}
        >
          <BsFillTrashFill size={18} />
          <Typography variant='body2'></Typography>
        </IconButton>,
        <ActionButton
          key='agendar'
          text={'Agendar'}
          handleClick={handleOpenAgendar}
        />,
        <ActionButton
          key='exportar'
          text={'Exportar'}
          handleClick={() => {
            //queryClient.invalidateQueries('listar_alunas_cadastradas');
            handleOpenExportar();
            carregarCentro(params.id);
            carregarAlunasDoCentro(Centro.id);
          }}
        ></ActionButton>,
      ],
    },
  ]

  return (
    <Container>
      {' '}
      <Sidebar />
      <Content>
        <Navbarlog text={'Centros Produtivos'} />
        <DivButtons>
          {role !== 'student' ? (
            <PrimaryButton text={'Cadastrar'} handleClick={handleOpen} />
          ) : (
            <></>
          )}
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTableCentros} />
        <Dialog
          open={openConfirmation}
          onClose={setOpenConfirmation}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            {'Você tem certeza que deseja excluir?'}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deletarCentro} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText>Preencha corretamente os dados cadastrais.</FormText>
            <Form onSubmit={handleSubmit(registerCentro)}>
              <TextField
                id='outlined-descricao'
                label='Descrição'
                required={true}
                inputProps={{ maxLength: 500 }}
                {...register('descricao')}
                sx={{ width: '100%', background: '#F5F4FF' }}
              />
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label' required={true}>
                  Status
                </InputLabel>
                <Select
                  id='simple-select-label-status'
                  labelId='simple-select-status'
                  label='Status'
                  {...register('status')}
                  sx={{ width: '100%', background: '#F5F4FF' }}
                >
                  <MenuItem value={1 as any}>Disponível</MenuItem>
                  <MenuItem value={2 as any}>Ocupado</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label' required={true}>
                  Turno
                </InputLabel>
                <Select
                  id='simple-select-label-turno'
                  labelId='simple-select-turno'
                  label='Turno'
                  {...register('turno')}
                  sx={{ width: '100%', background: '#F5F4FF' }}
                >
                  <MenuItem value={1 as any}>Matutino</MenuItem>
                  <MenuItem value={2 as any}>Vespertino</MenuItem>
                  <MenuItem value={3 as any}>Noturno</MenuItem>
                  <MenuItem value={4 as any}>Diurno</MenuItem>
                </Select>
              </FormControl>

              <ValueMask label='data_agendada' />

              <PrimaryButton text={'Confirmar'} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
      <Box sx={style} style={{ width: 900 }}>
          <FormProvider {...methods}>
            <FormText
              style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}
            >
              Relatório da Produção.
            </FormText>
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginBottom: 50,
              }}
            >
              <TableContainer
                component={Paper}
                style={{ width: 280, justifyContent: "center" }}
              >
                <Table
                  sx={{ minWidth: 50, width: 280, whiteSpace: "nowrap" }}
                  aria-label="simple table"
                >
                </Table>
              </TableContainer>
            </div>
            {/* { TABELA DE ALUNAS NO CENTRO} */}
            {
              <DataGrid
              rows={listaDeAlunas}
              columns={columnsTableAlunasNoCentro}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
            }
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginTop: 20,
              }}
            >
              <PrimaryButton
                text={"Exportar PDF"}
                handleClick={() => salvarDadosRelatorio(listaDeAlunas[0])}
                //handleClick={() => console.log(listaDeAlunas[0].status)}
              />
            </div>
          </FormProvider>
        </Box>
      </Modal>
    </Container>
  )
}