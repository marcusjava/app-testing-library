import React from "react";
import { useTranslation } from "react-i18next";

// import { Container } from './styles';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <>
      <img
        src="https://flagcdn.com/20x15/br.png"
        style={{ cursor: "pointer" }}
        alt="Brasil flag"
        onClick={() => i18n.changeLanguage("pt")}
      />
      {"   "}
      <img
        style={{ cursor: "pointer" }}
        src="https://flagcdn.com/20x15/us.png"
        alt="English flag"
        onClick={() => i18n.changeLanguage("en")}
      />
    </>
  );
};

export default LanguageSelector;
