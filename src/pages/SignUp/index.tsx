import React, { useEffect, useState } from "react";

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
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    if (
      username.length &&
      email.length &&
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
      const {
        validationErrors: { email, password },
      } = error.response.data;
      setErrors({ ...errors, email, password });
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
    setErrors({ email: "", password: "" });
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
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  className="form-control"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email ? (
                  <div className="text-danger">{errors.email}</div>
                ) : null}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  className="form-control"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password ? (
                  <div className="text-danger">{errors.password}</div>
                ) : null}
              </div>
              <div className="mb-3">
                <label htmlFor="password_confirm" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="password_confirm"
                  type="password"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
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
