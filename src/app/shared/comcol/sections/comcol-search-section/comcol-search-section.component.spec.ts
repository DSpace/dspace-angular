import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComcolSearchSectionComponent } from './comcol-search-section.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';

describe('ComcolSearchSectionComponent', () => {
  let component: ComcolSearchSectionComponent;
  let fixture: ComponentFixture<ComcolSearchSectionComponent>;

  let route: ActivatedRouteStub;

  beforeEach(async () => {
    route = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [
        ComcolSearchSectionComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComcolSearchSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
