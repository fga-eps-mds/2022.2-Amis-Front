import React, { useState } from 'react';
import { useTransition, animated } from 'react-spring';
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
    cursor: 'default',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '700px',
    minWidth: '500px',
    minHeight: '300px',
  },
  button: {
    transform: 'scale(0.5)',
    marginTop: 'auto',
    display: 'table-column', 
    justifyContent: 'flex-end',
  }
};

const Item = ({ title, subtitle, description }: { title: string; subtitle: string; description: string }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const modalTransition = useTransition(expanded, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  return (
    <div style={styles.item} onClick={handleClick}>
      <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
        <h3>{title}</h3>
        <h3 style={{ color: 'red' }}>{subtitle}</h3>
      </div>
      <p>{description}</p>
      {modalTransition((style, item) =>
        item && (
          <animated.div style={{ ...styles.modal, ...style }} onClick={handleClick}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.button} onClick={(e) => e.stopPropagation()}>
                <PrimaryButton text={'X'} handleClick={handleClick} />
              </div>
              <div style={{ fontWeight: 'bold', justifyContent: 'space-between', display: 'flex', paddingBottom: '20px' }}>
                <h2>{title}</h2>
                <h2 style={{ color: 'red' }}>{subtitle}</h2>
              </div>
              <p>{description}</p>
              <div style={{justifyItems: 'center'}}>
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

const VisualizarInstrucao = () => {
  return (
    <div style={styles.flexContainer}>
      <Item title="Receita 1" subtitle="Turma 1" description="Descrição da instrução 1" />
      <Item title="Receita 2" subtitle="Turma 2" description="Descrição da instrução 2" />
      <Item title="Receita 3" subtitle="Turma 3" description="Descrição da instrução 3" />
      <Item title="Receita 4" subtitle="Turma 4" description="Descrição da instrução 4" />
      <Item title="Receita 5" subtitle="Turma 5" description="Descrição da instrução 5" />
      <Item title="Receita 6" subtitle="Turma 6" description="Descrição da instrução 6" />
      <Item title="Receita 7" subtitle="Turma 7" description="Descrição da instrução 7" />
    </div>
  );
};

export default VisualizarInstrucao;
