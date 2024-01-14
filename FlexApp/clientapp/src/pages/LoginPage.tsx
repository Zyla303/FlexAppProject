import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Logo } from "../components/Logo";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../components/Button";
import { useAppContext } from "../context/useAppContext";
import { useAuthQueries } from "../hooks/use-auth-queries";

interface LoginFormValues {
  userName: string;
  password: string;
}

interface RegisterFormValues {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatedPassword: string;
}

export const LoginPage: FC = () => {
  // juz nie mialem nerwow robic inaczej, sorka
  const [formType, setFormType] = useState<"login" | "register">("login");
  const { authenticateUser, deauthenticateUser } = useAppContext();
  const { login, register } = useAuthQueries({
    onLogin: authenticateUser,
    onLogout: deauthenticateUser,
  });

  const { register: loginFormRegister, handleSubmit: loginFormHandleSubmit } =
    useForm<LoginFormValues>();

  const {
    register: registerFormRegister,
    handleSubmit: registerFormHandleSubmit,
  } = useForm<RegisterFormValues>();

  const loginOnSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const registerOnSubmit = async (values: RegisterFormValues) => {
    register(values);
  };

  return (
    <div className="login-page">
      <Logo />

      {formType === "login" && (
        <Card className="login-card">
          <h2>Login</h2>
          <form
            className="login-form"
            onSubmit={loginFormHandleSubmit(loginOnSubmit)}
          >
            <Input
              label="Username"
              icon={<FontAwesomeIcon icon={faUser} />}
              {...loginFormRegister("userName")}
            />
            <Input
              label="Password"
              type="password"
              icon={<FontAwesomeIcon icon={faKey} />}
              {...loginFormRegister("password")}
            />
            <u onClick={() => setFormType("register")}>Register now</u>
            <Button label="Login" />
          </form>
        </Card>
      )}

      {formType === "register" && (
        <Card className="register-card">
          <h2>Register</h2>
          <form
            className="register-form"
            onSubmit={registerFormHandleSubmit(registerOnSubmit)}
          >
            <Input label="Username" {...registerFormRegister("userName")} />
            <Input label="First name" {...registerFormRegister("firstName")} />
            <Input label="Last name" {...registerFormRegister("lastName")} />
            <Input
              label="Password"
              type="password"
              {...registerFormRegister("password")}
            />
            <Input
              label="Repeat password"
              type="password"
              {...registerFormRegister("repeatedPassword")}
            />
            <u onClick={() => setFormType("login")}>
              Already have an account? Login
            </u>
            <Button label="Register" />
          </form>
        </Card>
      )}
    </div>
  );
};
