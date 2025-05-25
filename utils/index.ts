const MAX_DOMAIN_LENGTH = 244;

function chunkLabel(input: string, maxChunk: number = 63): string[] {
  const parts = [];
  for (let i = 0; i < input.length; i += maxChunk) {
    parts.push(input.slice(i, i + maxChunk));
  }
  return parts;
}

export const generateRandomSubdomain = () => {
  const suffix = Math.random().toString(36).slice(2, 12); // 10 ký tự cho suffix

  const patternBase = 'o';
  let pattern = 'l';
  let patternChunks: string[] = [];

  while (true) {
    const testPattern = pattern + patternBase;
    const testChunks = chunkLabel(testPattern + 'ng');
    const labels = [...testChunks, suffix];
    const totalLength = labels.map(l => l.length).reduce((a, b) => a + b, 0) + (labels.length - 1); // tính dấu chấm

    if (totalLength > MAX_DOMAIN_LENGTH) break;

    pattern = testPattern;
    patternChunks = testChunks;
  }

  pattern += 'ng';
  patternChunks = chunkLabel(pattern);

  const fullSubdomain = [...patternChunks, suffix].join('.');
  return fullSubdomain.toLowerCase();
};
