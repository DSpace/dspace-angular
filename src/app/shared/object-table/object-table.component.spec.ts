import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectTableComponent } from './object-table.component';

describe('ObjectTableComponent', () => {
  let component: ObjectTableComponent;
  let fixture: ComponentFixture<ObjectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
