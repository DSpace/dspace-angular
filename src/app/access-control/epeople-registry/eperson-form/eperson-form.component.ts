import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  finalize,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { AuthService } from '../../../core/auth/auth.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { EpersonRegistrationService } from '../../../core/data/eperson-registration.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { Group } from '../../../core/eperson/models/group.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { PageInfo } from '../../../core/shared/page-info.model';
import { Registration } from '../../../core/shared/registration.model';
import { TYPE_REQUEST_FORGOT } from '../../../register-email-form/register-email-form.component';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue } from '../../../shared/empty.util';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { HasNoValuePipe } from '../../../shared/utils/has-no-value.pipe';
import { getEPersonsRoute } from '../../access-control-routing-paths';
import { ValidateEmailNotTaken } from './validators/email-taken.validator';

@Component({
  selector: 'ds-eperson-form',
  templateUrl: './eperson-form.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormComponent,
    HasNoValuePipe,
    PaginationComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  standalone: true,
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
        host: 'row',
      },
    },
    lastName: {
      grid: {
        host: 'row',
      },
    },
    email: {
      grid: {
        host: 'row',
      },
    },
    canLogIn: {
      grid: {
        host: 'col col-sm-6 d-inline-block',
      },
    },
    requireCertificate: {
      grid: {
        host: 'col col-sm-6 d-inline-block',
      },
    },
  };

  /**
   * A FormGroup that combines all inputs
   */
  formGroup: UntypedFormGroup;

  /**
   * An EventEmitter that's fired whenever the form is being submitted
   */
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  /**
   * An EventEmitter that's fired whenever the form is cancelled
   */
  @Output() cancelForm: EventEmitter<any> = new EventEmitter();

  /**
   * Observable whether or not the admin is allowed to reset the EPerson's password
   * TODO: Initialize the observable once the REST API supports this (currently hardcoded to return false)
   */
  canReset$: Observable<boolean>;

  /**
   * Observable whether or not the admin is allowed to delete the EPerson
   */
  canDelete$: Observable<boolean>;

  /**
   * Observable whether or not the admin is allowed to impersonate the EPerson
   */
  canImpersonate$: Observable<boolean>;

  /**
   * The current {@link EPerson}
   */
  activeEPerson$: Observable<EPerson>;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * A list of all the groups this EPerson is a member of
   */
  groups$: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * The pagination of the {@link groups$} list.
   */
  groupsPageInfoState$: Observable<PageInfo>;

  /**
   * Pagination config used to display the list of groups
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'gem',
    pageSize: 5,
    currentPage: 1,
  });

  /**
   * Try to retrieve initial active eperson, to fill in checkboxes at component creation
   */
  epersonInitial: EPerson;

  /**
   * Whether or not this EPerson is currently being impersonated
   */
  isImpersonated = false;

  /**
   * A boolean that indicate if to display EPersonForm's Rest password button
   */
  displayResetPassword = false;

  /**
   * A string that indicate the label of Submit button
   */
  submitLabel = 'form.create';
  /**
   * Subscription to email field value change
   */
  emailValueChangeSubscribe: Subscription;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    public epersonService: EPersonDataService,
    public groupsDataService: GroupDataService,
    private formBuilderService: FormBuilderService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private authorizationService: AuthorizationDataService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    public requestService: RequestService,
    private epersonRegistrationService: EpersonRegistrationService,
    public dsoNameService: DSONameService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
  }

  ngOnInit() {
    this.activeEPerson$ = this.epersonService.getActiveEPerson();
    this.subs.push(this.activeEPerson$.subscribe((eperson: EPerson) => {
      this.epersonInitial = eperson;
      if (hasValue(eperson)) {
        this.isImpersonated = this.authService.isImpersonatingUser(eperson.id);
        this.displayResetPassword = true;
        this.submitLabel = 'form.submit';
      }
    }));
    this.initialisePage();
  }

  /**
   * This method will initialise the page
   */
  initialisePage() {
    if (this.route.snapshot.params.id) {
      this.subs.push(this.epersonService.findById(this.route.snapshot.params.id).subscribe((ePersonRD: RemoteData<EPerson>) => {
        this.epersonService.editEPerson(ePersonRD.payload);
      }));
    }
    this.firstName = new DynamicInputModel({
      id: 'firstName',
      label: this.translateService.instant(`${this.messagePrefix}.firstName`),
      name: 'firstName',
      validators: {
        required: null,
      },
      required: true,
    });
    this.lastName = new DynamicInputModel({
      id: 'lastName',
      label: this.translateService.instant(`${this.messagePrefix}.lastName`),
      name: 'lastName',
      validators: {
        required: null,
      },
      required: true,
    });
    this.email = new DynamicInputModel({
      id: 'email',
      label: this.translateService.instant(`${this.messagePrefix}.email`),
      name: 'email',
      validators: {
        required: null,
        pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
      },
      required: true,
      errorMessages: {
        emailTaken: 'error.validation.emailTaken',
        pattern: 'error.validation.NotValidEmail',
      },
      hint: this.translateService.instant(`${this.messagePrefix}.emailHint`),
    });
    this.canLogIn = new DynamicCheckboxModel(
      {
        id: 'canLogIn',
        label: this.translateService.instant(`${this.messagePrefix}.canLogIn`),
        name: 'canLogIn',
        value: (this.epersonInitial != null ? this.epersonInitial.canLogIn : true),
      });
    this.requireCertificate = new DynamicCheckboxModel(
      {
        id: 'requireCertificate',
        label: this.translateService.instant(`${this.messagePrefix}.requireCertificate`),
        name: 'requireCertificate',
        value: (this.epersonInitial != null ? this.epersonInitial.requireCertificate : false),
      });
    this.formModel = [
      this.firstName,
      this.lastName,
      this.email,
      this.canLogIn,
      this.requireCertificate,
    ];
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.subs.push(this.activeEPerson$.subscribe((eperson: EPerson) => {
      if (eperson != null) {
        this.groups$ = this.groupsDataService.findListByHref(eperson._links.groups.href, {
          currentPage: 1,
          elementsPerPage: this.config.pageSize,
        }, undefined, undefined, followLink('object'));
      }
      this.formGroup.patchValue({
        firstName: eperson != null ? eperson.firstMetadataValue('eperson.firstname') : '',
        lastName: eperson != null ? eperson.firstMetadataValue('eperson.lastname') : '',
        email: eperson != null ? eperson.email : '',
        canLogIn: eperson != null ? eperson.canLogIn : true,
        requireCertificate: eperson != null ? eperson.requireCertificate : false,
      });

      if (eperson === null && !!this.formGroup.controls.email) {
        this.formGroup.controls.email.setAsyncValidators(ValidateEmailNotTaken.createValidator(this.epersonService));
        this.emailValueChangeSubscribe = this.email.valueChanges.pipe(debounceTime(300)).subscribe(() => {
          this.changeDetectorRef.detectChanges();
        });
      }
    }));

    this.groups$ = this.activeEPerson$.pipe(
      switchMap((eperson) => {
        return observableCombineLatest([of(eperson), this.paginationService.getFindListOptions(this.config.id, {
          currentPage: 1,
          elementsPerPage: this.config.pageSize,
        })]);
      }),
      switchMap(([eperson, findListOptions]) => {
        if (eperson != null) {
          return this.groupsDataService.findListByHref(eperson._links.groups.href, findListOptions, true, true, followLink('object'));
        }
        return of(undefined);
      }),
    );

    this.groupsPageInfoState$ = this.groups$.pipe(
      map(groupsRD => groupsRD.payload.pageInfo),
    );

    this.canImpersonate$ = this.activeEPerson$.pipe(
      switchMap((eperson) => {
        if (hasValue(eperson)) {
          return this.authorizationService.isAuthorized(FeatureID.LoginOnBehalfOf, eperson.self);
        } else {
          return of(false);
        }
      }),
    );
    this.canDelete$ = this.activeEPerson$.pipe(
      switchMap((eperson) => this.authorizationService.isAuthorized(FeatureID.CanDelete, hasValue(eperson) ? eperson.self : undefined)),
    );
    this.canReset$ = of(true);
  }

  /**
   * Stop editing the currently selected eperson
   */
  onCancel() {
    this.epersonService.cancelEditEPerson();
    this.cancelForm.emit();
    void this.router.navigate([getEPersonsRoute()]);
  }

  /**
   * Submit the form
   * When the eperson has an id attached -> Edit the eperson
   * When the eperson has no id attached -> Create new eperson
   * Emit the updated/created eperson using the EventEmitter submitForm
   */
  onSubmit() {
    this.activeEPerson$.pipe(take(1)).subscribe(
      (ePerson: EPerson) => {
        const values = {
          metadata: {
            'eperson.firstname': [
              {
                value: this.firstName.value,
              },
            ],
            'eperson.lastname': [
              {
                value: this.lastName.value,
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
      },
    );
  }

  /**
   * Creates new EPerson based on given values from form
   * @param values
   */
  createNewEPerson(values) {
    const ePersonToCreate = Object.assign(new EPerson(), values);

    const response = this.epersonService.create(ePersonToCreate);
    response.pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<EPerson>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.created.success', { name: this.dsoNameService.getName(ePersonToCreate) }));
        this.submitForm.emit(ePersonToCreate);
        this.epersonService.clearEPersonRequests();
        void this.router.navigateByUrl(getEPersonsRoute());
      } else {
        this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.created.failure', { name: this.dsoNameService.getName(ePersonToCreate) }));
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
            value: (this.firstName.value ? this.firstName.value : ePerson.firstMetadataValue('eperson.firstname')),
          },
        ],
        'eperson.lastname': [
          {
            value: (this.lastName.value ? this.lastName.value : ePerson.firstMetadataValue('eperson.lastname')),
          },
        ],
      },
      email: (hasValue(values.email) ? values.email : ePerson.email),
      canLogIn: (hasValue(values.canLogIn) ? values.canLogIn : ePerson.canLogIn),
      requireCertificate: (hasValue(values.requireCertificate) ? values.requireCertificate : ePerson.requireCertificate),
      _links: ePerson._links,
    });

    const response = this.epersonService.updateEPerson(editedEperson);
    response.pipe(getFirstCompletedRemoteData()).subscribe((rd: RemoteData<EPerson>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.edited.success', { name: this.dsoNameService.getName(editedEperson) }));
        this.submitForm.emit(editedEperson);
        void this.router.navigateByUrl(getEPersonsRoute());
      } else {
        this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.edited.failure', { name: this.dsoNameService.getName(editedEperson) }));
        this.cancelForm.emit();
      }
    });

    if (values.email != null && values.email !== ePerson.email) {
      this.showNotificationIfEmailInUse(editedEperson, 'edited');
    }
  }

  /**
   * Event triggered when the user changes page
   * @param event
   */
  onPageChange(event) {
    this.updateGroups({
      currentPage: event,
      elementsPerPage: this.config.pageSize,
    });
  }

  /**
   * Start impersonating the EPerson
   */
  impersonate() {
    this.authService.impersonate(this.epersonInitial.id);
    this.isImpersonated = true;
  }

  /**
   * Deletes the EPerson from the Repository. The EPerson will be the only that this form is showing.
   * It'll either show a success or error message depending on whether the delete was successful or not.
   */
  delete(): void {
    this.activeEPerson$.pipe(
      take(1),
      switchMap((eperson: EPerson) => {
        const modalRef = this.modalService.open(ConfirmationModalComponent);
        modalRef.componentInstance.name = this.dsoNameService.getName(eperson);
        modalRef.componentInstance.headerLabel = 'confirmation-modal.delete-eperson.header';
        modalRef.componentInstance.infoLabel = 'confirmation-modal.delete-eperson.info';
        modalRef.componentInstance.cancelLabel = 'confirmation-modal.delete-eperson.cancel';
        modalRef.componentInstance.confirmLabel = 'confirmation-modal.delete-eperson.confirm';
        modalRef.componentInstance.brandColor = 'danger';
        modalRef.componentInstance.confirmIcon = 'fas fa-trash';

        return modalRef.componentInstance.response.pipe(
          take(1),
          switchMap((confirm: boolean) => {
            if (confirm && hasValue(eperson.id)) {
              this.canDelete$ = of(false);
              return this.epersonService.deleteEPerson(eperson).pipe(
                getFirstCompletedRemoteData(),
                map((restResponse: RemoteData<NoContent>) => ({ restResponse, eperson })),
              );
            } else {
              return of(null);
            }
          }),
          finalize(() => this.canDelete$ = of(true)),
        );
      }),
    ).subscribe(({ restResponse, eperson }: { restResponse: RemoteData<NoContent> | null, eperson: EPerson }) => {
      if (restResponse?.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.deleted.success', { name: this.dsoNameService.getName(eperson) }));
        void this.router.navigate([getEPersonsRoute()]);
      } else {
        this.notificationsService.error(`Error occurred when trying to delete EPerson with id: ${eperson?.id} with code: ${restResponse?.statusCode} and message: ${restResponse?.errorMessage}`);
      }
      this.cancelForm.emit();
    });
  }

  /**
   * Stop impersonating the EPerson
   */
  stopImpersonating() {
    this.authService.stopImpersonatingAndRefresh();
    this.isImpersonated = false;
  }

  /**
   * Sends an email to current eperson address with the information
   * to reset password
   */
  resetPassword() {
    if (hasValue(this.epersonInitial.email)) {
      this.epersonRegistrationService.registerEmail(this.epersonInitial.email, null, TYPE_REQUEST_FORGOT).pipe(getFirstCompletedRemoteData())
        .subscribe((response: RemoteData<Registration>) => {
          if (response.hasSucceeded) {
            this.notificationsService.success(this.translateService.get('admin.access-control.epeople.actions.reset'),
              this.translateService.get('forgot-email.form.success.content', { email: this.epersonInitial.email }));
          } else {
            this.notificationsService.error(this.translateService.get('forgot-email.form.error.head'),
              this.translateService.get('forgot-email.form.error.content', { email: this.epersonInitial.email }));
          }
        },
        );
    }
  }

  /**
   * Cancel the current edit when component is destroyed & unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
    this.paginationService.clearPagination(this.config.id);
    if (hasValue(this.emailValueChangeSubscribe)) {
      this.emailValueChangeSubscribe.unsubscribe();
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
      elementsPerPage: 0,
    }).pipe(getFirstSucceededRemoteData(), getRemoteDataPayload())
      .subscribe((list: PaginatedList<EPerson>) => {
        if (list.totalElements > 0) {
          this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.' + notificationSection + '.failure.emailInUse', {
            name: this.dsoNameService.getName(ePerson),
            email: ePerson.email,
          }));
        }
      }));
  }

  /**
   * Update the list of groups by fetching it from the rest api or cache
   */
  private updateGroups(options) {
    this.subs.push(this.activeEPerson$.subscribe((eperson: EPerson) => {
      this.groups$ = this.groupsDataService.findListByHref(eperson._links.groups.href, options);
    }));
  }
}
