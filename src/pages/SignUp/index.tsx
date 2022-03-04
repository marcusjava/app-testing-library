import React, { useEffect, useState } from "react";
import Input from "../../components/Input";

// import { Container } from './styles';
import api from "../../services/api";

const SignUp: React.FC = () => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (
      password.length &&
      confirmPassword.length &&
      password === confirmPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [confirmPassword, password, username, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
    };
    try {
      setLoading(true);
      setDisabled(true);
      await api.post("/users", data);
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

  const clearFields = () => {
    setLoading(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({ username: "", email: "", password: "" });
  };
  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      <div className="card mt-5">
        <div className="card-header">
          <h1 className="text-center mt-3">Sign Up</h1>
        </div>
        <div className="card-body">
          {!signUpSuccess && (
            <form onSubmit={handleSubmit} data-testid="form-sign-up">
              <Input
                label="Username"
                id="username"
                value={username}
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                error={errors?.username}
                placeholder="Enter your username"
              />
              <Input
                label="Email"
                id="email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                error={errors?.email}
                placeholder="Enter your email"
              />

              <Input
                type="password"
                id="password"
                label="Password"
                error={errors?.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                id="password_confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button disabled={disabled} className="btn btn-primary btn-md">
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                )}{" "}
                Sign Up
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
