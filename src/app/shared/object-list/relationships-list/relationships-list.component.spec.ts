import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipsListComponent } from './relationships-list.component';

describe('RelationshipsListComponent', () => {
  let component: RelationshipsListComponent;
  let fixture: ComponentFixture<RelationshipsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
