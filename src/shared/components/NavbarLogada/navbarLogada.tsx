import React from "react";
import styled from "styled-components";

const DivNavbar = styled.div`
  width: 100%;
  height: 100px;
  background: ${(props) => props.theme.colors.grey};
  padding: 20px 60px;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.black};
  font-size: 28px;
  font-weight: 500;
  height: 40px;
  border-right: 1px solid #c5bdbd;
  padding-right: 100px;
  display: flex;
  align-items: center;
`;

export function Navbarlog() {
  return (
    <DivNavbar>
      <Title> Alunas </Title>
    </DivNavbar>
  );
}
export default Navbarlog;
