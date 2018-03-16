import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { MetadataSchema } from './metadataschema.model';
import { MetadataField } from './metadatafield.model';
import { PageInfo } from '../shared/page-info.model';

Injectable()
export class MetadataRegistryService {

  metadataSchemas: Array<MetadataSchema>;
  metadataFields: Array<MetadataField>;

  public getMetadataSchemas(): Observable<RemoteData<PaginatedList<MetadataSchema>>> {
    let pageInfo = new PageInfo();
    pageInfo.elementsPerPage = 10;
    pageInfo.currentPage = 1;

    let payload = new PaginatedList(pageInfo, this.metadataSchemas);
    let remoteData = new RemoteData(false, false, true, undefined, payload);
    return Observable.of(remoteData);
  }

  public getMetadataFieldsBySchema(schema: MetadataSchema): Observable<RemoteData<PaginatedList<MetadataField>>> {
    let pageInfo = new PageInfo();
    pageInfo.elementsPerPage = 10;
    pageInfo.currentPage = 1;

    let payload = new PaginatedList(pageInfo, this.metadataFields.filter((value) => value.schema == schema));
    let remoteData = new RemoteData(false, false, true, undefined, payload);
    return Observable.of(remoteData);
  }

  public getMetadataSchemaByName(schemaName: string): Observable<RemoteData<MetadataSchema>> {
    let payload = this.metadataSchemas.filter((value) => value.prefix == schemaName)[0];
    let remoteData = new RemoteData(false, false, true, undefined, payload);
    return Observable.of(remoteData);
  }

