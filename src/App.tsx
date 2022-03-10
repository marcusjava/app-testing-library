import React, { useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import User from "./pages/User";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const [path, setPath] = useState<string | null>(window.location.pathname);

  const onClickLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    window.history.pushState({}, "", href);
    setPath(href);
  };
  return (
    <>
      <div>
        <ul className="list-unstyled list-inline">
          <li>
            <a href="/" onClick={onClickLink}>
              {t("home")}
            </a>
          </li>
          <li>
            <a href="/signup" onClick={onClickLink}>
              {t("signUp")}
            </a>
          </li>
          <li>
            <a href="/user" onClick={onClickLink}>
              {t("user")}
            </a>
          </li>
          <li>
            <a href="/login" onClick={onClickLink}>
              {t("login")}
            </a>
          </li>
        </ul>
      </div>
      <div className="container">
        {path === "/" && <Home />}
        {path === "/login" && <Login />}
        {path === "/user" && <User />}
        <LanguageSelector />
        {path === "/signup" && <SignUp />}
      </div>
    </>
  );
}

export default App;
