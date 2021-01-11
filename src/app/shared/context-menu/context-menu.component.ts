import { Component, Injector, Input, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreState } from '../../core/core.reducers';
import { isAuthenticated } from '../../core/auth/selectors';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { getContextMenuEntriesForDSOType } from './context-menu.decorator';

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
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Store<CoreState>} store
   */
  constructor(
    private injector: Injector,
    private store: Store<CoreState>
  ) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        {provide: 'contextMenuObjectProvider', useFactory: () => (this.contextMenuObject), deps: []},
        {provide: 'contextMenuObjectTypeProvider', useFactory: () => (this.contextMenuObjectType), deps: []},
      ],
      parent: this.injector
    });
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));
  }

  /**
   * Get the menu entries based on the DSO's type
   */
  getContextMenuEntries(): any[] {
    return this.contextMenuObjectType ? getContextMenuEntriesForDSOType(this.contextMenuObjectType) : [];
  }
}
