import {
  Directive,
  Injectable,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import {
  getFirstSucceededRemoteData,
  MetadataField,
  MetadataFieldDataService,
  PaginatedList,
  RemoteData,
} from '@dspace/core';
import {
  Observable,
  of as observableOf,
  timer as observableTimer,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

/**
 * Directive for validating if a ngModel value is a valid metadata field
 */
@Directive({
  selector: '[ngModel][dsMetadataFieldValidator]',
  // We add our directive to the list of existing validators
  providers: [
    { provide: NG_VALIDATORS, useExisting: MetadataFieldValidator, multi: true },
  ],
  standalone: true,
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
            getFirstSucceededRemoteData(),
            map((matchingFieldRD: RemoteData<PaginatedList<MetadataField>>) => {
              if (matchingFieldRD.payload.pageInfo.totalElements === 0) {
                return { invalidMetadataField: { value: control.value } };
              } else if (matchingFieldRD.payload.pageInfo.totalElements === 1) {
                return null;
              }
            }),
          );

        res.pipe(take(1)).subscribe();

        return res;
      }),
    );
    resTimer.pipe(take(1)).subscribe();
    return resTimer;
  }
}
