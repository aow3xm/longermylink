const MAX_PATH_LENGTH = 500;

export const generateRandomPath = (): string => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);

  const uniqueSeed = timestamp + randomNum;
  const uniquePattern = uniqueSeed
    .toString()
    .split('')
    .map((digit, index) => {
      const char = parseInt(digit) % 2 === 0 ? 'o' : 'O';
      const repeat = index % 2 === 0 ? 1 : 2;
      return char.repeat(repeat);
    })
    .join('');

  const patternBase = 'o';
  let pattern = 'l';

  while (true) {
    const testPattern = pattern + patternBase;
    const testPath = testPattern + uniquePattern + patternBase.repeat(50) + 'ng';

    if (testPath.length > MAX_PATH_LENGTH - 50) break;

    pattern = testPattern;
  }

  const finalPath = pattern + uniquePattern + patternBase.repeat(25) + timestamp + patternBase.repeat(25) + 'ng';

  return finalPath;
};

