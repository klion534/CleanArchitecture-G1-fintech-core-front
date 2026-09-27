import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { useNavigate, Link } from 'react-router-dom';
import { LoginSchema } from '../../infrastructure/validation/AuthSchemas';
import { FieldError } from '../../domain/errors/ApiError';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    // Validar en el cliente con esquema Zod Espejo
    const validationResult = LoginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const errorsMap: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const fieldName = err.path[0];
        if (typeof fieldName === 'string') {
          errorsMap[fieldName] = err.message;
        }
      });
      setFieldErrors(errorsMap);
      return;
    }

    // Bloquear el formulario durante el envío
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors?: FieldError[] }).errors)) {
        const errorsMap: Record<string, string> = {};
        (err as { errors: FieldError[] }).errors.forEach((fe) => {
          errorsMap[fe.field] = fe.message;
        });
        setFieldErrors(errorsMap);
      }
      
      const message = err instanceof Error ? err.message : 'Credenciales inválidas. Por favor verifique sus datos.';
      setGeneralError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="auth-brand-block">
          <span className="brand-icon auth-brand-icon">F</span>
          <span>Panel financiero</span>
        </div>
        <h2>Controla tus finanzas con claridad.</h2>
        <p>
          Gestiona tus cuentas, movimientos y transferencias desde un panel pensado para decisiones rápidas y seguros.
        </p>
        <ul className="auth-benefits">
          <li>Resumen financiero en tiempo real</li>
          <li>Transferencias seguras entre cuentas</li>
          <li>Acceso protegido y experiencia premium</li>
        </ul>
      </div>

      <div className="page-card auth-panel">
        <div className="auth-header">
          <p className="eyebrow">Bienvenido</p>
          <h2>Iniciar Sesión</h2>
        </div>
        <ErrorAlert error={generalError} />
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors['email']}
            disabled={isSubmitting}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors['password']}
            disabled={isSubmitting}
            required
          />
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            Ingresar
          </Button>
        </form>
        <p className="auth-switcher">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};
