/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  Observable,
  of,
} from 'rxjs';

/**
 * Stub class of {@link ScriptDataService}.
 */
export class ScriptServiceStub {
  scriptWithNameExistsAndCanExecute(scriptName: string): Observable<boolean> {
    return of(true);
  }
}
