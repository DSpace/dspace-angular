/* tslint:disable:no-unused-variable */
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';

import { EPersonDataService } from './../../../../core/eperson/eperson-data.service';
import { EPersonDataComponent } from './ePerson-data.component';

describe('EPersonDataComponent', () => {
  let component: EPersonDataComponent;
  let fixture: ComponentFixture<EPersonDataComponent>;
  let ePersonDataService = jasmine.createSpyObj('EPersonDataService', ['findById']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EPersonDataComponent],
      providers: [{
        provide: EPersonDataService,
        useValue: ePersonDataService,
      } ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPersonDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve EPerson data when ePersonId is provided', () => {
    const ePersonId = '123';
    const ePersonData = Object.assign(new EPerson(), {
      id: ePersonId,
      email: 'john.doe@domain.com',
      metadata: [
        {
          key: 'eperson.firstname',
          value: 'John',
        },
        {
          key: 'eperson.lastname',
          value: 'Doe',
        },
      ],
    });
    const ePersonDataRD$ = createSuccessfulRemoteDataObject$(ePersonData);
    ePersonDataService.findById.and.returnValue(ePersonDataRD$);
    component.ePersonId = ePersonId;
    component.getEPersonData$();
    fixture.detectChanges();
    expect(ePersonDataService.findById).toHaveBeenCalledWith(ePersonId, true);
  });
});
