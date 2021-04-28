import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { SharedModule } from '../shared/shared.module';

import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { AuthServiceStub } from '../shared/testing/auth-service.stub';
import { AuthService } from '../core/auth/auth.service';
import { RelationshipService  } from '../core/data/relationship.service';
import { EntityTypeService } from '../core/data/entity-type.service';
import { SearchServiceStub } from '../shared/testing/search-service.stub';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { RelationshipsServiceStub } from '../shared/testing/relationships-service.stub';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../shared/remote-data.utils';
import { createPaginatedList } from '../shared/testing/utils.test';
import { RemoteData } from '../core/data/remote-data';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { RoleService } from '../core/roles/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../core/services/route.service';
import { SearchResultsMock } from '../shared/testing/search-results-mocks';

describe('EditItemRelationshipsComponent', () => {
  let component: EditItemRelationshipsComponent;
  let fixture: ComponentFixture<EditItemRelationshipsComponent>;
  let de: DebugElement;

  const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

  const authServiceStub = new AuthServiceStub();
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    data: observableOf({
      info: {'timeCompleted':1619374035878,'msToLive':10000,'lastUpdated':1619374035878,'state':'Success','errorMessage':null,'payload':{'handle':'123456789/43','lastModified':'2021-04-22T17:23:01.962+0000','isArchived':true,'isDiscoverable':true,'isWithdrawn':false,'_links':{'bundles':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/bundles'},'mappedCollections':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/mappedCollections'},'owningCollection':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/owningCollection'},'relationships':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/relationships'},'version':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/version'},'templateItemOf':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/templateItemOf'},'metrics':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/metrics'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'}},'_name':'Bollini, Andrea','id':'092b59e8-8159-4e70-98b5-93ec60bd3431','uuid':'092b59e8-8159-4e70-98b5-93ec60bd3431','type':'item','metadata':{'cris.orcid.access-token':[{'uuid':'7c3447ee-1d98-4c6b-9e5b-9d10d56fb89a','language':null,'value':'0f8e688f-a694-4928-90b3-2f3a9cbf4993','place':0,'authority':null,'confidence':-1}],'cris.orcid.refresh-token':[{'uuid':'1d03422d-0710-4ced-b24b-a62c6da4ee7b','language':null,'value':'97f584d7-f631-4170-8fee-ddbef8da7d91','place':0,'authority':null,'confidence':-1}],'cris.orcid.scope':[{'uuid':'0c704cae-f477-4950-94aa-be0036b5310d','language':null,'value':'/authenticate','place':0,'authority':null,'confidence':-1},{'uuid':'a0dce486-5a97-4c54-8e5b-9cfff7f1a4cd','language':null,'value':'/read-limited','place':1,'authority':null,'confidence':-1},{'uuid':'c2ca3e9b-f0a5-4162-b0d5-ce2ddd0772af','language':null,'value':'/activities/update','place':2,'authority':null,'confidence':-1},{'uuid':'9d7f01ce-15e2-49cb-bf2a-98512401987d','language':null,'value':'/person/update','place':3,'authority':null,'confidence':-1}],'cris.orcid.sync-mode':[{'uuid':'178ed5ac-2745-45a8-8ada-db6d5569d9fd','language':null,'value':'MANUAL','place':0,'authority':null,'confidence':-1}],'cris.orcid.sync-projects':[{'uuid':'b18bc9d8-53d3-478c-b568-088e69d44bac','language':null,'value':'ALL','place':0,'authority':null,'confidence':-1}],'cris.orcid.sync-publications':[{'uuid':'04c30bad-2cdd-45b9-9193-a5846510dccb','language':null,'value':'MY_SELECTED','place':0,'authority':null,'confidence':-1}],'cris.owner':[{'uuid':'49a446d9-db3c-4f60-bba0-287bdc300efa','language':null,'value':'Demo Site Administrator','place':0,'authority':'335647b6-8a52-4ecb-a8c1-7ebabb199bda','confidence':600}],'cris.policy.group':[{'uuid':'7268e517-9049-4735-9bcb-b4de08f2ce64','language':null,'value':'Administrator','place':0,'authority':'4ebb837c-c2ae-4928-9bb1-6f51df4eeb60','confidence':600}],'cris.sourceId':[{'uuid':'0fa73bfa-1c99-4ae5-baca-66a9fe325493','language':null,'value':'335647b6-8a52-4ecb-a8c1-7ebabb199bda','place':0,'authority':null,'confidence':-1}],'crisrp.country':[{'uuid':'4bccc9fe-8d14-4c85-94af-b05e80f5f35f','language':null,'value':'Italy','place':0,'authority':null,'confidence':-1}],'crisrp.education':[{'uuid':'85e2ae9a-2c55-466d-9172-4b8e58e96964','language':null,'value':'Università degli Studi di Milano Bicocca','place':0,'authority':null,'confidence':-1},{'uuid':'553ab27c-a1f9-4970-8d8c-b7ef1897ad0a','language':null,'value':'Sapienza Università di Roma','place':1,'authority':null,'confidence':-1}],'crisrp.education.end':[{'uuid':'346e16db-f75f-46ff-a384-3ebc44c63857','language':null,'value':'2008','place':0,'authority':null,'confidence':-1},{'uuid':'a3dea198-9784-48c7-b28f-289de41829e0','language':null,'value':'2003','place':1,'authority':null,'confidence':-1}],'crisrp.education.role':[{'uuid':'a7ed8300-4433-4e87-84bb-da05572ca59f','language':null,'value':'Master post experience 2nd level','place':0,'authority':null,'confidence':-1},{'uuid':'bff41ddd-3e91-4def-9ba4-d5d86e01bfe3','language':null,'value':'Graduate Studies - Mathematics, Physics','place':1,'authority':null,'confidence':-1}],'crisrp.education.start':[{'uuid':'1eefe340-53c3-4c52-8f7b-e0d2667a0c58','language':null,'value':'2007','place':0,'authority':null,'confidence':-1},{'uuid':'ed60f1de-7c13-4800-907c-1ebe6f3004b9','language':null,'value':'1998','place':1,'authority':null,'confidence':-1}],'crisrp.site.title':[{'uuid':'b39f42ec-78a9-4adc-b353-f7cc445449eb','language':null,'value':'LinkedIn','place':0,'authority':null,'confidence':-1},{'uuid':'16b06a29-9155-4a7d-ab94-9398c9af7d37','language':null,'value':'GitHub','place':1,'authority':null,'confidence':-1}],'dc.date.accessioned':[{'uuid':'2dc09182-d275-48fa-bb86-6d84904b3844','language':null,'value':'2020-09-14T09:36:02Z','place':0,'authority':null,'confidence':-1}],'dc.date.available':[{'uuid':'69eac56b-9a93-4e3e-8cae-f8ab14f05897','language':null,'value':'2020-09-14T09:36:02Z','place':0,'authority':null,'confidence':-1}],'dc.description.abstract':[{'uuid':'62964e61-4454-4154-8f67-6f6f1db1e6f1','language':null,'value':'I’m responsible of all the technological aspects of the company proposal, from the final solutions to tools, methodologies and technologies adopted for the production and support activities. Among my responsibilities, I define the infrastructure that best fits the project requirements. We provide support on premis on the customer data center and worldwide cloud providers. Our hosted solutions are powered by Amazon Web Services, our experience in their services allow us to offer best in class solutions, scalable and cost-optimized.\n\nI’m in charge of the planning, estimation and execution of the projects from the technical perspective, and of the preparation of technical annexes for national and international tenders.\n\nI lead the teams of software architects and developers, assuring the adoption of best practices and up-to-date technologies. I’m in charge of the scouting and integration of new technologies and products within our solutions with a particular focus on Open Source and Open Standards. I’m directly involved with open-source and domain communities to assure that our solutions remain aligned with the international trends both from the technical perspective and for the functional requirements.','place':0,'authority':null,'confidence':-1}],'dc.description.provenance':[{'uuid':'8a2abdcd-6cd1-4954-a4bb-6b0b1158d211','language':'en','value':'Made available in DSpace on 2020-09-14T09:36:02Z (GMT). No. of bitstreams: 0','place':0,'authority':null,'confidence':-1}],'dc.identifier.uri':[{'uuid':'571cecf7-ca0c-4562-b6a3-59691585ec3b','language':null,'value':'https://dspacecris7.4science.cloud/handle/123456789/43','place':0,'authority':null,'confidence':-1}],'dc.title':[{'uuid':'af697993-8c65-4c04-ac6a-a18f36d8493b','language':null,'value':'Bollini, Andrea','place':0,'authority':null,'confidence':-1}],'dspace.entity.type':[{'uuid':'00494f33-46e0-45fa-8399-84e76366e21c','language':null,'value':'Person','place':0,'authority':null,'confidence':-1}],'oairecerif.affiliation.endDate':[{'uuid':'814ad30f-ba97-4111-ba0d-5b37a381e647','language':null,'value':'2016','place':0,'authority':null,'confidence':-1},{'uuid':'a511bf32-01d7-479f-9c28-61d49b8bef9d','language':null,'value':'2012','place':1,'authority':null,'confidence':-1}],'oairecerif.affiliation.role':[{'uuid':'87ddb264-1eaf-424f-9e9c-49ac8e9037b9','language':null,'value':'Head of Open Source & Open Standards Strategy','place':0,'authority':null,'confidence':-1},{'uuid':'22181e37-0212-4c38-ae62-4edb20518cdd','language':null,'value':'Project Manager, IT Architect & Systems Integrator','place':1,'authority':null,'confidence':-1}],'oairecerif.affiliation.startDate':[{'uuid':'014311c4-c904-4a52-acdc-33e508c7aab1','language':null,'value':'2012','place':0,'authority':null,'confidence':-1},{'uuid':'557d56c6-d43c-4de2-b92b-19aede8131b7','language':null,'value':'2004','place':1,'authority':null,'confidence':-1}],'oairecerif.identifier.url':[{'uuid':'b1402b7d-4ecf-4d9b-94cb-90987a3e9e4d','language':null,'value':'https://www.linkedin.com/in/andreabollini/','place':0,'authority':null,'confidence':-1},{'uuid':'9fe60885-6d37-45c0-8332-ce2e441825d4','language':null,'value':'https://github.com/abollini','place':1,'authority':null,'confidence':-1}],'oairecerif.person.affiliation':[{'uuid':'33cb5b5f-3f96-4537-bf84-0d641ede7c0a','language':null,'value':'CINECA','place':0,'authority':'466bf244-ad2a-401f-bdbc-ea2dd946a1cf','confidence':600},{'uuid':'bd882058-9bf7-4cdf-b799-b12ce3060671','language':null,'value':'CILEA','place':1,'authority':'454291ef-8ed5-4dc7-900d-fcb142c576d1','confidence':600}],'oairecerif.person.gender':[{'uuid':'1befb118-bb2a-4225-9166-311f0f45314c','language':null,'value':'m','place':0,'authority':null,'confidence':-1}],'person.affiliation.name':[{'uuid':'84ac6de9-4024-4d4f-8b15-658ef6f5c6cc','language':null,'value':'4Science','place':0,'authority':'a14ba215-c0f0-4b74-b21a-06359bfabd45','confidence':600}],'person.birthDate':[{'uuid':'01c1a189-d6a3-45f6-92fa-39cdf6103437','language':null,'value':'1995','place':0,'authority':null,'confidence':-1}],'person.email':[{'uuid':'fb1ffa13-4fb6-42e8-a3aa-138c2b3b38b0','language':null,'value':'andrea.bollini@4science.it','place':0,'authority':null,'confidence':-1}],'person.familyName':[{'uuid':'ef4d76e2-b0b2-469e-b998-f36969075b2d','language':null,'value':'Bollini','place':0,'authority':null,'confidence':-1}],'person.givenName':[{'uuid':'4545933c-2692-4009-824d-3545ee2a4e81','language':null,'value':'Andrea','place':0,'authority':null,'confidence':-1}],'person.identifier.orcid':[{'uuid':'075a8411-a57e-445f-9ae6-d085fb442ef9','language':null,'value':'0000-0002-5497-7736','place':0,'authority':null,'confidence':-1}],'person.identifier.scopus-author-id':[{'uuid':'6d1c43d9-c6bd-45c2-b48c-bc38bfdd9537','language':null,'value':'55484808800','place':0,'authority':null,'confidence':-1}],'person.jobTitle':[{'uuid':'352eeec3-a613-422a-af9c-3eb621c02f1f','language':null,'value':'CTO','place':0,'authority':null,'confidence':-1}],'person.knowsLanguage':[{'uuid':'16c340fb-4790-4fa1-8c31-ad738d479571','language':null,'value':'it','place':0,'authority':null,'confidence':-1},{'uuid':'5373f4e4-fb51-44bc-b33c-7ca7940559f1','language':null,'value':'en','place':1,'authority':null,'confidence':-1}]},'owningCollection':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'version':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'bundles':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'relationships':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'metrics':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false,'source':{'_isScalar':false},'operator':{}},'operator':{}},'operator':{}},'operator':{}},'operator':{}}},'statusCode':200}})
  });

  const relationshipsTypes = [{'type':'relationshiptype','id':1,'uuid':'relationshiptype-1','leftwardType':'isCorrectionOfItem','leftMaxCardinality':1,'leftMinCardinality':0,'rightwardType':'isCorrectedByItem','rightMaxCardinality':1,'rightMinCardinality':0,'_links':{'leftType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'rightType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/1'}}},{'type':'relationshiptype','id':12,'uuid':'relationshiptype-12','leftwardType':'isResearchoutputsHiddenFor','leftMaxCardinality':null,'leftMinCardinality':0,'rightwardType':'notDisplayingResearchoutputs','rightMaxCardinality':null,'rightMinCardinality':0,'_links':{'leftType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/5'},'rightType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/12'}}},{'type':'relationshiptype','id':13,'uuid':'relationshiptype-13','leftwardType':'isResearchoutputsHiddenFor','leftMaxCardinality':null,'leftMinCardinality':0,'rightwardType':'notDisplayingResearchoutputs','rightMaxCardinality':null,'rightMinCardinality':0,'_links':{'leftType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/7'},'rightType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/13'}}},{'type':'relationshiptype','id':14,'uuid':'relationshiptype-14','leftwardType':'isProjectsHiddenFor','leftMaxCardinality':null,'leftMinCardinality':0,'rightwardType':'notDisplayingProjects','rightMaxCardinality':null,'rightMinCardinality':0,'_links':{'leftType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/2'},'rightType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/14'}}},{'type':'relationshiptype','id':18,'uuid':'relationshiptype-18','leftwardType':'isResearchoutputsSelectedFor','leftMaxCardinality':null,'leftMinCardinality':0,'rightwardType':'hasSelectedResearchoutputs','rightMaxCardinality':null,'rightMinCardinality':0,'_links':{'leftType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/5'},'rightType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/18'}}},{'type':'relationshiptype','id':19,'uuid':'relationshiptype-19','leftwardType':'isResearchoutputsSelectedFor','leftMaxCardinality':null,'leftMinCardinality':0,'rightwardType':'hasSelectedResearchoutputs','rightMaxCardinality':null,'rightMinCardinality':0,'_links':{'leftType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/7'},'rightType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/19'}}},{'type':'relationshiptype','id':20,'uuid':'relationshiptype-20','leftwardType':'isProjectsSelectedFor','leftMaxCardinality':null,'leftMinCardinality':0,'rightwardType':'hasSelectedProjects','rightMaxCardinality':null,'rightMinCardinality':0,'_links':{'leftType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/2'},'rightType':{'href':'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'},'self':{'href':'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/20'}}}];
  const relationships = [{'type': 'relationship', 'uuid': 'relationship-44', 'id': 44, 'leftPlace': 0, 'rightPlace': 0, 'leftwardValue': 'isResearchoutputsHiddenFor', 'rightwardValue': 'notDisplayingResearchoutputs', '_links': {'relationshipType': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/12'}, 'self': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationships/44'}, 'leftItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/4e934727-331e-4be2-8a6b-e1df8656dd51'}, 'rightItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'} }, 'leftItem': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} } }, {'type': 'relationship', 'uuid': 'relationship-18', 'id': 18, 'leftPlace': 0, 'rightPlace': 0, 'leftwardValue': 'isResearchoutputsSelectedFor', 'rightwardValue': 'hasSelectedResearchoutputs', '_links': {'relationshipType': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/18'}, 'self': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationships/18'}, 'leftItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df'}, 'rightItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'} }, 'leftItem': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} } }, {'type': 'relationship', 'uuid': 'relationship-19', 'id': 19, 'leftPlace': 0, 'rightPlace': 1, 'leftwardValue': 'isResearchoutputsSelectedFor', 'rightwardValue': 'hasSelectedResearchoutputs', '_links': {'relationshipType': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/18'}, 'self': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationships/19'}, 'leftItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205'}, 'rightItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'} }, 'leftItem': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} } }, {'type': 'relationship', 'uuid': 'relationship-36', 'id': 36, 'leftPlace': 0, 'rightPlace': 2, 'leftwardValue': 'isResearchoutputsSelectedFor', 'rightwardValue': 'hasSelectedResearchoutputs', '_links': {'relationshipType': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationshiptypes/18'}, 'self': {'href': 'https://dspacecris7.4science.cloud/server/api/core/relationships/36'}, 'leftItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/904885d7-c294-47a6-9064-8ba1070b91b5'}, 'rightItem': {'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'} }, 'leftItem': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false, 'source': {'_isScalar': false }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} }, 'operator': {} } }];
  const relationType = 'researchoutputs';
  const itemType = 'Person';


  const relationshipsServiceStub = new RelationshipsServiceStub();

  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => observableOf(emptyList),
    /* tslint:disable:no-empty */
    clearDiscoveryRequests: () => {}
    /* tslint:enable:no-empty */
  });
  const mockSearchOptions = observableOf(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      id: 'search-page-configuration',
      pageSize: 10,
      currentPage: 1
    }),
    sort: new SortOptions('dc.title', SortDirection.ASC)
  }));

  const searchResults = SearchResultsMock;

  const roleServiceStub = {
    isSubmitter : () => {
      return observableOf(true);
    },
    isController : () => {
      return observableOf(false);
    },
    isAdmin : () => {
      return observableOf(true);
    },
  };

  const routeServiceStub = {
    isSubmitter : () => {
      return observableOf(true);
    },
    getRouteParameterValue: () => {
      return observableOf('');
    },
    getQueryParameterValue: () => {
      return observableOf('');
    },
    getQueryParamsWithPrefix: () => {
      return observableOf('');
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports : [
          RouterTestingModule.withRoutes([]),
          SharedModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          })
        ],
        declarations: [ EditItemRelationshipsComponent ],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: AuthService, useValue: authServiceStub },
          { provide: RelationshipService, useValue: relationshipsServiceStub },
          { provide: SearchService, useValue: searchServiceStub },
          { provide: EntityTypeService, useValue: {} },
          { provide: RoleService, useValue: roleServiceStub },
          { provide: RouteService, useValue: routeServiceStub },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
    });


  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemRelationshipsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty list of relations', () => {
    expect(de.query(By.css('relationships-sort-list'))).toBeNull();
  });

  it('should be empty list of items', () => {
    expect(de.query(By.css('search-results'))).toBeNull();
  });

  it('should init', () => {
    component.searchOptions$ = mockSearchOptions;
    fixture.detectChanges();

    console.log(component);
    expect(component).toBeTruthy();
  });

  it('after init & item is set check that the relationship is set', () => {
    expect(component).toBeTruthy();
  });

  it('after init & item is set check that the relationship type is set', () => {
    expect(component).toBeTruthy();
  });

  it('after init & item is set check that the results of relationship to manage is set', () => {
    expect(component).toBeTruthy();
  });

  it('after all are set check if the view is changed for the left and right list', () => {
    expect(component).toBeTruthy();
  });
});
