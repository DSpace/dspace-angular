import { Observable } from 'rxjs';
import { FindAllOptions } from '../data/request.models';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { DataService } from '../data/data.service';
import { CacheableObject } from '../cache/object-cache.reducer';

/**
 * An abstract class that provides methods to make HTTP request to eperson endpoint.
 */
export abstract class EpersonService<TNormalized extends NormalizedObject, TDomain extends CacheableObject> extends DataService<TNormalized, TDomain> {

  public getBrowseEndpoint(options: FindAllOptions): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}
