import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Subscription } from 'rxjs/internal/Subscription';
import { take } from 'rxjs/operators';
import { RestResponse } from '../../../../core/cache/response.models';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-eperson-form',
  templateUrl: './eperson-form.component.html'
})
/**
 * A form used for creating and editing EPeople
 */
export class EPersonFormComponent implements OnInit, OnDestroy {

  labelPrefix = 'admin.access-control.epeople.form.';

  /**
   * A unique id used for ds-form
   */
  formId = 'eperson-form';

  /**
   * The labelPrefix for all messages related to this form
   */
  messagePrefix = 'admin.access-control.epeople.form';

  /**
   * Dynamic input models for the inputs of form
   */
  firstName: DynamicInputModel;
  lastName: DynamicInputModel;
  email: DynamicInputModel;
  // booleans
  canLogIn: DynamicCheckboxModel;
  requireCertificate: DynamicCheckboxModel;

  /**
   * A list of all dynamic input models
   */
  formModel: DynamicFormControlModel[];

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    firstName: {
      grid: {
        host: 'row'
      }
    },
    lastName: {
      grid: {
        host: 'row'
      }
    },
    email: {
      grid: {
        host: 'row'
      }
    },
    canLogIn: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    requireCertificate: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
  };

  /**
   * A FormGroup that combines all inputs
   */
  formGroup: FormGroup;

  /**
   * An EventEmitter that's fired whenever the form is being submitted
   */
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  /**
   * An EventEmitter that's fired whenever the form is cancelled
   */
  @Output() cancelForm: EventEmitter<any> = new EventEmitter();

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Try to retrieve initial active eperson, to fill in checkboxes at component creation
   */
  epersonInitial: EPerson;

  constructor(public epersonService: EPersonDataService,
              private formBuilderService: FormBuilderService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,) {
    this.subs.push(this.epersonService.getActiveEPerson().subscribe((eperson: EPerson) => {
      this.epersonInitial = eperson;
    }));
  }

  ngOnInit() {
    combineLatest(
      this.translateService.get(`${this.messagePrefix}.firstName`),
      this.translateService.get(`${this.messagePrefix}.lastName`),
      this.translateService.get(`${this.messagePrefix}.email`),
      this.translateService.get(`${this.messagePrefix}.canLogIn`),
      this.translateService.get(`${this.messagePrefix}.requireCertificate`),
      this.translateService.get(`${this.messagePrefix}.emailHint`),
    ).subscribe(([firstName, lastName, email, canLogIn, requireCertificate, emailHint]) => {
      this.firstName = new DynamicInputModel({
        id: 'firstName',
        label: firstName,
        name: 'firstName',
        validators: {
          required: null,
        },
        required: true,
      });
      this.lastName = new DynamicInputModel({
        id: 'lastName',
        label: lastName,
        name: 'lastName',
        validators: {
          required: null,
        },
        required: true,
      });
      this.email = new DynamicInputModel({
        id: 'email',
        label: email,
        name: 'email',
        validators: {
          required: null,
          pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
        },
        required: true,
        hint: emailHint
      });
      this.canLogIn = new DynamicCheckboxModel(
        {
          id: 'canLogIn',
          label: canLogIn,
          name: 'canLogIn',
          value: (this.epersonInitial != null ? this.epersonInitial.canLogIn : true)
        });
      this.requireCertificate = new DynamicCheckboxModel(
        {
          id: 'requireCertificate',
          label: requireCertificate,
          name: 'requireCertificate',
          value: (this.epersonInitial != null ? this.epersonInitial.requireCertificate : false)
        });
      this.formModel = [
        this.firstName,
        this.lastName,
        this.email,
        this.canLogIn,
        this.requireCertificate,
      ];
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
      this.subs.push(this.epersonService.getActiveEPerson().subscribe((eperson: EPerson) => {
        this.formGroup.patchValue({
          firstName: eperson != null ? eperson.firstMetadataValue('eperson.firstname') : '',
          lastName: eperson != null ? eperson.firstMetadataValue('eperson.lastname') : '',
          email: eperson != null ? eperson.email : '',
          canLogIn: eperson != null ? eperson.canLogIn : true,
          requireCertificate: eperson != null ? eperson.requireCertificate : false
        });
      }));
    });
  }

  /**
   * Stop editing the currently selected eperson
   */
  onCancel() {
    this.epersonService.cancelEditEPerson();
    this.cancelForm.emit();
  }

  /**
   * Submit the form
   * When the eperson has an id attached -> Edit the eperson
   * When the eperson has no id attached -> Create new eperson
   * Emit the updated/created eperson using the EventEmitter submitForm
   */
  onSubmit() {
    this.epersonService.getActiveEPerson().pipe(take(1)).subscribe(
      (ePerson: EPerson) => {
        console.log('onsubmit ep', ePerson)
        const values = {
          metadata: {
            'eperson.firstname': [
              {
                value: this.firstName.value
              }
            ],
            'eperson.lastname': [
              {
                value: this.lastName.value
              },
            ],
          },
          email: this.email.value,
          canLogIn: this.canLogIn.value,
          requireCertificate: this.requireCertificate.value,
        };
        if (ePerson == null) {
          this.createNewEPerson(values);
        } else {
          this.editEPerson(ePerson, values);
        }
      }
    );
  }

  /**
   * Creates new EPerson based on given values from form
   * @param values
   */
  createNewEPerson(values) {
    console.log('createNewEPerson(values)', values)
    const ePersonToCreate = Object.assign(new EPerson(), values);

    const response = this.epersonService.tryToCreate(ePersonToCreate);
    response.pipe(take(1)).subscribe((restResponse: RestResponse) => {
      if (restResponse.isSuccessful) {
        this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.created.success', { name: ePersonToCreate.name }));
        this.submitForm.emit(ePersonToCreate);
      } else {
        this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.created.failure', { name: ePersonToCreate.name }));
        this.cancelForm.emit();
      }
    });
    this.showNotificationIfEmailInUse(ePersonToCreate, 'created');
  }

  /**
   * Edits existing EPerson based on given values from form and old EPerson
   * @param ePerson   ePerson to edit
   * @param values    new ePerson values (of form)
   */
  editEPerson(ePerson: EPerson, values) {
    const editedEperson = Object.assign(new EPerson(), {
      id: ePerson.id,
      metadata: {
        'eperson.firstname': [
          {
            value: (this.firstName.value ? this.firstName.value : ePerson.firstMetadataValue('eperson.firstname'))
          }
        ],
        'eperson.lastname': [
          {
            value: (this.lastName.value ? this.lastName.value : ePerson.firstMetadataValue('eperson.lastname'))
          },
        ],
      },
      email: (hasValue(values.email) ? values.email : ePerson.email),
      canLogIn: (hasValue(values.canLogIn) ? values.canLogIn : ePerson.canLogIn),
      requireCertificate: (hasValue(values.requireCertificate) ? values.requireCertificate : ePerson.requireCertificate),
      _links: ePerson._links,
    });

    const response = this.epersonService.updateEPerson(editedEperson);
    response.pipe(take(1)).subscribe((restResponse: RestResponse) => {
      if (restResponse.isSuccessful) {
        this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.edited.success', { name: editedEperson.name }));
        this.submitForm.emit(editedEperson);
      } else {
        this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.edited.failure', { name: editedEperson.name }));
        this.cancelForm.emit();
      }
    });

    if (values.email != null && values.email !== ePerson.email) {
      this.showNotificationIfEmailInUse(editedEperson, 'edited');
    }
  }

  /**
   * Checks for the given ePerson if there is already an ePerson in the system with that email
   * and shows notification if this is the case
   * @param ePerson               ePerson values to check
   * @param notificationSection   whether in create or edit
   */
  private showNotificationIfEmailInUse(ePerson: EPerson, notificationSection: string) {
    // Relevant message for email in use
    this.subs.push(this.epersonService.searchByScope('email', ePerson.email, {
      currentPage: 1,
      elementsPerPage: 0
    }).pipe(getSucceededRemoteData(), getRemoteDataPayload())
      .subscribe((list: PaginatedList<EPerson>) => {
        if (list.totalElements > 0) {
          this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.' + notificationSection + '.failure.emailInUse', {
            name: ePerson.name,
            email: ePerson.email
          }));
        }
      }));
  }

  /**
   * Reset all input-fields to be empty
   */
  clearFields() {
    this.formGroup.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      canLogin: true,
      requireCertificate: false
    });
  }

  /**
   * Cancel the current edit when component is destroyed & unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.onCancel();
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
