import React, { useState } from 'react';
import { useTransition, animated } from 'react-spring';
import PrimaryButton from '../../shared/components/PrimaryButton/PrimaryButton';
import { IconButton, Typography, Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { excluirInstrucao } from "../../services/instrucoes";
import { toast } from "react-toastify";
import { queryClient } from "../../services/queryClient";


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
    backgroundColor: '#fff',
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
    display: 'table-column', 
    justifyContent: 'flex-end',
  },
  p: {
    height: '80px',
    overflow: 'hidden'
  }
};


export function Item(props: any) {
    const [expanded, setExpanded] = useState(false);
    const handleCloseConfirmation = () => setOpenConfirmation(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const handleOpenConfirmation = () => setOpenConfirmation(true);

  
    const handleClick = () => {
      setExpanded(!expanded);
    };

    const modalTransition = useTransition(expanded, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config: { duration: 300 },
    });
    
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
    return (
      <div style={styles.item}>
        <div onClick={handleClick}>
          <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
            <h3>{props.titulo}</h3>
            <h3 style={{ color: 'red' }}>Curso {props.subtitulo}</h3>
          </div>
          <p style={styles.p}>{props.descricao}</p>
        </div>
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
        {modalTransition((style, item) =>
          item && (
            <animated.div style={{ ...styles.modal, ...style }} onClick={handleClick}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={{justifyContent: 'space-between'}}>
                  <div style={styles.button} onClick={(e) => e.stopPropagation()}>
                      <PrimaryButton text={'X'} handleClick={handleClick} />
                  </div>
                  <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
                    <h2>{props.titulo}</h2>
                    <h2 style={{ color: 'red' }}>Curso {props.subtitulo}</h2>
                  </div>
                  <p>{props.descricao}</p>
                </div>
                <div style={{justifyContent: 'center'}}>
                  <br/>
                  <PrimaryButton text="Fechar" handleClick={handleClick} />
                </div>
              </div>
            </animated.div>
          )
        )}
      </div>
    );
  };