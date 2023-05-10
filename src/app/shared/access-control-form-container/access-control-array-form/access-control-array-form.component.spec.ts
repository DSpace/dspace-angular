import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlArrayFormComponent } from './access-control-array-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedBrowseByModule } from '../../browse-by/shared-browse-by.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlMaxStartDatePipe } from './control-max-start-date.pipe';
import { ControlMaxEndDatePipe } from './control-max-end-date.pipe';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('AccessControlArrayFormComponent', () => {
  let component: AccessControlArrayFormComponent;
  let fixture: ComponentFixture<AccessControlArrayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, ReactiveFormsModule, SharedBrowseByModule, TranslateModule, NgbDatepickerModule ],
      declarations: [ AccessControlArrayFormComponent, ControlMaxStartDatePipe, ControlMaxEndDatePipe  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlArrayFormComponent);
    component = fixture.componentInstance;
    component.dropdownOptions = [{name: 'Option1'}, {name: 'Option2'}] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have only one empty control access item in the form',  () => {
    const accessControlItems = fixture.debugElement.queryAll(By.css('[data-testId="access-control-item"]'));
    expect(accessControlItems.length).toEqual(1);
  });

  it('should add access control item', () => {
    component.addAccessControlItem();
    expect(component.accessControl.length).toEqual(2);
  });

  it('should remove access control item', () => {
    component.removeAccessControlItem(0);
    expect(component.accessControl.length).toEqual(0);

    component.addAccessControlItem();
    component.removeAccessControlItem(0);
    expect(component.accessControl.length).toEqual(0);
  });

  it('should set access control item value', () => {
    const item = { itemName: 'item1', startDate: '2022-01-01', endDate: '2022-02-01' };
    component.addAccessControlItem(item.itemName);
    component.accessControl.controls[0].patchValue(item);
    expect(component.form.value.accessControl[0]).toEqual(item);
  });

  it('should reset form value', () => {
    const item = { itemName: 'item1', startDate: '2022-01-01', endDate: '2022-02-01' };
    component.addAccessControlItem(item.itemName);
    component.accessControl.controls[1].patchValue(item);
    component.reset();
    expect(component.form.value.accessControl[1].value).toEqual(undefined);
  });


  it('should display a select dropdown with options', () => {
    const selectElement: DebugElement = fixture.debugElement.query(By.css('select#accesscontroloption'));
    expect(selectElement).toBeTruthy();

    const options = selectElement.nativeElement.querySelectorAll('option');
    expect(options.length).toEqual(3); // 2 options + default empty option

    expect(options[0].value).toEqual('');
    expect(options[1].value).toEqual('Option1');
    expect(options[2].value).toEqual('Option2');
  });

  it('should add new access control items when clicking "Add more" button', () => {
    const addButton: DebugElement = fixture.debugElement.query(By.css('button#add-btn'));
    addButton.nativeElement.click();
    fixture.detectChanges();

    const accessControlItems = fixture.debugElement.queryAll(By.css('[data-testId="access-control-item"]'));
    expect(accessControlItems.length).toEqual(2);
  });

  it('should remove access control items when clicking remove button', () => {
    const removeButton: DebugElement = fixture.debugElement.query(By.css('button.btn-outline-danger'));
    removeButton.nativeElement.click();
    fixture.detectChanges();

    const accessControlItems = fixture.debugElement.queryAll(By.css('[data-testId="access-control-item"]'));
    expect(accessControlItems.length).toEqual(0);
  });
});
