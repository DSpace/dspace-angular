import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentRenderComponent } from './attachment-render.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  AuthorizationDataService
} from '../../../../../../../../../core/data/feature-authorization/authorization-data.service';
import { AuthorizationDataServiceStub } from '../../../../../../../../../shared/testing/authorization-service.stub';
import { ConfigurationDataService } from '../../../../../../../../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../../../shared/remote-data.utils';
import { ConfigurationProperty } from '../../../../../../../../../core/shared/configuration-property.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../../../shared/mocks/translate-loader.mock';

describe('AttachmentRenderComponent', () => {
  let component: AttachmentRenderComponent;
  let fixture: ComponentFixture<AttachmentRenderComponent>;
  let configurationDataService: ConfigurationDataService;

  beforeEach(async () => {
    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'request.item.type',
        values: []
      }))
    });

    await TestBed.configureTestingModule({
      declarations: [ AttachmentRenderComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        {provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub},
        {provide: ConfigurationDataService, useValue: configurationDataService}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
