import { ResourceType } from '../../core/shared/resource-type';
import { OpenaireBrokerTopicObject } from '../../core/openaire/models/openaire-broker-topic.model';

// REST Mock ---------------------------------------------------------------------
// -------------------------------------------------------------------------------

export const openaireBrokerTopicObjectMorePid: OpenaireBrokerTopicObject = {
  type: new ResourceType('openaireBrokerTopic'),
  id: 'ENRICH!MORE!PID',
  name: 'ENRICH/MORE/PID',
  lastEvent: '2020/10/09 10:11 UTC',
  totalSuggestions: 33,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MORE!PID'
    }
  }
};

export const openaireBrokerTopicObjectMoreAbstract: OpenaireBrokerTopicObject = {
  type: new ResourceType('openaireBrokerTopic'),
  id: 'ENRICH!MORE!ABSTRACT',
  name: 'ENRICH/MORE/ABSTRACT',
  lastEvent: '2020/09/08 21:14 UTC',
  totalSuggestions: 5,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MORE!ABSTRACT'
    }
  }
};

export const openaireBrokerTopicObjectMissingPid: OpenaireBrokerTopicObject = {
  type: new ResourceType('openaireBrokerTopic'),
  id: 'ENRICH!MISSING!PID',
  name: 'ENRICH/MISSING/PID',
  lastEvent: '2020/10/01 07:36 UTC',
  totalSuggestions: 4,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!PID'
    }
  }
};

export const openaireBrokerTopicObjectMissingAbstract: OpenaireBrokerTopicObject = {
  type: new ResourceType('openaireBrokerTopic'),
  id: 'ENRICH!MISSING!ABSTRACT',
  name: 'ENRICH/MISSING/ABSTRACT',
  lastEvent: '2020/10/08 16:14 UTC',
  totalSuggestions: 71,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!ABSTRACT'
    }
  }
};

export const openaireBrokerTopicObjectMissingAcm: OpenaireBrokerTopicObject = {
  type: new ResourceType('openaireBrokerTopic'),
  id: 'ENRICH!MISSING!SUBJECT!ACM',
  name: 'ENRICH/MISSING/SUBJECT/ACM',
  lastEvent: '2020/09/21 17:51 UTC',
  totalSuggestions: 18,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!SUBJECT!ACM'
    }
  }
};

export const openaireBrokerTopicObjectMissingProject: OpenaireBrokerTopicObject = {
  type: new ResourceType('openaireBrokerTopic'),
  id: 'ENRICH!MISSING!PROJECT',
  name: 'ENRICH/MISSING/PROJECT',
  lastEvent: '2020/09/17 10:28 UTC',
  totalSuggestions: 6,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/nbtopics/ENRICH!MISSING!PROJECT'
    }
  }
};
