export const isRequired = (value) => value && value.toString().trim() !== '';

export const isEmail = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
