import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableItemSelectorComponent } from './editable-item-selector.component';

describe('EditableItemSelectorComponent', () => {
  let component: EditableItemSelectorComponent;
  let fixture: ComponentFixture<EditableItemSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableItemSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
