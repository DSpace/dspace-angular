import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicFormControlModel, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Community } from '../../../core/shared/community.model';
import { ComColFormComponent } from './comcol-form.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { hasValue } from '../../empty.util';

describe('ComColFormComponent', () => {
  let comp: ComColFormComponent<DSpaceObject>;
  let fixture: ComponentFixture<ComColFormComponent<DSpaceObject>>;
  let location: Location;
  const formServiceStub: any = {
    createFormGroup: (fModel: DynamicFormControlModel[]) => {
      const controls = {};
      if (hasValue(fModel)) {
        fModel.forEach((controlModel) => {
          controls[controlModel.id] = new FormControl((controlModel as any).value);
        });
        return new FormGroup(controls);
      }
      return undefined;
    }
  };
  const dcTitle = 'dc.title';
  const dcRandom = 'dc.random';
  const dcAbstract = 'dc.description.abstract';

  const titleMD = { [dcTitle]: [ { value: 'Community Title', language: null } ] };
  const randomMD = { [dcRandom]: [ { value: 'Random metadata excluded from form', language: null } ] };
  const abstractMD = { [dcAbstract]: [ { value: 'Community description', language: null } ] };
  const newTitleMD = { [dcTitle]: [ { value: 'New Community Title', language: null } ] };
  const formModel = [
    new DynamicInputModel({
      id: 'title',
      name: dcTitle,
      value: newTitleMD[dcTitle][0].value
    }),
    new DynamicInputModel({
      id: 'abstract',
      name: dcAbstract,
      value: abstractMD[dcAbstract][0].value
    })
  ];

  /* tslint:disable:no-empty */
  const locationStub = jasmine.createSpyObj('location', ['back']);
  /* tslint:enable:no-empty */

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ComColFormComponent],
      providers: [
        { provide: Location, useValue: locationStub },
        { provide: DynamicFormService, useValue: formServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComColFormComponent);
    comp = fixture.componentInstance;
    comp.formModel = [];
    comp.dso = new Community();
    fixture.detectChanges();
    location = (comp as any).location;
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(comp.submitForm, 'emit');
      comp.formModel = formModel;
    });

    it('should emit the new version of the community', () => {
      comp.dso = Object.assign(
        new Community(),
        {
          metadata: {
            ...titleMD,
            ...randomMD
          }
        }
      );

      comp.onSubmit();

      expect(comp.submitForm.emit).toHaveBeenCalledWith(
        Object.assign(
          {},
          new Community(),
          {
            metadata: {
              ...newTitleMD,
              ...randomMD,
              ...abstractMD
            },
            type: Community.type
          },
        )
      );
    })
  });

  describe('onCancel', () => {
    it('should call the back method on the Location service', () => {
        comp.onCancel();
        expect(locationStub.back).toHaveBeenCalled();
    });
  });
});
