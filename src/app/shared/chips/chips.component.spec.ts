// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick, } from '@angular/core/testing';
import 'rxjs/add/observable/of';

import { Chips } from './models/chips.model';
import { UploaderService } from '../uploader/uploader.service';
import { ChipsComponent } from './chips.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'angular-sortablejs';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from '../pagination/pagination.component';
import { TruncatableComponent } from '../truncatable/truncatable.component';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

describe('Chips component', () => {

  let testComp: TestComponent;
  let chipsComp: ChipsComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let chipsFixture: ComponentFixture<ChipsComponent>;
  let html;
  let chips: Chips;

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        SortablejsModule.forRoot({ animation: 150 }),
      ],
      declarations: [
        ChipsComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        ChipsComponent,
        UploaderService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-chips
        *ngIf="chips.hasItems()"
        [chips]="chips"
        [editable]="editable"
        (selected)="onChipSelected($event)"></ds-chips>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create Chips Component', inject([ChipsComponent], (app: ChipsComponent) => {
    expect(app).toBeDefined();
  }));

  beforeEach(() => {
    chips = new Chips(['a', 'b', 'c']);
    chipsFixture = TestBed.createComponent(ChipsComponent);
    chipsComp = chipsFixture.componentInstance; // TruncatableComponent test instance
    chipsComp.editable = true;
    chipsComp.chips = chips;
    chipsFixture.detectChanges();
  });

  afterEach(() => {
    chipsFixture.destroy();
    chipsComp = null;
  });

  it('should set edit mode when a chip item is selected', fakeAsync(() => {

    spyOn(chipsComp.selected, 'emit');

    chipsComp.chipsSelected(new Event('click'), 1);
    chipsFixture.detectChanges();
    tick();

    const item = chipsComp.chips.getChipByIndex(1);

    expect(item.editMode).toBe(true);
    expect(chipsComp.selected.emit).toHaveBeenCalledWith(1);
  }));

  it('should not set edit mode when a chip item is selected and editable is false', fakeAsync(() => {
    chipsComp.editable = false;
    spyOn(chipsComp.selected, 'emit');

    chipsComp.chipsSelected(new Event('click'), 1);
    chipsFixture.detectChanges();
    tick();

    const item = chipsComp.chips.getChipByIndex(1);

    expect(item.editMode).toBe(false);
    expect(chipsComp.selected.emit).not.toHaveBeenCalledWith(1);
  }));

  it('should emit when a chip item is removed and editable is true', fakeAsync(() => {

    spyOn(chipsComp.chips, 'remove');

    const item = chipsComp.chips.getChipByIndex(1);

    chipsComp.removeChips(new Event('click'), 1);
    chipsFixture.detectChanges();
    tick();

    expect(chipsComp.chips.remove).toHaveBeenCalledWith(item);
  }));

  // it('should chipsSelected', inject([ChipsComponent], (app: ChipsComponent) => {
  //   app.chipsSelected(new Event('click'), 1);
  //   expect(app).toBeDefined();
  // }));
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  public chips = new Chips(['a', 'b', 'c']);
  public editable = true;
}
