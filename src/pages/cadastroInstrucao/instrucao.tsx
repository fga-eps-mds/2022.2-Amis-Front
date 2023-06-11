import { GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import { useForm } from 'react-hook-form';
import { useQuery } from "react-query";
import { InstrucoesCadastrarDTO } from "./dtos/InstrucoesCadastrar.dto";
// import {
//   cadastrarInstrucao,
//   listarInstrucoes,
//   excluirInstrucao,
//   editarInstrucao,
// } from "../../services/instrucoes";
import VisualizarInstrucao from "./visualizarInstrucao";

import {
  getContainerStyles,
  getContentStyles,
  getDivButtonsStyles,
  getFormStyles,
  getFormTextStyles,
  getInlineStyles,
} from '../../shared/components/Style/style';


const Container = getContainerStyles();
const Content = getContentStyles();
const DivButtons = getDivButtonsStyles();
const Form = getFormStyles();
const FormText = getFormTextStyles();
const style = getInlineStyles();

export function Instrucao() {

  const [open, setOpen] = useState(false);
  const [instrucao,setInstrucao] = useState(Object);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState<Object[]>([]);
  const [id, setId] = useState<GridRowId>(0);
  const [selectedInstrucao, setSelectedInstrucao] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);

  const methods = useForm();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  function transformDate(date: any) {
    const parts = date.split('/');
    const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return transformedDate;
  }

  const cadastrarInstrucoes = async (data: any): Promise<void> => {

    // const response: any = await cadastrarInstrucao(instrucao);
    // if (response.status === 201) {
    //   handleClose();
    //   toast.success("Instrução cadastrada com sucesso!");
    // } else {
    //   toast.error("Erro ao cadastrar a instrucao.");
    // }
    // await queryClient.invalidateQueries("listar_instrucoes");
  };

  useQuery("listar_instrucoes", async () => {

    // const response = await listarInstrucoes();

    // const temp: InstrucoesListarDTO[] = [];
    // if (response.data && Array.isArray(response.data)) {
    //   response.data.forEach((value: InstrucoesListarDTO, index: number) => {
    //     temp.push({
    //       id: index, // Adiciona um id único com base no índice
    //       nome: value.nome,
    //       curso: value.curso,
    //       instrucao:value.instrucao,
    //     });
    //   });
    // }
    // setDataTable(temp);
  });


  const deleteInstrucao = async (): Promise<void> => {
    const selectedInstrucao = dataTable.find((item) => (item as any).id === id); // Encontra o objeto da instrucao com base no ID selecionado
    // if (selectedInstrucao) {
    //   const login = (selectedInstrucao as any).login; // Obtém o login da instrucao
    //   const response = await excluirInstrucao(login); // Passa o login para a função apagaInstrucao
    //   if (response.status === 204) {
    //     toast.success("Instrucao excluída com sucesso!");
    //   } else {
    //     toast.error("Erro ao excluir a instucao.");
    //   }

    //   handleCloseConfirmation();
    //   await queryClient.invalidateQueries("listar_instrucoes");
    // }
  };

  const carregarInstrucoes = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });

  };


  const editInstrucoes = async (data: any): Promise<void> => {
    
    const instrucaoEditada = {
      receita: data.nomeEdit,
      curso: data.cursoEdit,
      instrucao: data.instrucaoEdit,
      
    } as InstrucoesCadastrarDTO;


    // const response = await editarInstrucao(instrucao.login, instrucaoEditada);
    //   if (response.status === 200 || response.status === 204) {
    //     toast.success("Instrução atualizada com sucesso!");
    //   } else {
    //     toast.error("Erro na atualização da instrução.");
    //   }
    //   setOpenEdit(false);
    //   await queryClient.invalidateQueries("listar_instrucoes");
  };

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Instruções"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
          {/* <PrimaryButton text={"Editar"} /> */}
        </DivButtons>
        
        <VisualizarInstrucao />

        {/* <Dialog
          open={openConfirmation}
          onClose={setOpenConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Você tem certeza que deseja excluir a aluna ${selectedAluna}?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteAlunas} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog> */}
      </Content>
      {/* <Modal open={open} onClose={handleClose} aria-label="Modal de Cadastro">
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText id="cabecalho">
              Preencha corretamente os dados cadastrais.
            </FormText>
            <Form onSubmit={handleSubmit(cadastrarInstrucoes)}>
              
              <PrimaryButton text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal> */}

    </Container>
  );
}
