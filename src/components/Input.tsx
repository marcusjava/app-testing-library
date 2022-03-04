import React from "react";

// import { Container } from './styles';

interface Props {
  id: string;
  label: string;
  error?: string | null;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  type: "text" | "email" | "password";
  placeholder: string;
}

const Input: React.FC<Props> = ({
  id,
  label,
  error,
  onChange,
  value,
  type,
  placeholder,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        className={`form-control ${error && "is-invalid"}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="invalid-feedback">{error}</span>}
    </div>
  );
};

export default Input;
