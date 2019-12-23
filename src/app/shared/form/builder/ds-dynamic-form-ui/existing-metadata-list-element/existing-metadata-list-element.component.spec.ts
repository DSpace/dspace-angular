import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingMetadataListElementComponent } from './existing-metadata-list-element.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { Store } from '@ngrx/store';

describe('ExistingMetadataListElementComponent', () => {
  let component: ExistingMetadataListElementComponent;
  let fixture: ComponentFixture<ExistingMetadataListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExistingMetadataListElementComponent],
      providers: [
        { provide: SelectableListService, useValue: {} },
        { provide: Store, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingMetadataListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
