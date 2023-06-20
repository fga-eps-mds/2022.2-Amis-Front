import { useState, useEffect } from "react";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import { useForm } from 'react-hook-form';
import { useQuery } from "react-query";
import { CursosListarDTO } from "../curso/dtos/CursosListar.dto";
import { InstrucoesCadastrarDTO } from "./dtos/InstrucoesCadastrar.dto";
import { InstrucoesListarDTO } from "./dtos/InstrucoesListar.dto";
import { cadastrarInstrucao, listarInstrucoes, listarInstrucoesPorCurso, editarInstrucao } from "../../services/instrucoes";
import { listarCurso } from "../../services/cursos";
import { queryClient } from "../../services/queryClient";
import { toast } from "react-toastify";

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
  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [items, setItems] = useState<InstrucoesListarDTO[]>([]);
  const [options, setOptions] = useState<CursosListarDTO[]>([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    // Função para fazer a requisição GET à API
    const fetchData = async () => {
      try {
        const response = await listarInstrucoes();
        const data = await response.data;
        console.log(data)
        setItems(data);
      } catch (error) {
        console.error('Erro ao buscar as Intruções:', error);
      }
    };
    const fetchOptions = async () => {
      try {
        const response = await listarCurso();
        const options = await response.data;
        console.log(options)
        setOptions(options);
      } catch (error) {
        console.error('Erro ao buscar os Cursos:', error);
      }
    };

    // Chama a função de requisição ao montar o componente
    fetchData();
    fetchOptions();
  }, []);

  const methods = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  // function transformDate(date: any) {
  //   const parts = date.split('/');
  //   const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  //   return transformedDate;
  // }

  const cadastrarInstrucoes = async (data: any): Promise<void> => {
    const instrucao = {
      nome: data.nome,
      idCurso: data.idCurso,
      descricao: data.descricao,
      dataCadastro: data.dataCadastro,
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
    setSelectedOption(event.target.value);
    console.log(event.target.value)
    const response = await listarInstrucoesPorCurso(event.target.value);
      if (response.status === 200 || response.status === 204) {
        const data = await response.data;
        setItems(data);
        toast.success("Instruções filtradas com sucesso!");
      } else {
        toast.error("Erro no filtro das instruções.");
      }
  };

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Instruções"} />
        <DivButtons>
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="">Selecione um curso</option>
          {options.map((option: any) => (
            <option value={option.id}>
              {option.nome}
            </option>
          ))}
        </select>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
          {/* <PrimaryButton text={"Editar"} /> */}
        </DivButtons>
        
        <VisualizarInstrucao
          items={items}
          openModal={carregarInstrucoes}/>

      </Content>
      <Modal open={open} onClose={handleClose} aria-label="Modal de Cadastro">
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText id="cabecalho">
              Preencha corretamente os dados cadastrais.
            </FormText>
            <Form onSubmit={handleSubmit(cadastrarInstrucoes)}>
              <TextField
                id="outlined-nome"
                label="Nome da Receita"
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
                label="Observação"
                required={true}
                multiline 
                rows={10} 
                {...register("descricao")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-dataCadastro"
                label="Data de Cadastro"
                required={true}
                {...register("dataCadastro")}
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
                label="Nome da Receita"
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
