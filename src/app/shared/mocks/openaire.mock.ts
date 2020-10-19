import { ResourceType } from '../../core/shared/resource-type';
import { OpenaireBrokerTopicObject } from '../../core/openaire/models/openaire-broker-topic.model';
import { OpenaireBrokerEventObject } from '../../core/openaire/models/openaire-broker-event.model';
import { OpenaireBrokerTopicRestService } from '../../core/openaire/openaire-broker-topic-rest.service';
import { OpenaireStateService } from '../../openaire/openaire-state.service';

// REST Mock ---------------------------------------------------------------------
// -------------------------------------------------------------------------------

// Topics
// -------------------------------------------------------------------------------

export const openaireBrokerTopicObjectMorePid: OpenaireBrokerTopicObject = {
  type: new ResourceType('nbtopic'),
  id: 'ENRICH!MORE!PID',
  name: 'ENRICH/MORE/PID',
  lastEvent: '2020/10/09 10:11 UTC',
  totalEvents: 33,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MORE!PID'
    }
  }
};

export const openaireBrokerTopicObjectMoreAbstract: OpenaireBrokerTopicObject = {
  type: new ResourceType('nbtopic'),
  id: 'ENRICH!MORE!ABSTRACT',
  name: 'ENRICH/MORE/ABSTRACT',
  lastEvent: '2020/09/08 21:14 UTC',
  totalEvents: 5,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MORE!ABSTRACT'
    }
  }
};

export const openaireBrokerTopicObjectMissingPid: OpenaireBrokerTopicObject = {
  type: new ResourceType('nbtopic'),
  id: 'ENRICH!MISSING!PID',
  name: 'ENRICH/MISSING/PID',
  lastEvent: '2020/10/01 07:36 UTC',
  totalEvents: 4,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!PID'
    }
  }
};

export const openaireBrokerTopicObjectMissingAbstract: OpenaireBrokerTopicObject = {
  type: new ResourceType('nbtopic'),
  id: 'ENRICH!MISSING!ABSTRACT',
  name: 'ENRICH/MISSING/ABSTRACT',
  lastEvent: '2020/10/08 16:14 UTC',
  totalEvents: 71,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!ABSTRACT'
    }
  }
};

export const openaireBrokerTopicObjectMissingAcm: OpenaireBrokerTopicObject = {
  type: new ResourceType('nbtopic'),
  id: 'ENRICH!MISSING!SUBJECT!ACM',
  name: 'ENRICH/MISSING/SUBJECT/ACM',
  lastEvent: '2020/09/21 17:51 UTC',
  totalEvents: 18,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!SUBJECT!ACM'
    }
  }
};

export const openaireBrokerTopicObjectMissingProject: OpenaireBrokerTopicObject = {
  type: new ResourceType('nbtopic'),
  id: 'ENRICH!MISSING!PROJECT',
  name: 'ENRICH/MISSING/PROJECT',
  lastEvent: '2020/09/17 10:28 UTC',
  totalEvents: 6,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!PROJECT'
    }
  }
};

// Events
// -------------------------------------------------------------------------------

export const openaireBrokerEventObjectMissingPid: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  uuid: '123e4567-e89b-12d3-a456-426614174001',
  type: new ResourceType('nbevent'),
  originalId: 'oai:www.openstarts.units.it:10077/21486',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174001',
  title: 'Index nominum et rerum',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.18848/1447-9494/cgp/v15i09/45934',
    abstract: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    matchFoundHandle: null,
    matchFoundId: null
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevent/123e4567-e89b-12d3-a456-426614174001'
    }
  }
};

export const openaireBrokerEventObjectMissingPid2: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174004',
  uuid: '123e4567-e89b-12d3-a456-426614174004',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21486',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174004',
  title: 'UNA NUOVA RILETTURA DELL\u0027 ARISTOTELE DI FRANZ BRENTANO ALLA LUCE DI ALCUNI INEDITI',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'urn',
    value: 'http://thesis2.sba.units.it/store/handle/item/12238',
    abstract: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    matchFoundHandle: null,
    matchFoundId: null
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevent/123e4567-e89b-12d3-a456-426614174004'
    }
  }
};

export const openaireBrokerEventObjectMissingPid3: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174005',
  uuid: '123e4567-e89b-12d3-a456-426614174005',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/554',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174005',
  title: 'Sustainable development',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.4324/9780203408889',
    abstract: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    matchFoundHandle: null,
    matchFoundId: null
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevents/123e4567-e89b-12d3-a456-426614174005'
    }
  }
};

export const openaireBrokerEventObjectMissingPid4: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174006',
  uuid: '123e4567-e89b-12d3-a456-426614174006',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/10787',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174006',
  title: 'Reply to Critics',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.1080/13698230.2018.1430104',
    abstract: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    matchFoundHandle: null,
    matchFoundId: null
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevents/123e4567-e89b-12d3-a456-426614174006'
    }
  }
};

