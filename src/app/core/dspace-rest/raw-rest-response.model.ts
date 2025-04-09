import { HttpHeaders } from '@angular/common/http';

export interface RawRestResponse {
  payload: {
    [name: string]: any;
    _embedded?: any;
    _links?: any;
    page?: any;
  };
  headers?: HttpHeaders;
  statusCode: number;
  statusText: string;
}

export interface RawBootstrapResponse {
  payload: {
    [name: string]: any;
    _embedded?: any;
    _links?: any;
    page?: any;
  };
  headers?: Record<string, string>;
  statusCode: number;
  statusText: string;
}

export function rawBootstrapToRawRestResponse(bootstrapResponse: RawBootstrapResponse): RawRestResponse {
  return {
    payload: bootstrapResponse.payload,
    headers: new HttpHeaders(bootstrapResponse.headers),
    statusCode: bootstrapResponse.statusCode,
    statusText: bootstrapResponse.statusText,
  };
}
