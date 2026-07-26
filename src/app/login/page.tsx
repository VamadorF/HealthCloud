import Link from 'next/link';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthCard
      title="Iniciar sesión en HealthCloud"
      description="Ingresa tus credenciales para acceder"
      footer={
        <p>
          ¿No tienes cuenta?{' '}
          <Link href="/signup" className="font-medium text-brand hover:text-brand-dark">
            Regístrate
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
