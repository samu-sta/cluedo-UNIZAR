// Crear funciones simuladas manualmente
const fn = () => {
  const mockFn = function (...args) {
    mockFn.calls.push(args);
    if (mockFn.implementation) {
      return mockFn.implementation(...args);
    }
    return mockFn.returnValue;
  };
  mockFn.calls = [];
  mockFn.returnValue = {};
  mockFn.mockReturnValue = function (value) {
    mockFn.returnValue = value;
    return mockFn;
  };
  mockFn.mockImplementation = function (impl) {
    mockFn.implementation = impl;
    return mockFn;
  };
  return mockFn;
};

// Mock implementations for validation functions
const validateLoginUser = fn().mockImplementation((data) => {
  const errors = {};

  // Email validation
  if (!data.email) {
    errors.email = "Formato de email inválido";
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  // Return validation result
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: {
        formErrors: {
          fieldErrors: errors
        }
      }
    };
  }

  return {
    success: true,
    data
  };
});

const validateRegisterUser = fn().mockImplementation((data) => {
  const errors = {};

  // Username validation
  if (!data.username || data.username.length < 3) {
    errors.username = "El nombre de usuario debe tener al menos 3 caracteres";
  }

  // Email validation
  if (!data.email || !data.email.includes('@')) {
    errors.email = "Formato de email inválido";
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  // Confirm password validation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  // Return validation result
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: {
        formErrors: {
          fieldErrors: errors
        }
      }
    };
  }

  return {
    success: true,
    data
  };
});

export const userSchema = {
  validateRegisterUser,
  validateLoginUser
};