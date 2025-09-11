import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbAccordion,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  map,
  Observable,
} from 'rxjs';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { CommunityDataService } from 'src/app/core/data/community-data.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { MetadataFieldDataService } from 'src/app/core/data/metadata-field-data.service';
import { MetadataSchemaDataService } from 'src/app/core/data/metadata-schema-data.service';
import { ScriptDataService } from 'src/app/core/data/processes/script-data.service';
import { RestRequestMethod } from 'src/app/core/data/rest-request-method';
import { DspaceRestService } from 'src/app/core/dspace-rest/dspace-rest.service';
import { RawRestResponse } from 'src/app/core/dspace-rest/raw-rest-response.model';
import { MetadataField } from 'src/app/core/metadata/metadata-field.model';
import { MetadataSchema } from 'src/app/core/metadata/metadata-schema.model';
import { Collection } from 'src/app/core/shared/collection.model';
import { Community } from 'src/app/core/shared/community.model';
import { getFirstSucceededRemoteListPayload } from 'src/app/core/shared/operators';
import { isEmpty } from 'src/app/shared/empty.util';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';
import { environment } from 'src/environments/environment';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { FiltersComponent } from '../filters-section/filters-section.component';
import { FilteredItemsExportCsvComponent } from './filtered-items-export-csv/filtered-items-export-csv.component';
import {
  FilteredItem,
  FilteredItems,
} from './filtered-items-model';
import { OptionVO } from './option-vo.model';
import { PresetQuery } from './preset-query.model';
import { QueryPredicate } from './query-predicate.model';

/**
 * Component representing the Filtered Items content report.
 */
