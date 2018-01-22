import { Component, Inject } from '@angular/core';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { SearchResultListElementComponent } from '../search-result-list-element/search-result-list-element.component';
import { MyDSpaceResult } from '../../../+my-dspace-page/my-dspace-result.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { hasNoValue, isEmpty } from '../../empty.util';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';

@Component({
  selector: 'ds-my-dspace-result-list-element',
  template: ``
})

export class MyDSpaceResultListElementComponent<T extends MyDSpaceResult<K>, K extends SubmissionObject> extends AbstractListableElementComponent<T> {
  dso: K;

public constructor(@Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
    this.dso = this.object.dspaceObject;
  }

  getValues(keys: string[]): string[] {
    const results: string[] = new Array<string>();
    this.object.hitHighlights.forEach(
      (md: Metadatum) => {
        if (keys.indexOf(md.key) > -1) {
          results.push(md.value);
        }
      }
    );
    if (isEmpty(results)) {
      this.dso.filterMetadata(keys).forEach(
        (md: Metadatum) => {
          results.push(md.value);
        }
      );
    }
    return results;
  }

  getFirstValue(key: string): string {
    let result: string;
    this.object.hitHighlights.some(
      (md: Metadatum) => {
        if (key === md.key) {
          result =  md.value;
          return true;
        }
      }
    );
    if (hasNoValue(result)) {
      result = this.dso.findMetadata(key);
    }
    return result;
  }
}
