import { CommunityFormComponent } from './community-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  DynamicFormService,
  DynamicInputControlModel,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';
import { Community } from '../../core/shared/community.model';
import { ResourceType } from '../../core/shared/resource-type';

fdescribe('CommunityFormComponent', () => {
  let comp: CommunityFormComponent;
  let fixture: ComponentFixture<CommunityFormComponent>;
  let location: Location;
  const formServiceStub: any = {
    createFormGroup: (formModel: DynamicFormControlModel[]) => {
      const controls = {};
      formModel.forEach((controlModel) => {
        controls[controlModel.id] = new FormControl((controlModel as any).value);
      });
      return new FormGroup(controls);
    }
  };
  const titleMD = { key: 'dc.title', value: 'Community Title' };
  const randomMD = { key: 'dc.random', value: 'Random metadata excluded from form' };
  const abstractMD = { key: 'dc.description.abstract', value: 'Community description' };
  const newTitleMD = { key: 'dc.title', value: 'New Community Title' };
  const formModel = [
    new DynamicInputModel({
      id: 'title',
      name: newTitleMD.key,
      value: newTitleMD.value
    }),
    new DynamicInputModel({
      id: 'abstract',
      name: abstractMD.key,
      value: abstractMD.value
    })
  ];

  /* tslint:disable:no-empty */
  const locationStub = {
    back: () => {
    }
  };
  /* tslint:enable:no-empty */

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CommunityFormComponent],
      providers: [
        { provide: Location, useValue: locationStub },
        { provide: DynamicFormService, useValue: formServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityFormComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    location = (comp as any).location;
    comp.formModel = formModel;
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(comp.submitForm, 'emit');
    });

    it('should update emit the new version of the community', () => {
      comp.community = Object.assign(
        new Community(),
        {
          metadata: [
            titleMD,
            randomMD
          ]
        }
      );

      comp.onSubmit();

      expect(comp.submitForm.emit).toHaveBeenCalledWith(
        Object.assign(
          {},
          new Community(),
          {
            metadata: [
              randomMD,
              newTitleMD,
              abstractMD
            ],
            type: ResourceType.Community
          },
        )
      );
    })
  });
});
