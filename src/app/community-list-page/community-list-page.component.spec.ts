import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityListPageComponent } from './community-list-page.component';

describe('CommunityListPageComponent', () => {
  let component: CommunityListPageComponent;
  let fixture: ComponentFixture<CommunityListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
