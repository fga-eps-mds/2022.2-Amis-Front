import {
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthProvider";
import { Navbar } from "../../shared/components/Navbar/navbar";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.colors.grey};
`;

const DivLogin = styled.div`
  width: 600px;
  height: 450px;
  background: ${(props) => props.theme.colors.white};
  margin-top: 5%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
`;

const Link = styled.a`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;

export function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { login, senha } = data;
  
    try {
      const request = await auth.authenticate(login, senha);
  
      if (request.token) {
        setLoading(false);
        navigate("/alunas");
      } else {
        toast.error("Não foi possível entrar, verifique as credenciais!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Não foi possível entrar, verifique as credenciais!");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Navbar hideButton={true} />
      <Content>
        <DivLogin>
          <Title>Acesse sua conta</Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="outlined-cpf"
              label="Login"
              {...register("login")}
              sx={{ width: "60%", background: "#F5F4FF" }}
            />
            <FormControl
              sx={{ width: "60%", background: "#F5F4FF" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Senha
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                {...register("senha")}
                endAdornment={
                  <InputAdornment position="end">
                    {showPassword ? (
                      <AiFillEyeInvisible
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        cursor="pointer"
                        size={20}
                      />
                    ) : (
                      <AiFillEye
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        cursor="pointer"
                        size={20}
                      />
                    )}
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Link>Esqueceu sua senha?</Link>
            <PrimaryButton>
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                <>Entrar</>
              )}
            </PrimaryButton>
          </Form>
        </DivLogin>
      </Content>
    </Container>
  );
}
