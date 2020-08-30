import { User } from "user.interface";

export class AuthCredentialsDto implements Omit<User, "id"> {
  email: string;
  password: string;
}
