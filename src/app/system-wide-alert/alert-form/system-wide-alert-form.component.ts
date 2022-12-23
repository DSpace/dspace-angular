import { Component, OnInit } from '@angular/core';
import { SystemWideAlertDataService } from '../../core/data/system-wide-alert-data.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { filter, map } from 'rxjs/operators';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { SystemWideAlert } from '../system-wide-alert.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { RemoteData } from '../../core/data/remote-data';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { Router } from '@angular/router';
import { RequestService } from '../../core/data/request.service';
import { TranslateService } from '@ngx-translate/core';


/**
 * Component responsible for rendering the form to update a system-wide alert
 */
@Component({
  selector: 'ds-system-wide-alert-form',
  styleUrls: ['./system-wide-alert-form.component.scss'],
  templateUrl: './system-wide-alert-form.component.html'
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
  alertForm: FormGroup;

  /**
   * Date object to store the countdown date part
   */
  date: NgbDateStruct;

  /**
   * Object to store the countdown time part
   */
  time;


  constructor(
    protected systemWideAlertDataService: SystemWideAlertDataService,
    protected notificationsService: NotificationsService,
    protected router: Router,
    protected requestService: RequestService,
    protected translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.systemWideAlert$ = this.systemWideAlertDataService.findAll().pipe(
      getFirstSucceededRemoteDataPayload(),
      map((payload: PaginatedList<SystemWideAlert>) => payload.page),
      filter((page) => isNotEmpty(page)),
      map((page) => page[0])
    );
    this.createForm();

    this.systemWideAlert$.subscribe((alert) => {
      this.currentAlert = alert;
      this.initFormValues(alert);
    });
  }

  /**
   * Creates the form with empty values
   */
  createForm() {
    this.alertForm = new FormBuilder().group({
        formMessage: new FormControl('', {
          validators: [Validators.required],
        }),
        formActive: new FormControl(false),
      }
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
      this.setDateTime(countDownTo);
    }

  }

  private setDateTime(dateToSet) {
    this.time = {hour: dateToSet.getHours(), minute: dateToSet.getMinutes()};
    this.date = {year: dateToSet.getFullYear(), month: dateToSet.getMonth() + 1, day: dateToSet.getDate()};

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
   */
  save() {
    const alert = new SystemWideAlert();
    alert.message = this.formMessage.value;
    alert.active = this.formActive.value;
    const countDownTo = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute);
    alert.countdownTo = utcToZonedTime(countDownTo, 'UTC').toUTCString();

    if (hasValue(this.currentAlert)) {
      const updatedAlert = Object.assign(new SystemWideAlert(), this.currentAlert, alert);
      this.handleResponse(this.systemWideAlertDataService.put(updatedAlert), 'system-wide-alert.form.update');
    } else {
      this.handleResponse(this.systemWideAlertDataService.create(alert), 'system-wide-alert.form.create');
    }
  }

  private handleResponse(response$: Observable<RemoteData<SystemWideAlert>>, messagePrefix) {
    response$.pipe(
      getFirstCompletedRemoteData()
    ).subscribe((response: RemoteData<SystemWideAlert>) => {
      if (response.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(`${messagePrefix}.success`));
        this.requestService.setStaleByHrefSubstring('systemwidealerts');
        this.back();
      } else {
        this.notificationsService.error(this.translateService.get(`${messagePrefix}.error`, response.errorMessage));
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
