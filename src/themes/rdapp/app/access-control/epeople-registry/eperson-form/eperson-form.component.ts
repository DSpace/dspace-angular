import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { EpersonRegistrationService } from '@dspace/core/data/eperson-registration.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { GroupDataService } from '@dspace/core/eperson/group-data.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { Group } from '@dspace/core/eperson/models/group.model';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { NoContent } from '@dspace/core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteListPayload,
} from '@dspace/core/shared/operators';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { Registration } from '@dspace/core/shared/registration.model';
import { VocabularyEntry } from '@dspace/core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyOptions } from '@dspace/core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyService } from '@dspace/core/submission/vocabularies/vocabulary.service';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicInputModel,
  DynamicSelectModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  getEPersonsRoute,
  getGroupEditPageRouterLink,
} from '../../../../../../app/access-control/access-control-routing-paths';
import { EpeopleRegistryService } from '../../../../../../app/access-control/epeople-registry/epeople-registry.service';
import { ValidateEmailNotTaken } from '../../../../../../app/access-control/epeople-registry/eperson-form/validators/email-taken.validator';
import { GroupRegistryService } from '../../../../../../app/access-control/group-registry/group-registry.service';
import { TYPE_REQUEST_FORGOT } from '../../../../../../app/register-email-form/register-email-form.component';
import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { ConfirmationModalComponent } from '../../../../../../app/shared/confirmation-modal/confirmation-modal.component';
import { FormBuilderService } from '../../../../../../app/shared/form/builder/form-builder.service';
import { FormComponent } from '../../../../../../app/shared/form/form.component';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { PaginationComponent } from '../../../../../../app/shared/pagination/pagination.component';
import { HasNoValuePipe } from '../../../../../../app/shared/utils/has-no-value.pipe';

