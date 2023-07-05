import { useState, useContext } from "react";
import { useForm } from 'react-hook-form';
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { listarCurso } from "../../services/cursos";
import { cadastrarInstrucao, editarInstrucao, listarInstrucoes, listarInstrucoesPorCurso } from "../../services/instrucoes";
import { queryClient } from "../../services/queryClient";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import { CursosListarDTO } from "../curso/dtos/CursosListar.dto";
import { InstrucoesCadastrarDTO } from "./dtos/InstrucoesCadastrar.dto";
import { InstrucoesListarDTO } from "./dtos/InstrucoesListar.dto";
import { AuthContext } from "../../context/AuthProvider";

import VisualizarInstrucao from "./visualizarInstrucao";

import {
  getContainerStyles,
  getContentStyles,
  getDivButtonsStyles,
  getFormStyles,
  getFormTextStyles,
  getInlineStyles,
} from '../../shared/components/Style/style';

import {
  Box,
  Modal,
  TextField,
} from "@mui/material";

import { FormProvider } from "react-hook-form";
import CursoSelect from "./cursoSelect";
import { Navbar } from "../../shared/components/Navbar/navbar";

const Container = getContainerStyles();
const Content = getContentStyles();
const DivButtons = getDivButtonsStyles();
const Form = getFormStyles();
const FormText = getFormTextStyles();
const style = getInlineStyles();



export function Instrucao(props: any) {

  const [open, setOpen] = useState(false);
  const [instrucao,setInstrucao] = useState(Object);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [items, setItems] = useState<InstrucoesListarDTO[]>([]);
  const [options, setOptions] = useState<CursosListarDTO[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const { role } = useContext(AuthContext);

  useQuery("listar_instrucoes", async () => {
    const fetchData = async () => {
      try {
        const response = await listarInstrucoes();
        const data = await response.data;
  
        setItems(data);
      } catch (error) {
        console.error('Erro ao buscar as Intruções:', error);
      }
    };
    const fetchOptions = async () => {
      try {
        const response = await listarCurso();
        const options = await response.data;
        setOptions(options);
      } catch (error) {
        console.error('Erro ao buscar as Intruções', error);
      }
    };

    fetchData();
    fetchOptions();
  });

  const methods = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const cadastrarInstrucoes = async (data: any): Promise<void> => {
    const currentDate = new Date().toISOString().split("T")[0];
    const instrucao = {
      nome: data.nome,
      idCurso: data.idCurso,
      descricao: data.descricao,
      dataCadastro: currentDate,
    } as InstrucoesCadastrarDTO;

    const response: any = await cadastrarInstrucao(instrucao);
    if (response.status === 201) {
      handleClose();
      toast.success("Instrução cadastrada com sucesso!");
    } else {
      toast.error("Erro ao cadastrar a instrucao.");
    }
    await queryClient.invalidateQueries("listar_instrucoes");
  };

  const carregarInstrucoes = async (id: any) => {
    const response = items.find((item: any) => {
      if (item.id === id) {
        return item;
      }
    });

    const instrucao = response as InstrucoesListarDTO;
    setInstrucao(instrucao);
    setValue("nomeEdit", instrucao.nome);
    setValue("idCursoEdit", instrucao.idCurso);
    setValue("descricaoEdit",instrucao.descricao);
    setOpenEdit(true);
  };


  const editInstrucoes = async (data: any): Promise<void> => {
    
    const instrucaoEditada = {
      nome: data.nomeEdit,
      idCurso: data.idCursoEdit,
      descricao: data.descricaoEdit,
      dataCadastro: instrucao.dataCadastro,
      id: instrucao.id
      
    } as InstrucoesCadastrarDTO;
    const response = await editarInstrucao(instrucao.id, instrucaoEditada);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        toast.success("Instrução atualizada com sucesso!");
      } else {
        toast.error("Erro na atualização da instrução.");
      }
      setOpenEdit(false);
      await queryClient.invalidateQueries("listar_instrucoes");
  };

  const handleSelectChange = async (event: any) => {
    //setSelectedOption(event.target.value);
    console.log(event)
    if(event == null) 
      await queryClient.invalidateQueries("listar_instrucoes");
    else {
      const response = await listarInstrucoesPorCurso(event);
      if (response.status === 200 || response.status === 204) {
        const data = await response.data;
        setItems(data);
        toast.success("Instruções filtradas com sucesso!");
      } else {
        toast.error("Erro no filtro das instruções.");
      }
    }
  };

  return (
    <Container>
      {props.home === false &&
      <Sidebar />
      }
      <Content>
      {props.home === true && (
        <Navbar hideButton={true}/>
      )}
        <Navbarlog text={"Receitas"} />
        <CursoSelect 
          cursos={options} 
          onSelectCurso={handleSelectChange}
        />
        <DivButtons>
        {role !== "student" && props.home == false ? (
            <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
        ) : (
            <></>
        )}
        </DivButtons>
        <VisualizarInstrucao
          items={items}
          openModal={carregarInstrucoes}
          home={props.home}
        />

      </Content>
      <Modal open={open} onClose={handleClose} aria-label="Modal de Cadastro">
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText id="cabecalho">
              Preencha corretamente os dados cadastrais da instrução.
            </FormText>
            <Form onSubmit={handleSubmit(cadastrarInstrucoes)}>
              <TextField
                id="outlined-nome"
                label="Título"
                required={true}
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-curso"
                label="Curso"
                required={true}
                {...register("idCurso")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-observacao"
                label="Instrução"
                required={true}
                multiline 
                rows={10} 
                {...register("descricao")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <PrimaryButton text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={handleCloseEdit} aria-label="Modal de Cadastro">
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText id="cabecalho">
              Editar os dados cadastrais.
            </FormText>
            <Form onSubmit={handleSubmit(editInstrucoes)}>
              <TextField
                id="outlined-nome"
                label="Título"
                required={true}
                {...register("nomeEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nome"
                label="Curso"
                required={true}
                {...register("idCursoEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nome"
                label="Observção"
                required={true}
                multiline 
                rows={10} 
                {...register("descricaoEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <PrimaryButton text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>

    </Container>
  );
}