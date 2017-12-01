import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {SectionModelComponent} from '../section.model';
import {hasValue, isNotUndefined, isUndefined} from '../../../shared/empty.util';
import {SectionUploadService} from './section-upload.service';
import {SectionStatusChangeAction} from '../../objects/submission-objects.actions';
import {SubmissionState} from '../../submission.reducers';
import {CollectionDataService} from '../../../core/data/collection-data.service';
import {GroupEpersonService} from '../../../core/eperson/group-eperson.service';
import {SubmissionUploadsConfigService} from '../../../core/config/submission-uploads-config.service';
import {SubmissionUploadsModel} from '../../../core/shared/config/config-submission-uploads.model';

export const PolicyBannerType = {
  POLICY_NO_DEFAULT: 0, // No Banner
  POLICY_DEFAULT_NO_LIST: 1, // Banner1
  POLICY_DEFAULT_WITH_LIST: 2 // Banner2
}

@Component({
  selector: 'ds-submission-section-files',
  styleUrls: ['./section-upload.component.scss'],
  templateUrl: './section-upload.component.html',
})

export class FilesSectionComponent extends SectionModelComponent {
  public static readonly POLICY_DEFAULT_NO_LIST = 1; // Banner1
  public bitstreamsKeys = [];
  public bitstreamsIndexes = [];
  public bitstreamsList;

  public collectionName;
  public availablePolicies = [];  // List of policies that an user can select
  public collectionPolicies = []; // Default policies of this collection
  public collectionPoliciesMessageType = PolicyBannerType.POLICY_NO_DEFAULT; // Selector for banner policy

  protected subs = [];

  constructor(private bitstreamService: SectionUploadService,
              private collectionDataService: CollectionDataService,
              private groupService: GroupEpersonService,
              private store:Store<SubmissionState>,
              private uploadsConfigService: SubmissionUploadsConfigService,) {
    super();
  }

  ngOnInit() {
    this.subs.push(
      this.collectionDataService.findById(this.sectionData.collectionId)
        .filter((collectionData) => isNotUndefined((collectionData.payload)))
        .subscribe((collectionData) => {
          console.log(collectionData);
          this.collectionName = collectionData.payload.name;

          // Default Access Conditions
          collectionData.payload.defaultAccessConditions
            .filter((accessConditions) => isNotUndefined((accessConditions.payload)))
            .take(1)
            .subscribe((accessConditions) => {

              let payload = accessConditions.payload;
              if (! (accessConditions.payload instanceof Array)) {
                payload = [];
                payload.push(accessConditions.payload);
              }
              payload.forEach((condition) => {
                this.collectionPolicies.push(condition);
                this.availablePolicies.length > 0 ?
                  this.collectionPoliciesMessageType = PolicyBannerType.POLICY_DEFAULT_WITH_LIST
                  : this.collectionPoliciesMessageType = PolicyBannerType.POLICY_DEFAULT_NO_LIST;
              });

              // Edit Form Configuration, access policy list
              this.uploadsConfigService.getConfigByHref(this.sectionData.config)
                .flatMap((config) => config.payload)
                .take(1)
                .subscribe((config: SubmissionUploadsModel) => {
                  this.availablePolicies = config.accessConditionOptions;

                  this.collectionPolicies.length > 0 ?
                    this.collectionPoliciesMessageType = PolicyBannerType.POLICY_DEFAULT_WITH_LIST
                    : this.collectionPoliciesMessageType = PolicyBannerType.POLICY_NO_DEFAULT;
                });

            });
        })
      ,
      this.bitstreamService
        .getUploadedFileList(this.sectionData.submissionId, this.sectionData.id)
        .subscribe((bitstreamList) => {
            let sectionStatus = false;
            this.bitstreamsList = bitstreamList;
            this.bitstreamsKeys = [];
            this.bitstreamsIndexes = [];
            if (isNotUndefined(this.bitstreamsList) && Object.keys(bitstreamList).length > 0) {
              this.bitstreamsKeys = Object.keys(bitstreamList);
              sectionStatus = true;
            }
            this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId,
              this.sectionData.id,
              sectionStatus));
          }
        )
    );
  }

  // protected buildBitsreamEditForm(config:SubmissionUploadsModel) {
  //   this.formModel = Object.create(BITSTREAM_METADATA_FORM_MODEL);
  //   const accessConditionTypeModel = Object.create(BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG);
  //   const accessConditionsArrayConfig = Object.create(BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG);
  //   const accessConditionTypeOptions = [];
  //   this.accessConditionTypeOptions = config.accessConditionOptions;
  //
  //   if (config.accessConditionOptions.length > 0) {
  //     for (const accessPolicy of config.accessConditionOptions) {
  //       accessConditionTypeOptions.push(
  //         {
  //           label: accessPolicy.name,
  //           value: accessPolicy.name
  //         }
  //       );
  //       if (!isUndefined(accessPolicy.groupUUID)) {
  //         this.subscriptions.push(
  //           this.groupEpersonService.getDataByUuid(accessPolicy.groupUUID)
  //             .take(1)
  //             .flatMap((group) => group.payload)
  //             .subscribe((group) => {
  //                 if (group.groups.length > 0 && isUndefined(this.accessConditionGroups[group.uuid])) {
  //                   let groupArrayData;
  //                   for (const groupData of group.groups) {
  //                     groupArrayData = { name: groupData.name, uuid: groupData.uuid };
  //                   }
  //                   this.accessConditionGroups[group.uuid] = groupArrayData;
  //                 } else {
  //                   this.accessConditionGroups[group.uuid] = { name: group.name, uuid: group.uuid };
  //                 }
  //               }
  //             )
  //         );
  //       }
  //     }
  //     accessConditionTypeModel.options = accessConditionTypeOptions;
  //
  //     accessConditionsArrayConfig.groupFactory = () => {
  //       const type = new DynamicSelectModel(accessConditionTypeModel, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS);
  //       const startDate = new DynamicDatePickerModel(BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS);
  //       const endDate = new DynamicDatePickerModel(BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS);
  //       const group = new DynamicInputModel(BITSTREAM_FORM_ACCESS_CONDITION_HIDDEN_GROUP_CONFIG);
  //       const groups = new DynamicSelectModel(BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS);
  //       return [type, startDate, endDate, group, groups];
  //     };
  //     formModel.push(
  //       new DynamicFormArrayModel(accessConditionsArrayConfig, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS)
  //     );
  //   }
  //   return formModel;
  // }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
