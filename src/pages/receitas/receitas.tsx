import React from "react";
import styled from "styled-components";
import { Navbar } from "../../shared/components/Navbar/navbar";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Title from "../../shared/components/Title/Title";
import { Footer } from "../../shared/components/Footer/footer";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const DivPresentation = styled.div`
  background-color: ${(props) => props.theme.colors.gray};
  display: flex;
  flex-direction: column;
  padding: 45px 120px 120px 100px;
`;

const DivHeaderReceitas = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;

export function Receitas() {
  return (
    <div>
      <Navbar />
      <DivPresentation>
        <DivHeaderReceitas>
          <Title fontSize={40} fontWeight={600}>
            RECEITAS
          </Title>
          <PrimaryButton
            text={"Cadastrar receita"}
            handleClick={() => console.log("BOTÃO")}
          />
        </DivHeaderReceitas>
        <Card sx={{ maxWidth: 330, borderRadius: 7, padding: 1 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Biscoito ou Bolacha
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat laboriosam, asperiores fugiat quae ad corporis.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </DivPresentation>
      <Footer />
    </div>
  );
}
