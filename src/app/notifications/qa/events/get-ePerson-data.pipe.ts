import { Pipe, PipeTransform } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';

@Pipe({
  name: 'dsGetEPersonData'
})
export class GetEPersonDataPipe implements PipeTransform {
  constructor(private ePersonDataService: EPersonDataService) { }

  /**
   * Transforms the personId into an Observable of EPerson.
   * @param personId The ID of the person.
   * @returns An Observable of EPerson.
   */
  transform(personId: string): Observable<EPerson> {
   return this.ePersonDataService.findById(personId, true).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      tap((ePerson: EPerson) => {console.log(ePerson)})
    );
  }

}
