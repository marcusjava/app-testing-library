import {
  screen,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Input from "./Input";

type Props = {
  label: string;
  id: string;
  value: string;
  type: "text" | "email" | "password";
  error?: string;
  placeholder: string;
};

describe("Input component tests", () => {
  const setup = ({ label, id, value, type, error, placeholder }: Props) => {
    const onChangeFn = jest.fn();
    render(
      <Input
        label={label}
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
      value: "marcus",
      type: "text",
      placeholder: "Enter your username",
    });

    const errorMessage = screen.queryByText("Please enter a username");
    expect(errorMessage).not.toBeInTheDocument();
  });
});
