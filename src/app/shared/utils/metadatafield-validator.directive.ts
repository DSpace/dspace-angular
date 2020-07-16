import { Directive, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { map, switchMap, take } from 'rxjs/operators';
import { of as observableOf, timer as observableTimer, Observable } from 'rxjs';
import { MetadataFieldDataService } from '../../core/data/metadata-field-data.service';
import { getSucceededRemoteData } from '../../core/shared/operators';

/**
 * Directive for validating if a ngModel value is a valid metadata field
 */
@Directive({
  selector: '[ngModel][dsMetadataFieldValidator]',
  // We add our directive to the list of existing validators
  providers: [
    { provide: NG_VALIDATORS, useExisting: MetadataFieldValidator, multi: true }
  ]
})
@Injectable({ providedIn: 'root' })
export class MetadataFieldValidator implements AsyncValidator {

  constructor(private metadataFieldService: MetadataFieldDataService) {
  }

  /**
   * The function that checks if the form control's value is currently valid
   * @param control The FormControl
   */
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const resTimer = observableTimer(500).pipe(
      switchMap(() => {
        console.log('control', control)
        if (!control.value) {
          return observableOf({ invalidMetadataField: { value: control.value } });
        }
        const mdFieldNameParts = control.value.split('.');
        if (mdFieldNameParts.length < 2) {
          console.log('not enough parts')
          return observableOf({ invalidMetadataField: { value: control.value } });
        }

        const res = this.metadataFieldService.findByFieldName(mdFieldNameParts[0], mdFieldNameParts[1], mdFieldNameParts.length == 3 ? mdFieldNameParts[2] : '', '')
          .pipe(
            getSucceededRemoteData(),
            map((results) => {
              console.log('results', results)
              // TODO:     - Currently it’s valid if the search returns at least one matching mdField; but this does mean that if for example a mdField named schema.elementEx.qualifierEx exists, but you fill in schema. or schema.elementEx then there is at least one result, but this doesn’t mean this is the whole of the field (the suggestion does show the options); alternatively it is valid if exact one matching field but then dc.title isn’t valid because the search schema=dc & element=title also returns for example dc.title.alternative
              //         - So the endpoint / restcontract should probably be changed to accommodate and exact search? Or was that already what was wanted and did I interpret it wrong?
              if (results.payload.totalElements > 0) {
                console.log('VALID')
                return null;
              } else {
                console.log('NOT VALID')
                return { invalidMetadataField: { value: control.value } };
              }
            })
          );

        res.pipe(take(1)).subscribe();

        return res;
      })
    );
    resTimer.pipe(take(1)).subscribe();
    return resTimer;
  }
}
