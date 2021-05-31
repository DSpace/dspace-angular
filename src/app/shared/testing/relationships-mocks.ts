import { of as observableOf } from 'rxjs';
import { Item } from '../../core/shared/item.model';

export const ItemInfo: any = {
    'timeCompleted': 1619374035878,
    'msToLive': 10000,
    'lastUpdated': 1619374035878,
    'state': 'Success',
    'errorMessage': null,
    'payload': {
      '_name': 'Bollini, Andrea',
      'id': '092b59e8-8159-4e70-98b5-93ec60bd3431',
      'uuid': '092b59e8-8159-4e70-98b5-93ec60bd3431',
      'type': 'item',
      'metadata': {
        'dspace.entity.type': [
          {
            'uuid': '00494f33-46e0-45fa-8399-84e76366e21c',
            'language': null,
            'value': 'Person',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ]
      }
    },
    'statusCode': 200
  };


export const RelationshipsTypesData: any = [
  {
    'type': 'relationshiptype',
    'id': 12,
    'uuid': 'relationshiptype-12',
    'leftwardType': 'isResearchoutputsHiddenFor',
    'leftMaxCardinality': null,
    'leftMinCardinality': 0,
    'rightwardType': 'notDisplayingResearchoutputs',
    'rightMaxCardinality': null,
    'rightMinCardinality': 0
  },
  {
    'type': 'relationshiptype',
    'id': 13,
    'uuid': 'relationshiptype-13',
    'leftwardType': 'isResearchoutputsHiddenFor',
    'leftMaxCardinality': null,
    'leftMinCardinality': 0,
    'rightwardType': 'notDisplayingResearchoutputs',
    'rightMaxCardinality': null,
    'rightMinCardinality': 0
  },
  {
    'type': 'relationshiptype',
    'id': 18,
    'uuid': 'relationshiptype-18',
    'leftwardType': 'isResearchoutputsSelectedFor',
    'leftMaxCardinality': null,
    'leftMinCardinality': 0,
    'rightwardType': 'hasSelectedResearchoutputs',
    'rightMaxCardinality': null,
    'rightMinCardinality': 0
  },
  {
    'type': 'relationshiptype',
    'id': 19,
    'uuid': 'relationshiptype-19',
    'leftwardType': 'isResearchoutputsSelectedFor',
    'leftMaxCardinality': null,
    'leftMinCardinality': 0,
    'rightwardType': 'hasSelectedResearchoutputs',
    'rightMaxCardinality': null,
    'rightMinCardinality': 0
  },
];


export const RelationshipsData: any = [
  {
    'type': 'relationship',
    'uuid': 'relationship-44',
    'id': 44,
    'leftPlace': 0,
    'rightPlace': 0,
    'leftwardValue': 'isResearchoutputsHiddenFor',
    'rightwardValue': 'notDisplayingResearchoutputs',
    'leftItem': observableOf({
      'timeCompleted': 1619374035878,
      'msToLive': 10000,
      'lastUpdated': 1619374035878,
      'state': 'Success',
      'errorMessage': null,
      'payload': Object.assign(new Item(), {
        'handle': '123456789/184',
        'lastModified': '2021-04-21T20:42:45.335+0000',
        'isArchived': true,
        'isDiscoverable': true,
        'isWithdrawn': false,
        '_name': 'Origin and distribution of Daltonism in Italy',
        'id': '87e35ca7-2826-422e-8ecb-079bc4e23744',
        'uuid': '87e35ca7-2826-422e-8ecb-079bc4e23744',
        'type': 'item',
      }),
      'statusCode': 200
    })
  },
  {
    'type': 'relationship',
    'uuid': 'relationship-18',
    'id': 18,
    'leftPlace': 0,
    'rightPlace': 0,
    'leftwardValue': 'isResearchoutputsSelectedFor',
    'rightwardValue': 'hasSelectedResearchoutputs',
    'leftItem': observableOf({
      'timeCompleted': 1619374035878,
      'msToLive': 10000,
      'lastUpdated': 1619374035878,
      'state': 'Success',
      'errorMessage': null,
      'payload': Object.assign(new Item(), {
        'handle': '123456789/160',
        'lastModified': '2021-04-21T20:43:00.479+0000',
        'isArchived': true,
        'isDiscoverable': true,
        'isWithdrawn': false,
        '_name': 'COVID-19 Vaccine: Promoting Vaccine Acceptance',
        'id': '11b61935-5228-4a94-acd9-b44131509494',
        'uuid': '11b61935-5228-4a94-acd9-b44131509494',
        'type': 'item'
      }),
      'statusCode': 200
    })
  },
  {
    'type': 'relationship',
    'uuid': 'relationship-19',
    'id': 19,
    'leftPlace': 0,
    'rightPlace': 1,
    'leftwardValue': 'isResearchoutputsSelectedFor',
    'rightwardValue': 'hasSelectedResearchoutputs',
    'leftItem': observableOf({
      'timeCompleted': 1619374035878,
      'msToLive': 10000,
      'lastUpdated': 1619374035878,
      'state': 'Success',
      'errorMessage': null,
      'payload': Object.assign(new Item(), {
        'handle': '123456789/148',
        'lastModified': '2021-04-21T20:06:15.099+0000',
        'isArchived': true,
        'isDiscoverable': true,
        'isWithdrawn': false,
        '_name': 'Non-viral COVID-19 vaccine delivery systems',
        'id': '572a1622-edcc-4fdf-8b87-4695c758823e',
        'uuid': '572a1622-edcc-4fdf-8b87-4695c758823e',
        'type': 'item'
      }),
      'statusCode': 200
    })
  },
  {
    'type': 'relationship',
    'uuid': 'relationship-36',
    'id': 36,
    'leftPlace': 0,
    'rightPlace': 2,
    'leftwardValue': 'isResearchoutputsSelectedFor',
    'rightwardValue': 'hasSelectedResearchoutputs',
    'leftItem': observableOf({
      'timeCompleted': 1619374035878,
      'msToLive': 10000,
      'lastUpdated': 1619374035878,
      'state': 'Success',
      'errorMessage': null,
      'payload': Object.assign(new Item(), {
        'handle': '123456789/176',
        'lastModified': '2021-04-20T17:26:35.380+0000',
        'isArchived': true,
        'isDiscoverable': true,
        'isWithdrawn': false,
        '_name': 'Color blindness (daltonism) in the light of genetic studies',
        'id': '11605f08-27f0-4e96-b229-a69609c68639',
        'uuid': '11605f08-27f0-4e96-b229-a69609c68639',
        'type': 'item'
      }),
      'statusCode': 200
    })
  }
];

