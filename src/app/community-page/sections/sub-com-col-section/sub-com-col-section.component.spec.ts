import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubComColSectionComponent } from './sub-com-col-section.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';

describe('SubComColSectionComponent', () => {
  let component: SubComColSectionComponent;
  let fixture: ComponentFixture<SubComColSectionComponent>;

  let activatedRoute: ActivatedRouteStub;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.parent = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [
        SubComColSectionComponent,
      ],
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
