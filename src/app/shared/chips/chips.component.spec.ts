// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';
import 'rxjs/add/observable/of';

import { Chips } from './models/chips.model';
import { UploaderService } from '../uploader/uploader.service';
import { ChipsComponent } from './chips.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'angular-sortablejs';

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
  let testFixture: ComponentFixture<TestComponent>;
  let html;

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
        [editable]="true"
        (selected)="onChipSelected($event)"></ds-chips>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create Chips Component', inject([ChipsComponent], (app: ChipsComponent) => {

    expect(app).toBeDefined();
  }));

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  public chips = new Chips([]);

}
