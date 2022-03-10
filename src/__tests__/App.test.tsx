import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

describe("Routing", () => {
  const setup = (path: string) => {
    window.history.pushState({}, "", path);
    render(<App />);
  };
  it.each`
    path         | pageTestId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"signup-page"}
    ${"/login"}  | ${"login-page"}
    ${"/user"}   | ${"user-page"}
  `("Displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const signup = screen.queryByTestId(pageTestId);
    expect(signup).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"signup-page"}
    ${"/"}       | ${"login-page"}
    ${"/"}       | ${"user-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"login-page"}
    ${"/signup"} | ${"user-page"}
    ${"/login"}  | ${"signup-page"}
    ${"/login"}  | ${"home-page"}
    ${"/login"}  | ${"user-page"}
    ${"/user"}   | ${"home-page"}
    ${"/user"}   | ${"login-page"}
    ${"/user"}   | ${"home-page"}
  `("Displays $pageTestId when not path is $path", ({ path, pageTestId }) => {
    setup(path);
    const signup = screen.queryByTestId(pageTestId);
    expect(signup).not.toBeInTheDocument();
  });

  it.each`
    targetPage
    ${"Home"}
    ${"Login"}
    ${"Sign Up"}
    ${"User"}
  `("has link to $targetPage page on navbar", ({ targetPage }) => {
    setup("/");
    const link = screen.getByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    targetPage   | pageTestId
    ${"Home"}    | ${"home-page"}
    ${"Login"}   | ${"login-page"}
    ${"Sign Up"} | ${"signup-page"}
    ${"User"}    | ${"user-page"}
  `(
    "displays $pageTestId page after click in $targetPage link",
    ({ targetPage, pageTestId }) => {
      setup("/");
      const link = screen.getByRole("link", { name: targetPage });
      userEvent.click(link);
      expect(screen.getByTestId(pageTestId)).toBeInTheDocument();
    }
  );

  it("check links are displayed in PT language", () => {
    setup("/");
    const ptLangToggle = screen.getByAltText("Brasil flag");
    // userEvent.click(ptLangToggle)
  });
});
