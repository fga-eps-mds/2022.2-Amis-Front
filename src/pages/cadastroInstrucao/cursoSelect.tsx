import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai'; // Importando o ícone de lupa
import { CursosListarDTO } from '../curso/dtos/CursosListar.dto';

interface Styles {
  container: React.CSSProperties;
  select: React.CSSProperties;
  searchIcon: React.CSSProperties; // Adicionando estilo para o ícone de lupa
}

const styles: Styles = {
  container: {
    position: 'relative',
    marginLeft: '0px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    width: '100%'
  },
  select: {
    backgroundColor: "#F5F4FF",
    border: '1px solid #cccccc',
    borderRadius: '4px',
    color: '#555555',
    padding: '8px',
    flex: 1,
    fontSize: '15px',
    paddingRight: '30px' // Aumentando o padding à direita para acomodar o ícone de lupa
  },
  searchIcon: {
    position: 'absolute',
    right: '20px',
    color: '#555555', // Definindo a cor do ícone como a cor do texto
  },
};

interface CursoSelectProps {
  cursos: CursosListarDTO[];
  selectedOption: any;
  onSelectCurso: (curso: any) => void; // Função para manipular a seleção do curso
}

const CursoSelect: React.FC<CursoSelectProps> = (props) => {
  const handleCursoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCursoId = event.target.value === "" ? null : parseInt(event.target.value);
    props.onSelectCurso(selectedCursoId);
  };

  return (
    <div style={styles.container}>
      <select value={props?.selectedOption} style={styles.select} onChange={handleCursoChange}>
        <option>Selecione um curso</option> {/* Adicionando a primeira opção */}
        {props?.cursos?.map((curso: CursosListarDTO) => (
          <option key={curso.id} value={curso.id.toString()}>{curso.nome}</option>
        ))}
      </select>
      <AiOutlineSearch style={styles.searchIcon} /> {/* Ícone de lupa */}
    </div>
  );
};

export default CursoSelect;
