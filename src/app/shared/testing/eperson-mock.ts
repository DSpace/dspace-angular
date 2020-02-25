import { EPerson } from '../../core/eperson/models/eperson.model';

export const EPersonMock: EPerson = Object.assign(new EPerson(),{
  handle: null,
  groups: [],
  netid: 'test@test.com',
  lastActive: '2018-05-14T12:25:42.411+0000',
  canLogIn: true,
  email: 'test@test.com',
  requireCertificate: false,
  selfRegistered: false,
  _links: {
    self: {
      href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/epersons/testid',
    }
  },
  id: 'testid',
  uuid: 'testid',
  type: 'eperson',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'User Test'
      }
    ],
    'eperson.firstname': [
      {
        language: null,
        value: 'User'
      }
    ],
    'eperson.lastname': [
      {
        language: null,
        value: 'Test'
      },
    ],
    'eperson.language': [
      {
        language: null,
        value: 'en'
      },
    ]
  }
});