export const openaireBrokerEventObjectMissingPid5: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174007',
  uuid: '123e4567-e89b-12d3-a456-426614174007',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/11339',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174007',
  title: 'PROGETTAZIONE, SINTESI E VALUTAZIONE DELL\u0027ATTIVITA\u0027 ANTIMICOBATTERICA ED ANTIFUNGINA DI NUOVI DERIVATI ETEROCICLICI',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'urn',
    value: 'http://thesis2.sba.units.it/store/handle/item/12477',
    abstract: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    matchFoundHandle: null,
    matchFoundId: null
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevents/123e4567-e89b-12d3-a456-426614174007'
    }
  }
};

export const openaireBrokerEventObjectMissingPid6: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174008',
  uuid: '123e4567-e89b-12d3-a456-426614174008',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/29860',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174008',
  title: 'Donald Davidson',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.1111/j.1475-4975.2004.00098.x',
    abstract: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    matchFoundHandle: null,
    matchFoundId: null
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevents/123e4567-e89b-12d3-a456-426614174008'
    }
  }
};

export const openaireBrokerEventObjectMissingAbstract: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174009',
  uuid: '123e4567-e89b-12d3-a456-426614174009',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21110',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174009',
  title: 'Missing abstract article',
  trust: 0.751,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: null,
    value: null,
    abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla scelerisque vestibulum tellus sed lacinia. Aenean vitae sapien a quam congue ultrices. Sed vehicula sollicitudin ligula, vitae lacinia velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla scelerisque vestibulum tellus sed lacinia. Aenean vitae sapien a quam congue ultrices. Sed vehicula sollicitudin ligula, vitae lacinia velit.',
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    matchFoundHandle: null,
    matchFoundId: null
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevents/123e4567-e89b-12d3-a456-426614174009'
    }
  }
};

export const openaireBrokerEventObjectMissingProjectFound: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  uuid: '123e4567-e89b-12d3-a456-426614174002',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21838',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174002',
  title: 'Egypt, crossroad of translations and literary interweavings (3rd-6th centuries). A reconsideration of earlier Coptic literature',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: null,
    value: null,
    abstract: null,
    acronym: 'PAThs',
    code: '687567',
    funder: 'EC',
    fundingProgram: 'H2020',
    jurisdiction: 'EU',
    title: 'Tracking Papyrus and Parchment Paths: An Archaeological Atlas of Coptic Literature.\nLiterary Texts in their Geographical Context: Production, Copying, Usage, Dissemination and Storage',
    matchFoundHandle: '10713/29832',
    matchFoundId: 'P23e4567-e89b-12d3-a456-426614174002',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevents/123e4567-e89b-12d3-a456-426614174002'
    }
  }
};

export const openaireBrokerEventObjectMissingProjectNotFound: OpenaireBrokerEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  uuid: '123e4567-e89b-12d3-a456-426614174003',
  type: new ResourceType('openaireBrokerEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21838',
  itemId: 'ITEM4567-e89b-12d3-a456-426614174003',
  title: 'Egypt, crossroad of translations and literary interweavings (3rd-6th centuries). A reconsideration of earlier Coptic literature',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: null,
    value: null,
    abstract: null,
    acronym: 'PAThs',
    code: '687567',
    funder: 'EC',
    fundingProgram: 'H2020',
    jurisdiction: 'EU',
    title: 'Tracking Papyrus and Parchment Paths: An Archaeological Atlas of Coptic Literature.\nLiterary Texts in their Geographical Context: Production, Copying, Usage, Dissemination and Storage',
    matchFoundHandle: null,
    matchFoundId: null,
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbevents/123e4567-e89b-12d3-a456-426614174003'
    }
  }
};

/**
 * Mock for [[OpenaireStateService]]
 */
export function getMockOpenaireStateService():
OpenaireStateService {
  return jasmine.createSpyObj('OpenaireStateService', {
    getOpenaireBrokerTopics: jasmine.createSpy('getOpenaireBrokerTopics'),
    isOpenaireBrokerTopicsLoading: jasmine.createSpy('isOpenaireBrokerTopicsLoading'),
    isOpenaireBrokerTopicsLoaded: jasmine.createSpy('isOpenaireBrokerTopicsLoaded'),
    isOpenaireBrokerTopicsProcessing: jasmine.createSpy('isOpenaireBrokerTopicsProcessing'),
    getOpenaireBrokerTopicsTotalPages: jasmine.createSpy('getOpenaireBrokerTopicsTotalPages'),
    getOpenaireBrokerTopicsCurrentPage: jasmine.createSpy('getOpenaireBrokerTopicsCurrentPage'),
    getOpenaireBrokerTopicsTotals: jasmine.createSpy('getOpenaireBrokerTopicsTotals'),
    dispatchRetrieveOpenaireBrokerTopics: jasmine.createSpy('dispatchRetrieveOpenaireBrokerTopics'),
  });
}

/**
 * Mock for [[OpenaireBrokerTopicRestService]]
 */
export function getMockOpenaireBrokerTopicRestService():
OpenaireBrokerTopicRestService {
  return jasmine.createSpyObj('OpenaireBrokerTopicRestService', {
    getTopics: jasmine.createSpy('getTopics'),
    getTopic: jasmine.createSpy('getTopic'),
  });
}
