import { ChangeDetectorRef, Component, Inject } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, find, flatMap, map, reduce, take, tap } from 'rxjs/operators';

import { SectionModelComponent } from '../models/section.model';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { SectionUploadService } from './section-upload.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { GroupEpersonService } from '../../../core/eperson/group-eperson.service';
import { SubmissionUploadsConfigService } from '../../../core/config/submission-uploads-config.service';
import { SubmissionUploadsModel } from '../../../core/config/models/config-submission-uploads.model';
import { SubmissionFormsModel } from '../../../core/config/models/config-submission-forms.model';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionObjectEntry } from '../../objects/submission-objects.reducer';
import { AlertType } from '../../../shared/alerts/aletrs-type';
import { RemoteData } from '../../../core/data/remote-data';
import { Group } from '../../../core/eperson/models/group.model';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';
import { Collection } from '../../../core/shared/collection.model';
import { ResourcePolicy } from '../../../core/shared/resource-policy.model';
import { AccessConditionOption } from '../../../core/config/models/config-access-condition-option.model';
import { PaginatedList } from '../../../core/data/paginated-list';

export const POLICY_DEFAULT_NO_LIST = 1; // Banner1
export const POLICY_DEFAULT_WITH_LIST = 2; // Banner2

export interface AccessConditionGroupsMapEntry {
  accessCondition: string;
  groups: Group[]
}

@Component({
  selector: 'ds-submission-section-upload',
  styleUrls: ['./section-upload.component.scss'],
  templateUrl: './section-upload.component.html',
})
@renderSectionFor(SectionsType.Upload)
export class UploadSectionComponent extends SectionModelComponent {

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
  public availableAccessConditionOptions: AccessConditionOption[];  // List of accessConditions that an user can select

  /*
   * List of Groups available for every access condition
   */
  protected availableGroups: Map<string, Group[]>; // Groups for any policy

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

  onSectionInit() {
    const config$ = this.uploadsConfigService.getConfigByHref(this.sectionData.config).pipe(
      map((config) => config.payload));

    this.configMetadataForm$ = config$.pipe(
      take(1),
      map((config: SubmissionUploadsModel) => config.metadata));

    this.subs.push(
      this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter((submissionObject: SubmissionObjectEntry) => isNotUndefined(submissionObject) && !submissionObject.isLoading),
        filter((submissionObject: SubmissionObjectEntry) => isUndefined(this.collectionId) || this.collectionId !== submissionObject.collection),
        tap((submissionObject: SubmissionObjectEntry) => this.collectionId = submissionObject.collection),
        flatMap((submissionObject: SubmissionObjectEntry) => this.collectionDataService.findById(submissionObject.collection)),
        find((rd: RemoteData<Collection>) => isNotUndefined((rd.payload))),
        tap((collectionRemoteData: RemoteData<Collection>) => this.collectionName = collectionRemoteData.payload.name),
        flatMap((collectionRemoteData: RemoteData<Collection>) => {
          return this.collectionDataService.findByHref(
            (collectionRemoteData.payload as any)._links.defaultAccessConditions
          );
        }),
        find((defaultAccessConditionsRemoteData: RemoteData<ResourcePolicy>) =>
          defaultAccessConditionsRemoteData.hasSucceeded),
        tap((defaultAccessConditionsRemoteData: RemoteData<ResourcePolicy>) => {
          if (isNotEmpty(defaultAccessConditionsRemoteData.payload)) {
            this.collectionDefaultAccessConditions = Array.isArray(defaultAccessConditionsRemoteData.payload)
              ? defaultAccessConditionsRemoteData.payload : [defaultAccessConditionsRemoteData.payload];
          }
        }),
        flatMap(() => config$),
        take(1),
        flatMap((config: SubmissionUploadsModel) => {
          this.availableAccessConditionOptions = isNotEmpty(config.accessConditionOptions) ? config.accessConditionOptions : [];

          this.collectionPolicyType = this.availableAccessConditionOptions.length > 0
            ? POLICY_DEFAULT_WITH_LIST
            : POLICY_DEFAULT_NO_LIST;

          this.availableGroups = new Map();
          const mapGroups$: Array<Observable<AccessConditionGroupsMapEntry>> = [];
          // Retrieve Groups for accessConditionPolicies
          this.availableAccessConditionOptions.forEach((accessCondition: AccessConditionOption) => {
            if (accessCondition.hasEndDate === true || accessCondition.hasStartDate === true) {
              if (accessCondition.groupUUID) {
                mapGroups$.push(
                  this.groupService.findById(accessCondition.groupUUID).pipe(
                    find((rd: RemoteData<Group>) => !rd.isResponsePending && rd.hasSucceeded),
                    map((rd: RemoteData<Group>) => ({
                      accessCondition: accessCondition.name,
                      groups: [rd.payload]
                    } as AccessConditionGroupsMapEntry)))
                );
              } else if (accessCondition.selectGroupUUID) {
                mapGroups$.push(
                  this.groupService.findById(accessCondition.selectGroupUUID).pipe(
                    find((rd: RemoteData<Group>) => !rd.isResponsePending && rd.hasSucceeded),
                    tap((group: RemoteData<Group>) => console.log(group.payload.groups)),
                    flatMap((group: RemoteData<Group>) => group.payload.groups),
                    find((rd: RemoteData<PaginatedList<Group>>) => !rd.isResponsePending && rd.hasSucceeded),
                    tap((group) => console.log(group)),
                    map((rd: RemoteData<PaginatedList<Group>>) => ({
                      accessCondition: accessCondition.name,
                      groups: rd.payload.page
                    } as AccessConditionGroupsMapEntry))
                ));
              }
            }
          });
          return mapGroups$;
        }),
        flatMap((entry) => entry),
        reduce((acc: any[], entry: AccessConditionGroupsMapEntry) => {
          acc.push(entry);
          return acc;
        }, []),
      ).subscribe((entries: AccessConditionGroupsMapEntry[]) => {
        entries.forEach((entry: AccessConditionGroupsMapEntry) => {
          this.availableGroups.set(entry.accessCondition, entry.groups);
        });
        this.changeDetectorRef.detectChanges();
      })
      ,
      combineLatest(this.configMetadataForm$,
        this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id)).pipe(
        filter(([configMetadataForm, fileList]: [SubmissionFormsModel, any[]]) => {
          return isNotEmpty(configMetadataForm) && isNotUndefined(fileList)
        }),
        distinctUntilChanged())
        .subscribe(([configMetadataForm, fileList]: [SubmissionFormsModel, any[]]) => {
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
          }

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

  protected getSectionStatus(): Observable<boolean> {
    return this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id).pipe(
      map((fileList: any[]) => (isNotUndefined(fileList) && fileList.length > 0)));
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
