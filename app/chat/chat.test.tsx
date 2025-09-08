import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ChatPage from './page';
import io from 'socket.io-client';

const mockSocket = io();

describe('ChatPage', () => {
  beforeEach(() => {
    (io as jest.Mock).mockClear();
    (mockSocket.on as jest.Mock).mockClear();
    (mockSocket.off as jest.Mock).mockClear();
    (mockSocket.emit as jest.Mock).mockClear();
  });

  it('renders the chat page', () => {
    render(<ChatPage />);
    expect(screen.getByText('Real-time Chat')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('displays received messages', () => {
    render(<ChatPage />);

    act(() => {
      const messageHandler = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === 'message')[1];
      messageHandler({ user_name: 'testuser', text: 'Hello, world!' });
    });

    expect(screen.getByText('testuser:')).toBeInTheDocument();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('displays the list of users', () => {
    render(<ChatPage />);

    act(() => {
      const usersHandler = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === 'users')[1];
      usersHandler([{ id: '1', name: 'testuser1' }, { id: '2', name: 'testuser2' }]);
    });

    expect(screen.getByText('testuser1')).toBeInTheDocument();
    expect(screen.getByText('testuser2')).toBeInTheDocument();
  });
});
