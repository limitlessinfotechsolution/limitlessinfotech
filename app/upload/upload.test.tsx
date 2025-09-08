import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadPage from './page';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UploadPage', () => {
  it('renders the file upload form', () => {
    render(<UploadPage />);
    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByLabelText('File')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });

  it('shows a success message after a successful upload', async () => {
    mockedAxios.post.mockResolvedValue({ data: { url: 'http://example.com/file.jpg' } });

    render(<UploadPage />);

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const input = screen.getByLabelText('File') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    const form = screen.getByRole('button', { name: 'Upload' }).closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
        expect(screen.getByText('File uploaded successfully! URL: http://example.com/file.jpg')).toBeInTheDocument();
    });
  });
});