@Component({
  selector: 'ds-themed-eperson-form',
  templateUrl: './eperson-form.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormComponent,
    FormsModule,
    HasNoValuePipe,
    PaginationComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
/**
 * A form used for creating and editing EPeople
 */
export class EPersonFormComponent implements OnInit, AfterViewInit, OnDestroy {

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
  institution: DynamicSelectModel<string>;
  institutions: VocabularyEntry[] = [];
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
    institution: {
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
   * Trigger to force refresh of the current user's groups list
   */
  private refreshGroups$ = new BehaviorSubject<void>(undefined);

  /**
   * The pagination of the {@link groups$} list.
   */
  groupsPageInfoState$: Observable<PageInfo>;

  /**
   * D12: Controle para busca e adição de grupos diretamente na tela do usuário
   */
  showAddGroupSection = false;
  groupSearchQuery = '';
  availableGroups$: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * Pagination config used to display the list of current groups
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'gem',
    pageSize: 5,
    currentPage: 1,
  });

  /**
   * Pagination config used to display the list of available groups to add
   */
  addGroupsConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'eperson-add-groups',
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

  protected readonly getGroupEditPageRouterLink = getGroupEditPageRouterLink;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    public epersonService: EPersonDataService,
    public epeopleRegistryService: EpeopleRegistryService,
    public groupsDataService: GroupDataService,
    public groupRegistryService: GroupRegistryService,
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
    private vocabularyService: VocabularyService,
  ) {
  }

  ngOnInit() {
    this.activeEPerson$ = this.epeopleRegistryService.getActiveEPerson();
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

  ngAfterViewInit(): void {
    if (this.formGroup) {
      this.subs.push(
        this.formGroup.statusChanges.pipe(debounceTime(50)).subscribe(() => {
          this.syncFormAriaAttributes();
        }),
      );
    }
  }

  /**
   * This method will initialise the page
   */
  initialisePage() {
    if (this.route.snapshot.params.id) {
      this.subs.push(this.epersonService.findById(this.route.snapshot.params.id).subscribe((ePersonRD: RemoteData<EPerson>) => {
        if (hasValue(ePersonRD?.payload)) {
          this.epersonInitial = ePersonRD.payload;
          this.epeopleRegistryService.editEPerson(ePersonRD.payload);
        }
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
      errorMessages: {
        required: 'admin.access-control.epeople.form.firstName.error.required',
      },
    });
    this.lastName = new DynamicInputModel({
      id: 'lastName',
      label: this.translateService.instant(`${this.messagePrefix}.lastName`),
      name: 'lastName',
      validators: {
        required: null,
      },
      required: true,
      errorMessages: {
        required: 'admin.access-control.epeople.form.lastName.error.required',
      },
    });
    this.email = new DynamicInputModel({
      id: 'email',
      label: this.translateService.instant(`${this.messagePrefix}.email`),
      name: 'email',
      validators: {
        required: null,
        email: null,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      },
      required: true,
      errorMessages: {
        required: 'admin.access-control.epeople.form.email.error.required',
        emailTaken: 'error.validation.emailTaken',
        email: 'error.validation.NotValidEmail',
        pattern: 'error.validation.NotValidEmail',
      },
      hint: this.translateService.instant(`${this.messagePrefix}.emailHint`),
    });
    this.institution = new DynamicSelectModel({
      id: 'institution',
      label: this.translateService.instant(`${this.messagePrefix}.institution`),
      name: 'institution',
      validators: {
        required: null,
      },
      required: true,
      options: [],
      errorMessages: {
        required: 'admin.access-control.epeople.form.institution.error.required',
      },
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
      this.institution,
      this.canLogIn,
      this.requireCertificate,
    ];
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.subs.push(
      this.vocabularyService.getVocabularyEntries(
        new VocabularyOptions('rdapp-instituicoes', 'local.instituicao', null, true),
        new PageInfo(),
      ).pipe(
        getFirstSucceededRemoteListPayload(),
      ).subscribe((entries: VocabularyEntry[]) => {
        this.institutions = entries;
        this.institution.options = entries.map((entry) => ({
          label: entry.display,
          value: entry.value,
        }));
        if (hasValue(this.epersonInitial)) {
          this.institution.value = this.epersonInitial.firstMetadataValue('eperson.institution');
        }
        this.changeDetectorRef.detectChanges();
      }),
    );

    this.subs.push(this.activeEPerson$.subscribe((eperson: EPerson) => {
      this.formGroup.patchValue({
        firstName: eperson != null ? eperson.firstMetadataValue('eperson.firstname') : '',
        lastName: eperson != null ? eperson.firstMetadataValue('eperson.lastname') : '',
        email: eperson != null ? eperson.email : '',
        institution: eperson != null ? eperson.firstMetadataValue('eperson.institution') : '',
        canLogIn: eperson != null ? eperson.canLogIn : true,
        requireCertificate: eperson != null ? eperson.requireCertificate : false,
      });

      if (eperson === null && !!this.formGroup.controls.email) {
        this.formGroup.controls.email.setAsyncValidators(ValidateEmailNotTaken.createValidator(this.epersonService));
        this.emailValueChangeSubscribe = this.email.valueChanges.pipe(debounceTime(300)).subscribe(() => {
          this.changeDetectorRef.detectChanges();
          this.syncFormAriaAttributes();
        });
      }
    }));

    // Unifica o carregamento de grupos atuais com suporte a paginação e atualização reativa
    this.groups$ = observableCombineLatest([
      this.activeEPerson$,
      this.paginationService.getFindListOptions(this.config.id, {
        currentPage: 1,
        elementsPerPage: this.config.pageSize,
      }),
      this.refreshGroups$,
    ]).pipe(
      switchMap(([eperson, findListOptions]) => {
        if (hasValue(eperson)) {
          return this.groupsDataService.findListByHref(
            eperson._links.groups.href,
            findListOptions,
            true,
            true,
            followLink('object'),
          );
        }
        return of(undefined);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.groupsPageInfoState$ = this.groups$.pipe(
      map(groupsRD => groupsRD?.payload?.pageInfo),
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
    this.epeopleRegistryService.cancelEditEPerson();
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
    // D7: Validação manual de e-mail vazio ou inválido antes de submeter
    const emailControl = this.formGroup.controls.email;
    const rawEmail = (this.email?.value || emailControl?.value || '').trim();
    if (!rawEmail) {
      emailControl?.setErrors({ required: true });
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      Object.values(this.formGroup.controls).forEach((control) => control.markAsDirty());
      this.changeDetectorRef.detectChanges();
      this.syncFormAriaAttributes(true);
      return;
    }

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
            'eperson.institution': [
              {
                value: this.institution.value,
              },
            ],
          },
          email: rawEmail,
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
   * D5: Creates new EPerson based on given values from form.
   * Valida previamente se o e-mail já está em uso para evitar o erro 500 ("Server Error")
   * e apontar diretamente o campo de e-mail e a causa em português.
   * @param values
   */
  createNewEPerson(values) {
    const ePersonToCreate = Object.assign(new EPerson(), values);
    const emailToCheck = (values.email || '').trim();

    this.epersonService.getEPersonByEmail(emailToCheck).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((checkRD: RemoteData<EPerson>) => {
      if (checkRD.hasSucceeded && hasValue(checkRD.payload)) {
        this.markEmailAsDuplicate(ePersonToCreate, 'created');
        return;
      }

      const response = this.epersonService.create(ePersonToCreate);
      response.pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((rd: RemoteData<EPerson>) => {
        if (rd.hasSucceeded) {
          this.notificationsService.success(
            this.translateService.get(this.labelPrefix + 'notification.created.success', { name: this.dsoNameService.getName(ePersonToCreate) }),
          );
          this.submitForm.emit(ePersonToCreate);
          this.epersonService.clearEPersonRequests();
          void this.router.navigateByUrl(getEPersonsRoute());
        } else {
          // D5: Se falhou por duplicidade (422, 409 ou 500 com e-mail repetido), aponta o campo email sem limpar o form
          if (rd.statusCode === 422 || rd.statusCode === 409 || rd.statusCode === 500) {
            this.markEmailAsDuplicate(ePersonToCreate, 'created');
          } else {
            this.notificationsService.error(
              this.translateService.get(this.labelPrefix + 'notification.created.failure', { name: this.dsoNameService.getName(ePersonToCreate) }),
            );
          }
        }
      });
    });
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
        'eperson.institution': [
          {
            value: (this.institution.value ? this.institution.value : ePerson.firstMetadataValue('eperson.institution')),
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
        if (values.email != null && values.email !== ePerson.email) {
          this.markEmailAsDuplicate(editedEperson, 'edited');
        } else {
          this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.edited.failure', { name: this.dsoNameService.getName(editedEperson) }));
        }
      }
    });
  }

  /**
   * Event triggered when the user changes page on current groups
   * @param event
   */
  onPageChange(event) {
    this.updateGroups({
      currentPage: event,
      elementsPerPage: this.config.pageSize,
    });
  }

  /**
   * D12: Abre/fecha a seção de busca de grupos para adição direta na tela do usuário
   */
  toggleAddGroupSection(): void {
    this.showAddGroupSection = !this.showAddGroupSection;
    if (this.showAddGroupSection) {
      this.searchGroupsToAdd(1);
    }
  }

  /**
   * D12: Busca grupos disponíveis pelo termo digitado (com paginação)
   */
  searchGroupsToAdd(page = 1): void {
    this.addGroupsConfig.currentPage = page;
    this.availableGroups$ = this.groupsDataService.searchGroups(this.groupSearchQuery.trim(), {
      currentPage: page,
      elementsPerPage: this.addGroupsConfig.pageSize,
    }, true, true).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  /**
   * D12: Muda de página na busca de grupos para adicionar
   */
  onAddGroupsPageChange(page: number): void {
    this.searchGroupsToAdd(page);
  }

  /**
   * D12: Verifica se o grupo já está na lista de grupos atuais para desabilitar o botão Adicionar
   */
  isMemberOfGroup(groupId: string, currentGroups: Group[]): boolean {
    if (!currentGroups || !groupId) {
      return false;
    }
    return currentGroups.some((g) => g.id === groupId);
  }

  /**
   * D12: Adiciona o usuário atual ao grupo selecionado diretamente pela tela do usuário
   * @param group Grupo ao qual o usuário será vinculado
   */
  addUserToGroup(group: Group): void {
    this.activeEPerson$.pipe(take(1)).subscribe((eperson: EPerson) => {
      if (hasValue(eperson) && hasValue(group)) {
        this.groupsDataService.addMemberToGroup(group, eperson).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((rd: RemoteData<Group>) => {
          if (rd.hasSucceeded) {
            this.notificationsService.success(
              this.translateService.instant('admin.access-control.groups.form.notification.members.added.success', { name: this.dsoNameService.getName(eperson) }),
            );
            this.groupsDataService.clearGroupsRequests();
            this.epersonService.clearLinkRequests(eperson._links.groups.href);
            this.refreshGroups$.next();
            this.changeDetectorRef.detectChanges();
          } else {
            this.notificationsService.error(
              this.translateService.instant('admin.access-control.groups.form.notification.members.added.failure', { name: this.dsoNameService.getName(eperson) }),
            );
          }
        });
      }
    });
  }

  /**
   * D12: Remove o usuário atual do grupo selecionado diretamente pela tela do usuário
   * @param group Grupo do qual o usuário será removido
   */
  removeUserFromGroup(group: Group): void {
    this.activeEPerson$.pipe(take(1)).subscribe((eperson: EPerson) => {
      if (hasValue(eperson) && hasValue(group)) {
        this.groupsDataService.deleteMemberFromGroup(group, eperson).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((rd: RemoteData<NoContent>) => {
          if (rd.hasSucceeded) {
            this.notificationsService.success(
              this.translateService.instant('admin.access-control.groups.form.notification.members.removed.success', { name: this.dsoNameService.getName(eperson) }),
            );
            this.groupsDataService.clearGroupsRequests();
            this.epersonService.clearLinkRequests(eperson._links.groups.href);
            this.refreshGroups$.next();
            this.changeDetectorRef.detectChanges();
          } else {
            this.notificationsService.error(
              this.translateService.instant('admin.access-control.groups.form.notification.members.removed.failure', { name: this.dsoNameService.getName(eperson) }),
            );
          }
        });
      }
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
   * D6: Sends an email to current eperson address with the information
   * to reset password, garantindo feedback visual em tela em qualquer cenário.
   */
  resetPassword() {
    const targetEmail = this.epersonInitial?.email || this.email?.value || this.formGroup?.controls?.email?.value;

    if (!hasValue(targetEmail)) {
      this.notificationsService.error(
        this.translateService.instant('admin.access-control.epeople.actions.reset'),
        this.translateService.instant('admin.access-control.epeople.form.email.error.required'),
      );
      return;
    }

    this.epersonRegistrationService.registerEmail(targetEmail, null, TYPE_REQUEST_FORGOT).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<Registration>) => {
      if (response.hasSucceeded) {
        this.notificationsService.success(
          this.translateService.instant('admin.access-control.epeople.actions.reset'),
          this.translateService.instant('forgot-email.form.success.content', { email: targetEmail }),
        );
      } else {
        this.notificationsService.error(
          this.translateService.instant('forgot-email.form.error.head'),
          this.translateService.instant('forgot-email.form.error.content', { email: targetEmail }),
        );
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Cancel the current edit when component is destroyed & unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
    this.paginationService.clearPagination(this.config.id);
    this.paginationService.clearPagination(this.addGroupsConfig.id);
    if (hasValue(this.emailValueChangeSubscribe)) {
      this.emailValueChangeSubscribe.unsubscribe();
    }
  }

  /**
   * D5: Marca o campo de e-mail como duplicado no FormGroup, atualiza os atributos ARIA
   * e exibe notificação em português apontando o campo e a causa.
   */
  private markEmailAsDuplicate(ePerson: EPerson, notificationSection: string): void {
    const emailControl = this.formGroup?.controls?.email;
    if (emailControl) {
      emailControl.setErrors({ emailTaken: true });
      emailControl.markAsTouched();
      emailControl.markAsDirty();
    }
    this.notificationsService.error(
      this.translateService.instant('error.validation.emailTaken'),
      this.translateService.instant(this.labelPrefix + 'notification.' + notificationSection + '.failure.emailInUse', {
        name: this.dsoNameService.getName(ePerson),
        email: ePerson.email,
      }),
    );
    this.changeDetectorRef.detectChanges();
    this.syncFormAriaAttributes(true);
  }

  /**
   * D7: Vincula programaticamente aria-invalid e aria-describedby nos inputs do formulário
   */
  private syncFormAriaAttributes(focusFirstInvalid = false): void {
    if (!this.formGroup || typeof document === 'undefined') {
      return;
    }
    let firstInvalidFocused = false;
    ['firstName', 'lastName', 'email', 'institution'].forEach((fieldId) => {
      const control = this.formGroup.controls[fieldId];
      const inputEl = document.getElementById(fieldId);
      if (control && inputEl) {
        const isInvalid = control.invalid && (control.touched || control.dirty);
        inputEl.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');

        // Procura o elemento de feedback de erro próximo ao input para vincular via aria-describedby
        const wrapper = inputEl.closest('.form-group, .mb-3, ds-dynamic-form-control-container');
        const errorEl = wrapper?.querySelector('.invalid-feedback, .text-danger') as HTMLElement;
        if (isInvalid && errorEl) {
          const errorId = `${fieldId}-error-feedback`;
          errorEl.id = errorId;
          errorEl.setAttribute('role', 'alert');
          inputEl.setAttribute('aria-describedby', errorId);
        } else if (!isInvalid) {
          inputEl.removeAttribute('aria-describedby');
        }

        if (focusFirstInvalid && isInvalid && !firstInvalidFocused) {
          inputEl.focus();
          firstInvalidFocused = true;
        }
      }
    });
  }

  /**
   * Update the list of groups by triggering the refresh subject
   */
  private updateGroups(options) {
    this.config.currentPage = options.currentPage;
    this.refreshGroups$.next();
  }

}