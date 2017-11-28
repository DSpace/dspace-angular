export interface DSpaceRESTV2Response {
  payload: {
    [name: string]: string;
    _embedded?: any;
    _links?: any;
    page?: any;
  },
  statusCode: string
}
