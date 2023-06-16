import { GridRowId } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import { useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { InstrucoesCadastrarDTO } from "./dtos/InstrucoesCadastrar.dto";
import VisualizarInstrucao from "./visualizarInstrucao";
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
} from "@mui/material";
import {
  cadastrarInstrucao,
  editarInstrucao,
  excluirInstrucao,
  listarInstrucao,
} from "../../services/instrucoes";
import {
  getContainerStyles,
  getContentStyles,
  getDivButtonsStyles,
  getFormStyles,
  getFormTextStyles,
  getInlineStyles,
} from "../../shared/components/Style/style";
import { queryClient } from "../../services/queryClient";
const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: ${(props) => props.theme.colors.grey};
  display: inline-flex;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DivButtons = styled.div`
  width: 85%;
  display: inline-flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 0 auto;
  margin-right: 40px;
  padding-top: 70px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const FormText = styled.h1`
  color: #525252;
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  padding-bottom: 25px;
`;

const TextBox = styled.h1`
  color: #525252;
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  padding-bottom: 25px;
`;

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  padding: "50px",
  height: "85%",
  overflow: "hidden",
  overflowY: "scroll",
};

export function Instrucao() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [instrucao, setInstrucao] = useState(Object);
  const [dataTable, setDataTable] = useState<Object[]>([]);
  const [id, setId] = useState<GridRowId>(0);
  const [selectedInstrucao, setSelectedInstrucao] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);

  const methods = useForm();

  const registerInstrucao = async (data: any) => {
    const instrucao = {
      receita: data.receita,
      curso: data.curso,
      instrucao: data.descricao,
    } as InstrucoesCadastrarDTO;

    const response = await cadastrarInstrucao(instrucao);

    if (response.status === 201) {
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries("Listar_Instrucao");
      toast.success("Instrucao cadastrado com sucesso!");
    }
  };

  useQuery("listarInstrucao", async () => {
    const response = await listarInstrucao();

    const temp: InstrucoesListarDTO[] = [];
    response.data.forEach((value: InstrucoesListarDTO, index: number) => {});
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Instruções"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
        </DivButtons>
        <VisualizarInstrucao />
        {}
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText>
            Preencha corretamente os dados cadastrais da instrução
          </FormText>
          <Form onSubmit={handleSubmit(registerInstrucao)}>
            <TextField
              id="outlined-nomReceita"
              label="Nome da receita"
              required={true}
              inputProps={{ maxLenght: 70 }}
              {...register("nomeReceita")}
              sx={{ width: "100%", backgroud: "F5F4FF" }}
            />
            <TextField
              id="outlined-nomCurso"
              label="Curso"
              required={true}
              inputProps={{ maxLenght: 70 }}
              {...register("curso")}
              sx={{ width: "100%", backgroud: "F5F4FF" }}
            />
            <TextField
              id="outlined-nomInstrucao"
              label="Instrução"
              required={true}
              inputProps={{ maxLenght: 100 }}
              {...register("instrucao")}
              sx={{
                width: "100%",
                marginBottom: "5rem",
                backgroud: "F5F4FF",
                paddingBottom: "10px",
              }}
            />
            <PrimaryButton text="Cadastrar" />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
