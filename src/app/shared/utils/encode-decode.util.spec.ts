import { loginEncodeUrl } from './encode-decode.util';

describe('Encode/Decode Utils', () => {
  const strng = '+string+/=t-%';
  const encodedStrng = '%2Bstring%2B%2F%3Dt-%25';

  it('should return encoded string', () => {
    expect(loginEncodeUrl(strng)).toBe(encodedStrng);
  });
});
