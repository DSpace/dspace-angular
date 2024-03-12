import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { SubComColSectionComponent } from './sub-com-col-section.component';

describe('SubComColSectionComponent', () => {
  let component: SubComColSectionComponent;
  let fixture: ComponentFixture<SubComColSectionComponent>;

  let activatedRoute: ActivatedRouteStub;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.parent = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports: [SubComColSectionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubComColSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
