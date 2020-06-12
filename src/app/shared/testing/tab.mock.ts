import { Tab } from 'src/app/core/layout/models/tab.model';
import { TAB } from 'src/app/core/layout/models/tab.resource-type';

export const tabPersonProfile: Tab = {
  type: TAB,
  id: 1,
  shortname: 'person-profile',
  header: 'person-profile-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-profile-1',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/1'
    },
    boxes: {
      href: 'https://rest.api/rest/api/tabs/1/boxes'
    }
  }
};

export const tabPersonBiography: Tab = {
  type: TAB,
  id: 2,
  shortname: 'person-biography',
  header: 'person-biography-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-biography-2',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/2'
    },
    boxes: {
      href: 'https://rest.api/rest/api/tabs/2/boxes'
    }
  }
};

export const tabPersonBibliometrics: Tab = {
  type: TAB,
  id: 3,
  shortname: 'person-bibliometrics',
  header: 'person-bibliometrics-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-bibliometrics-3',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/3'
    },
    boxes: {
      href: 'https://rest.api/rest/api/tabs/3/boxes'
    }
  }
};

export const tabPersonTest: Tab = {
  type: TAB,
  id: 4,
  shortname: 'person-test',
  header: 'person-test-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-test-3',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/3'
    },
    boxes: {
      href: 'https://rest.api/rest/api/tabs/3/boxes'
    }
  }
};

export const tabs = [tabPersonProfile, tabPersonBiography, tabPersonBibliometrics];
