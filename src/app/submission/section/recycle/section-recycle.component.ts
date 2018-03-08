import { SectionType } from '../section-type';
import { Component, Inject } from '@angular/core';
import { SectionModelComponent } from '../section.model';
import { renderSectionFor } from '../section-decorator';
import { SectionDataObject } from '../section-data.model';
import { SubmissionState } from '../../submission.reducers';
import { Store } from '@ngrx/store';
import { WorkspaceitemSectionRecycleObject } from '../../../core/submission/models/workspaceitem-section-recycle.model';

@Component({
  selector: 'ds-recycle-section',
  styleUrls: ['./section-recycle.component.scss'],
  templateUrl: './section-recycle.component.html',
})

@renderSectionFor(SectionType.Recycle)
export class RecycleSectionComponent extends SectionModelComponent {
  public isLoading = true;

  public unexpected: any[]; // FormFieldChangedObject[];
  public metadata: any[]; // FormFieldMetadataValueObject[];
  public files: any[]; // WorkspaceitemSectionUploadFileObject[];

  public data;

  constructor(protected store: Store<SubmissionState>,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {

    // JavaScript Document
    // this.sectionData.data =
    this.data = {
      unexpected: [],
      metadata: {
        'dc.type.specified': [
          {
            value: 'Meeting Abstract',
            language: 'en',
            authority: null,
            confidence: -1,
            place: 1
          }
        ],
        'dc.title': [
          {
            value: 'Detection of myocardial viability with dual dose dobutamine MRI in correlation with histological changes in chronically dysfunctional myocardium. An experimental study',
            language: 'en',
            authority: null,
            confidence: -1,
            place: 1
          }
        ]
      },
      files: [
        {
          uuid: 'c8183d95-2bce-44f2-acbc-e7a46ba3679f',
          metadata: {
            'dc.description': [
              {
                value: '',
                language: null,
                authority: null,
                confidence: -1,
                place: 0
              }
            ],
            'dc.source': [
              {
                value: '/repos/uhasselt/upload/C:\\Users\\lucp0548\\Google Drive\\Secretariaat\\Admin\\Document Server\\pdfs\\1-s2.0-S0167947312002617-main.pdf',
                language: null,
                authority: null,
                confidence: -1,
                place: 0
              }
            ],
            'dc.title': [
              {
                value: '1-s2.0-S0167947312002617-main.pdf',
                language: null,
                authority: null,
                confidence: -1,
                place: 0
              }
            ]
          },
          accessConditions: [],
          format: {
            id: 3,
            shortDescription: 'Adobe PDF',
            description: 'Adobe Portable Document Format',
            mimetype: 'application/pdf',
            supportLevel: 0,
            internal: false,
            extensions: null,
            type: 'bitstreamformat'
          },
          sizeBytes: 494089,
          checkSum: {
            checkSumAlgorithm: 'MD5',
            value: 'd033bc9bf87cfae19fad1ef228b7f8ed'
          },
          url: 'http://hasselt-dspace.dev01.4science.it/api/core/bitstreams/c8183d95-2bce-44f2-acbc-e7a46ba3679f/content'
        }
      ]
    };

    // this.unexpected = (this.sectionData.data as WorkspaceitemSectionRecycleObject).unexpected;
    // this.metadata = (this.sectionData.data as WorkspaceitemSectionRecycleObject).metadata;
    // this.files = (this.sectionData.data as WorkspaceitemSectionRecycleObject).files;

    this.unexpected = (this.data as WorkspaceitemSectionRecycleObject).unexpected;
    this.metadata = (this.data as WorkspaceitemSectionRecycleObject).metadata;
    this.files = (this.data as WorkspaceitemSectionRecycleObject).files;

    this.isLoading = false;
  }

}