@Component({
  selector: 'ds-report-filtered-items',
  templateUrl: './filtered-items.component.html',
  styleUrls: ['./filtered-items.component.scss'],
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FilteredItemsExportCsvComponent,
    FiltersComponent,
    NgbAccordionModule,
    ReactiveFormsModule,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class FilteredItemsComponent implements OnInit {

  collections: OptionVO[];
  /**
   * A Boolean representing if loading the list of collections is pending
   */
  loadingCollections$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  presetQueries: PresetQuery[];
  metadataFields: OptionVO[];
  metadataFieldsWithAny: OptionVO[];
  predicates: OptionVO[];
  pageLimits: OptionVO[];

  queryForm: FormGroup;
  currentPage = 0;
  results: FilteredItems = new FilteredItems();
  results$: Observable<FilteredItem[]>;
  @ViewChild('acc') accordionComponent: NgbAccordion;
  /**
   * Observable used to determine whether CSV export is enabled
   */
  csvExportEnabled$: Observable<boolean>;

  constructor(
    private communityService: CommunityDataService,
    private collectionService: CollectionDataService,
    private metadataSchemaService: MetadataSchemaDataService,
    private metadataFieldService: MetadataFieldDataService,
    private translateService: TranslateService,
    private scriptDataService: ScriptDataService,
    private authorizationDataService: AuthorizationDataService,
    private formBuilder: FormBuilder,
    private restService: DspaceRestService) {}

  ngOnInit(): void {
    this.loadCollections();
    this.loadPresetQueries();
    this.loadMetadataFields();
    this.loadPredicates();
    this.loadPageLimits();

    const formQueryPredicates: FormGroup[] = [
      new QueryPredicate().toFormGroup(this.formBuilder),
    ];

    this.csvExportEnabled$ = FilteredItemsExportCsvComponent.csvExportEnabled(this.scriptDataService, this.authorizationDataService);

    this.queryForm = this.formBuilder.group({
      collections: this.formBuilder.control([''], []),
      presetQuery: this.formBuilder.control('new', []),
      queryPredicates: this.formBuilder.array(formQueryPredicates),
      pageLimit: this.formBuilder.control('10', []),
      filters: FiltersComponent.formGroup(this.formBuilder),
      additionalFields: this.formBuilder.control([], []),
    });
  }

  loadCollections(): void {
    this.loadingCollections$.next(true);
    this.collections = [];
    const wholeRepo$ = this.translateService.stream('admin.reports.items.wholeRepo');
    this.collections.push(OptionVO.collectionLoc('', wholeRepo$));

    this.communityService.findAll({ elementsPerPage: 10000, currentPage: 1 }).pipe(
      getFirstSucceededRemoteListPayload(),
    ).subscribe(
      (communitiesRest: Community[]) => {
        communitiesRest.forEach(community => {
          const commVO = OptionVO.collection(community.uuid, community.name, true);
          this.collections.push(commVO);

          this.collectionService.findByParent(community.uuid, { elementsPerPage: 10000, currentPage: 1 }).pipe(
            getFirstSucceededRemoteListPayload(),
          ).subscribe(
            (collectionsRest: Collection[]) => {
              collectionsRest.filter(collection => collection.firstMetadataValue('dspace.entity.type') === 'Publication')
                .forEach(collection => {
                  const collVO = OptionVO.collection(collection.uuid, '–' + collection.name);
                  this.collections.push(collVO);
                });
              this.loadingCollections$.next(false);
            },
          );
        });
      },
    );
  }

  loadPresetQueries(): void {
    this.presetQueries = [
      PresetQuery.of('new', 'admin.reports.items.preset.new', []),
      PresetQuery.of('q1', 'admin.reports.items.preset.hasNoTitle', [
        QueryPredicate.of('dc.title', QueryPredicate.DOES_NOT_EXIST),
      ]),
      PresetQuery.of('q2', 'admin.reports.items.preset.hasNoIdentifierUri', [
        QueryPredicate.of('dc.identifier.uri', QueryPredicate.DOES_NOT_EXIST),
      ]),
      PresetQuery.of('q3', 'admin.reports.items.preset.hasCompoundSubject', [
        QueryPredicate.of('dc.subject.*', QueryPredicate.LIKE, '%;%'),
      ]),
      PresetQuery.of('q4', 'admin.reports.items.preset.hasCompoundAuthor', [
        QueryPredicate.of('dc.contributor.author', QueryPredicate.LIKE, '% and %'),
      ]),
      PresetQuery.of('q5', 'admin.reports.items.preset.hasCompoundCreator', [
        QueryPredicate.of('dc.creator', QueryPredicate.LIKE, '% and %'),
      ]),
      PresetQuery.of('q6', 'admin.reports.items.preset.hasUrlInDescription', [
        QueryPredicate.of('dc.description', QueryPredicate.MATCHES, '^.*(http://|https://|mailto:).*$'),
      ]),
      PresetQuery.of('q7', 'admin.reports.items.preset.hasFullTextInProvenance', [
        QueryPredicate.of('dc.description.provenance', QueryPredicate.MATCHES, '^.*No\. of bitstreams(.|\r|\n|\r\n)*\.(PDF|pdf|DOC|doc|PPT|ppt|DOCX|docx|PPTX|pptx).*$'),
      ]),
      PresetQuery.of('q8', 'admin.reports.items.preset.hasNonFullTextInProvenance', [
        QueryPredicate.of('dc.description.provenance', QueryPredicate.DOES_NOT_MATCH, '^.*No\. of bitstreams(.|\r|\n|\r\n)*\.(PDF|pdf|DOC|doc|PPT|ppt|DOCX|docx|PPTX|pptx).*$'),
      ]),
      PresetQuery.of('q9', 'admin.reports.items.preset.hasEmptyMetadata', [
        QueryPredicate.of('*', QueryPredicate.MATCHES, '^\\s*$'),
      ]),
      PresetQuery.of('q10', 'admin.reports.items.preset.hasUnbreakingDataInDescription', [
        QueryPredicate.of('dc.description.*', QueryPredicate.MATCHES, '^.*(\\S){50,}.*$'),
      ]),
      PresetQuery.of('q12', 'admin.reports.items.preset.hasXmlEntityInMetadata', [
        QueryPredicate.of('*', QueryPredicate.MATCHES, '^.*&#.*$'),
      ]),
      PresetQuery.of('q13', 'admin.reports.items.preset.hasNonAsciiCharInMetadata', [
        QueryPredicate.of('*', QueryPredicate.MATCHES, '^.*[^[:ascii:]].*$'),
      ]),
    ];
  }

  loadMetadataFields(): void {
    this.metadataFields = [];
    this.metadataFieldsWithAny = [];
    const anyField$ = this.translateService.stream('admin.reports.items.anyField');
    this.metadataFieldsWithAny.push(OptionVO.itemLoc('*', anyField$));
    this.metadataSchemaService.findAll({ elementsPerPage: 10000, currentPage: 1 }).pipe(
      getFirstSucceededRemoteListPayload(),
    ).subscribe(
      (schemasRest: MetadataSchema[]) => {
        schemasRest.forEach(schema => {
          this.metadataFieldService.findBySchema(schema, { elementsPerPage: 10000, currentPage: 1 }).pipe(
            getFirstSucceededRemoteListPayload(),
          ).subscribe(
            (fieldsRest: MetadataField[]) => {
              fieldsRest.forEach(field => {
                let fieldName = schema.prefix + '.' + field.toString();
                let fieldVO = OptionVO.item(fieldName, fieldName);
                this.metadataFields.push(fieldVO);
                this.metadataFieldsWithAny.push(fieldVO);
                if (isEmpty(field.qualifier)) {
                  fieldName = schema.prefix + '.' + field.element + '.*';
                  fieldVO = OptionVO.item(fieldName, fieldName);
                  this.metadataFieldsWithAny.push(fieldVO);
                }
              });
            },
          );
        });
      },
    );
  }

  loadPredicates(): void {
    this.predicates = [
      OptionVO.item(QueryPredicate.EXISTS, 'admin.reports.items.predicate.exists'),
      OptionVO.item(QueryPredicate.DOES_NOT_EXIST, 'admin.reports.items.predicate.doesNotExist'),
      OptionVO.item(QueryPredicate.EQUALS, 'admin.reports.items.predicate.equals'),
      OptionVO.item(QueryPredicate.DOES_NOT_EQUAL, 'admin.reports.items.predicate.doesNotEqual'),
      OptionVO.item(QueryPredicate.LIKE, 'admin.reports.items.predicate.like'),
      OptionVO.item(QueryPredicate.NOT_LIKE, 'admin.reports.items.predicate.notLike'),
      OptionVO.item(QueryPredicate.CONTAINS, 'admin.reports.items.predicate.contains'),
      OptionVO.item(QueryPredicate.DOES_NOT_CONTAIN, 'admin.reports.items.predicate.doesNotContain'),
      OptionVO.item(QueryPredicate.MATCHES, 'admin.reports.items.predicate.matches'),
      OptionVO.item(QueryPredicate.DOES_NOT_MATCH, 'admin.reports.items.predicate.doesNotMatch'),
    ];
  }

  loadPageLimits(): void {
    this.pageLimits = [
      OptionVO.item('10', '10'),
      OptionVO.item('25', '25'),
      OptionVO.item('50', '50'),
      OptionVO.item('100', '100'),
    ];
  }

  queryPredicatesArray(): FormArray {
    return (this.queryForm.get('queryPredicates') as FormArray);
  }

  addQueryPredicate(newItem: FormGroup = new QueryPredicate().toFormGroup(this.formBuilder)) {
    this.queryPredicatesArray().push(newItem);
  }

  deleteQueryPredicateDisabled(): boolean {
    return this.queryPredicatesArray().length < 2;
  }

  deleteQueryPredicate(index: number, nbToDelete: number = 1) {
    if (index > -1) {
      this.queryPredicatesArray().removeAt(index);
    }
  }

  setPresetQuery() {
    const queryField = this.queryForm.controls.presetQuery as FormControl;
    const value = queryField.value;
    const query = this.presetQueries.find(q => q.id === value);
    if (query !== undefined) {
      this.queryPredicatesArray().clear();
      query.predicates
        .map(qp => qp.toFormGroup(this.formBuilder))
        .forEach(qp => this.addQueryPredicate(qp));
      if (query.predicates.length === 0) {
        this.addQueryPredicate(new QueryPredicate().toFormGroup(this.formBuilder));
      }
    }
  }

  filtersFormGroup(): FormGroup {
    return this.queryForm.get('filters') as FormGroup;
  }

  private pageSize() {
    const form = this.queryForm.value;
    return form.pageLimit;
  }

  canNavigatePrevious(): boolean {
    return this.currentPage > 0;
  }

  prevPage() {
    if (this.canNavigatePrevious()) {
      this.currentPage--;
      this.resubmit();
    }
  }

  pageCount(): number {
    const total = this.results.itemCount || 0;
    return Math.ceil(total / this.pageSize());
  }

  canNavigateNext(): boolean {
    return this.currentPage + 1 < this.pageCount();
  }

  nextPage() {
    if (this.canNavigateNext()) {
      this.currentPage++;
      this.resubmit();
    }
  }

  submit() {
    this.accordionComponent.expand('itemResults');
    this.currentPage = 0;
    this.resubmit();
  }

  resubmit() {
    this.results$ = this
      .getFilteredItems()
      .pipe(
        map(response => {
          const offset = this.currentPage * this.pageSize();
          this.results.deserialize(response.payload, offset);
          return this.results.items;
        }),
      );
  }

  getFilteredItems(): Observable<RawRestResponse> {
    let params = this.toQueryString();
    if (params.length > 0) {
      params = `?${params}`;
    }
    const scheme = environment.rest.ssl ? 'https' : 'http';
    const urlRestApp = `${scheme}://${environment.rest.host}:${environment.rest.port}${environment.rest.nameSpace}`;
    return this.restService.request(RestRequestMethod.GET, `${urlRestApp}/api/contentreport/filtereditems${params}`);
  }

  private toQueryString(): string {
    let params = `pageNumber=${this.currentPage}&pageLimit=${this.pageSize()}`;

    const colls = this.queryForm.value.collections;
    for (let i = 0; i < colls.length; i++) {
      params += `&collections=${colls[i]}`;
    }

    const preds = this.queryForm.value.queryPredicates;
    for (let i = 0; i < preds.length; i++) {
      const pred = encodeURIComponent(QueryPredicate.toString(preds[i]));
      params += `&queryPredicates=${pred}`;
    }

    const filters = FiltersComponent.toQueryString(this.queryForm.value.filters);
    if (filters.length > 0) {
      params += `&${filters}`;
    }

    const addFlds = this.queryForm.value.additionalFields;
    for (let i = 0; i < addFlds.length; i++) {
      params += `&additionalFields=${addFlds[i]}`;
    }

    return params;
  }

}
