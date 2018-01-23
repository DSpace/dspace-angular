export interface DSpaceRESTV2Response {
  payload: {
    [name: string]: any;
    _embedded?: any;
    _links?: any;
    page?: any;
  },
  statusCode: string
}
