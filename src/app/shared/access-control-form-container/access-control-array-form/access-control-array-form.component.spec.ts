import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlArrayFormComponent } from './access-control-array-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToDatePipe } from './to-date.pipe';
import { SharedBrowseByModule } from '../../browse-by/shared-browse-by.module';

describe('AccessControlArrayFormComponent', () => {
  let component: AccessControlArrayFormComponent;
  let fixture: ComponentFixture<AccessControlArrayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, FormsModule, SharedBrowseByModule, TranslateModule.forRoot(), NgbDatepickerModule ],
      declarations: [ AccessControlArrayFormComponent, ToDatePipe  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlArrayFormComponent);
    component = fixture.componentInstance;
    component.dropdownOptions = [{name: 'Option1'}, {name: 'Option2'}] as any;
    component.type = 'item';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have only one empty control access item in the form',  () => {
    const accessControlItems = fixture.debugElement.queryAll(By.css('.access-control-item'));
    expect(accessControlItems.length).toEqual(1);
  });

  it('should add access control item', () => {
    component.addAccessControlItem();
    expect(component.form.accessControls.length).toEqual(2);
  });

  it('should remove access control item', () => {
    expect(component.form.accessControls.length).toEqual(1);

    component.addAccessControlItem();
    expect(component.form.accessControls.length).toEqual(2);

    const id = component.form.accessControls[0].id;
    component.removeAccessControlItem(id);
    expect(component.form.accessControls.length).toEqual(1);
  });

  it('should reset form value', () => {
    const item = { itemName: 'item1', startDate: '2022-01-01', endDate: '2022-02-01' };
    component.addAccessControlItem(item.itemName);

    // set value to item1
    component.accessControlChanged(
      component.form.accessControls[1],
      'item1'
    );

    component.reset();
    expect(component.form.accessControls[1]?.itemName).toEqual(undefined);
  });


  it('should display a select dropdown with options', () => {
    component.enable();
    fixture.detectChanges();

    const id = component.form.accessControls[0].id;

    const selectElement: DebugElement = fixture.debugElement.query(By.css(`select#accesscontroloption-${id}`));
    expect(selectElement).toBeTruthy();

    const options = selectElement.nativeElement.querySelectorAll('option');
    expect(options.length).toEqual(3); // 2 options + default empty option

    expect(options[0].value).toEqual('');
    expect(options[1].value).toEqual('Option1');
    expect(options[2].value).toEqual('Option2');
  });

  it('should add new access control items when clicking "Add more" button', () => {
    component.enable();
    fixture.detectChanges();

    const addButton: DebugElement = fixture.debugElement.query(By.css(`button#add-btn-${component.type}`));
    addButton.nativeElement.click();
    fixture.detectChanges();

    const accessControlItems = fixture.debugElement.queryAll(By.css('.access-control-item'));
    expect(accessControlItems.length).toEqual(2);
  });

  it('should remove access control items when clicking remove button', () => {
    component.enable();

    component.addAccessControlItem('test');

    fixture.detectChanges();

    const removeButton: DebugElement[] = fixture.debugElement.queryAll(By.css('button.btn-outline-danger'));
    removeButton[1].nativeElement.click();
    fixture.detectChanges();

    const accessControlItems = fixture.debugElement.queryAll(By.css('.access-control-item'));
    expect(accessControlItems.length).toEqual(1);
  });
});
