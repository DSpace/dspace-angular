import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { SectionModelComponent } from '../models/section.model';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { SectionUploadService } from './section-upload.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { GroupEpersonService } from '../../../core/eperson/group-eperson.service';
import { SubmissionUploadsConfigService } from '../../../core/config/submission-uploads-config.service';
import { SubmissionUploadsModel } from '../../../core/shared/config/config-submission-uploads.model';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionObjectEntry } from '../../objects/submission-objects.reducer';
import { AlertType } from '../../../shared/alerts/aletrs-type';
import { RemoteData } from '../../../core/data/remote-data';
import { Group } from '../../../core/eperson/models/group.model';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';

export const POLICY_DEFAULT_NO_LIST = 1; // Banner1
export const POLICY_DEFAULT_WITH_LIST = 2; // Banner2

@Component({
  selector: 'ds-submission-section-upload',
  styleUrls: ['./section-upload.component.scss'],
  templateUrl: './section-upload.component.html',
})
@renderSectionFor(SectionsType.Upload)
export class UploadSectionComponent extends SectionModelComponent implements OnInit {

  public AlertTypeEnum = AlertType;
  public fileIndexes = [];
  public fileList = [];
  public fileNames = [];

  public collectionName: string;

  /*
   * Default access conditions of this collection
   */
  public collectionDefaultAccessConditions: any[] = [];

  /*
   * The collection access conditions policy
   */
  public collectionPolicyType;

  public configMetadataForm$: Observable<SubmissionFormsModel>;

  /*
   * List of available access conditions that could be setted to files
   */
  public availableAccessConditionOptions: any[];  // List of accessConditions that an user can select

  /*
   * List of Groups available for every access condition
   */
  protected availableGroups: Map<string, any>; // Groups for any policy

  protected subs = [];

  constructor(private bitstreamService: SectionUploadService,
              private changeDetectorRef: ChangeDetectorRef,
              private collectionDataService: CollectionDataService,
              private groupService: GroupEpersonService,
              protected sectionService: SectionsService,
              private submissionService: SubmissionService,
              private uploadsConfigService: SubmissionUploadsConfigService,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(undefined, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {
    const config$ = this.uploadsConfigService.getConfigByHref(this.sectionData.config)
      .flatMap((config) => config.payload);

    this.configMetadataForm$ = config$
      .take(1)
      .map((config: SubmissionUploadsModel) => config.metadata[0]);

    this.subs.push(
      this.submissionService.getSubmissionObject(this.submissionId)
        .filter((submissionObject: SubmissionObjectEntry) => isNotUndefined(submissionObject) && !submissionObject.isLoading)
        .filter((submissionObject: SubmissionObjectEntry) => isUndefined(this.collectionId) || this.collectionId !== submissionObject.collection)
        .subscribe((submissionObject: SubmissionObjectEntry) => {
          this.collectionId = submissionObject.collection;
          this.collectionDataService.findById(this.collectionId)
            .filter((collectionData) => isNotUndefined((collectionData.payload)))
            .take(1)
            .subscribe((collectionData) => {
              this.collectionName = collectionData.payload.name;

              // Default Access Conditions
              this.subs.push(collectionData.payload.defaultAccessConditions
                .filter((accessConditions) => isNotUndefined((accessConditions.payload)))
                .take(1)
                .subscribe((defaultAccessConditions) => {

                  if (isNotEmpty(defaultAccessConditions.payload)) {
                    this.collectionDefaultAccessConditions = Array.isArray(defaultAccessConditions.payload)
                      ? defaultAccessConditions.payload : [defaultAccessConditions.payload];
                  }

                  // Edit Form Configuration, access policy list
                  this.subs.push(config$
                    .take(1)
                    .subscribe((config: SubmissionUploadsModel) => {
                      this.availableAccessConditionOptions = isNotEmpty(config.accessConditionOptions) ? config.accessConditionOptions : [];

                      this.collectionPolicyType = this.availableAccessConditionOptions.length > 0
                        ? POLICY_DEFAULT_WITH_LIST
                        : POLICY_DEFAULT_NO_LIST;

                      this.availableGroups = new Map();
                      const groupsObs = [];
                      // Retrieve Groups for accessConditionPolicies
                      this.availableAccessConditionOptions.forEach((accessCondition) => {
                        if (accessCondition.hasEndDate === true || accessCondition.hasStartDate === true) {
                          groupsObs.push(
                            this.groupService.findById(accessCondition.groupUUID)
                              .filter((rd: RemoteData<Group>) => !rd.isResponsePending && rd.hasSucceeded)
                              .take(1)
                          );
                        }
                      });
                      let obsCounter = 1;
                      Observable.forkJoin(groupsObs)
                        .flatMap((group) => group)
                        .take(groupsObs.length)
                        .subscribe((rd: RemoteData<Group>) => {
                          const group: Group = rd.payload;
                          if (isUndefined(this.availableGroups.get(group.uuid))) {
                            if (Array.isArray(group.groups)) {
                              const groupArrayData = [];
                              for (const groupData of group.groups) {
                                groupArrayData.push({name: groupData.name, uuid: groupData.uuid});
                              }
                              this.availableGroups.set(group.uuid, groupArrayData);
                            } else {
                              this.availableGroups.set(group.uuid, {name: group.name, uuid: group.uuid});
                            }
                          }
                          if (obsCounter++ === groupsObs.length) {
                            this.changeDetectorRef.detectChanges();
                          }
                        })
                    })
                  );
                })
              );
            })
        })
      ,
      Observable.combineLatest(this.configMetadataForm$,
        this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id))
        .filter(([configMetadataForm, fileList]:[SubmissionFormsModel, any[]]) => {
          return isNotEmpty(configMetadataForm) && isNotUndefined(fileList)
        })
        .distinctUntilChanged()
        .subscribe(([configMetadataForm, fileList]:[SubmissionFormsModel, any[]]) => {
            let sectionStatus = false;
            this.fileList = [];
            this.fileIndexes = [];
            this.fileNames = [];
            this.changeDetectorRef.detectChanges();
            if (isNotUndefined(fileList) && fileList.length > 0) {
              fileList.forEach((file) => {
                this.fileList.push(file);
                this.fileIndexes.push(file.uuid);
                this.fileNames.push(this.getFileName(configMetadataForm, file));
              });
              sectionStatus = true;
            }
            this.sectionService.setSectionStatus(this.submissionId, this.sectionData.id, sectionStatus);
            this.changeDetectorRef.detectChanges();
          }
        )
    );
  }

  private getFileName(configMetadataForm: SubmissionFormsModel, fileData: any): string {
    const metadataName: string = configMetadataForm.rows[0].fields[0].selectableMetadata[0].metadata;
    let title: string;
    if (isNotEmpty(fileData.metadata) && isNotEmpty(fileData.metadata[metadataName])) {
      title = fileData.metadata[metadataName][0].display;
    } else {
      title = fileData.uuid;
    }

    return title;
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
