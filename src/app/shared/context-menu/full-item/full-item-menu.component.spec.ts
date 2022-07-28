import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { FullItemMenuComponent } from './full-item-menu.component';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('FullItemMenuComponent', () => {
  let component: FullItemMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<FullItemMenuComponent>;
  let scheduler: TestScheduler;
  let dso: DSpaceObject;
  let router: Router;

  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: jasmine.createSpy('getAuthenticatedUserFromStore'),
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      'handle': '123456789/122',
      'lastModified': '2022-07-01T08:24:53.040Z',
      'isArchived': true,
      'isDiscoverable': true,
      'isWithdrawn': false,
      'entityType': 'Publication',
      '_links': {
        'bundles': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/bundles'
        },
        'mappedCollections': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/mappedCollections'
        },
        'owningCollection': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/owningCollection'
        },
        'relationships': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/relationships'
        },
        'version': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/version'
        },
        'templateItemOf': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/templateItemOf'
        },
        'metrics': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/metrics'
        },
        'thumbnail': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/thumbnail'
        },
        'self': {
          'href': 'https://dspacecris7.4science.cloud/server/api/core/items/9880d9e1-5441-4e14-a6e8-6cf453bc25f9'
        }
      },
      '_name': 'Regional Portal FVG: Effective Interoperability Trough DSpace-CRIS and Open Standards',
      'id': '9880d9e1-5441-4e14-a6e8-6cf453bc25f9',
      'uuid': '9880d9e1-5441-4e14-a6e8-6cf453bc25f9',
      'type': 'item',
      'metadata': {
        'cris.virtual.department': [
          {
            'uuid': '57244d56-a2fa-4654-8cb9-f5d8548f8f96',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 0,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'c8c4c33a-6c56-4853-a42b-760810698186',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 1,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'f61f30f8-7e85-464f-9968-80e359af7e74',
            'language': null,
            'value': '4Science',
            'place': 2,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '0b8463ef-6d47-4b4d-bd39-a1181140d055',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 3,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '3a398695-da7c-4f6e-ac24-f931860076bc',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 4,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '0a285bf9-502a-4225-8d42-93047aaf9352',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 5,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '3003026d-2887-4563-8634-d16cdd18b61d',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 6,
            'authority': null,
            'confidence': -1
          }
        ],
        'cris.virtualsource.department': [
          {
            'uuid': '9c192700-0488-4d95-a602-f7c1bbe87d52',
            'language': null,
            'value': '77b42b8e-6bcc-4b5c-91de-8fe7e7a1565c',
            'place': 0,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'da15a04c-7274-4b18-90e5-9e8de36462a9',
            'language': null,
            'value': 'cb683795-9fb8-448a-acf1-3122e8bdf665',
            'place': 1,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '12713c7f-0e0d-47c9-a5f4-fea3f7eb0d7b',
            'language': null,
            'value': '092b59e8-8159-4e70-98b5-93ec60bd3431',
            'place': 2,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '677dac67-40b4-402b-b059-0851ba7ebc49',
            'language': null,
            'value': 'afebd5f1-488c-4f92-8401-e5b3bc7b57cf',
            'place': 3,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'adebd1ec-1272-4783-86f1-72e7cd03e68f',
            'language': null,
            'value': 'f42a9a63-307f-48ac-b02b-6cf9f031be4d',
            'place': 4,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'c62e718e-75c9-4beb-97ad-106f065912dd',
            'language': null,
            'value': 'f3e21d9d-6c82-43a5-9c4f-a355bf135469',
            'place': 5,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'c339bfbf-f706-4fba-8541-429fa7ba78d6',
            'language': null,
            'value': '84678934-bf08-4546-ad3d-95c1a95a3090',
            'place': 6,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.contributor.author': [
          {
            'uuid': '845e6c92-2a67-4319-ae70-1b1a4b569bce',
            'language': null,
            'value': 'Piščanc J.',
            'place': 0,
            'authority': '77b42b8e-6bcc-4b5c-91de-8fe7e7a1565c',
            'confidence': 600
          },
          {
            'uuid': '53c8a01d-bdd9-43a0-9c63-c70da1f6dfcc',
            'language': null,
            'value': 'Trampus R.',
            'place': 1,
            'authority': 'cb683795-9fb8-448a-acf1-3122e8bdf665',
            'confidence': 600
          },
          {
            'uuid': '2de52eec-fe85-4e3e-8dea-7bfa82849cad',
            'language': null,
            'value': 'Bollini, Andrea',
            'place': 2,
            'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
            'confidence': 600
          },
          {
            'uuid': '830756d4-5be2-4355-a1b3-478eabffd971',
            'language': null,
            'value': 'Mennielli M.',
            'place': 3,
            'authority': 'afebd5f1-488c-4f92-8401-e5b3bc7b57cf',
            'confidence': 600
          },
          {
            'uuid': '94ee3d66-ed00-41a0-b4d5-cd1b8f9ad4b4',
            'language': null,
            'value': 'Balbi L.',
            'place': 4,
            'authority': 'f42a9a63-307f-48ac-b02b-6cf9f031be4d',
            'confidence': 600
          },
          {
            'uuid': '66137349-25b2-4bc8-b33f-943d3db87c73',
            'language': null,
            'value': 'Pascarelli L.',
            'place': 5,
            'authority': 'f3e21d9d-6c82-43a5-9c4f-a355bf135469',
            'confidence': 600
          },
          {
            'uuid': '2bc7bfee-3e8d-4d2c-9672-3a5be82d8a77',
            'language': null,
            'value': 'Mornati S.',
            'place': 6,
            'authority': '84678934-bf08-4546-ad3d-95c1a95a3090',
            'confidence': 600
          },
          {
            'uuid': 'c5532034-024f-458d-8476-ee770da8ec6b',
            'language': null,
            'value': 'pinco pallino',
            'place': 7,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.date.accessioned': [
          {
            'uuid': 'bf7c7807-8d97-4db7-994e-ba1c555d479e',
            'language': null,
            'value': '2021-01-12T20:49:51Z',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.date.available': [
          {
            'uuid': '7939690d-2014-47bf-8f94-d16bc2bbb0c5',
            'language': null,
            'value': '2021-01-12T20:49:51Z',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.date.issued': [
          {
            'uuid': 'b3308a4d-ca20-4e23-bec2-9aa111c173d2',
            'language': null,
            'value': '2019',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.description.abstract': [
          {
            'uuid': '6f45ec31-4d10-4317-bf50-ad8194e1a9e0',
            'language': null,
            'value': '© 2017 The Authors. Friuli-VeneziaGiulia (FVG) Regional Scientific System includes three Public Research Institutions, three Universities, four International Institutions, four Technological Parks in FVG region in North-East Italy. In 2014 the three Universities started to cooperate for a common research output inside a project named UnityFVG: United Universities-FVG. They already have 10 years experience in OA with four Institutional Repositories (DSpace/DSpace-CRIS based) and more than 100,000 Research Publications. So they decided to provide a single point of access under a new Regional Research Portal based on DSpace-CRIS. The project, with the technical support of Cineca consortium, offers a great opportunity to improve the interoperability of DSpace-CRIS based solutions. The European standard for the research domain, CERIF, is the best option to drive rich information to the portal in a standard and reusable way. A plugin/patch for DSpace will be freely available to enable data export using CERIF-XML over OAI-PMH. CERIF-XML will be available for all the main entities (People, Projects, Organizations, Journals, Conferences, Dataset, Publications and metrics). The DSpace OAI-PMH harvester will be extended to support ingestion of complex, interconnected information as provided by the CERIF-XML format. This will enable content replication between DSpace-CRIS instances and easy setup of public OA oriented portals.',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.identifier.scopus': [
          {
            'uuid': '886ee280-fef9-4fe7-92d3-780ca107f26c',
            'language': null,
            'value': '2-s2.0-85020703703',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.identifier.uri': [
          {
            'uuid': '56eaae93-6ecd-4323-a15a-1e18b1ff561f',
            'language': null,
            'value': 'https://dspacecris7.4science.cloud/handle/123456789/122',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.relation.grantno': [
          {
            'uuid': 'd25b9774-dc20-4eec-86f0-c858bb97110d',
            'language': null,
            'value': 'undefined',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.relation.ispartof': [
          {
            'uuid': '974d2053-c402-4ddb-b2fd-fac24d967c56',
            'language': null,
            'value': 'Procedia Computer Science',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.relation.ispartofseries': [
          {
            'uuid': 'e05904b5-0e8b-4198-ada5-94051ce6ed1d',
            'language': null,
            'value': 'Procedia Computer Science',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.relation.product': [
          {
            'uuid': 'ac94ffba-c9f5-40c8-b1d4-4937a662a5f2',
            'language': null,
            'value': 'DSpace-CRIS 7.0',
            'place': 0,
            'authority': 'b44bbd4b-9bc8-453b-8740-e9dd64fca31b',
            'confidence': 600
          }
        ],
        'dc.relation.project': [
          {
            'uuid': 'b675ea71-d492-4df1-95da-740a02112e72',
            'language': null,
            'value': 'DSpace-CRIS',
            'place': 0,
            'authority': '90f3b9ce-db65-479c-90d7-8c794abf942c',
            'confidence': 600
          }
        ],
        'dc.rights': [
          {
            'uuid': '677373a5-c1c6-4a15-b9bf-d264bdf0ecbf',
            'language': null,
            'value': 'open access',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.subject': [
          {
            'uuid': 'e1c4812f-dc0c-4303-ae2d-8fa412f67a46',
            'language': null,
            'value': 'dspace',
            'place': 0,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '36c860c1-5c8f-49e7-84b3-61b8ba3b2700',
            'language': null,
            'value': 'dspace-cris',
            'place': 1,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'ecff3e20-cd84-4fb8-9c51-c161c97a75a0',
            'language': null,
            'value': 'cerif',
            'place': 2,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'a1b4468f-83da-473e-9b67-d94c81d3f8f0',
            'language': null,
            'value': 'xml',
            'place': 3,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '70d0bcfd-7fb4-4feb-83fb-413375ef1156',
            'language': null,
            'value': 'openaire',
            'place': 4,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.title': [
          {
            'uuid': '88a5da5c-8ff9-48fa-84da-7f6d6c0641c0',
            'language': null,
            'value': 'Regional Portal FVG: Effective Interoperability Trough DSpace-CRIS and Open Standards',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dc.type': [
          {
            'uuid': 'dfb525f2-e694-4907-8547-5c85cafb5491',
            'language': null,
            'value': 'Conference Proceeding',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'dspace.entity.type': [
          {
            'uuid': '07edae92-c019-4ce8-9bc1-05cfebbfcac2',
            'language': null,
            'value': 'Publication',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'oaire.citation.endPage': [
          {
            'uuid': 'cdfe13bc-422d-4c62-8200-1dbc34ebc89b',
            'language': null,
            'value': '86',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'oaire.citation.startPage': [
          {
            'uuid': '5a8c9c4b-17e7-4c81-8034-8b88fc13885e',
            'language': null,
            'value': '82',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'oaire.citation.volume': [
          {
            'uuid': '042c7e97-b565-4c42-864e-307555fe28aa',
            'language': null,
            'value': '106',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ],
        'oairecerif.affiliation.orgunit': [
          {
            'uuid': '0414ce39-a9ce-49c0-934d-7f6fb6928b47',
            'language': null,
            'value': 'Università degli Studi di Trieste',
            'place': 0,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'e8428976-df9b-42ba-a4b7-a99708ab878e',
            'language': null,
            'value': 'Università degli Studi di Trieste',
            'place': 1,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'd1f5d784-6626-48c1-9156-60caa8496b2b',
            'language': null,
            'value': 'Università degli Studi di Trieste',
            'place': 2,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '36e7d4df-2e87-40ef-9057-9824daa7cb52',
            'language': null,
            'value': 'CINECA',
            'place': 3,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '23560ee5-1d66-4e75-bd96-59212cbc2d5d',
            'language': null,
            'value': 'CINECA',
            'place': 4,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'f71c94e1-585d-4cee-a548-5b597267be94',
            'language': null,
            'value': 'CINECA',
            'place': 5,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '1661093c-6829-42e5-a5b3-e05ac1a9acca',
            'language': null,
            'value': 'CINECA',
            'place': 6,
            'authority': null,
            'confidence': -1
          }
        ],
        'oairecerif.author.affiliation': [
          {
            'uuid': 'e532ba30-cdaf-4b2e-862d-492a56ab1fda',
            'language': null,
            'value': 'University of Trieste',
            'place': 0,
            'authority': 'd04dcca5-07be-4f87-8fb4-a9615236483c',
            'confidence': 600
          },
          {
            'uuid': 'c869e0ea-592e-4818-a797-8bcf30554d3a',
            'language': null,
            'value': 'University of Trieste',
            'place': 1,
            'authority': 'd04dcca5-07be-4f87-8fb4-a9615236483c',
            'confidence': 600
          },
          {
            'uuid': '2b4ebcb1-1cfb-4518-8c06-492345f083a6',
            'language': null,
            'value': '4Science',
            'place': 2,
            'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
            'confidence': 600
          },
          {
            'uuid': '0374791a-39ef-40a8-90f7-dda842e4b4ce',
            'language': null,
            'value': '4Science',
            'place': 3,
            'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
            'confidence': 600
          },
          {
            'uuid': '62c3f5e6-eb3b-48d3-b944-2fd072e67abe',
            'language': null,
            'value': 'University of Trieste',
            'place': 4,
            'authority': 'd04dcca5-07be-4f87-8fb4-a9615236483c',
            'confidence': 600
          },
          {
            'uuid': 'ef9e9fe7-0d2d-4cf5-a006-def140eed14f',
            'language': null,
            'value': '4Science',
            'place': 5,
            'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
            'confidence': 600
          },
          {
            'uuid': 'f52927b9-8676-4823-a66a-9ed3cb58d828',
            'language': null,
            'value': '4Science',
            'place': 6,
            'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
            'confidence': 600
          },
          {
            'uuid': '42f4b2be-7b48-472f-907f-154472de8cfd',
            'language': null,
            'value': 'puntino',
            'place': 7,
            'authority': null,
            'confidence': -1
          }
        ],
        'person.identifier.orcid': [
          {
            'uuid': '5eb94b24-3112-4592-8c94-7dce2a07a9ce',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 0,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '6d917f57-20fc-4428-92b1-16f52c126431',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 1,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '3c7461a5-600e-495e-9889-d18b470a008f',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 2,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '8807a6a9-b8d0-47c1-9c66-6af2d317e1ac',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 3,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'e1c52159-8ad6-4b07-bb46-51ab936bde11',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 4,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '52c404c4-6df4-4cac-b66d-d57bd0f3b772',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 5,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'b0e0ea1b-a76d-447c-bafa-925ac4d6211c',
            'language': null,
            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
            'place': 6,
            'authority': null,
            'confidence': -1
          }
        ],
        'person.identifier.scopus-author-id': [
          {
            'uuid': 'd39ab2f6-8f78-4c4b-8631-574ca9a815cc',
            'language': null,
            'value': '57194540175',
            'place': 0,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '4622c333-0f49-4926-9f7a-45dfec1ec947',
            'language': null,
            'value': '57194549595',
            'place': 1,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': '70c1bf0e-74d0-41f6-93ed-f57062365efa',
            'language': null,
            'value': '57194546716',
            'place': 2,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'efd01e6d-c42b-4b4e-a039-ffa2e6887e27',
            'language': null,
            'value': '56278674000',
            'place': 3,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'c836fc66-a750-4dbf-814b-b3fe797285bc',
            'language': null,
            'value': '55480547600',
            'place': 4,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'ddc66eaa-791e-4156-a87e-0ef90b4980f1',
            'language': null,
            'value': '57194546589',
            'place': 5,
            'authority': null,
            'confidence': -1
          },
          {
            'uuid': 'ab471dc3-0c08-4e9a-8b38-c793113815e0',
            'language': null,
            'value': '55484808800',
            'place': 6,
            'authority': null,
            'confidence': -1
          }
        ]
      },
      'owningCollection': {
        '_isScalar': false,
        'source': {
          '_isScalar': false,
          'source': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false
                },
                'operator': {

                }
              },
              'operator': {

              }
            },
            'operator': {

            }
          },
          'operator': {

          }
        },
        'operator': {

        }
      },
      'version': {
        '_isScalar': false,
        'source': {
          '_isScalar': false,
          'source': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false
                },
                'operator': {

                }
              },
              'operator': {

              }
            },
            'operator': {

            }
          },
          'operator': {

          }
        },
        'operator': {

        }
      },
      'relationships': {
        '_isScalar': false,
        'source': {
          '_isScalar': false,
          'source': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false
                },
                'operator': {

                }
              },
              'operator': {

              }
            },
            'operator': {

            }
          },
          'operator': {

          }
        },
        'operator': {

        }
      },
      'thumbnail': {
        '_isScalar': false,
        'source': {
          '_isScalar': false,
          'source': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false
                },
                'operator': {

                }
              },
              'operator': {

              }
            },
            'operator': {

            }
          },
          'operator': {

          }
        },
        'operator': {

        }
      },
      'metrics': {
        '_isScalar': false,
        'source': {
          '_isScalar': false,
          'source': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false
                },
                'operator': {

                }
              },
              'operator': {

              }
            },
            'operator': {

            }
          },
          'operator': {

          }
        },
        'operator': {

        }
      }
    });

    TestBed.configureTestingModule({
      declarations: [ FullItemMenuComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthService, useValue: authServiceStub },
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(FullItemMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).not.toBeNull();
  });

  it('should not render a button', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/entities/publication/9880d9e1-5441-4e14-a6e8-6cf453bc25f9/full');
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).toBeNull();
  });

});
