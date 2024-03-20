import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../../../core/shared/item.model';
import { ConfigurationSearchPageComponent } from '../../../../search-page/configuration-search-page.component';
import { RelatedEntitiesSearchComponent } from './related-entities-search.component';

describe('RelatedEntitiesSearchComponent', () => {
  let comp: RelatedEntitiesSearchComponent;
  let fixture: ComponentFixture<RelatedEntitiesSearchComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'id1',
  });
  const mockRelationType = 'publicationsOfAuthor';
  const mockConfiguration = 'publication';
  const mockFilter = `f.${mockRelationType}=${mockItem.id},equals`;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule, RelatedEntitiesSearchComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(RelatedEntitiesSearchComponent, {
        remove: {
          imports: [ConfigurationSearchPageComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedEntitiesSearchComponent);
    comp = fixture.componentInstance;
    comp.relationType = mockRelationType;
    comp.item = mockItem;
    comp.configuration = mockConfiguration;
    fixture.detectChanges();
  });

  it('should create a fixedFilter', () => {
    expect(comp.fixedFilter).toEqual(mockFilter);
  });

});
