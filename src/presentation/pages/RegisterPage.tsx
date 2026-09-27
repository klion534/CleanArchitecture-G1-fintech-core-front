import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterUserSchema } from '../../infrastructure/validation/AuthSchemas';
import { FieldError } from '../../domain/errors/ApiError';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    setSuccessMessage(null);

    // Validar en el cliente con esquema Zod Espejo
    const validationResult = RegisterUserSchema.safeParse({ name, email, password });
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
      await register({ name, email, password });
      setSuccessMessage('Usuario registrado con éxito. Serás redirigido a iniciar sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors?: FieldError[] }).errors)) {
        const errorsMap: Record<string, string> = {};
        (err as { errors: FieldError[] }).errors.forEach((fe) => {
          errorsMap[fe.field] = fe.message;
        });
        setFieldErrors(errorsMap);
      }

      const message = err instanceof Error ? err.message : 'No se pudo completar el registro. Intente nuevamente.';
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
        <h2>Crea tu cuenta y empieza a mover tu dinero.</h2>
        <p>
          Abre tu primera cuenta digital, monitorea tus saldos y gestiona movimientos con una experiencia moderna y segura.
        </p>
        <ul className="auth-benefits">
          <li>Creación de cuentas en segundos</li>
          <li>Panel financiero claro y organizado</li>
          <li>Seguridad y confianza desde el primer acceso</li>
        </ul>
      </div>

      <div className="page-card auth-panel">
        <div className="auth-header">
          <p className="eyebrow">Nuevo usuario</p>
          <h2>Registro de Usuario</h2>
        </div>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <ErrorAlert error={generalError} />
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Nombre Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors['name']}
            disabled={isSubmitting}
            required
          />
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
            Registrarse
          </Button>
        </form>
        <p className="auth-switcher">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};
