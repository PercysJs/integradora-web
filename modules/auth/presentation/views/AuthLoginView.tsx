import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";

export function AuthLoginView() {
  return (
    <AuthCard title="Iniciar Sesión">
      <LoginForm />
    </AuthCard>
  );
}