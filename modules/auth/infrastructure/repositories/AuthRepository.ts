import { supabase } from "@/shared/lib/supabase";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/User";

export class AuthRepository implements IAuthRepository {
  async register(fullName: string, email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("No se pudo crear el usuario.");

    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      full_name: fullName,
      email,
    });

    if (insertError) throw new Error(insertError.message);

    return {
      id: data.user.id,
      fullName,
      email,
      createdAt: new Date(data.user.created_at),
    };
  }

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error("Credenciales inválidas.");
    if (!data.user) throw new Error("Usuario no encontrado.");

    return {
      id: data.user.id,
      fullName: data.user.user_metadata?.full_name ?? "",
      email: data.user.email!,
      createdAt: new Date(data.user.created_at),
    };
  }
}