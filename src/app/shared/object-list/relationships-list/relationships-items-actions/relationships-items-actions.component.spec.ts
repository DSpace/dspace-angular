import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipsItemsActionsComponent } from './relationships-items-actions.component';

describe('RelationshipsItemsActionsComponent', () => {
  let component: RelationshipsItemsActionsComponent;
  let fixture: ComponentFixture<RelationshipsItemsActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipsItemsActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipsItemsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