  constructor() {
    this.metadataSchemas = [
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1",
        "prefix": "dc",
        "namespace": "http://dublincore.org/documents/dcmi-terms/"
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/2",
        "prefix": "mock",
        "namespace": "http://dspace.org/mockschema"
      }
    ];
    this.metadataFields = [
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/8",
        "element": "contributor",
        "qualifier": "advisor",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/9",
        "element": "contributor",
        "qualifier": "author",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/10",
        "element": "contributor",
        "qualifier": "editor",
        "scopenote": "test scope note",
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/11",
        "element": "contributor",
        "qualifier": "illustrator",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/12",
        "element": "contributor",
        "qualifier": "other",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/7",
        "element": "contributor",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/13",
        "element": "coverage",
        "qualifier": "spatial",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/14",
        "element": "coverage",
        "qualifier": "temporal",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/15",
        "element": "creator",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/17",
        "element": "date",
        "qualifier": "accessioned",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/18",
        "element": "date",
        "qualifier": "available",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/19",
        "element": "date",
        "qualifier": "copyright",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/20",
        "element": "date",
        "qualifier": "created",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/21",
        "element": "date",
        "qualifier": "issued",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/22",
        "element": "date",
        "qualifier": "submitted",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/128",
        "element": "date",
        "qualifier": "updated",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/16",
        "element": "date",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/33",
        "element": "description",
        "qualifier": "abstract",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/34",
        "element": "description",
        "qualifier": "provenance",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/35",
        "element": "description",
        "qualifier": "sponsorship",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/36",
        "element": "description",
        "qualifier": "statementofresponsibility",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/37",
        "element": "description",
        "qualifier": "tableofcontents",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/38",
        "element": "description",
        "qualifier": "uri",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/129",
        "element": "description",
        "qualifier": "version",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/32",
        "element": "description",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/40",
        "element": "format",
        "qualifier": "extent",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/41",
        "element": "format",
        "qualifier": "medium",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/42",
        "element": "format",
        "qualifier": "mimetype",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/39",
        "element": "format",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/24",
        "element": "identifier",
        "qualifier": "citation",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/133",
        "element": "identifier",
        "qualifier": "doi",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/137",
        "element": "identifier",
        "qualifier": "eissn",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/134",
        "element": "identifier",
        "qualifier": "epage",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/25",
        "element": "identifier",
        "qualifier": "govdoc",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/26",
        "element": "identifier",
        "qualifier": "isbn",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/29",
        "element": "identifier",
        "qualifier": "ismn",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/27",
        "element": "identifier",
        "qualifier": "issn",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/135",
        "element": "identifier",
        "qualifier": "issue",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/30",
        "element": "identifier",
        "qualifier": "other",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/141",
        "element": "identifier",
        "qualifier": "pmcid",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/136",
        "element": "identifier",
        "qualifier": "pmid",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/28",
        "element": "identifier",
        "qualifier": "sici",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/130",
        "element": "identifier",
        "qualifier": "slug",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/139",
        "element": "identifier",
        "qualifier": "spage",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/31",
        "element": "identifier",
        "qualifier": "uri",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/138",
        "element": "identifier",
        "qualifier": "url",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/140",
        "element": "identifier",
        "qualifier": "volume",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/23",
        "element": "identifier",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/44",
        "element": "language",
        "qualifier": "iso",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/131",
        "element": "language",
        "qualifier": "rfc3066",
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/43",
        "element": "language",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/5",
        "element": "provenance",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[0]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/45",
        "element": "publisher",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/50",
        "element": "relation",
        "qualifier": "haspart",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/52",
        "element": "relation",
        "qualifier": "hasversion",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/53",
        "element": "relation",
        "qualifier": "isbasedon",
        "scopenote": "a scope note",
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/47",
        "element": "relation",
        "qualifier": "isformatof",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/48",
        "element": "relation",
        "qualifier": "ispartof",
        "scopenote": "another scope note",
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/142",
        "element": "relation",
        "qualifier": "ispartofbook",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/49",
        "element": "relation",
        "qualifier": "ispartofseries",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/54",
        "element": "relation",
        "qualifier": "isreferencedby",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/57",
        "element": "relation",
        "qualifier": "isreplacedby",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/51",
        "element": "relation",
        "qualifier": "isversionof",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/56",
        "element": "relation",
        "qualifier": "replaces",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/55",
        "element": "relation",
        "qualifier": "requires",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/58",
        "element": "relation",
        "qualifier": "uri",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/46",
        "element": "relation",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/132",
        "element": "rights",
        "qualifier": "holder",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/6",
        "element": "rights",
        "qualifier": "license",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/60",
        "element": "rights",
        "qualifier": "uri",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/59",
        "element": "rights",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/62",
        "element": "source",
        "qualifier": "uri",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/61",
        "element": "source",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/64",
        "element": "subject",
        "qualifier": "classification",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/65",
        "element": "subject",
        "qualifier": "ddc",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/66",
        "element": "subject",
        "qualifier": "lcc",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/67",
        "element": "subject",
        "qualifier": "lcsh",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/68",
        "element": "subject",
        "qualifier": "mesh",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/69",
        "element": "subject",
        "qualifier": "other",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/63",
        "element": "subject",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/71",
        "element": "title",
        "qualifier": "alternative",
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/70",
        "element": "title",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/72",
        "element": "type",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/73",
        "element": "abstract",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/74",
        "element": "accessRights",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/75",
        "element": "accrualMethod",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/76",
        "element": "accrualPeriodicity",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/77",
        "element": "accrualPolicy",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/78",
        "element": "alternative",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/79",
        "element": "audience",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/80",
        "element": "available",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/81",
        "element": "bibliographicCitation",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/82",
        "element": "conformsTo",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/83",
        "element": "contributor",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/84",
        "element": "coverage",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/85",
        "element": "created",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/86",
        "element": "creator",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/87",
        "element": "date",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/88",
        "element": "dateAccepted",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/89",
        "element": "dateCopyrighted",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/90",
        "element": "dateSubmitted",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/91",
        "element": "description",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/92",
        "element": "educationLevel",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/93",
        "element": "extent",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/94",
        "element": "format",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/95",
        "element": "hasFormat",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/96",
        "element": "hasPart",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/97",
        "element": "hasVersion",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/98",
        "element": "identifier",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/99",
        "element": "instructionalMethod",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/100",
        "element": "isFormatOf",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/101",
        "element": "isPartOf",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/102",
        "element": "isReferencedBy",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/103",
        "element": "isReplacedBy",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/104",
        "element": "isRequiredBy",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/105",
        "element": "issued",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/106",
        "element": "isVersionOf",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/107",
        "element": "language",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/108",
        "element": "license",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/109",
        "element": "mediator",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/110",
        "element": "medium",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/111",
        "element": "modified",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/112",
        "element": "provenance",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/113",
        "element": "publisher",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/114",
        "element": "references",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/115",
        "element": "relation",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/116",
        "element": "replaces",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/117",
        "element": "requires",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/118",
        "element": "rights",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/119",
        "element": "rightsHolder",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/120",
        "element": "source",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/121",
        "element": "spatial",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/122",
        "element": "subject",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/123",
        "element": "tableOfContents",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/124",
        "element": "temporal",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/125",
        "element": "title",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/126",
        "element": "type",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      },
      {
        "self": "https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/127",
        "element": "valid",
        "qualifier": null,
        "scopenote": null,
        "schema": this.metadataSchemas[1]
      }
    ]
  }

}
