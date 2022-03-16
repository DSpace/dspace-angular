import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentItemListComponent } from './recent-item-list.component';

describe('RecentItemListComponent', () => {
  let component: RecentItemListComponent;
  let fixture: ComponentFixture<RecentItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
