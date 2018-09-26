import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SectionModelComponent } from '../models/section.model';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { SectionUploadService } from './section-upload.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { SubmissionState } from '../../submission.reducers';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { GroupEpersonService } from '../../../core/eperson/group-eperson.service';
import { SubmissionUploadsConfigService } from '../../../core/config/submission-uploads-config.service';
import { SubmissionUploadsModel } from '../../../core/shared/config/config-submission-uploads.model';
import { Observable } from 'rxjs/Observable';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { submissionObjectFromIdSelector } from '../../selectors';
import { SubmissionObjectEntry } from '../../objects/submission-objects.reducer';
import { AlertType } from '../../../shared/alerts/aletrs-type';
import { RemoteData } from '../../../core/data/remote-data';
import { Group } from '../../../core/eperson/models/group.model';

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

  public configMetadataForm: SubmissionFormsModel;

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
              private store: Store<SubmissionState>,
              private uploadsConfigService: SubmissionUploadsConfigService,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(undefined, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {
    this.subs.push(
      this.store.select(submissionObjectFromIdSelector(this.submissionId))
        .filter((submissionObject: SubmissionObjectEntry) => isNotUndefined(submissionObject) && !submissionObject.isLoading)
        .filter((submissionObject: SubmissionObjectEntry) => isUndefined(this.collectionId) || this.collectionId !== submissionObject.collection)
        .subscribe((submissionObject: SubmissionObjectEntry) => {
          this.collectionId = submissionObject.collection;
          this.collectionDataService.findById(this.collectionId)
            .filter((collectionData) => isNotUndefined((collectionData.payload)))
            .take(1)
            .subscribe((collectionData) => {
              this.collectionName = collectionData.payload.name;

              console.log(collectionData.payload.defaultAccessConditions);
              const defaultAccessConditions$ = collectionData.payload.defaultAccessConditions
                || Observable.of(
                  new RemoteData(
                    false,
                    false,
                    true,
                    undefined,
                    undefined
                  ));

              // Default Access Conditions
              this.subs.push(defaultAccessConditions$
                .filter((accessConditions) => isNotUndefined((accessConditions.payload)))
                .take(1)
                .subscribe((defaultAccessConditions) => {

                  if (isNotEmpty(defaultAccessConditions.payload)) {
                    this.collectionDefaultAccessConditions = Array.isArray(defaultAccessConditions.payload)
                      ? defaultAccessConditions.payload : [defaultAccessConditions.payload];
                  }

                  // Edit Form Configuration, access policy list
                  this.subs.push(this.uploadsConfigService.getConfigByHref(this.sectionData.config)
                    .flatMap((config) => config.payload)
                    .take(1)
                    .subscribe((config: SubmissionUploadsModel) => {
                      this.availableAccessConditionOptions = isNotEmpty(config.accessConditionOptions) ? config.accessConditionOptions : [];

                      this.configMetadataForm = config.metadata[0];
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
      this.bitstreamService
        .getUploadedFileList(this.submissionId, this.sectionData.id)
        .filter((bitstreamList) => isNotUndefined(bitstreamList))
        .distinctUntilChanged()
        .subscribe((fileList: any[]) => {
            let sectionStatus = false;
            this.fileList = [];
            this.fileIndexes = [];
            this.fileNames = [];
            this.changeDetectorRef.detectChanges();
            if (isNotUndefined(fileList) && fileList.length > 0) {
              fileList.forEach((file) => {
                this.fileList.push(file);
                this.fileIndexes.push(file.uuid);
                this.fileNames.push(this.getFileName(file));
              });
              sectionStatus = true;
            }
            this.store.dispatch(new SectionStatusChangeAction(this.submissionId,
              this.sectionData.id,
              sectionStatus));
            this.changeDetectorRef.detectChanges();
          }
        )
    );
  }

  private getFileName(fileData: any): string {
    const metadataName: string = this.configMetadataForm.rows[0].fields[0].selectableMetadata[0].metadata;
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
