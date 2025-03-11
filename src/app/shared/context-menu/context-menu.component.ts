import {
  AsyncPipe,
  DOCUMENT,
  NgClass,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  from,
  Observable,
} from 'rxjs';
import {
  concatMap,
  filter,
  map,
  reduce,
  take,
} from 'rxjs/operators';

import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { isNotEmpty } from '../empty.util';
import { BrowserOnlyDirective } from '../utils/browser-only.directive';
import {
  ContextMenuEntryRenderOptions,
  getContextMenuEntriesForDSOType,
} from './context-menu.decorator';
import { ContextMenuEntryComponent } from './context-menu-entry.component';
import { ContextMenuEntryType } from './context-menu-entry-type';

/**
 * This component renders a context menu for a given DSO.
 */
@Component({
  selector: 'ds-context-menu',
  styleUrls: ['./context-menu.component.scss'],
  templateUrl: './context-menu.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgComponentOutlet,
    NgbDropdownModule,
    NgClass,
    AsyncPipe,
    TranslateModule,
    BrowserOnlyDirective,
  ],
})
export class ContextMenuComponent implements OnInit, AfterViewChecked {

  /**
   * The context menu entries
   */
  menuEntries$: Observable<any[]>;

  /**
   * The context menu standalone entries
   */
  menuStandaloneEntries$: Observable<any[]>;

  /**
   * The related item
   */
  @Input() contextMenuObject: DSpaceObject;

  /**
   * The related item
   */
  @Input() contextMenuObjectType: DSpaceObjectType;

  /**
   * Injector to inject a menu entry component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  /**
   * context menu options count.
   * @type {number}
   */
  public optionCount = 0;

  public standAloneEntries$: Observable<any>;
  public contextEntries$: Observable<any>;

  /**
   * Initialize instance variables
   *
   * @param {Document} _document
   * @param {ChangeDetectorRef} cdr
   * @param {ConfigurationDataService} configurationService
   * @param {Injector} injector
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private cdr: ChangeDetectorRef,
    private configurationService: ConfigurationDataService,
    private injector: Injector,
  ) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'contextMenuObjectProvider', useFactory: () => (this.contextMenuObject), deps: [] },
        { provide: 'contextMenuObjectTypeProvider', useFactory: () => (this.contextMenuObjectType), deps: [] },
      ],
      parent: this.injector,
    });

    this.menuEntries$ = this.getContextMenuEntries();
    this.menuStandaloneEntries$ = this.getStandAloneMenuEntries();
  }

  /**
   * Get the menu entries based on the DSO's type
   */
  getContextMenuEntries(): Observable<any[]> {
    return this.retrieveSelectedContextMenuEntries(false);
  }

  /**
   * Get the stand alone menu entries based on the DSO's type
   */
  getStandAloneMenuEntries(): Observable<any[]> {
    return this.retrieveSelectedContextMenuEntries(true);
  }

  private retrieveSelectedContextMenuEntries(isStandAlone: boolean): Observable<any[]> {
    const list = this.contextMenuObjectType ? getContextMenuEntriesForDSOType(this.contextMenuObjectType) : [];
    return from(list).pipe(
      filter((renderOptions: ContextMenuEntryRenderOptions) => isNotEmpty(renderOptions?.componentRef) && renderOptions?.isStandAlone === isStandAlone),
      map((renderOptions: ContextMenuEntryRenderOptions) => renderOptions.componentRef),
      concatMap((constructor: GenericConstructor<ContextMenuEntryComponent>) => {
        const entryComp: ContextMenuEntryComponent = new constructor();
        return this.isDisabled(entryComp.menuEntryType).pipe(
          filter((disabled) => !disabled),
          map(() => constructor),
        );
      }),
      reduce((acc: any, value: any) => [...acc, value], []),
      take(1),
    );
  }

  /**
   * Check if an entry menu is disabled by REST configuration
   * @param menuEntryType
   */
  isDisabled(menuEntryType: ContextMenuEntryType): Observable<boolean> {
    const property = `context-menu-entry.${menuEntryType}.enabled`;
    return this.configurationService.findByPropertyName(property).pipe(
      getFirstCompletedRemoteData(),
      map((res: RemoteData<ConfigurationProperty>) => {
        return res.hasSucceeded && res.payload && isNotEmpty(res.payload.values) && res.payload.values[0].toLowerCase() === 'false';
      }),
    );
  }

  ngAfterViewChecked() {
    // To check that Context-menu contains options or not
    if (this._document.getElementById('itemOptionsDropdownMenu')) {
      const el = Array.from(this._document.getElementById('itemOptionsDropdownMenu')?.getElementsByClassName('dropdown-item'));
      this.optionCount = 0;
      if (el.length > 0) {
        this.optionCount += el.length;
        this.cdr.detectChanges();
      }
    }
  }
}
