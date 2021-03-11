import { Audit } from '../../core/audit/model/audit.model';
import { EPerson } from '../../core/eperson/models/eperson.model';

export const AuditEPersonMock: EPerson = Object.assign(new EPerson(), {
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
      href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/epersons/4eebf0fa-cb9a-463e-8d4c-8a63122c7658',
    },
    groups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/epersons/4eebf0fa-cb9a-463e-8d4c-8a63122c7658/groups' }
  },
  id: '4eebf0fa-cb9a-463e-8d4c-8a63122c7658',
  uuid: '4eebf0fa-cb9a-463e-8d4c-8a63122c7658',
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

export const AuditMock: Audit = Object.assign(new Audit(), {
  detail: null,
  epersonUUID: '4eebf0fa-cb9a-463e-8d4c-8a63122c7658',
  eventType: 'MODIFY',
  id: '6fcd7329-8439-4492-bb72-0a4240b52da8',
  objectType: 'ITEM',
  objectUUID: 'objectUUID',
  subjectType: 'ITEM',
  subjectUUID: '3a74fe2c-d353-4e33-9887-d50184662dd4',
  timeStamp: '2020-11-13T10:41:06.223+0000',
  type: 'auditevent',
  _embedded: {
    eperson: AuditEPersonMock
  },
  self: {
    _links: {
      eperson: {
        href: 'https://dspace.4science.it/dspace-spring-rest/api/system/auditevents/6fcd7329-8439-4492-bb72-0a4240b52da8/eperson'
      },
      object: {
        href: 'https://dspace.4science.it/dspace-spring-rest/api/system/auditevents/6fcd7329-8439-4492-bb72-0a4240b52da8/object'
      },
      self: {
        href: 'https://dspace.4science.it/dspace-spring-rest/api/system/auditevents/6fcd7329-8439-4492-bb72-0a4240b52da8'
      },
      subject: {
        href: 'https://dspace.4science.it/dspace-spring-rest/api/system/auditevents/6fcd7329-8439-4492-bb72-0a4240b52da8/subject',
      }
    }
  }
});

