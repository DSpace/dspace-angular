import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateUserErrorComponent } from './duplicate-user-error.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { of as observableOf } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { HELP_DESK_PROPERTY } from '../../item-page/tombstone/tombstone.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DuplicateUserErrorComponent', () => {
  let component: DuplicateUserErrorComponent;
  let fixture: ComponentFixture<DuplicateUserErrorComponent>;
  let mockConfigurationDataService: ConfigurationDataService;

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({})
  });

  mockConfigurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: HELP_DESK_PROPERTY,
      values: [
        'email'
      ]
    }))
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ DuplicateUserErrorComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ConfigurationDataService, useValue: mockConfigurationDataService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateUserErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
