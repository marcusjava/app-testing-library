import { screen, render } from "@testing-library/react";
import SignUp from "../../pages/SignUp";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import api from "../../services/api";

describe("SignUp page tests", () => {
  describe("Layout", () => {
    it("has Header", () => {
      render(<SignUp />);
      expect(
        screen.getByRole("heading", { name: "Sign Up" })
      ).toBeInTheDocument();
    });
    it("has username input", () => {
      render(<SignUp />);
      const inputByLabel = screen.getByLabelText("Username");
      const input = screen.getByPlaceholderText("Enter your username");
      expect(input).toBeInTheDocument();
      expect(inputByLabel).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignUp />);
      const inputByLabel = screen.getByLabelText("Email");
      const input = screen.getByPlaceholderText("Enter your email");
      expect(input).toBeInTheDocument();
      expect(inputByLabel).toBeInTheDocument();
    });
    it("has pasword input", () => {
      render(<SignUp />);
      const inputByLabel = screen.getByLabelText("Password");
      const input = screen.getByPlaceholderText("Enter your password");
      expect(input).toBeInTheDocument();
      expect(inputByLabel).toBeInTheDocument();
    });
    it("has input type pasword", () => {
      render(<SignUp />);
      const input = screen.getByPlaceholderText<HTMLInputElement>(
        "Enter your password"
      );

      expect(input.type).toEqual("password");
    });
    it("has confirm pasword input", () => {
      render(<SignUp />);
      const inputByLabel = screen.getByLabelText("Confirm Password");
      const input = screen.getByPlaceholderText("Confirm your password");
      expect(input).toBeInTheDocument();
      expect(inputByLabel).toBeInTheDocument();
    });
    it("has input type confirm pasword", () => {
      render(<SignUp />);
      const input = screen.getByPlaceholderText<HTMLInputElement>(
        "Confirm your password"
      );
      expect(input.type).toEqual("password");
    });
    it("has submit button", () => {
      render(<SignUp />);
      expect(
        screen.getByRole("button", { name: "Sign Up" })
      ).toBeInTheDocument();
    });
    it("has submit button disabled initially", () => {
      render(<SignUp />);
      expect(screen.getByRole("button", { name: "Sign Up" })).toBeDisabled();
    });
  });
  describe("interactions on Form", () => {
    let button: HTMLElement;
    const setup = () => {
      render(<SignUp />);
      const username = screen.getByPlaceholderText("Enter your username");
      const email = screen.getByPlaceholderText("Enter your email");
      const password = screen.getByPlaceholderText<HTMLInputElement>(
        "Enter your password"
      );
      const confirmPassword = screen.getByPlaceholderText<HTMLInputElement>(
        "Confirm your password"
      );
      button = screen.getByRole("button", { name: "Sign Up" });
      userEvent.type(username, "marcus");
      userEvent.type(email, "marcus@email.com");
      userEvent.type(password, "teste");
      userEvent.type(confirmPassword, "teste");
    };
    it("enable signup button when password and confirm password are the same value", () => {
      setup();

      expect(button).not.toBeDisabled();
    });
    it("send username,email and password to backend after click on submit button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();

      userEvent.click(button);
      // const mockFn = jest.fn();
      //window.fetch = mockFn
      //api.post = mockFn;
      //axios.post("url", body)

      // const firstCallOfMockFn = mockFn.mock.calls[0];
      //when use fetch!!!
      //const body = JSON.parse(firstCallOfMockFn[1].body)
      //const body = firstCallOfMockFn[1];
      await screen.findByText(
        "Please check your email for activate your account"
      );
      expect(requestBody).toEqual({
        username: "marcus",
        email: "marcus@email.com",
        password: "teste",
      });
    });
    it("disables button when there is ongoing api call", async () => {
      let counter = 0;
      let requestBody;
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          counter += 1;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);
      userEvent.click(button);
      userEvent.click(button);
      await screen.findByText(
        "Please check your email for activate your account"
      );
      expect(counter).toBe(1);
    });
    it("does not display spinner when no API request", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    it("display spinner when API request", async () => {
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);
      expect(await screen.findByRole("status")).toBeInTheDocument();
      await screen.findByText(
        "Please check your email for activate your account"
      );
    });
    it("display notification after successful signup", async () => {
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);

      const text = await screen.findByText(
        "Please check your email for activate your account"
      );
      expect(text).toBeInTheDocument();
    });
  });
});
