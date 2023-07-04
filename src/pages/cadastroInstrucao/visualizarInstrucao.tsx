import React from 'react';
import { Item } from './item';

interface Styles {
  flexContainer: React.CSSProperties;
}

const styles: Styles = {
  flexContainer: {
    margin: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
};

const VisualizarInstrucao = (props: any | []) => {
  const handleClickModal = (id: any) => {
    // Chamando a função de callback passada como propriedade
    console.log(id)
    props.openModal(id);
  }

  return (
    <div style={styles.flexContainer}>
      {props?.items?.map((item: any) => (
        <Item
          id={item.id}
          titulo={item.nome}
          subtitulo={item.idCurso}
          descricao={item.descricao}
          openModal={handleClickModal}
          home={props.home}
        />
      ))}
    </div>
  );
};

export default VisualizarInstrucao;