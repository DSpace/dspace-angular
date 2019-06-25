import { ChangeDetectorRef, Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormService } from '../../../shared/form/form.service';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SubmissionService } from '../../submission.service';
import { SectionsService } from '../sections.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';

/**
 * This component represents a section that contains a Form.
 */
@Component({
  selector: 'ds-submission-section-relationships',
  styleUrls: ['./section-relationships.component.scss'],
  templateUrl: './section-relationships.component.html',
})
@renderSectionFor(SectionsType.Relationships)
export class SubmissionSectionRelationshipComponent extends SectionModelComponent {
  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected collectionDataService: CollectionDataService,
              protected formBuilderService: FormBuilderService,
              protected formService: FormService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  protected getSectionStatus(): Observable<boolean> {
    return undefined;
  }

  protected onSectionDestroy(): void {
  }

  protected onSectionInit(): void {
  }

}
