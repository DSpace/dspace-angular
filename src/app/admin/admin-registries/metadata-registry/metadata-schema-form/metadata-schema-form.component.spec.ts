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

import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../../shared/form/form.component';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { RegistryServiceStub } from '../../../../shared/testing/registry.service.stub';
import { EnumKeysPipe } from '../../../../shared/utils/enum-keys-pipe';
import { MetadataSchemaFormComponent } from './metadata-schema-form.component';

describe('MetadataSchemaFormComponent', () => {
  let component: MetadataSchemaFormComponent;
  let fixture: ComponentFixture<MetadataSchemaFormComponent>;

  let registryService: RegistryServiceStub;

  beforeEach(waitForAsync(() => {
    registryService = new RegistryServiceStub();

    return TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, MetadataSchemaFormComponent, EnumKeysPipe],
      providers: [
        { provide: RegistryService, useValue: registryService },
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(MetadataSchemaFormComponent, {
        remove: {
          imports: [FormComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataSchemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([RegistryService], (s) => {
    registryService = s;
  }));

  describe('when submitting the form', () => {
    const namespace = 'fake namespace';
    const prefix = 'fake';

    const expected = Object.assign(new MetadataSchema(), {
      namespace: namespace,
      prefix: prefix,
    } as MetadataSchema);

    beforeEach(() => {
      spyOn(component.submitForm, 'emit');
      component.name.value = prefix;
      component.namespace.value = namespace;
    });

    describe('without an active schema', () => {
      beforeEach(() => {
        component.activeMetadataSchema$ = of(undefined);
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit a new schema using the correct values', async () => {
        await fixture.whenStable();
        expect(component.submitForm.emit).toHaveBeenCalledWith(expected);
      });
    });

    describe('with an active schema', () => {
      const expectedWithId = Object.assign(new MetadataSchema(), {
        id: 1,
        namespace: namespace,
        prefix: prefix,
      } as MetadataSchema);

      beforeEach(() => {
        component.activeMetadataSchema$ = of(expectedWithId);
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should edit the existing schema using the correct values', async () => {
        await fixture.whenStable();
        expect(component.submitForm.emit).toHaveBeenCalledWith(expectedWithId);
      });
    });
  });
});
