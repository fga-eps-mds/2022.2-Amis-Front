import { Navbar } from "../../shared/components/Navbar/navbar";
import { Footer } from "../../shared/components/Footer/footer";
import styled from "styled-components";
import home_image1 from "../../assets/home_image1.png";
import home_image2 from "../../assets/home_image2.png";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { QtdAlunasDTO } from "./dtos/QtdAlunas.dto";
import axios from "axios";
import { useQuery } from "react-query";
import { QtdAlunasFormDTO } from "./dtos/QtdAlunasForm.dto";


const DivPresentation = styled.div`
  background-color: ${(props) => props.theme.colors.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 120px 120px 150px;
`;

const DivPresentationText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  border-radius: 35%;
`;

const HomeText = styled.h1`
  color: ${(props) => props.theme.colors.darkGray};
  font-weight: bold;
  font-size: 60px;
`;

const DivText = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  align-items: center;
  padding: 70px 150px 120px 150px;
  text-align: center;
`;

const TitleText = styled.h1`
  font-weight: bold;
  font-size: 45px;
  text-align: center;
  padding: 40px;
`;

const Text = styled.span`
  font-weight: light;
  font-size: 20px;
  color: #4f4f4f;
`;

const DivCounter = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  padding: 45px 150px;
  justify-content: space-evenly;
`;

const DivEachCounter = styled.div`
  width: 300px;
  text-align: center;
`;

const CounterNumber = styled.h1`
  font-size: 70px;
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

const CounterText = styled.span`
  color: ${(props) => props.theme.colors.white};
  font-weight: 400px;
  font-size: 25px;
`;

const DivRec = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  padding: 95px 300px;
`;

const TituloReceitas = styled.h1`
  font-weight: bold;
  font-size: 50px;
  text-align: center;
`;

export function Home() {
  /*const [qtdAluna, setQtdAluna] = useState<QtdAlunasDTO>();
  const [qtdAlunaForm, setQtdAlunaForm] = useState<QtdAlunasFormDTO>();

  useQuery("quantidade_alunas", async () => {
    const responseQtdAlunas = await baseApi.get("/alunas/count/");
    setQtdAluna(responseQtdAlunas.data as QtdAlunasDTO);
  });

  useQuery("quantidade_alunasFormadas", async () => {
    const responseQtdFormadas = await baseApi.get("/alunas/count/formada");
    setQtdAlunaForm(responseQtdFormadas.data as QtdAlunasFormDTO);
  });*/


  return (
    <div>
      <Navbar />
      <DivPresentation>
        <DivPresentationText>
          <HomeText>AMIS</HomeText>
          <HomeText>Mulheres Criativas</HomeText>
          <span style={{ paddingTop: "30px" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </span>
          <span style={{ paddingBottom: "30px" }}>
            Varius sed pharetra dictum neque massa congue
          </span>
          <div style={{ display: "flex", gap: "15px" }}>
            <PrimaryButton text="Saiba Mais" />
            <PrimaryButton text="Faça um pedido" />
          </div>
        </DivPresentationText>
        <div style={{ position: "relative" }}>
          <Image
            src={home_image1}
            style={{
              width: "300px",
              zIndex: 5,
              position: "absolute",
              bottom: -80,
              left: -200,
            }}
          ></Image>
          <Image
            src={home_image2}
            style={{ width: "400px", zIndex: 0 }}
          ></Image>
        </div>
      </DivPresentation>
      <DivText>
        <TitleText>Quem Somos</TitleText>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          aliquam egestas ultricies. Morbi venenatis, odio a laoreet vulputate,
          sapien tellus ornare orci, sit amet feugiat arcu dui sed lorem.
          Maecenas et lacus vel lacus lacinia porttitor. Nulla tempus dictum
          efficitur. Suspendisse potenti. Sed ac nulla eget nunc tempor faucibus
          sed et mauris. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Suspendisse potenti. Quisque tortor ipsum, tincidunt eget ligula
          at, aliquet commodo purus. Vestibulum ante ipsum primis in faucibus
          orci luctus et ultrices posuere cubilia curae; In pretium leo ac dolor
          gravida pretium. Sed eu venenatis lacus, efficitur pulvinar massa.
          Morbi aliquet sapien vitae purus tincidunt, eget consequat erat
          iaculis. Donec ut sem ac sapien laoreet congue id et neque. Ut
          fermentum non libero ut consequat. Quisque elementum velit eget ipsum
          suscipit rutrum.
        </Text>
        <TitleText> Nossa missão</TitleText>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          aliquam egestas ultricies. Morbi venenatis, odio a laoreet vulputate,
          sapien tellus ornare orci, sit amet feugiat arcu dui sed lorem.
          Maecenas et lacus vel lacus lacinia porttitor. Nulla tempus dictum
          efficitur. Suspendisse potenti. Sed ac nulla eget nunc tempor faucibus
          sed et mauris. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Suspendisse potenti. Quisque tortor ipsum, tincidunt eget ligula
          at, aliquet commodo purus. Vestibulum ante ipsum primis in faucibus
          orci luctus et ultrices posuere cubilia curae; In pretium leo ac dolor
          gravida pretium. Sed eu venenatis lacus, efficitur pulvinar massa.
          Morbi aliquet sapien vitae purus tincidunt, eget consequat erat
          iaculis. Donec ut sem ac sapien laoreet congue id et neque. Ut
          fermentum non libero ut consequat. Quisque elementum velit eget ipsum
          suscipit rutrum.
        </Text>
      </DivText>
      <DivCounter>
        <DivEachCounter>
          <CounterNumber></CounterNumber>
          <CounterText>Mulheres atendidas</CounterText>
        </DivEachCounter>
        <DivEachCounter>
          <CounterNumber></CounterNumber>
          <CounterText>Formações profissionais</CounterText>
        </DivEachCounter>
      </DivCounter>
      <DivRec>
        <div>
          <TituloReceitas>Nossas receitas</TituloReceitas>
        </div>
      </DivRec>
      <Footer />
    </div>
  );
}
