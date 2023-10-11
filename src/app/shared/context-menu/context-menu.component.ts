import { ChangeDetectorRef, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { select, Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { concatMap, filter, map, reduce, take } from 'rxjs/operators';

import { CoreState } from '../../core/core-state.model';
import { isAuthenticated } from '../../core/auth/selectors';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { ContextMenuEntryRenderOptions, getContextMenuEntriesForDSOType } from './context-menu.decorator';
import { ContextMenuEntryComponent } from './context-menu-entry.component';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { ContextMenuEntryType } from './context-menu-entry-type';
import { isNotEmpty } from '../empty.util';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { GenericConstructor } from '../../core/shared/generic-constructor';

/**
 * This component renders a context menu for a given DSO.
 */
@Component({
  selector: 'ds-context-menu',
  styleUrls: ['./context-menu.component.scss'],
  templateUrl: './context-menu.component.html'
})
export class ContextMenuComponent implements OnInit {

  /**
   * The related item
   */
  @Input() contextMenuObject: DSpaceObject;

  /**
   * The related item
   */
  @Input() contextMenuObjectType: DSpaceObjectType;

  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

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

  /**
   * Initialize instance variables
   *
   * @param {Document} _document
   * @param {ConfigurationDataService} configurationService
   * @param {Injector} injector
   * @param {Store<CoreState>} store
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private cdr: ChangeDetectorRef,
    private configurationService: ConfigurationDataService,
    private injector: Injector,
    private store: Store<CoreState>
  ) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'contextMenuObjectProvider', useFactory: () => (this.contextMenuObject), deps: [] },
        { provide: 'contextMenuObjectTypeProvider', useFactory: () => (this.contextMenuObjectType), deps: [] },
      ],
      parent: this.injector
    });
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));
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
      filter((renderOptions: ContextMenuEntryRenderOptions) => isNotEmpty(renderOptions ?.componentRef) && renderOptions ?.isStandAlone === isStandAlone),
      map((renderOptions: ContextMenuEntryRenderOptions) => renderOptions.componentRef),
      concatMap((constructor: GenericConstructor<ContextMenuEntryComponent>) => {
        const entryComp: ContextMenuEntryComponent = new constructor();
        return this.isDisabled(entryComp.menuEntryType).pipe(
          filter((disabled) => !disabled),
          map(() => constructor)
        );
      }),
      reduce((acc: any, value: any) => [...acc, value], []),
      take(1)
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
      })
    );
  }

  isItem(): boolean {
    return this.contextMenuObjectType === DSpaceObjectType.ITEM;
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
