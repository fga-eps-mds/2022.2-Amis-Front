import React, { useState, useContext } from 'react';
import PrimaryButton from '../../shared/components/PrimaryButton/PrimaryButton';
import { IconButton, Typography, Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { excluirInstrucao } from "../../services/instrucoes";
import { toast } from "react-toastify";
import { listarCursoPorId } from '../../services/cursos';
import { queryClient } from "../../services/queryClient";
import { AuthContext } from "../../context/AuthProvider";

interface Styles {
    flexContainer: React.CSSProperties;
    item: React.CSSProperties;
    modal: React.CSSProperties;
    modalContent: React.CSSProperties;
    button: React.CSSProperties;
    p: React.CSSProperties;
}
  
const styles: Styles = {
  flexContainer: {
    margin: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  item: {
    flex: '0 0 calc(33.33% - 20px)',
    width: 'calc(33.33% - 20px)',
    height: '200px',
    marginBottom: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)',
    padding: '20px',
    transition: 'height 0.3s ease',
    cursor: 'pointer',
    overflow: 'hidden',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  modalContent: {
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)',
    cursor: 'default',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '700px',
    minWidth: '500px',
    minHeight: '300px',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    transform: 'scale(0.5)',
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  p: {
    height: '80px',
    overflow: 'hidden'
  }
};


export function Item(props: any) {
    const [expanded, setExpanded] = useState(false);
    const [curso, setCurso] = useState(Object);
    const handleCloseConfirmation = () => setOpenConfirmation(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const handleOpenConfirmation = () => setOpenConfirmation(true);
    const { role } = useContext(AuthContext);

    const handleClick = () => {
      setExpanded(!expanded);
    };
    
    const handleClickModal = (id: any) => {
      props.openModal(id);
    }

    const deleteInstrucao = async (): Promise<void> => {
      const idItem = props.id
      if (idItem) {
        const response = await excluirInstrucao(idItem); // Passa o login para a função apagaInstrucao
        if (response.status === 204) {
          toast.success("Instrucao excluída com sucesso!");
        } else {
          toast.error("Erro ao excluir a instucao.");
        }
  
        handleCloseConfirmation();
        await queryClient.invalidateQueries("listar_instrucoes");
      }
    };

    // const getCurso = async (): Promise<void> =>  {
    //   const response = await listarCursoPorId(props.subtitulo);
    //   console.log(response)
    //   setCurso(response.data);
    // }

    // getCurso()
    // console.log(curso)

    return (
      <div style={styles.item}>
        <div onClick={handleClick}>
          <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
            <h3>{props.titulo}</h3>
            <h3 style={{ color: 'red' }}>{props.subtitulo}</h3>
          </div>
          <p style={styles.p}>{props.descricao}</p>
        </div>
          {role !== "student" && props.home == false && (
        <div>
          <IconButton
            id="meu-grid-actions-cell-item"
            data-testid="teste-editar"
            onClick={async () => {
              handleClickModal(props.id)
            }}
            >
            <AiFillEdit size={20} />
            <Typography variant="body2"></Typography>
          </IconButton>
          <IconButton
            data-testid="teste-excluir"
            onClick={() => {
              handleOpenConfirmation();
            }}
            >
            <BsFillTrashFill size={18} />
            <Typography variant="body2"></Typography>
          </IconButton>
        </div>
          )}
        <Dialog
          open={openConfirmation}
          onClose={setOpenConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Você tem certeza que deseja excluir?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteInstrucao} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
        {expanded && ( 
        <div style={styles.modal} onClick={handleClick}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
              <h2>{props.titulo}</h2>
              <h2 style={{ color: 'red' }}>Curso {props.subtitulo}</h2>
            </div>
            <p>{props.descricao}</p>
            <div style={{ justifyContent: 'center' }}>
              <PrimaryButton text="Fechar" handleClick={handleClick} />
            </div>
          </div>
        </div>
      )}
        </div>
);
};