import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { TopSectionTemplateType } from '../../core/layout/models/section.model';
import { Item } from '../../core/shared/item.model';
import { ItemSearchResult } from '../object-collection/shared/item-search-result.model';
import { BrowseMostElementsComponent } from './browse-most-elements.component';
import { ThemedDefaultBrowseElementsComponent } from './default-browse-elements/themed-default-browse-elements.component';

describe('BrowseMostElementsComponent', () => {
  let component: BrowseMostElementsComponent;
  let fixture: ComponentFixture<BrowseMostElementsComponent>;


  const mockResultObject: ItemSearchResult = new ItemSearchResult();
  mockResultObject.hitHighlights = {};

  mockResultObject.indexableObject = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'This is just another title',
        },
      ],
      'dc.type': [
        {
          language: null,
          value: 'Article',
        },
      ],
      'dc.contributor.author': [
        {
          language: 'en_US',
          value: 'Smith, Donald',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '2015-06-26',
        },
      ],
    },
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowseMostElementsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(BrowseMostElementsComponent, { remove: { imports: [ThemedDefaultBrowseElementsComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseMostElementsComponent);
    component = fixture.componentInstance;
    component.topSection = {
      template: TopSectionTemplateType.DEFAULT,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when the templateType is DEFAULT', () => {
    beforeEach(() => {
      component.topSection = {
        template: TopSectionTemplateType.DEFAULT,
      } as any;
      fixture.detectChanges();
    });

    it('should display ds-themed-default-browse-elements', () => {
      const defaultElement = fixture.debugElement.query(By.css('ds-default-browse-elements'));
      expect(defaultElement).toBeTruthy();
    });

    it('should not display ds-themed-images-browse-elements', () => {
      const imageElement = fixture.debugElement.query(By.css('ds-images-browse-elements'));
      expect(imageElement).toBeNull();
    });
  });

  describe('when the templateType is not recognized', () => {
    beforeEach(() => {
      component.topSection = {
        template: 'not recognized' as any,
      } as any;
      fixture.detectChanges();
    });

    it('should display ds-themed-default-browse-elements', () => {
      const defaultElement = fixture.debugElement.query(By.css('ds-default-browse-elements'));
      expect(defaultElement).toBeTruthy();
    });
  });
});
