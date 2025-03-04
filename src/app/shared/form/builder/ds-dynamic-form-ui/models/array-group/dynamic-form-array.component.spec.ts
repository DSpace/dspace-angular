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
  DYNAMIC_FORM_CONTROL_MAP_FN,
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { of } from 'rxjs';
import { LiveRegionService } from 'src/app/shared/live-region/live-region.service';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../../../../../config/app-config.interface';
import { environment } from '../../../../../../../environments/environment.test';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { getLiveRegionServiceStub } from '../../../../../live-region/live-region.service.stub';
import { DsDynamicFormControlContainerComponent } from '../../ds-dynamic-form-control-container.component';
import { dsDynamicFormControlMapFn } from '../../ds-dynamic-form-control-map-fn';
import { DynamicRowArrayModel } from '../ds-dynamic-row-array-model';
import { DsDynamicFormArrayComponent } from './dynamic-form-array.component';

describe('DsDynamicFormArrayComponent', () => {
  const translateServiceStub = {
    get: () => of('translated-text'),
    instant: () => 'translated-text',
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  let component: DsDynamicFormArrayComponent;
  let fixture: ComponentFixture<DsDynamicFormArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DsDynamicFormArrayComponent,
        NgxMaskModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        DynamicFormLayoutService,
        DynamicFormValidationService,
        provideMockStore(),
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: HttpClient, useValue: {} },
        { provide: SubmissionService, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: DYNAMIC_FORM_CONTROL_MAP_FN, useValue: dsDynamicFormControlMapFn },
        { provide: LiveRegionService, useValue: getLiveRegionServiceStub() },
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
    const dropList = fixture.debugElement.query(By.css('.cdk-drop-list')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowUp' }), dropList, 3, 1, 'up');
    fixture.detectChanges();
    expect(component.model.groups[0]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[0]);
  });

  it('should move element down and maintain focus', () => {
    const dropList = fixture.debugElement.query(By.css('.cdk-drop-list')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowDown' }), dropList, 3, 1, 'down');
    fixture.detectChanges();
    expect(component.model.groups[2]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[2]);
  });

  it('should wrap around when moving up from the first element', () => {
    const dropList = fixture.debugElement.query(By.css('.cdk-drop-list')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowUp' }), dropList, 3, 0, 'up');
    fixture.detectChanges();
    expect(component.model.groups[2]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[2]);
  });

  it('should wrap around when moving down from the last element', () => {
    const dropList = fixture.debugElement.query(By.css('.cdk-drop-list')).nativeElement;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowDown' }), dropList, 3, 2, 'down');
    fixture.detectChanges();
    expect(component.model.groups[0]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[0]);
  });

  it('should not move element if keyboard drag is not active', () => {
    const dropList = fixture.debugElement.query(By.css('.cdk-drop-list')).nativeElement;
    component.elementBeingSorted = null;
    component.handleArrowPress(new KeyboardEvent('keydown', { key: 'ArrowDown' }), dropList, 3, 1, 'down');
    fixture.detectChanges();
    expect(component.model.groups[1]).toBeDefined();
    expect(document.activeElement).toBe(dropList.querySelectorAll('[cdkDragHandle]')[2]);
  });

  it('should cancel keyboard drag and drop', () => {
    const dropList = fixture.debugElement.query(By.css('.cdk-drop-list')).nativeElement;
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
