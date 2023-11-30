import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


/**
 * Service that performs all actions that have to do with the current mydspace configuration
 */
@Injectable()
export class RelationshipsDataService {

  /**
   * Initialize class
   *
   * @param {ActivatedRoute} route
   */
  constructor(protected route: ActivatedRoute) {
  }

}
