import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-eperson-data',
  templateUrl: './ePerson-data.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  styleUrls: ['./ePerson-data.component.scss'],
})
/**
 * Represents the component for displaying ePerson data.
 */
export class EPersonDataComponent {

  /**
   * The ID of the ePerson.
   */
  @Input() ePersonId: string;

  /**
   * The properties of the ePerson to display.
   */
  @Input() properties: string[];

  /**
   * Creates an instance of the EPersonDataComponent.
   * @param ePersonDataService The service for retrieving ePerson data.
   */
  constructor(private ePersonDataService: EPersonDataService) { }

  /**
   * Retrieves the EPerson data based on the provided ePersonId.
   * @returns An Observable that emits the EPerson data.
   */
  getEPersonData$(): Observable<EPerson> {
    if (this.ePersonId) {
      return this.ePersonDataService.findById(this.ePersonId, true).pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
      );
    }
  }
}
