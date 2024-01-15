import { FC } from "react";
import { Card } from "../components/Card";
// TODO zdjecie jest na sztywno wrzucone, jak nie mamy profilowek to trzeba by zmienic tego chlopa na innego
import profilePic from "../assets/default-profile-pic.png";
import { useAppContext } from "../context/useAppContext";
import { useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import "../styles/profiles-content.scss";
import { useAuthQueries } from "../hooks/use-auth-queries";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  newPasswordRepeated: string;
}

const schema = yup
  .object()
  .shape({
    currentPassword: yup.string().required("Current Password is required"),
    newPassword: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})/,
        "Must Contain 5 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      )
      .required("Password is required"),
    newPasswordRepeated: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  })
  .required();

export const ProfileContent: FC = () => {
  const { loggedUserData, deauthenticateUser } = useAppContext();
  const {
    logout,
    changePassword: { mutate: changePassword, error },
  } = useAuthQueries({
    onLogout: deauthenticateUser,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<ChangePasswordFormValues>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({
    currentPassword,
    newPassword,
  }: ChangePasswordFormValues) => {
    changePassword({
      userId: loggedUserData?.id ?? "",
      currentPassword,
      newPassword,
    });
    reset();
  };

  return (
    <Card className="profile-content">
      <div className="left-side">
        <div className="profile-pic-container">
          <img src={profilePic} alt="profile-pic" className="profile-pic" />
        </div>
        <div className="name-logout-container">
          <p>{loggedUserData?.userName}</p>
          <Button label="Logout" onClick={logout} />
        </div>
      </div>
      <div className="right-side">
        <p>Change your password</p>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Current password"
            type="password"
            errorMessage={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <Input
            label="New password"
            type="password"
            errorMessage={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Repeat new password"
            type="password"
            errorMessage={errors.newPasswordRepeated?.message}
            {...register("newPasswordRepeated")}
          />
          <Button
            disabled={!(Object.keys(errors).length === 0) && !isValid}
            label="Change password"
          />
        </form>
        {error && (
          <p className="response-error">{error?.response?.data as string}</p>
        )}
      </div>
    </Card>
  );
};
