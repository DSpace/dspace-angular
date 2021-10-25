import { Component, Inject } from '@angular/core';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { Observable } from 'rxjs';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { AuthService } from '../../../core/auth/auth.service';

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
    private authService: AuthService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.Audit);
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
