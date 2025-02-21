import { ParsedResponse } from '../cache';
import { Registration } from '../shared';
import { RegistrationResponseParsingService } from '@dspace/core';

describe('RegistrationResponseParsingService', () => {
  describe('parse', () => {
    const registration = Object.assign(new Registration(), { email: 'test@email.org', token: 'test-token' });
    const registrationResponseParsingService = new RegistrationResponseParsingService();

    const data = {
      payload: { email: 'test@email.org', token: 'test-token' },
      statusCode: 200,
      statusText: 'Success',
    };

    it('should parse a registration response', () => {
      const expected = registrationResponseParsingService.parse({} as any, data);

      expect(expected).toEqual(new ParsedResponse(200, undefined, registration));
    });
  });
});
