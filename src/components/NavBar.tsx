import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";

// import { Container } from './styles';

interface Props {
  onClickLink: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const NavBar: React.FC<Props> = ({ onClickLink }) => {
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="logo" width="40" height="34" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a
              className="nav-link active"
              aria-current="page"
              href="/"
              onClick={onClickLink}
            >
              {t("home")}
            </a>
            <a className="nav-link" href="/signup" onClick={onClickLink}>
              {t("signUp")}
            </a>
            <a className="nav-link" href="/user" onClick={onClickLink}>
              {t("user")}
            </a>
            <a className="nav-link" href="/login" onClick={onClickLink}>
              {t("login")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
