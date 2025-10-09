import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicInputModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import {
  combineLatest as observableCombineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { getCollectionEditRolesRoute } from '../../../collection-page/collection-page-routing-paths';
import { getCommunityEditRolesRoute } from '../../../community-page/community-page-routing-paths';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { Group } from '../../../core/eperson/models/group.model';
import { Collection } from '../../../core/shared/collection.model';
import { Community } from '../../../core/shared/community.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getAllCompletedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { ContextHelpDirective } from '../../../shared/context-help.directive';
import {
  hasValue,
  hasValueOperator,
  isNotEmpty,
} from '../../../shared/empty.util';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import {
  getGroupEditRoute,
  getGroupsRoute,
} from '../../access-control-routing-paths';
import { MembersListComponent } from './members-list/members-list.component';
import { SubgroupsListComponent } from './subgroup-list/subgroups-list.component';
import { ValidateGroupExists } from './validators/group-exists.validator';

@Component({
  selector: 'ds-group-form',
  templateUrl: './group-form.component.html',
  imports: [
    AlertComponent,
    AsyncPipe,
    ContextHelpDirective,
    FormComponent,
    MembersListComponent,
    SubgroupsListComponent,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * A form used for creating and editing groups
 */
export class GroupFormComponent implements OnInit, OnDestroy {

  messagePrefix = 'admin.access-control.groups.form';

  /**
   * A unique id used for ds-form
   */
  formId = 'group-form';

  /**
   * Dynamic models for the inputs of form
   */
  groupName: AbstractControl;
  groupCommunity: AbstractControl;
  groupDescription: AbstractControl;

  /**
   * A list of all dynamic input models
   */
  formModel: DynamicFormControlModel[];

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    groupName: {
      grid: {
        host: 'row',
      },
    },
    groupDescription: {
      grid: {
        host: 'row',
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
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Observable whether or not the logged in user is allowed to delete the Group & doesn't have a linked object (community / collection linked to workspace group
   */
  canEdit$: Observable<boolean>;

  /**
   * The current {@link Group}
   */
  activeGroup$: Observable<Group>;

  /**
   * The current {@link Group}'s linked {@link Community}/{@link Collection}
   */
  activeGroupLinkedDSO$: Observable<DSpaceObject>;

  /**
   * Link to the current {@link Group}'s {@link Community}/{@link Collection} edit role tab
   */
  linkedEditRolesRoute$: Observable<string>;

  /**
   * The AlertType enumeration
   */
  public readonly AlertType = AlertType;

  /**
   * Subscription to email field value change
   */
  groupNameValueChangeSubscribe: Subscription;


  constructor(
    public groupDataService: GroupDataService,
    protected dSpaceObjectDataService: DSpaceObjectDataService,
    protected formBuilderService: FormBuilderService,
    protected translateService: TranslateService,
    protected notificationsService: NotificationsService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    public requestService: RequestService,
    protected changeDetectorRef: ChangeDetectorRef,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    if (this.route.snapshot.params.groupId !== 'newGroup') {
      this.setActiveGroup(this.route.snapshot.params.groupId);
    }
    this.activeGroup$ = this.groupDataService.getActiveGroup();
    this.activeGroupLinkedDSO$ = this.getActiveGroupLinkedDSO();
    this.linkedEditRolesRoute$ = this.getLinkedEditRolesRoute();
    this.canEdit$ = this.activeGroupLinkedDSO$.pipe(
      switchMap((dso: DSpaceObject) => {
        if (hasValue(dso)) {
          return [false];
        } else {
          return this.activeGroup$.pipe(
            hasValueOperator(),
            switchMap((group: Group) => this.authorizationService.isAuthorized(FeatureID.CanDelete, group.self)),
          );
        }
      }),
    );
    this.initialisePage();
  }

  initialisePage() {
    const groupNameModel = new DynamicInputModel({
      id: 'groupName',
      label: this.translateService.instant(`${this.messagePrefix}.groupName`),
      name: 'groupName',
      validators: {
        required: null,
      },
      required: true,
    });
    const groupCommunityModel = new DynamicInputModel({
      id: 'groupCommunity',
      label: this.translateService.instant(`${this.messagePrefix}.groupCommunity`),
      name: 'groupCommunity',
      required: false,
      readOnly: true,
    });
    const groupDescriptionModel = new DynamicTextAreaModel({
      id: 'groupDescription',
      label: this.translateService.instant(`${this.messagePrefix}.groupDescription`),
      name: 'groupDescription',
      required: false,
      spellCheck: environment.form.spellCheck,
    });
    this.formModel = [
      groupNameModel,
      groupDescriptionModel,
    ];
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.groupName = this.formGroup.get('groupName');
    this.groupDescription = this.formGroup.get('groupDescription');

    if (hasValue(this.groupName)) {
      this.groupName.setAsyncValidators(ValidateGroupExists.createValidator(this.groupDataService));
      this.groupNameValueChangeSubscribe = this.groupName.valueChanges.pipe(debounceTime(300)).subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
    }

    this.subs.push(
      observableCombineLatest([
        this.activeGroup$,
        this.canEdit$,
        this.activeGroupLinkedDSO$,
      ]).subscribe(([activeGroup, canEdit, linkedObject]) => {

        if (activeGroup != null) {

          // Disable group name exists validator
          this.formGroup.controls.groupName.clearAsyncValidators();

          if (isNotEmpty(linkedObject?.name)) {
            if (!this.formGroup.controls.groupCommunity) {
              this.formBuilderService.insertFormGroupControl(1, this.formGroup, this.formModel, groupCommunityModel);
              this.groupDescription = this.formGroup.get('groupCommunity');
            }
            this.formGroup.patchValue({
              groupName: activeGroup.name,
              groupCommunity: linkedObject?.name ?? '',
              groupDescription: activeGroup.firstMetadataValue('dc.description'),
            });
          } else {
            this.formModel = [
              groupNameModel,
              groupDescriptionModel,
            ];
            this.formGroup.patchValue({
              groupName: activeGroup.name,
              groupDescription: activeGroup.firstMetadataValue('dc.description'),
            });
          }
          if (!canEdit || activeGroup.permanent) {
            this.formGroup.disable();
          } else {
            this.formGroup.enable();
          }
        }
      }),
    );
  }

  /**
   * Stop editing the currently selected group
   */
  onCancel() {
    this.groupDataService.cancelEditGroup();
    this.cancelForm.emit();
    void this.router.navigate([getGroupsRoute()]);
  }

  /**
   * Submit the form
   * When the eperson has an id attached -> Edit the eperson
   * When the eperson has no id attached -> Create new eperson
   * Emit the updated/created eperson using the EventEmitter submitForm
   */
  onSubmit() {
    this.activeGroup$.pipe(take(1)).subscribe((group: Group) => {
      if (group === null) {
        this.createNewGroup({
          name: this.groupName.value,
          metadata: {
            'dc.description': [
              {
                value: this.groupDescription.value,
              },
            ],
          },
        });
      } else {
        this.editGroup(group);
      }
    });
  }

  /**
   * Creates new Group based on given values from form
   * @param values
   */
  createNewGroup(values) {
    const groupToCreate = Object.assign(new Group(), values);
    this.groupDataService.create(groupToCreate).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<Group>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.created.success', { name: groupToCreate.name }));
        this.submitForm.emit(groupToCreate);
        if (isNotEmpty(rd.payload)) {
          const groupSelfLink = rd.payload._links.self.href;
          this.setActiveGroupWithLink(groupSelfLink);
          this.groupDataService.clearGroupsRequests();
          void this.router.navigateByUrl(getGroupEditRoute(rd.payload.uuid));
        }
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.created.failure', { name: groupToCreate.name }));
        this.showNotificationIfNameInUse(groupToCreate, 'created');
        this.cancelForm.emit();
      }
    });
  }

  /**
   * Checks for the given group if there is already a group in the system with that group name and shows error if that
   * is the case
   * @param group                 group to check
   * @param notificationSection   whether in create or edit
   */
  private showNotificationIfNameInUse(group: Group, notificationSection: string) {
    // Relevant message for group name in use
    this.subs.push(this.groupDataService.searchGroups(group.name, {
      currentPage: 1,
      elementsPerPage: 0,
    }).pipe(getFirstSucceededRemoteData(), getRemoteDataPayload())
      .subscribe((list: PaginatedList<Group>) => {
        if (list.totalElements > 0) {
          this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.' + notificationSection + '.failure.groupNameInUse', {
            name: this.dsoNameService.getName(group),
          }));
        }
      }));
  }

  /**
   * Edit existing Group based on given values from form and old Group
   * @param group   Group to edit and old values contained within
   */
  editGroup(group: Group) {
    let operations: Operation[] = [];

    if (hasValue(this.groupDescription.value)) {
      operations = [...operations, {
        op: 'add',
        path: '/metadata/dc.description',
        value: this.groupDescription.value,
      }];
    }

    if (hasValue(this.groupName.value)) {
      operations = [...operations, {
        op: 'replace',
        path: '/name',
        value: this.groupName.value,
      }];
    }

    this.groupDataService.patch(group, operations).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<Group>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.edited.success', { name: this.dsoNameService.getName(rd.payload) }));
        this.submitForm.emit(rd.payload);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.edited.failure', { name: this.dsoNameService.getName(group) }));
        this.cancelForm.emit();
      }
    });
  }

  /**
   * Start editing the selected group
   * @param groupId   ID of group to set as active
   */
  setActiveGroup(groupId: string) {
    this.groupDataService.cancelEditGroup();
    this.groupDataService.findById(groupId)
      .pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload())
      .subscribe((group: Group) => {
        this.groupDataService.editGroup(group);
      });
  }

  /**
   * Start editing the selected group
   * @param groupSelfLink   SelfLink of group to set as active
   */
  setActiveGroupWithLink(groupSelfLink: string) {
    this.activeGroup$.pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup === null) {
        this.groupDataService.cancelEditGroup();
        this.groupDataService.findByHref(groupSelfLink, false, false, followLink('subgroups'), followLink('epersons'), followLink('object'))
          .pipe(
            getFirstSucceededRemoteData(),
            getRemoteDataPayload())
          .subscribe((group: Group) => {
            this.groupDataService.editGroup(group);
          });
      }
    });
  }

  /**
   * Deletes the Group from the Repository. The Group will be the only that this form is showing.
   * It'll either show a success or error message depending on whether the delete was successful or not.
   */
  delete() {
    this.activeGroup$.pipe(take(1)).subscribe((group: Group) => {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.name = this.dsoNameService.getName(group);
      modalRef.componentInstance.headerLabel = this.messagePrefix + '.delete-group.modal.header';
      modalRef.componentInstance.infoLabel = this.messagePrefix + '.delete-group.modal.info';
      modalRef.componentInstance.cancelLabel = this.messagePrefix + '.delete-group.modal.cancel';
      modalRef.componentInstance.confirmLabel = this.messagePrefix + '.delete-group.modal.confirm';
      modalRef.componentInstance.brandColor = 'danger';
      modalRef.componentInstance.confirmIcon = 'fas fa-trash';
      modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
        if (confirm) {
          if (hasValue(group.id)) {
            this.groupDataService.delete(group.id).pipe(getFirstCompletedRemoteData())
              .subscribe((rd: RemoteData<NoContent>) => {
                if (rd.hasSucceeded) {
                  this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.deleted.success', { name: this.dsoNameService.getName(group) }));
                  this.onCancel();
                } else {
                  this.notificationsService.error(
                    this.translateService.get(this.messagePrefix + '.notification.deleted.failure.title', { name: this.dsoNameService.getName(group) }),
                    this.translateService.get(this.messagePrefix + '.notification.deleted.failure.content', { cause: rd.errorMessage }));
                }
              });
          }
        }
      });
    });
  }

  /**
   * Cancel the current edit when component is destroyed & unsub all subscriptions
   */
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.groupDataService.cancelEditGroup();
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());

    if ( hasValue(this.groupNameValueChangeSubscribe) ) {
      this.groupNameValueChangeSubscribe.unsubscribe();
    }

  }

  /**
   * Get the active {@link Group}'s linked object if it has one ({@link Community} or {@link Collection} linked to a
   * workflow group)
   */
  getActiveGroupLinkedDSO(): Observable<DSpaceObject> {
    return this.activeGroup$.pipe(
      hasValueOperator(),
      switchMap((group: Group) => {
        if (group.object === undefined) {
          return this.dSpaceObjectDataService.findByHref(group._links.object.href);
        }
        return group.object;
      }),
      getAllCompletedRemoteData(),
      getRemoteDataPayload(),
    );
  }

  /**
   * Get the route to the edit roles tab of the active {@link Group}'s linked object (community or collection linked
   * to a workflow group) if it has one
   */
  getLinkedEditRolesRoute(): Observable<string> {
    return this.activeGroupLinkedDSO$.pipe(
      hasValueOperator(),
      map((dso: DSpaceObject) => {
        switch ((dso as any).type) {
          case Community.type.value:
            return getCommunityEditRolesRoute(dso.id);
          case Collection.type.value:
            return getCollectionEditRolesRoute(dso.id);
        }
      }),
    );
  }
}
