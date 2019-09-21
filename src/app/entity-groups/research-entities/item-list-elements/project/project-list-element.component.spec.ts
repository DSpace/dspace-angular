import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ProjectListElementComponent } from './project-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';

let projectListElementComponent: ProjectListElementComponent;
let fixture: ComponentFixture<ProjectListElementComponent>;

const mockItemWithMetadata: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    // 'project.identifier.status': [
    //   {
    //     language: 'en_US',
    //     value: 'A status about the project'
    //   }
    // ]
  }
});
const mockItemWithoutMetadata: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('ProjectListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectListElementComponent , TruncatePipe],
      providers: [
        { provide: ITEM, useValue: mockItemWithMetadata},
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(ProjectListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProjectListElementComponent);
    projectListElementComponent = fixture.componentInstance;

  }));

  // describe('When the item has a status', () => {
  //   beforeEach(() => {
  //     projectListElementComponent.item = mockItemWithMetadata;
  //     fixture.detectChanges();
  //   });
  //
  //   it('should show the status span', () => {
  //     const statusField = fixture.debugElement.query(By.css('span.item-list-status'));
  //     expect(statusField).not.toBeNull();
  //   });
  // });
  //
  // describe('When the item has no status', () => {
  //   beforeEach(() => {
  //     projectListElementComponent.item = mockItemWithoutMetadata;
  //     fixture.detectChanges();
  //   });
  //
  //   it('should not show the status span', () => {
  //     const statusField = fixture.debugElement.query(By.css('span.item-list-status'));
  //     expect(statusField).toBeNull();
  //   });
  // });
});
