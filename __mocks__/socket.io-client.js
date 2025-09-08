const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};

export default jest.fn(() => mockSocket);
