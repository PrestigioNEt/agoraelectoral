import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as authService from '../services/authService';

// Hacemos un mock del servicio de autenticación
vi.mock('../services/authService');

describe('Página de Login', () => {

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  it('debería renderizar el formulario de login correctamente', () => {
    // 1. Arrange
    renderComponent();

    // 2. Assert
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debería permitir al usuario escribir en los campos', async () => {
    // 1. Arrange
    renderComponent();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    // 2. Act
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // 3. Assert
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('debería llamar a la función de login al enviar el formulario', async () => {
    // 1. Arrange
    renderComponent();
    const user = userEvent.setup();
    const loginSpy = vi.spyOn(authService, 'login').mockResolvedValue({} as any);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // 2. Act
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // 3. Assert
    expect(loginSpy).toHaveBeenCalledTimes(1);
    expect(loginSpy).toHaveBeenCalledWith({ 
      email: 'test@example.com', 
      password: 'password123' 
    });
  });

});
