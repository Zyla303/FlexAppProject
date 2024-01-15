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
import { StatusInfo } from "../components/StatusInfo";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

const schema = yup
  .object()
  .shape({
    userName: yup.string().required("User Name is required"),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})/,
        "Must Contain 5 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      )
      .required("Password is required"),
    repeatedPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  })
  .required();

export const LoginPage: FC = () => {
  // juz nie mialem nerwow robic inaczej, sorka
  const [formType, setFormType] = useState<"login" | "register">("login");
  const { authenticateUser, deauthenticateUser } = useAppContext();
  const {
    login: { mutate: login, error: loginError },
    register,
  } = useAuthQueries({
    onLogin: authenticateUser,
    onLogout: deauthenticateUser,
  });

  const { register: loginFormRegister, handleSubmit: loginFormHandleSubmit } =
    useForm<LoginFormValues>();

  const {
    register: registerFormRegister,
    handleSubmit: registerFormHandleSubmit,
    formState: { errors: registerFormErrors, isValid },
  } = useForm<RegisterFormValues>({
    mode: "all",
    resolver: yupResolver(schema),
  });

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
            {!!loginError && (
              <StatusInfo status="error" message="Login failed" />
            )}
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
            <Input
              label="Username"
              errorMessage={registerFormErrors.userName?.message}
              {...registerFormRegister("userName")}
            />
            <Input
              label="First name"
              errorMessage={registerFormErrors.firstName?.message}
              {...registerFormRegister("firstName")}
            />
            <Input
              label="Last name"
              errorMessage={registerFormErrors.lastName?.message}
              {...registerFormRegister("lastName")}
            />
            <Input
              label="Password"
              type="password"
              errorMessage={registerFormErrors.password?.message}
              {...registerFormRegister("password")}
            />
            <Input
              label="Repeat password"
              type="password"
              errorMessage={registerFormErrors.repeatedPassword?.message}
              {...registerFormRegister("repeatedPassword")}
            />
            <u onClick={() => setFormType("login")}>
              Already have an account? Login
            </u>
            <Button label="Register" disabled={!isValid} />
          </form>
        </Card>
      )}
    </div>
  );
};
