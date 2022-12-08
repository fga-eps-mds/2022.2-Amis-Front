import React from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.grey};
  display: inline-flex;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export function Alunas() {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog />
      </Content>
    </Container>
  );
}
