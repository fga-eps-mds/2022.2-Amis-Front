import React, { useState } from 'react';
import PrimaryButton from '../../shared/components/PrimaryButton/PrimaryButton';

interface Styles {
  flexContainer: React.CSSProperties;
  item: React.CSSProperties;
  modal: React.CSSProperties;
  modalContent: React.CSSProperties;
  button: React.CSSProperties;
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
    overflow: 'hidden'
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Alterado para um valor de transparência
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '700px',
    minWidth: '500px',
    minHeight: '300px',
  },
  button: {
    display: 'flex', // Alterado para 'flex' em vez de 'table-column'
    justifyContent: 'flex-end',
  },
};

export function Item(props: any) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={styles.item} onClick={handleClick}>
      <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
        <h3>{props.titulo}</h3>
        <h3 style={{ color: 'red' }}>Curso {props.subtitulo}</h3>
      </div>
      <p>{props.descricao}</p>
      {expanded && ( 
        <div style={styles.modal} onClick={handleClick}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
              <h2>{props.titulo}</h2>
              <h2 style={{ color: 'red' }}>Curso {props.subtitulo}</h2>
            </div>
            <p>{props.descricao}</p>
            <div style={{ justifyContent: 'center' }}>
              <br />
              <PrimaryButton text="Fechar" handleClick={handleClick} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
