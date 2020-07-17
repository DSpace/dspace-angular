import { Directive, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { map, switchMap, take } from 'rxjs/operators';
import { of as observableOf, timer as observableTimer, Observable } from 'rxjs';
import { RestResponse } from '../../core/cache/response.models';
import { MetadataFieldDataService } from '../../core/data/metadata-field-data.service';

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
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const resTimer = observableTimer(500).pipe(
      switchMap(() => {
        if (!control.value) {
          return observableOf({ invalidMetadataField: { value: control.value } });
        }
        const mdFieldNameParts = control.value.split('.');
        if (mdFieldNameParts.length < 2) {
          return observableOf({ invalidMetadataField: { value: control.value } });
        }

        const res = this.metadataFieldService.findByExactFieldName(control.value)
          .pipe(
            map((response: RestResponse) => {
              if (response.isSuccessful) {
                return null;
              } else {
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
