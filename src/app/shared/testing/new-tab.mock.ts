import { Tab } from '../../core/layout/models/tab.model';
import { TAB } from '../../core/layout/models/tab.resource-type';

export const tabDetailsTest: Tab = {
    'id': 395,
    'shortname': 'details',
    'header': 'Informations',
    'entityType': 'OrgUnit',
    'priority': 0,
    'security': 0,
    'type': TAB,
    'uuid' : '123123123123',
    '_links': {
      'boxes': {
        'href': 'http://localhost:8080/server/api/layout/tabs/395/boxes'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/layout/tabs/395'
      }
    }
  };

export const tabPublicationsTest: Tab = {
    'id': 396,
    'shortname': 'publications',
    'header': 'Publications',
    'entityType': 'OrgUnit',
    'priority': 2,
    'security': 0,
    'type': TAB,
    'uuid' : '123123123123',
    '_links': {
      'boxes': {
        'href': 'http://localhost:8080/server/api/layout/tabs/396/boxes'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/layout/tabs/396'
      }
    }
  };

export const tabRpPublicationsTest: Tab = {
    'id': 397,
    'shortname': 'rp::publications',
    'header': 'Researchers::Publications',
    'entityType': 'OrgUnit',
    'priority': 4,
    'security': 0,
    'type': TAB,
    'uuid' : '123123123123',
    '_links': {
      'boxes': {
        'href': 'http://localhost:8080/server/api/layout/tabs/397/boxes'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/layout/tabs/397'
      }
    }
  };

export const tabProjectsTest: Tab = {
    'id': 398,
    'shortname': 'projects',
    'header': 'Projects',
    'entityType': 'OrgUnit',
    'priority': 6,
    'security': 0,
    'type': TAB,
    'uuid' : '123123123123',
    '_links': {
      'boxes': {
        'href': 'http://localhost:8080/server/api/layout/tabs/398/boxes'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/layout/tabs/398'
      }
    }
  };


export const tabRpProjectsTest: Tab = {
    'id': 399,
    'shortname': 'rp::projects',
    'header': 'Researchers::Projects',
    'entityType': 'OrgUnit',
    'priority': 8,
    'security': 0,
    'type': TAB,
    'uuid' : '123123123123',
    '_links': {
      'boxes': {
        'href': 'http://localhost:8080/server/api/layout/tabs/399/boxes'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/layout/tabs/399'
      }
    }
  };


export const tabPeoplesTest: Tab = {
    'id': 400,
    'shortname': 'people',
    'header': 'Peoples',
    'entityType': 'OrgUnit',
    'priority': 10,
    'security': 0,
    'type': TAB,
    'uuid' : '123123123123',
    '_links': {
      'boxes': {
        'href': 'http://localhost:8080/server/api/layout/tabs/400/boxes'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/layout/tabs/400'
      }
    }
  };
export const tabs = [tabDetailsTest, tabPublicationsTest, tabRpPublicationsTest, tabProjectsTest, tabRpProjectsTest, tabPeoplesTest];
