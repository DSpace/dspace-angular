import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MetadataField } from '../../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../../shared/form/form.component';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { RegistryServiceStub } from '../../../../shared/testing/registry.service.stub';
import { EnumKeysPipe } from '../../../../shared/utils/enum-keys-pipe';
import { MetadataFieldFormComponent } from './metadata-field-form.component';

describe('MetadataFieldFormComponent', () => {
  let component: MetadataFieldFormComponent;
  let fixture: ComponentFixture<MetadataFieldFormComponent>;

  let registryService: RegistryServiceStub;

  const metadataSchema = Object.assign(new MetadataSchema(), {
    id: 1,
    namespace: 'fake schema',
    prefix: 'fake',
  });

  beforeEach(waitForAsync(() => {
    registryService = new RegistryServiceStub();

    return TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, MetadataFieldFormComponent, EnumKeysPipe],
      providers: [
        { provide: RegistryService, useValue: registryService },
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(MetadataFieldFormComponent, {
        remove: { imports: [FormComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataFieldFormComponent);
    component = fixture.componentInstance;
    component.metadataSchema = metadataSchema;
    fixture.detectChanges();
  });

  beforeEach(inject([RegistryService], (s) => {
    registryService = s;
  }));

  afterEach(() => {
    component = null;
    registryService = null;
  });

  describe('when submitting the form', () => {
    const element = 'fakeElement';
    const qualifier = 'fakeQualifier';
    const scopeNote = 'fakeScopeNote';

    const expected = Object.assign(new MetadataField(), {
      element: element,
      qualifier: qualifier,
      scopeNote: scopeNote,
    });

    beforeEach(() => {
      spyOn(component.submitForm, 'emit');
      component.element.value = element;
      component.qualifier.value = qualifier;
      component.scopeNote.value = scopeNote;
    });

    describe('without an active field', () => {
      beforeEach(() => {
        spyOn(registryService, 'getActiveMetadataField').and.returnValue(of(undefined));
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit a new field using the correct values', async () => {
        await fixture.whenStable();
        expect(component.submitForm.emit).toHaveBeenCalledWith(expected);
      });
    });

    describe('with an active field', () => {
      const expectedWithId = Object.assign(new MetadataField(), {
        id: 1,
        schema: metadataSchema,
        element: element,
        qualifier: qualifier,
        scopeNote: scopeNote,
      });

      beforeEach(() => {
        spyOn(registryService, 'getActiveMetadataField').and.returnValue(of(expectedWithId));
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should edit the existing field using the correct values', async () => {
        await fixture.whenStable();
        expect(component.submitForm.emit).toHaveBeenCalledWith(expectedWithId);
      });
    });
  });
});
