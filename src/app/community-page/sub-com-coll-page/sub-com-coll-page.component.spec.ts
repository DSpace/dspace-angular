import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { SubComCollPageComponent } from './sub-com-coll-page.component';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Community } from '../../core/shared/community.model';
describe('SubComCollPageComponent', () => {
  let component: SubComCollPageComponent;
  let fixture: ComponentFixture<SubComCollPageComponent>;
  let route: ActivatedRoute;
  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community'
      }
    ]
  });
  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity)
  };
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({})
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubComCollPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubComCollPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
