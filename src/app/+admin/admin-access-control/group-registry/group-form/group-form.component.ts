import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Subscription } from 'rxjs/internal/Subscription';
import { switchMap, take } from 'rxjs/operators';
import { RestResponse } from '../../../../core/cache/response.models';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RequestService } from '../../../../core/data/request.service';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-group-form',
  templateUrl: './group-form.component.html'
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
  groupName: DynamicInputModel;
  groupDescription: DynamicTextAreaModel;

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
        host: 'row'
      }
    },
    groupDescription: {
      grid: {
        host: 'row'
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
   * Group currently being edited
   */
  groupBeingEdited: Group;

  /**
   * Observable whether or not the logged in user is allowed to delete the Group
   */
  canDelete$: Observable<boolean>;

  constructor(public groupDataService: GroupDataService,
              private ePersonDataService: EPersonDataService,
              private formBuilderService: FormBuilderService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private route: ActivatedRoute,
              protected router: Router,
              private authorizationService: AuthorizationDataService,
              private modalService: NgbModal,
              public requestService: RequestService) {
  }

  ngOnInit() {
    this.initialisePage();
  }

  initialisePage() {
    this.subs.push(this.route.params.subscribe((params) => {
      this.setActiveGroup(params.groupId)
    }));
    this.canDelete$ = this.groupDataService.getActiveGroup().pipe(
      switchMap((group: Group) => this.authorizationService.isAuthorized(FeatureID.CanDelete, hasValue(group) ? group.self : undefined))
    );
    combineLatest(
      this.translateService.get(`${this.messagePrefix}.groupName`),
      this.translateService.get(`${this.messagePrefix}.groupDescription`),
    ).subscribe(([groupName, groupDescription]) => {
      this.groupName = new DynamicInputModel({
        id: 'groupName',
        label: groupName,
        name: 'groupName',
        validators: {
          required: null,
        },
        required: true,
      });
      this.groupDescription = new DynamicTextAreaModel({
        id: 'groupDescription',
        label: groupDescription,
        name: 'groupDescription',
        required: false,
      });
      this.formModel = [
        this.groupName,
        this.groupDescription,
      ];
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
      this.subs.push(this.groupDataService.getActiveGroup().subscribe((activeGroup: Group) => {
        if (activeGroup != null) {
          this.groupBeingEdited = activeGroup;
          this.formGroup.patchValue({
            groupName: activeGroup != null ? activeGroup.name : '',
            groupDescription: activeGroup != null ? activeGroup.firstMetadataValue('dc.description') : '',
          });
          if (activeGroup.permanent) {
            this.formGroup.get('groupName').disable();
          }
        }
      }));
    });
  }

  /**
   * Stop editing the currently selected group
   */
  onCancel() {
    this.groupDataService.cancelEditGroup();
    this.cancelForm.emit();
    this.router.navigate([this.groupDataService.getGroupRegistryRouterLink()]);
  }

  /**
   * Submit the form
   * When the eperson has an id attached -> Edit the eperson
   * When the eperson has no id attached -> Create new eperson
   * Emit the updated/created eperson using the EventEmitter submitForm
   */
  onSubmit() {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe(
      (group: Group) => {
        const values = {
          name: this.groupName.value,
          metadata: {
            'dc.description': [
              {
                value: this.groupDescription.value
              }
            ],
          },
        };
        if (group === null) {
          this.createNewGroup(values);
        } else {
          this.editGroup(group);
        }
      }
    );
  }

  /**
   * Creates new Group based on given values from form
   * @param values
   */
  createNewGroup(values) {
    const groupToCreate = Object.assign(new Group(), values);
    const response = this.groupDataService.tryToCreate(groupToCreate);
    response.pipe(take(1)).subscribe((restResponse: RestResponse) => {
      if (restResponse.isSuccessful) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.created.success', { name: groupToCreate.name }));
        this.submitForm.emit(groupToCreate);
        const resp: any = restResponse;
        if (isNotEmpty(resp.resourceSelfLinks)) {
          const groupSelfLink = resp.resourceSelfLinks[0];
          this.setActiveGroupWithLink(groupSelfLink);
          this.groupDataService.clearGroupsRequests();
          this.router.navigateByUrl(this.groupDataService.getGroupEditPageRouterLinkWithID(this.groupDataService.getUUIDFromString(groupSelfLink)));
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
      elementsPerPage: 0
    }).pipe(getSucceededRemoteData(), getRemoteDataPayload())
      .subscribe((list: PaginatedList<Group>) => {
        if (list.totalElements > 0) {
          this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.' + notificationSection + '.failure.groupNameInUse', {
            name: group.name
          }));
        }
      }));
  }

  /**
   * Edit existing Group based on given values from form and old Group
   * @param group   Group to edit and old values contained within
   */
  editGroup(group: Group) {
    const editedGroup = Object.assign(new Group(), {
      id: group.id,
      metadata: {
        'dc.description': [
          {
            value: (hasValue(this.groupDescription.value) ? this.groupDescription.value : group.firstMetadataValue('dc.description'))
          }
        ],
      },
      name: (hasValue(this.groupName.value) ? this.groupName.value : group.name),
      _links: group._links,
    });
    const response = this.groupDataService.updateGroup(editedGroup);
    response.pipe(take(1)).subscribe((restResponse: RestResponse) => {
      if (restResponse.isSuccessful) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.edited.success', { name: editedGroup.name }));
        this.submitForm.emit(editedGroup);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.edited.failure', { name: editedGroup.name }));
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
        getSucceededRemoteData(),
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
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup === null) {
        this.groupDataService.cancelEditGroup();
        this.groupDataService.findByHref(groupSelfLink)
          .pipe(
            getSucceededRemoteData(),
            getRemoteDataPayload())
          .subscribe((group: Group) => {
            this.groupDataService.editGroup(group);
          })
      }
    });
  }

  /**
   * Deletes the Group from the Repository. The Group will be the only that this form is showing.
   * It'll either show a success or error message depending on whether the delete was successful or not.
   */
  delete() {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((group: Group) => {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = group;
      modalRef.componentInstance.headerLabel = this.messagePrefix + '.delete-group.modal.header';
      modalRef.componentInstance.infoLabel = this.messagePrefix + '.delete-group.modal.info';
      modalRef.componentInstance.cancelLabel = this.messagePrefix + '.delete-group.modal.cancel';
      modalRef.componentInstance.confirmLabel = this.messagePrefix + '.delete-group.modal.confirm';
      modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
        if (confirm) {
          if (hasValue(group.id)) {
            this.groupDataService.deleteGroup(group).pipe(take(1))
              .subscribe(([success, optionalErrorMessage]: [boolean, string]) => {
                if (success) {
                  this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.deleted.success', { name: group.name }));
                  this.reset();
                } else {
                  this.notificationsService.error(
                    this.translateService.get(this.messagePrefix + '.notification.deleted.failure.title', { name: group.name }),
                    this.translateService.get(this.messagePrefix + '.notification.deleted.failure.content', { cause: optionalErrorMessage }));
                }
              })
          }}
      });
    })
  }

  /**
   * This method will ensure that the page gets reset and that the cache is cleared
   */
  reset() {
    this.groupDataService.getBrowseEndpoint().pipe(take(1)).subscribe((href: string) => {
      this.requestService.removeByHrefSubstring(href);
    });
    this.onCancel();
  }

  /**
   * Cancel the current edit when component is destroyed & unsub all subscriptions
   */
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.onCancel();
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
