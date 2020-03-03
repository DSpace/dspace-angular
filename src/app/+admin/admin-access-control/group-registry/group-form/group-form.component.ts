import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Subscription } from 'rxjs/internal/Subscription';
import { take } from 'rxjs/operators';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
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

  constructor(public groupDataService: GroupDataService,
              private ePersonDataService: EPersonDataService,
              private formBuilderService: FormBuilderService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private route: ActivatedRoute,
              protected router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.setActiveGroup(params.groupId)
    });
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
        this.groupDescription
      ];
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
      this.subs.push(this.groupDataService.getActiveGroup().subscribe((group: Group) => {
        this.formGroup.patchValue({
          groupName: group != null ? group.name : '',
          groupDescription: group != null ? group.firstMetadataValue('dc.description') : '',
        });
      }));
    });
  }

  /**
   * Stop editing the currently selected group
   */
  onCancel() {
    this.groupDataService.cancelEditGroup();
    this.cancelForm.emit();
    this.router.navigate(['/admin/access-control/groups']);
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
        if (group == null) {
          this.createNewGroup(values);
        } else {
          this.editGroup(group, values);
        }
      }
    );
  }

  /**
   * Creates new Group based on given values from form
   * @param values
   */
  createNewGroup(values) {
    this.subs.push(this.groupDataService.createOrUpdateGroup(Object.assign(new Group(), values))
      .pipe(
        getSucceededRemoteData(),
        getRemoteDataPayload())
      .subscribe((group: Group) => {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.created.success', { name: group.name }));
        this.setActiveGroup(group.id);
        this.submitForm.emit(group);
      }));
  }

  /**
   * // TODO
   * @param group
   * @param values
   */
  editGroup(group: Group, values) {
    // TODO (backend)
    console.log('TODO implement editGroup', values);
    this.notificationsService.error('TODO implement editGroup (not yet implemented in backend) ');
  }

  /**
   * Start editing the selected group
   * @param group
   */
  setActiveGroup(groupId: string) {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup === null) {
        this.groupDataService.cancelEditGroup();
        this.groupDataService.findById(groupId)
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
   * Cancel the current edit when component is destroyed & unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.onCancel();
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
