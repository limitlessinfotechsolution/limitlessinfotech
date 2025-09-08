import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPage from './page';

describe('AdminPage', () => {
  it('renders the admin login form', () => {
    render(<AdminPage />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Secure Login' })).toBeInTheDocument();
  });
});
