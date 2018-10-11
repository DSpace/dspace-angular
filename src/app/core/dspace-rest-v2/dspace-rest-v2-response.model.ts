import { HttpHeaders } from '@angular/common/http';

export interface DSpaceRESTV2Response {
  payload: {
    [name: string]: any;
    _embedded?: any;
    _links?: any;
    page?: any;
  },
  headers?: HttpHeaders,
  statusCode: number,
  statusText: string
}
