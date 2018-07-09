import { Eperson } from '../../core/eperson/models/eperson.model';

export const EpersonMock: Eperson = Object.assign(new Eperson(),{
  handle: null,
  groups: [],
  netid: 'test@test.com',
  lastActive: '2018-05-14T12:25:42.411+0000',
  canLogIn: true,
  email: 'test@test.com',
  requireCertificate: false,
  selfRegistered: false,
  self: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/epersons/testid',
  id: 'testid',
  uuid: 'testid',
  type: 'eperson',
  name: 'User Test',
  metadata: [
    {
      key: 'eperson.firstname',
      language: null,
      value: 'User'
    },
    {
      key: 'eperson.lastname',
      language: null,
      value: 'Test'
    },
    {
      key: 'eperson.language',
      language: null,
      value: 'en'
    }
  ]
});
