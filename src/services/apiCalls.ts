import i18n from "../locale/i18n";
import api from "./api";

type Props = {
  username: string;
  email: string;
  password: string;
};

export const signUp = ({ username, email, password }: Props) => {
  return api.post(
    "/users",
    {
      username,
      email,
      password,
    },
    {
      headers: {
        "Accept-language": i18n.language,
      },
    }
  );
};
