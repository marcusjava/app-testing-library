import React from "react";
import LanguageSelector from "./components/LanguageSelector";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <div className="container">
      <LanguageSelector />
      <SignUp />
    </div>
  );
}

export default App;
