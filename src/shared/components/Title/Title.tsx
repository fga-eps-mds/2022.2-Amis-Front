import styled from "styled-components";

interface TitleProps {
  fontSize: number;
  fontWeight: number;
}

const Title = styled.h1<TitleProps>`
  font-size: ${(props) => `${props.fontSize}px`};
  font-weight: ${(props) => props.fontWeight};
  color: ${(props) => props.theme.colors.primary};
`;

export default Title;
