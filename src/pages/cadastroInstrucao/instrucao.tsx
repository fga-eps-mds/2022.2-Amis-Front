import { Box, Modal, TextField } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { cadastrarInstrucao } from "../../services/instrucoes";
import { queryClient } from "../../services/queryClient";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import { InstrucoesCadastrarDTO } from "./dtos/InstrucoesCadastrar.dto";
import VisualizarInstrucao from "./visualizarInstrucao";

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

interface Item1 {
  nome: string;
  idCurso: string;
  descricao: string;
}

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const registerInstrucao = async (data: any) => {
    const currentDate = new Date().toISOString().split("T")[0];

    const instrucao = {
      nome: data.nomeReceita,
      idCurso: data.curso,
      descricao: data.instrucao,
      dataCadastro: currentDate.toString(),
    } as InstrucoesCadastrarDTO;

    const response = await cadastrarInstrucao(instrucao);

    if (response.status === 201) {
      setOpen(false);
      toast.success("Instrução cadastrada com sucesso!");
    }
  };

  // const deletarInstrucao = async () => {
  //   const response = await excluirInstrucao(id.toString());

  //   if (response.status === 204) {
  //     toast.success("Instrução excluída com sucesso!");
  //   } else {
  //     toast.error("Erro ao excluir Instrução");
  //   }
  // };

  return (
    <Container>
      {" "}
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
              label="Título"
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
