import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbDatepickerModule,
  NgbDateStruct,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  utcToZonedTime,
  zonedTimeToUtc,
} from 'date-fns-tz';
import { UiSwitchModule } from 'ngx-ui-switch';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { RequestService } from '../../core/data/request.service';
import { SystemWideAlertDataService } from '../../core/data/system-wide-alert-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import {
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SystemWideAlert } from '../system-wide-alert.model';


/**
 * Component responsible for rendering the form to update a system-wide alert
 */
@Component({
  selector: 'ds-system-wide-alert-form',
  styleUrls: ['./system-wide-alert-form.component.scss'],
  templateUrl: './system-wide-alert-form.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    ReactiveFormsModule,
    TranslateModule,
    UiSwitchModule,
  ],
})
export class SystemWideAlertFormComponent implements OnInit {

  /**
   * Observable to track an existing system-wide alert
   */
  systemWideAlert$: Observable<SystemWideAlert>;

  /**
   * The currently configured system-wide alert
   */
  currentAlert: SystemWideAlert;

  /**
   * The form group representing the system-wide alert
   */
  alertForm: UntypedFormGroup;

  /**
   * Date object to store the countdown date part
   */
  date: NgbDateStruct;

  /**
   * The minimum date for the countdown timer
   */
  minDate: NgbDateStruct;

  /**
   * Object to store the countdown time part
   */
  time;

  /**
   * Behaviour subject to track whether the counter is enabled
   */
  counterEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The amount of minutes to be used in the banner preview
   */
  previewMinutes: number;

  /**
   * The amount of hours to be used in the banner preview
   */
  previewHours: number;

  /**
   * The amount of days to be used in the banner preview
   */
  previewDays: number;


  constructor(
    protected systemWideAlertDataService: SystemWideAlertDataService,
    protected notificationsService: NotificationsService,
    protected router: Router,
    protected requestService: RequestService,
    protected translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.systemWideAlert$ = this.systemWideAlertDataService.findAll().pipe(
      getFirstCompletedRemoteData(),
      map((rd) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          this.notificationsService.error('system-wide-alert-form.retrieval.error');
        }
      }),
      map((payload: PaginatedList<SystemWideAlert>) => payload.page),
      filter((page) => isNotEmpty(page)),
      map((page) => page[0]),
    );
    this.createForm();

    const currentDate = new Date();
    this.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };


    this.systemWideAlert$.subscribe((alert) => {
      this.currentAlert = alert;
      this.initFormValues(alert);
    });
  }

  /**
   * Creates the form with empty values
   */
  createForm() {
    this.alertForm = new UntypedFormBuilder().group({
      formMessage: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
      formActive: new UntypedFormControl(false),
    },
    );
    this.setDateTime(new Date());
  }

  /**
   * Sets the form values based on the values retrieve from the provided system-wide alert
   * @param alert   - System-wide alert to use to init the form
   */
  initFormValues(alert: SystemWideAlert) {
    this.formMessage.patchValue(alert.message);
    this.formActive.patchValue(alert.active);
    const countDownTo = zonedTimeToUtc(alert.countdownTo, 'UTC');
    if (countDownTo.getTime() - new Date().getTime() > 0) {
      this.counterEnabled$.next(true);
      this.setDateTime(countDownTo);
    }

  }

  /**
   * Set whether the system-wide alert is active
   * Will also save the info in the current system-wide alert
   * @param active
   */
  setActive(active: boolean) {
    this.formActive.patchValue(active);
    this.save(false);
  }

  /**
   * Set whether the countdown timer is enabled or disabled. This will also update the counter in the preview
   * @param enabled   - Whether the countdown timer is enabled or disabled.
   */
  setCounterEnabled(enabled: boolean) {
    this.counterEnabled$.next(enabled);
    if (!enabled) {
      this.previewMinutes = 0;
      this.previewHours = 0;
      this.previewDays = 0;
    } else {
      this.updatePreviewTime();
    }
  }


  private setDateTime(dateToSet) {
    this.time = { hour: dateToSet.getHours(), minute: dateToSet.getMinutes() };
    this.date = { year: dateToSet.getFullYear(), month: dateToSet.getMonth() + 1, day: dateToSet.getDate() };

    this.updatePreviewTime();
  }

  /**
   * Update the preview time based on the configured countdown date and the current time
   */
  updatePreviewTime() {
    const countDownTo = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute);
    const timeDifference = countDownTo.getTime() - new Date().getTime();
    this.allocateTimeUnits(timeDifference);
  }

  /**
   * Helper method to push how many days, hours and minutes are left in the countdown to their respective behaviour subject
   * @param timeDifference  - The time difference to calculate and push the time units for
   */
  private allocateTimeUnits(timeDifference) {
    this.previewMinutes = Math.floor((timeDifference) / (1000 * 60) % 60);
    this.previewHours = Math.floor((timeDifference) / (1000 * 60 * 60) % 24);
    this.previewDays = Math.floor((timeDifference) / (1000 * 60 * 60 * 24));
  }


  get formMessage() {
    return this.alertForm.get('formMessage');
  }

  get formActive() {
    return this.alertForm.get('formActive');
  }

  /**
   * Save the system-wide alert present in the form
   * When no alert is present yet on the server, a new one will be created
   * When one already exists, the existing one will be updated
   *
   * @param navigateToHomePage  - Whether the user should be navigated back on successful save or not
   */
  save(navigateToHomePage  = true) {
    const alert = new SystemWideAlert();
    alert.message = this.formMessage.value;
    alert.active = this.formActive.value;
    if (this.counterEnabled$.getValue()) {
      const countDownTo = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute);
      alert.countdownTo = utcToZonedTime(countDownTo, 'UTC').toISOString();
    } else {
      alert.countdownTo = null;
    }
    if (this.alertForm.valid) {
      if (hasValue(this.currentAlert)) {
        const updatedAlert = Object.assign(new SystemWideAlert(), this.currentAlert, alert);
        this.handleResponse(this.systemWideAlertDataService.put(updatedAlert), 'system-wide-alert.form.update', navigateToHomePage);
      } else {
        this.handleResponse(this.systemWideAlertDataService.create(alert), 'system-wide-alert.form.create', navigateToHomePage);
      }
    }
  }

  private handleResponse(response$: Observable<RemoteData<SystemWideAlert>>, messagePrefix, navigateToHomePage: boolean) {
    response$.pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<SystemWideAlert>) => {
      if (response.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(`${messagePrefix}.success`));
        this.requestService.setStaleByHrefSubstring('systemwidealerts');
        if (navigateToHomePage) {
          this.back();
        }
      } else {
        this.notificationsService.error(this.translateService.get(`${messagePrefix}.error`));
      }
    });
  }

  /**
   * Navigate back to the homepage
   */
  back() {
    this.router.navigate(['/home']);
  }


}
