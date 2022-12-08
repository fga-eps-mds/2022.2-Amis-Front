import styled from "styled-components";

const Button = styled.button`
  width: 150px;
  height: 50px;
  border-radius: 28px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.primary};
`;

export default Button;
