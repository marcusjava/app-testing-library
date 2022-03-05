import {
  screen,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Input from "./Input";

type Props = {
  label: string;
  name: string;
  id: string;
  value: string;
  type: "text" | "email" | "password";
  error?: string;
  placeholder: string;
};

describe("Input component tests", () => {
  const setup = ({
    label,
    id,
    value,
    type,
    error,
    placeholder,
    name,
  }: Props) => {
    const onChangeFn = jest.fn();
    render(
      <Input
        label={label}
        name={name}
        id={id}
        value={value}
        type={type}
        onChange={onChangeFn}
        error={error}
        placeholder={placeholder}
      />
    );
  };
  it("should have invalid class when error", () => {
    setup({
      label: "Username",
      name: "username",
      id: "username",
      value: "",
      type: "text",
      error: "Please enter a username",
      placeholder: "Enter your username",
    });
    const inputField = screen.getByPlaceholderText("Enter your username");
    expect(inputField.classList).toContain("is-invalid");
  });
  it("should have invalid feedback when error", async () => {
    setup({
      label: "Username",
      name: "username",
      id: "username",
      value: "",
      type: "text",
      error: "Please enter a username",
      placeholder: "Enter your username",
    });

    const errorMessage = screen.getByText("Please enter a username");
    expect(errorMessage).toBeInTheDocument();
  });
  it("should not have invalid feedback", async () => {
    setup({
      label: "Username",
      id: "username",
      name: "username",
      value: "marcus",
      type: "text",
      placeholder: "Enter your username",
    });

    const errorMessage = screen.queryByText("Please enter a username");
    expect(errorMessage).not.toBeInTheDocument();
  });
});
