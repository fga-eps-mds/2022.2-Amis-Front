import React from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.grey};
`;

export function Alunas() {
  return (
    <Container>
      <Sidebar />
    </Container>
  );
}
