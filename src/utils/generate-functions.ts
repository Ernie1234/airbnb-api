export const generateVerificationToken = (): string => {
  const randomNumber = Math.floor(Math.random() * 1_000_000);
  return randomNumber.toString().padStart(6, '0');
};

export const generateRandomNumber = (length: number): string => {
  const randomNumber = Math.floor(Math.random() * 10 ** length);
  return randomNumber.toString().padStart(length, '0');
};
