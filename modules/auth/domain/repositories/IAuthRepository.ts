import { User } from "../entities/User";

// Contrato que deben cumplir todos los repositorios de autenticación
export interface IAuthRepository {
  register(
    fullName: string,
    email: string,
    password: string
  ): Promise<User>;

  login(
    email: string,
    password: string
  ): Promise<User>;
}