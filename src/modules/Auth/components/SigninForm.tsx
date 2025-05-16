import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useFormFactory } from "../../../common/hooks/useFormFactory";
import { useAuthToken } from "../hooks/useAuthToken";

enum SigninFormFields {
  email = "email",
  password = "password",
}

type FormState = {
  email: string;
  password: string;
};

export const SigninForm = () => {
  const { createInput } = useFormFactory();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>({ email: "", password: "" });
  const { handleSetIdToken } = useAuthToken();

  const getOnChangeInputEvent = (formField: SigninFormFields) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({
      ...formState,
      [formField]: event.target.value,
    });

  const emailInput = createInput(SigninFormFields.email, {
    onChange: getOnChangeInputEvent(SigninFormFields.email),
    size: "medium",
    required: true,
  });
  const passwordInput = createInput(SigninFormFields.password, {
    onChange: getOnChangeInputEvent(SigninFormFields.password),
    size: "medium",
    required: true,
  });

  const onClickSignin = () => {
    // TODO: esta linea deberia ser una llamada a un servicio
    // token expired in 60 sec.
    handleSetIdToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjYwMDAwfQ.rNK7KllXnzXIDxSsFoYELhxZX1ag_1tO819-_03Q548");
    // token expired in 10 sec.
    // setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjEwMDAwfQ.i0zeTzvoRsF7ZzVsnStdZ_QRfoWdYFHwqJQp4zE0tmc')
    navigate("/");
  };

  return (
    <div className="signin-form">
      {emailInput}
      {passwordInput}
      <div className="signin-form--buttons">
        <Button size="large">Recover password</Button>
        <Button variant="contained" size="large" onClick={onClickSignin}>
          Signin
        </Button>
      </div>
    </div>
  );
};
