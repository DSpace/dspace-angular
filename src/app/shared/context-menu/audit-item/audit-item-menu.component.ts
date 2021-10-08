import { Component, Inject } from '@angular/core';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { Observable } from 'rxjs';
import { CoreState } from '../../../core/core.reducers';
import { select, Store } from '@ngrx/store';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { isAuthenticated } from '../../../core/auth/selectors';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-audit-item',
  templateUrl: './audit-item-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class AuditItemMenuComponent extends ContextMenuEntryComponent {

  public isAuthenticated: Observable<boolean>;

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected store: Store<CoreState>
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }

  ngOnInit(): void {
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));
  }
}
