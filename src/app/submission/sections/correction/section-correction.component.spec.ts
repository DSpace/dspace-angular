import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { mockSubmissionCollectionId, mockSubmissionId } from '../../../shared/mocks/submission.mock';
import { SubmissionSectionCorrectionComponent } from './section-correction.component';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { SubmissionSectionLicenseComponent } from '../license/section-license.component';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsType } from '../sections-type';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SectionsService } from '../sections.service';
import { OperationType } from '../../../core/submission/models/workspaceitem-section-correction.model';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const sectionObject: SectionDataObject = {
  config: 'https://dspace7.4science.it/or2018/api/config/submissionforms/license',
  mandatory: true,
  opened: true,
  data: {
    metadata: [
      {
        metadata: 'dc.issued.date',
        newValues: ['2020-06-25'],
        oldValues: ['2020-06-15'],
        label: 'Date Of Issued'
      },
      {
        metadata: 'dc.subject',
        newValues: ['key3'],
        oldValues: ['key1','key2'],
        label: 'Subject Keywords'
      },
      {
        metadata: 'dc.title',
        newValues: ['new title'],
        oldValues: [],
        label: 'Title'
      },
      {
        metadata: 'dc.type',
        oldValues: ['Text'],
        newValues: ['Book'],
        label: 'Type'
      }
    ],
    bitstream:[
      {
        filename: 'filename.pdf',
        operationType: OperationType.MODIFY,
        metadata: [
          {
            metadata: 'dc.title',
            newValues: ['Current Title'],
            oldValues: ['Previous Title'],
            label: 'Title'
          },
          {
            metadata: 'dc.description',
            newValues: ['Current Description'],
            oldValues: ['Previous Description'],
            label: 'Description'
          }
        ],
        policies: [
          {
            newValue: 'openaccess',
            oldValue: 'administrator',
            label: 'Access condition type'
          }
        ]
      }
    ]
  },
  errorsToShow: [],
  serverValidationErrors: [],
  header: 'submit.progressbar.describe.license',
  id: 'license',
  sectionType: SectionsType.License,
  sectionVisibility: null
};
const submissionId = mockSubmissionId;
const collectionId = mockSubmissionCollectionId;

describe('CorrectionComponent', () => {
  let component: SubmissionSectionCorrectionComponent;
  let fixture: ComponentFixture<SubmissionSectionCorrectionComponent>;
  let sectionsService: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AlertComponent,
        SubmissionSectionCorrectionComponent
      ],
      providers: [
        {provide: SectionsService, useClass: SectionsServiceStub},
        {provide: 'collectionIdProvider', useValue: collectionId},
        {provide: 'sectionDataProvider', useValue: sectionObject},
        {provide: 'submissionIdProvider', useValue: submissionId},
        ChangeDetectorRef,
        FormBuilderService,
        SubmissionSectionLicenseComponent
      ],
    })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SubmissionSectionCorrectionComponent);
    component = fixture.componentInstance;
    sectionsService = TestBed.inject(SectionsService);
    sectionsService.getSectionData.and.returnValue(of(sectionObject.data));
    fixture.detectChanges();
  }));

  it('should create correction component', () => {
    expect(component).toBeTruthy();
  });

  it('should contains a new date of issued on the firts row', () => {
    const tableElement: DebugElement = fixture.debugElement.query(By.css('.correction-item-table'));
    const table = tableElement.nativeElement;
    expect(table.innerHTML).toBeDefined();
    const rows: DebugElement[] = tableElement.queryAll(By.css('.correction-row'));
    expect(rows.length).toEqual(4);
    // check on dc.issued.date
    const cells: DebugElement[] = rows[0].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toContain('Date Of Issued');
    expect(cells[1].nativeElement.innerHTML).toContain('2020-06-15');
    expect(cells[2].nativeElement.innerHTML).toContain('2020-06-25');

  });
  it('should contains the new keyword on the second row', () => {
    const tableElement: DebugElement = fixture.debugElement.query(By.css('.correction-item-table'));
    const table = tableElement.nativeElement;
    expect(table.innerHTML).toBeDefined();
    const rows: DebugElement[] = tableElement.queryAll(By.css('.correction-row'));
    expect(rows.length).toEqual(4);
    // check on dc.subject
    const cells = rows[1].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toContain('Subject Keywords');
    expect(cells[1].nativeElement.innerHTML).toContain('key1');
    expect(cells[1].nativeElement.innerHTML).toContain('key2');
    expect(cells[2].nativeElement.innerHTML).toContain('key3');
  });
  it('should contains the new title on the thirtd row', () => {
    const tableElement: DebugElement = fixture.debugElement.query(By.css('.correction-item-table'));
    const table = tableElement.nativeElement;
    expect(table.innerHTML).toBeDefined();
    const rows: DebugElement[] = tableElement.queryAll(By.css('.correction-row'));
    expect(rows.length).toEqual(4);
    // check on dc.subject
    // check on dc.title
    const cells = rows[2].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toContain('Title');
    expect(cells[1].nativeElement.innerHTML).toContain('-');
    expect(cells[2].nativeElement.innerHTML).toContain('new title');

  });
  it('should contains the new type on the fourth row', () => {
    const tableElement: DebugElement = fixture.debugElement.query(By.css('.correction-item-table'));
    const table = tableElement.nativeElement;
    expect(table.innerHTML).toBeDefined();
    const rows: DebugElement[] = tableElement.queryAll(By.css('.correction-row'));
    expect(rows.length).toEqual(4);
    // check on dc.title
    const cells = rows[3].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toContain('Type');
    expect(cells[1].nativeElement.innerHTML).toContain('Text');
    expect(cells[2].nativeElement.innerHTML).toContain('Book');

  });
  it('should contains the bitstream table', () => {
    let tableElement: DebugElement = fixture.debugElement.query(By.css('.correction-bitstream-table'));
    const tableTitle = tableElement.nativeElement;
    expect(tableTitle.innerHTML).toBeDefined();

    tableElement = fixture.debugElement.query(By.css('.correction-bitstream-metadata-table'));
    const tableMetadata = tableElement.nativeElement;

    expect(tableMetadata.innerHTML).toBeDefined();
    let rows: DebugElement[] = tableElement.queryAll(By.css('.correction-row'));
    expect(rows.length).toEqual(2);
    // check bitstream metadata
    let cells = rows[0].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toContain('Title (dc.title)');
    expect(cells[1].nativeElement.innerHTML).toContain('Previous Title');
    expect(cells[2].nativeElement.innerHTML).toContain('Current Title');

    cells = rows[1].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toContain('Description (dc.description)');
    expect(cells[1].nativeElement.innerHTML).toContain('Previous Description');
    expect(cells[2].nativeElement.innerHTML).toContain('Current Description');

    tableElement = fixture.debugElement.query(By.css('.correction-bitstream-policies-table'));
    const tablePolicies = tableElement.nativeElement;
    expect(tablePolicies.innerHTML).toBeDefined();

    rows = tableElement.queryAll(By.css('.correction-row'));
    expect(rows.length).toEqual(1);

    cells = rows[0].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toContain('Access condition type');
    expect(cells[1].nativeElement.innerHTML).toContain('administrator');
    expect(cells[2].nativeElement.innerHTML).toContain('openaccess');

  });
});
