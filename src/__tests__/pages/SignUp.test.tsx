import {
  screen,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import SignUp from "../../pages/SignUp";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

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
    let requestBody: any;
    let counter = 0;
    const server = setupServer(
      rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });

    beforeAll(() => server.listen());

    afterAll(() => server.close());

    let button: HTMLElement;
    let username: HTMLElement;
    let email: HTMLElement;
    let password: HTMLElement;
    let confirmPassword: HTMLElement;
    const setup = () => {
      render(<SignUp />);
      username = screen.getByPlaceholderText("Enter your username");
      email = screen.getByPlaceholderText("Enter your email");
      password = screen.getByPlaceholderText<HTMLInputElement>(
        "Enter your password"
      );
      confirmPassword = screen.getByPlaceholderText<HTMLInputElement>(
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
      setup();
      userEvent.click(button);
      expect(await screen.findByRole("status")).toBeInTheDocument();
      await screen.findByText(
        "Please check your email for activate your account"
      );
    });
    it("display notification after successful signup", async () => {
      setup();
      userEvent.click(button);

      const text = await screen.findByText(
        "Please check your email for activate your account"
      );
      expect(text).toBeInTheDocument();
    });
    it("hides form on submit success", async () => {
      setup();
      userEvent.click(button);

      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      /* await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      }); */
      await waitForElementToBeRemoved(form);
    });

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
    `("display $message for $field", async ({ field, message }) => {
      server.use(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                [field]: `${message}`,
              },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      expect(await screen.findByText(message)).toBeInTheDocument();
    });

    it("display validation message for password minimum characters", async () => {
      server.use(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                password: "Password must be at least 6 characters",
              },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      expect(
        await screen.findByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
    });
    it("display validation message for password required uppercase and number characters", async () => {
      server.use(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res.once(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                password:
                  "Password must have at least 1 uppercase, 1 lowercase letter and 1 number",
              },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      expect(
        await screen.findByText(
          "Password must have at least 1 uppercase, 1 lowercase letter and 1 number"
        )
      ).toBeInTheDocument();
    });
    it("hide spinner and enable button after response received", async () => {
      server.use(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res.once(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                password:
                  "Password must have at least 1 uppercase, 1 lowercase letter and 1 number",
              },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      await screen.findByText(
        "Password must have at least 1 uppercase, 1 lowercase letter and 1 number"
      );
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });
    it("hide validation message for username when field is updated", async () => {
      server.use(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res.once(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: "Username cannot be null",
              },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      const validation = await screen.findByText("Username cannot be null");
      expect(validation).toBeInTheDocument();
      userEvent.type(username, "marcus");
      expect(validation).not.toBeInTheDocument();
    });
    it("hide validation message for email when field is updated", async () => {
      server.use(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res.once(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                email: "E-mail cannot be null",
              },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      const validation = await screen.findByText("E-mail cannot be null");
      expect(validation).toBeInTheDocument();
      userEvent.type(email, "marcus@email.com");
      expect(validation).not.toBeInTheDocument();
    });
    it("hide validation message for password when field is updated", async () => {
      server.use(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res.once(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                password: "Password must be at least 6 characters",
              },
            })
          );
        })
      );
      setup();

      userEvent.click(button);
      const validation = await screen.findByText(
        "Password must be at least 6 characters"
      );
      expect(validation).toBeInTheDocument();
      userEvent.type(password, "123456");
      expect(validation).not.toBeInTheDocument();
    });
  });
});
