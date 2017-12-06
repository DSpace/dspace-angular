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

@Component({
  selector: 'ds-submission-section-files',
  styleUrls: ['./section-upload.component.scss'],
  templateUrl: './section-upload.component.html',
})

export class FilesSectionComponent extends SectionModelComponent {

  public bitstreamsKeys = [];
  public bitstreamsIndexes = [];
  public bitstreamsList;

  public collectionName;
  public collectionPolicies = []; // Default policies of this collection

  readonly POLICY_NO_DEFAULT = 0; // No Banner
  readonly POLICY_DEFAULT_NO_LIST = 1; // Banner1
  readonly POLICY_DEFAULT_WITH_LIST = 2; // Banner2
  public collectionPoliciesMessageType = this.POLICY_NO_DEFAULT; // Selector for banner policy

  public availablePolicies = [];  // List of policies that an user can select
  protected policiesGroups = []; // Groups for any policy

  protected subs = [];

  constructor(private bitstreamService: SectionUploadService,
              private collectionDataService: CollectionDataService,
              private groupService: GroupEpersonService,
              private store:Store<SubmissionState>,
              private uploadsConfigService: SubmissionUploadsConfigService,
              private groupEpersonService: GroupEpersonService,
              ) {
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
                  this.collectionPoliciesMessageType = this.POLICY_DEFAULT_WITH_LIST
                  : this.collectionPoliciesMessageType = this.POLICY_DEFAULT_NO_LIST;
              });

              // Edit Form Configuration, access policy list
              this.uploadsConfigService.getConfigByHref(this.sectionData.config)
                .flatMap((config) => config.payload)
                .take(1)
                .subscribe((config: SubmissionUploadsModel) => {
                  this.availablePolicies = Object.create(config.accessConditionOptions);

                  this.collectionPolicies.length > 0 ?
                    this.collectionPoliciesMessageType = this.POLICY_DEFAULT_WITH_LIST
                    : this.collectionPoliciesMessageType = this.POLICY_NO_DEFAULT;

                  // Retrieve Groups for accessConditionPolicies
                  this.availablePolicies.forEach( (accessCondition, index) => {
                    if (accessCondition.hasEndDate === true || accessCondition.hasStartDate === true) {
                      this.policiesGroups.push(
                        this.groupEpersonService.getDataByUuid(accessCondition.groupUUID)
                          .take(1)
                          .flatMap((group) => group.payload)
                          .subscribe((group) => {
                              if (group.groups.length > 0 && isUndefined(this.policiesGroups[group.uuid])) {
                                const groupArrayData = [];
                                for (const groupData of group.groups) {
                                  groupArrayData.push({ name: groupData.name, uuid: groupData.uuid });
                                }
                                this.policiesGroups[group.uuid] = groupArrayData;
                                // const myAccessCondition = Object.assign(accessCondition, {groups: groupArrayData}); // Object.create(accessCondition) as MyAccessConditionOption;
                                // // myAccessCondition.groups = groupArrayData;
                                // this.availablePolicies[index] = Object.assign(this.availablePolicies[index], myAccessCondition);
                              } else {
                                this.policiesGroups[group.uuid] = { name: group.name, uuid: group.uuid };
                                // this.availablePolicies[index].groups = { name: group.name, uuid: group.uuid };
                              }
                            }
                          )
                      );
                    }
                  })
                });
            });
        })
      ,
      this.bitstreamService
        .getUploadedFileList(this.sectionData.submissionId, this.sectionData.id)
        .distinctUntilChanged()
        .subscribe((bitstreamList) => {
            let sectionStatus = false;
            this.bitstreamsList = bitstreamList;
            this.bitstreamsKeys = [];
            // this.bitstreamsIndexes = [];
            if (isNotUndefined(this.bitstreamsList) && Object.keys(bitstreamList).length > 0) {
              const keys = Object.keys(bitstreamList);
              keys.forEach((key) => {
                let field2 = '';
                if (bitstreamList[key].metadata.size > 1) {
                  field2 = bitstreamList[key].metadata[1].value;
                }

                // dc.title
                let field1 = '';
                if (isNotUndefined(bitstreamList[key].metadata['dc.title'])) {
                  // Case /edit
                  field1 = bitstreamList[key].metadata['dc.title'][0].value;
                } else {
                  // Case /submit
                  field1 = bitstreamList[key].metadata[0].value;
                }

                this.bitstreamsKeys.push({
                  key: key,
                  // TODO  bitstreamList[key].metadata['dc.title'][0].value,
                  field1: field1,
                  field2: field2
                });
              });

              sectionStatus = true;
            }
            this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId,
              this.sectionData.id,
              sectionStatus));
          }
        )
    );
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
