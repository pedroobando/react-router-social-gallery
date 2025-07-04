export function validateEmail(
  email: string,
  errorMessage: string
): { isError: boolean; errorMessage: string | null } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isError: true,
      errorMessage: errorMessage,
    };
  }

  return {
    isError: false,
    errorMessage: null,
  };
}
