import { Component, Inject } from '@angular/core';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';

/**
 * This component renders a context menu option that provides the links to edit item page.
 */
@Component({
  template: ''
})
export abstract class ContextMenuEntryComponent {

  /**
   * The related dso
   */
  contextMenuObject: DSpaceObject;

  /**
   * The related dso type
   */
  contextMenuObjectType: DSpaceObjectType;

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType
  ) {
    this.contextMenuObject = injectedContextMenuObject;
    this.contextMenuObjectType = injectedContextMenuObjectType;
  }

}
