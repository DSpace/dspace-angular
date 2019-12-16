import { StatusCodeOnlyResponseParsingService } from './status-code-only-response-parsing.service';

describe('StatusCodeOnlyResponseParsingService', () => {
  let service;
  let statusCode;
  let statusText;

  beforeEach(() => {
    service = new StatusCodeOnlyResponseParsingService();
  });

  describe('parse', () => {

    describe('when the response is successful', () => {
      beforeEach(() => {
        statusCode = 201;
        statusText = `${statusCode}`;
      });

      it('should return a success RestResponse', () => {
        const result = service.parse(undefined, {
          statusCode,
          statusText
        });

        expect(result.isSuccessful).toBe(true);
      });

      it('should return a RestResponse with the correct status code', () => {
        const result = service.parse(undefined, {
          statusCode,
          statusText
        });

        expect(result.statusCode).toBe(statusCode);
      });

      it('should return a RestResponse with the correct status text', () => {
        const result = service.parse(undefined, {
          statusCode,
          statusText
        });

        expect(result.statusText).toBe(statusText);
      });
    });

    describe('when the response is unsuccessful', () => {
      beforeEach(() => {
        statusCode = 400;
        statusText = `${statusCode}`;
      });

      it('should return an error RestResponse', () => {
        const result = service.parse(undefined, {
          statusCode,
          statusText
        });

        expect(result.isSuccessful).toBe(false);
      });

      it('should return a RestResponse with the correct status code', () => {
        const result = service.parse(undefined, {
          statusCode,
          statusText
        });

        expect(result.statusCode).toBe(statusCode);
      });

      it('should return a RestResponse with the correct status text', () => {
        const result = service.parse(undefined, {
          statusCode,
          statusText
        });

        expect(result.statusText).toBe(statusText);
      });
    });
  });
});
