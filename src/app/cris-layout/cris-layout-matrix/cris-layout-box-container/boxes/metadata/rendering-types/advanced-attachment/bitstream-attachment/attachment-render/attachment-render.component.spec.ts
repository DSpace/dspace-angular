import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentRenderComponent } from './attachment-render.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  AuthorizationDataService
} from '../../../../../../../../../core/data/feature-authorization/authorization-data.service';
import { AuthorizationDataServiceStub } from '../../../../../../../../../shared/testing/authorization-service.stub';

describe('AttachmentRenderComponent', () => {
  let component: AttachmentRenderComponent;
  let fixture: ComponentFixture<AttachmentRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentRenderComponent ],
      providers: [
        {provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub}
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
