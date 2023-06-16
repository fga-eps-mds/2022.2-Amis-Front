import React, { useState, useEffect } from 'react';
import { Item } from './item';
import { listarInstrucoes } from '../../services/instrucoes';

interface Styles {
  flexContainer: React.CSSProperties;
}

interface Item1 {
  nome: string;
  idCurso: string;
  descricao: string;
}

const styles: Styles = {
  flexContainer: {
    margin: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
};

const VisualizarInstrucao = () => {
  const [items, setItems] = useState<Item1[]>([]);

  useEffect(() => {
    // Função para fazer a requisição GET à API
    const fetchData = async () => {
      try {
        const response = await listarInstrucoes();
        const data = await response.data;
        console.log(data)
        setItems(data);
      } catch (error) {
        console.error('Erro ao buscar os dados da API:', error);
      }
    };

    fetchData(); // Chama a função de requisição ao montar o componente
  }, []);

  return (
    <div style={styles.flexContainer}>
      {items.map((item) => (
        <Item
          titulo={item.nome}
          subtitulo={item.idCurso}
          descricao={item.descricao}
        />
      ))}
    </div>
  );
};

export default VisualizarInstrucao;
