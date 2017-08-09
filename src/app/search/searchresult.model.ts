import { NgModule } from '@angular/core';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { Metadatum } from '../core/shared/metadatum.model';
import { Observable } from 'rxjs/Observable';

@NgModule({

})

export class SearchResult<T extends DSpaceObject>{

  result: T;
  hitHiglights : Metadatum[];

}
