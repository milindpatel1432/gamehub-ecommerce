export const EMAIL_VALIDATION = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address format',
  },
};

export const PASSWORD_VALIDATION = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters long',
  },
  validate: {
    hasUppercase: (value) =>
      /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
    hasLowercase: (value) =>
      /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
    hasNumber: (value) =>
      /[0-9]/.test(value) || 'Password must contain at least one digit',
  },
};

export const PHONE_VALIDATION = {
  required: 'Phone number is required',
  pattern: {
    value: /^[0-9]{10}$/,
    message: 'Phone number must be exactly 10 digits',
  },
};

export const PIN_CODE_VALIDATION = {
  required: 'PIN code is required',
  pattern: {
    value: /^[0-9]{6}$/,
    message: 'PIN code must be exactly 6 digits',
  },
};

export const NAME_VALIDATION = {
  required: 'Name is required',
  minLength: {
    value: 2,
    message: 'Name must be at least 2 characters long',
  },
  validate: {
    notEmpty: (value) => value.trim().length >= 2 || 'Name cannot consist of spaces only',
  },
};

export const REQUIRED_VALIDATION = (fieldName = 'Field') => ({
  required: `${fieldName} is required`,
});
