import { Base64EncodeUrl } from './encode-decode.util';

describe('Encode/Decode Utils', () => {
  const strng = '+string+/=t-';
  const encodedStrng = '%2Bstring%2B%2F%3Dt-';

  it('should return encoded string', () => {
    expect(Base64EncodeUrl(strng)).toBe(encodedStrng);
  });
});
