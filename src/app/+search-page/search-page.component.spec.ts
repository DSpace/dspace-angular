import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchPageComponent } from './search-page.component';
import { Router } from '@angular/router';
import { SearchFormComponent } from '../shared/search-form/search-form.component';
import { SearchResultsComponent } from './search-results/search-results.compontent';
import { FormsModule } from '@angular/forms';
import { ObjectListComponent } from '../shared/object-list/object-list.component';
import { CommonModule } from '@angular/common';
import { WrapperListElementComponent } from '../object-list/wrapper-list-element/wrapper-list-element.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { PaginatePipe } from 'ngx-pagination';
import { NgbDropdown, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../shared/utils/enum-keys-pipe';
import { SearchService } from './search.service';
import { ItemDataService } from '../core/data/item-data.service';
import { ResponseCacheService } from '../core/cache/response-cache.service';
import { StateObservable, Store } from '@ngrx/store';

fdescribe('SearchPageComponent', () => {
  let comp: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [SearchPageComponent, SearchFormComponent, SearchResultsComponent, ObjectListComponent, WrapperListElementComponent, PaginationComponent, PaginatePipe, NgbPagination, NgbDropdown, EnumKeysPipe],
      providers: [SearchService, ItemDataService, ResponseCacheService, Store, StateObservable],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
  });

  it('should set the scope and query based on the route parameters', inject([Router], (router: Router) => {
    // const query = 'test query';
    // const scope = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
    // router.navigate([], {
    //   queryParams: Object.assign({}, this.currentQueryParams, { query: query, scope: scope })
    // });
    // expect(this.comp.query).toBe(query);
    // expect(this.comp.scope).toBe(scope);

  }));
});
