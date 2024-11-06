import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { hasValue, isNotNull } from '../empty.util';
import { map, reduce, startWith, switchMap, take, tap } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../../core/data/paginated-list.model';
import { EntityTypeDataService } from '../../core/data/entity-type-data.service';
import { ItemType } from '../../core/shared/item-relationships/item-type.model';
import { getFirstSucceededRemoteWithNotEmptyData } from '../../core/shared/operators';
import {
  ItemExportFormatMolteplicity,
  ItemExportFormatService
} from '../../core/itemexportformat/item-export-format.service';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-entity-dropdown',
  templateUrl: './entity-dropdown.component.html',
  styleUrls: ['./entity-dropdown.component.scss']
})
export class EntityDropdownComponent implements OnInit, OnDestroy {
  /**
   * The entity list obtained from a search
   * @type {Observable<ItemType[]>}
   */
  public searchListEntity$: Observable<ItemType[]>;

  /**
   * A boolean representing if dropdown list is scrollable to the bottom
   * @type {boolean}
   */
  private scrollableBottom = false;

  /**
   * A boolean representing if dropdown list is scrollable to the top
   * @type {boolean}
   */
  private scrollableTop = false;

  /**
   * The list of entity to render
   */
  public searchListEntity: ItemType[] = [];

  /**
   * TRUE if the parent operation is a 'new submission' operation, FALSE otherwise (eg.: is an 'Import metadata from an external source' operation).
   */
  @Input() isSubmission: boolean;

  /**
   * The entity to output to the parent component
   */
  @Output() selectionChange = new EventEmitter<ItemType>();

  /**
   * A boolean representing if the loader is visible or not
   */
  public isLoadingList: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * A numeric representig current page
   */
  public currentPage: number;

  /**
   * A boolean representing if exist another page to render
   */
  public hasNextPage: boolean;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  public subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {EntityTypeDataService} entityTypeService
   * @param {ItemExportFormatService} itemExportFormatService
   * @param {ElementRef} el
   * @param {TranslateService} translate
   */
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private entityTypeService: EntityTypeDataService,
    private itemExportFormatService: ItemExportFormatService,
    private el: ElementRef,
    private translate: TranslateService
  ) { }

  /**
   * Method called on mousewheel event, it prevent the page scroll
   * when arriving at the top/bottom of dropdown menu
   *
   * @param event
   *     mousewheel event
   */
  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (event.wheelDelta > 0 && this.scrollableTop) {
      event.preventDefault();
    }
    if (event.wheelDelta < 0 && this.scrollableBottom) {
      event.preventDefault();
    }
  }

  /**
   * Initialize entity list
   */
  ngOnInit() {
    this.resetPagination();
    this.populateEntityList(this.currentPage);
  }

  /**
   * Check if dropdown scrollbar is at the top or bottom of the dropdown list
   *
   * @param event
   */
  public onScroll(event) {
    this.scrollableBottom = ((event.target.scrollTop + event.target.clientHeight) === event.target.scrollHeight);
    this.scrollableTop = (event.target.scrollTop === 0);
  }

  /**
   * Method used from infitity scroll for retrive more data on scroll down
   */
  public onScrollDown() {
    if ( this.hasNextPage ) {
      this.populateEntityList(++this.currentPage);
    }
  }

  /**
   * Emit a [selectionChange] event when a new entity is selected from list
   *
   * @param event
   *    the selected [ItemType]
   */
  public onSelect(event: ItemType) {
    this.selectionChange.emit(event);
  }

  /**
   * Method called for populate the entity list
   * @param page page number
   */
  public populateEntityList(page: number) {
    this.isLoadingList.next(true);
    let searchListEntity$;
    if (this.isSubmission) {
      // Set the pagination info
      const findOptions: FindListOptions = {
        elementsPerPage: 10,
        currentPage: page
      };
      searchListEntity$ =
        this.entityTypeService.getAllAuthorizedRelationshipType(findOptions)
          .pipe(
            getFirstSucceededRemoteWithNotEmptyData(),
            tap(entityType => {
              if ((this.searchListEntity.length + findOptions.elementsPerPage) >= entityType.payload.totalElements) {
                this.hasNextPage = false;
              }
            })
          );
    } else {
      searchListEntity$ =
        this.itemExportFormatService.byEntityTypeAndMolteplicity(null, ItemExportFormatMolteplicity.MULTIPLE)
          .pipe(
            take(1),
            map((formatTypes: any) => {
              const entityList: ItemType[] = Object.keys(formatTypes)
                .filter((entityType: string) => isNotNull(entityType) && entityType !== 'null')
                .map((entityType: string) => ({
                  id: entityType,
                  label: entityType
                } as any));
              return createSuccessfulRemoteDataObject(buildPaginatedList(null, entityList));
            }),
            tap(() => this.hasNextPage = false)
          );
    }
    this.searchListEntity$ = searchListEntity$.pipe(
      switchMap((entityType: RemoteData<PaginatedList<ItemType>>) => entityType.payload.page),
      map((item: ItemType) => {
          return {
            ...item,
            translatedLabel: this.translate.instant(`${item.label?.toLowerCase()}.listelement.badge`)
          };
        }
      ),
      reduce((acc: any, value: any) => [...acc, value], []),
      startWith([])
    );
    this.subs.push(
      this.searchListEntity$.subscribe({
        next: (result: ItemType[]) => {
          this.searchListEntity = [...this.searchListEntity, ...result];
        },
        complete: () => { this.hideShowLoader(false); this.changeDetectorRef.detectChanges(); }
      })
    );
  }

  /**
   * Reset pagination values
   */
  public resetPagination() {
    this.currentPage = 1;
    this.hasNextPage = true;
    this.searchListEntity = [];
  }

  /**
   * Hide/Show the entity list loader
   * @param hideShow true for show, false otherwise
   */
  public hideShowLoader(hideShow: boolean) {
    this.isLoadingList.next(hideShow);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
