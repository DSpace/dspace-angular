import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  BehaviorSubject,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'ds-eperson-data',
  templateUrl: './ePerson-data.component.html',
  imports: [
    AsyncPipe,
  ],
  styleUrls: ['./ePerson-data.component.scss'],
})
/**
 * Represents the component for displaying ePerson data.
 */
export class EPersonDataComponent implements OnChanges, OnDestroy {

  /**
   * The ID of the ePerson.
   */
  @Input() ePersonId: string;

  /**
   * The properties of the ePerson to display.
   */
  @Input() properties: string[];

  /**
   * The EPerson data based on the provided ePersonId.
   */
  ePersonData$: BehaviorSubject<EPerson> = new BehaviorSubject<EPerson>(null);

  private subs: Subscription[] = [];

  /**
   * Creates an instance of the EPersonDataComponent.
   * @param ePersonDataService The service for retrieving ePerson data.
   */
  constructor(private ePersonDataService: EPersonDataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ePersonId && hasValue(this.ePersonId)) {
      this.subs.push(
        this.ePersonDataService.findById(this.ePersonId, true).pipe(
          getFirstCompletedRemoteData(),
          getRemoteDataPayload(),
        ).subscribe((ePerson: EPerson) => this.ePersonData$.next(ePerson)),
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
