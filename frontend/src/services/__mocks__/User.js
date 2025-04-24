// Crear funciones simuladas manualmente
const fn = () => {
  const mockFn = function (...args) {
    mockFn.calls.push(args);
    return mockFn.returnValue;
  };
  mockFn.calls = [];
  mockFn.mockReturnValue = function (value) {
    mockFn.returnValue = value;
    return mockFn;
  };
  mockFn.mockResolvedValue = function (value) {
    return mockFn.mockReturnValue(Promise.resolve(value));
  };
  mockFn.mockRejectedValue = function (error) {
    return mockFn.mockReturnValue(Promise.reject(error));
  };
  return mockFn;
};

export const registerUser = fn();
export const loginUser = fn();
export const logoutUser = fn();