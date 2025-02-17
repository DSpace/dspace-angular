import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { of } from 'rxjs';

import {
  APP_CONFIG,
} from '../../../../../../../config/app-config.interface';
import { environment } from '../../../../../../../environments/environment.test';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { DsDynamicFormControlContainerComponent } from '../../ds-dynamic-form-control-container.component';
import { DynamicRowArrayModel } from '../ds-dynamic-row-array-model';
import { DsDynamicFormArrayComponent } from './dynamic-form-array.component';
import { UUIDService } from '../../../../../../core/shared/uuid.service';
import { TranslateLoaderMock } from '../../../../../mocks/translate-loader.mock';

describe('DsDynamicFormArrayComponent', () => {
  const translateServiceStub = {
    get: () => of('translated-text'),
    instant: () => 'translated-text',
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  const uuidServiceStub = {
    generate: () => 'fake-id'
  };

  let component: DsDynamicFormArrayComponent;
  let fixture: ComponentFixture<DsDynamicFormArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DsDynamicFormArrayComponent,
      ],
      imports: [
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        DynamicFormLayoutService,
        DynamicFormValidationService,
        provideMockStore(),
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: HttpClient, useValue: {} },
        { provide: SubmissionService, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: UUIDService, useValue: uuidServiceStub },
      ],
    }).overrideComponent(DsDynamicFormArrayComponent, {
      remove: {
        imports: [DsDynamicFormControlContainerComponent],
      },
    })
      .compileComponents();
  });

  beforeEach(inject([DynamicFormService], (service: DynamicFormService) => {
    const formModel = [
      new DynamicRowArrayModel({
        id: 'testFormRowArray',
        initialCount: 5,
        notRepeatable: false,
        relationshipConfig: undefined,
        submissionId: '1234',
        isDraggable: true,
        groupFactory: () => {
          return [
            new DynamicInputModel({ id: 'testFormRowArrayGroupInput' }),
          ];
        },
        required: false,
        metadataKey: 'dc.contributor.author',
        metadataFields: ['dc.contributor.author'],
        hasSelectableMetadata: true,
        showButtons: true,
        typeBindRelations: [{ match: 'VISIBLE', operator: 'OR', when: [{ id: 'dc.type', value: 'Book' }] }],
      }),
    ];

    fixture = TestBed.createComponent(DsDynamicFormArrayComponent);
    component = fixture.componentInstance;
    component.model = formModel[0] as DynamicRowArrayModel;

    component.group = service.createFormGroup(formModel);

    fixture.detectChanges();
  }));

  it('should move element up and maintain focus', () => {
    const dropList = fixture.debugElement.query(By.css('[cdkDropList]')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowUp' }), dropList, 3, 1, 'up');
    fixture.detectChanges();
    expect(component.model.groups[0]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[0]);
  });

  it('should move element down and maintain focus', () => {
    const dropList = fixture.debugElement.query(By.css('[cdkDropList]')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowDown' }), dropList, 3, 1, 'down');
    fixture.detectChanges();
    expect(component.model.groups[2]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[2]);
  });

  it('should wrap around when moving up from the first element', () => {
    const dropList = fixture.debugElement.query(By.css('[cdkDropList]')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowUp' }), dropList, 3, 0, 'up');
    fixture.detectChanges();
    expect(component.model.groups[2]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[2]);
  });

  it('should wrap around when moving down from the last element', () => {
    const dropList = fixture.debugElement.query(By.css('[cdkDropList]')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowDown' }), dropList, 3, 2, 'down');
    fixture.detectChanges();
    expect(component.model.groups[0]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[0]);
  });

  it('should not move element if keyboard drag is not active', () => {
    const dropList = fixture.debugElement.query(By.css('[cdkDropList]')).nativeElement;
    component.elementBeingSorted = null;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowDown' }), dropList, 3, 1, 'down');
    fixture.detectChanges();
    expect(component.model.groups[1]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[2]);
  });

  it('should cancel keyboard drag and drop', () => {
    const dropList = fixture.debugElement.query(By.css('[cdkDropList]')).nativeElement;
    component.elementBeingSortedStartingIndex = 2;
    component.elementBeingSorted = dropList.querySelectorAll('[cdkDragHandle]')[2];
    component.model.moveGroup(2, 1);
    fixture.detectChanges();
    component.cancelKeyboardDragAndDrop(dropList, 1, 3);
    fixture.detectChanges();
    expect(component.elementBeingSorted).toBeNull();
    expect(component.elementBeingSortedStartingIndex).toBeNull();
  });
});
