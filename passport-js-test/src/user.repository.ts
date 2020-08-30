import * as bcrypt from "bcrypt";
import { v1 as uuid } from "uuid";

import { User } from "./user.interface";
import { AuthCredentialsDto } from "./auth-credentials.dto";

export class UserRepository {
  users: User[] = [
    {
      id: uuid(),
      email: "art.rinor@gmail.com",
      password: bcrypt.hashSync("admin", 10),
    },
  ];

  async findOne({ id, email }: Partial<User>): Promise<User> {
    if (typeof id === "undefined" && typeof email === "undefined") {
      return undefined;
    }

    return this.users.find((user) => {
      return (
        (id ? user.id === id : true) && (email ? user.email === email : true)
      );
    });
  }

  async signUp({ email, password }: AuthCredentialsDto): Promise<User> {
    if (this.users.find((user) => user.email === email)) {
      throw new Error("Пользователь с таким e-mail уже существует.");
    }

    const hash = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuid(),
      email,
      password: hash,
    };

    this.users.push(user);

    return user;
  }

  async signIn({ email, password }: AuthCredentialsDto): Promise<User> {
    const user = await this.findOne({ email });

    if (user) {
      const isPasswordRight = await bcrypt.compare(password, user.password);

      if (isPasswordRight) return user;
    }

    throw new Error("Неверный логин или пароль.");
  }
}
