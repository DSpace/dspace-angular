import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { ThemedCollectionPageSubCollectionListComponent } from './sub-collection-list/themed-community-page-sub-collection-list.component';
import { SubComColSectionComponent } from './sub-com-col-section.component';
import { ThemedCommunityPageSubCommunityListComponent } from './sub-community-list/themed-community-page-sub-community-list.component';

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
    }).overrideComponent(SubComColSectionComponent, { remove: { imports: [ThemedCommunityPageSubCommunityListComponent, ThemedCollectionPageSubCollectionListComponent] } }).compileComponents();

    fixture = TestBed.createComponent(SubComColSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
