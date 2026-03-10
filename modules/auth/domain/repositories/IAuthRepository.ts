import { User } from "../entities/User";

export interface IAuthRepository {
  register(fullName: string, email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
}