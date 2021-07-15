/* eslint-disable jest/no-mocks-import */
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server } from '../../../__mocks__/server';
import { errorHandler } from '../../../__mocks__/handlers';

import { CreateAccount } from '../CreateAccount';

beforeEach(() => render(<CreateAccount />));
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CreateAccount', () => {
  test('вижу форму с полями и кнопку отправки', () => {
    expect(screen.getByLabelText(/email/i)).toBeEnabled();
    expect(screen.getByLabelText(/^password/i)).toBeEnabled();
    expect(screen.getByLabelText(/confirm password/i)).toBeEnabled();
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  test('заполняю все поля -> получаю сообщение, что успешно зарегистрирован', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, 'test');
    userEvent.type(confirmPasswordInput, 'test');
    userEvent.click(submitButton);

    await waitFor(() => screen.getByText('Account was successfully created'));
    expect(submitButton).toBeEnabled();
  });

  test('заполняю не все поля -> получаю ошибку валидации', async () => {
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(passwordInput, 'test');
    userEvent.type(confirmPasswordInput, 'test');
    userEvent.click(submitButton);

    await waitFor(() => screen.getByText('Email is required'));
    expect(submitButton).toBeEnabled();
  });

  test('заполняю поле не верно -> получаю ошибку валидации', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, 'test');
    userEvent.type(confirmPasswordInput, 'error');
    userEvent.click(submitButton);

    await waitFor(() => screen.getByText("Passwords don't match"));
    expect(submitButton).toBeEnabled();
  });

  test('заполняю все поля -> приходит ошибка -> показываю сообщение об ошибке', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    server.use(errorHandler);

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, 'test');
    userEvent.type(confirmPasswordInput, 'test');
    userEvent.click(submitButton);

    await waitFor(() => screen.getByText('Something went wrong'));
    expect(submitButton).toBeEnabled();
  });
});
