import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import { useTranslation } from "react-i18next";

// import { Container } from './styles';
import { signUp } from "../../services/apiCalls";

const SignUp: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const { password, confirmPassword } = inputs;
    if (
      password.length &&
      confirmPassword.length &&
      password === confirmPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputs]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setDisabled(true);
      await signUp(inputs);
      setSignUpSuccess(true);
      clearFields();
    } catch (error: any) {
      if (error.response.status === 400) {
        const {
          validationErrors: { email, password, username },
        } = error.response.data;
        setErrors({ ...errors, email, password, username });
      }
      setLoading(false);
      setDisabled(false);
      setSignUpSuccess(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const clearFields = () => {
    setLoading(false);
    setInputs({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({ username: "", email: "", password: "" });
  };
  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      <div className="card mt-5">
        <div className="card-header">
          <h1 className="text-center mt-3">{t("signUp")}</h1>
        </div>
        <div className="card-body">
          {!signUpSuccess && (
            <form onSubmit={handleSubmit} data-testid="form-sign-up">
              <Input
                label={t("username")}
                name="username"
                id="username"
                value={inputs.username}
                type="text"
                onChange={handleChange}
                error={errors?.username}
                placeholder="Enter your username"
              />
              <Input
                label={t("email")}
                name="email"
                id="email"
                value={inputs.email}
                type="email"
                onChange={handleChange}
                error={errors?.email}
                placeholder="Enter your email"
              />

              <Input
                type="password"
                name="password"
                id="password"
                label={t("password")}
                error={errors?.password}
                value={inputs.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <Input
                label={t("passwordConfirm")}
                name="confirmPassword"
                placeholder="Confirm your password"
                id="password_confirm"
                type="password"
                value={inputs.confirmPassword}
                onChange={handleChange}
              />

              <button disabled={disabled} className="btn btn-primary btn-md">
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                )}{" "}
                {t("signUp")}
              </button>
            </form>
          )}
          {signUpSuccess && (
            <div className="alert alert-success  mt-3 text-center" role="alert">
              Please check your email for activate your account
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
