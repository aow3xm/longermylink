const MAX_PATH_LENGTH = 4000;
const MAX_OFFSET = 50;

export const generateRandomPath = (): string => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1_000_000);
  const uniqueSeed = BigInt(timestamp) * BigInt(1_000_000) + BigInt(randomNum);
  const offset = Number(uniqueSeed % BigInt(MAX_OFFSET));
  const actualLength = MAX_PATH_LENGTH - offset - timestamp.toString().length;
  return 'o'.repeat(actualLength) + timestamp.toString();
};

export const capitalizeName = (name?: string) => {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length <= 1) return name.charAt(0).toUpperCase();

  const first = words[0].charAt(0);
  const last = words[words.length - 1].charAt(0);

  return (first + last).toUpperCase();
};