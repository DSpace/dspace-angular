import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommunityDataService } from '../core/data/community-data.service';
import { SearchPageComponent } from './search-page.component';
import { SearchService } from './search.service';
import { Community } from '../core/shared/community.model';

fdescribe('SearchPageComponent', () => {
  let comp: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  const mockResults = []; // TODO
  const searchServiceStub = {
    search: () => mockResults
  };
  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
  const activatedRouteStub = {
    queryParams: Observable.of({
      query: queryParam,
      scope: scopeParam
    })
  };
  const mockCommunityList = [];
  const communityDataServiceStub = {
    findAll: () => mockCommunityList,
    findById: () => new Community()
  };

  class RouterStub {
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // imports: [ SearchPageModule ],
      declarations: [ SearchPageComponent ],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: Router, useClass: RouterStub }
      ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
  });

  it('should set the scope and query based on the route parameters', () => {
    expect(comp.query).toBe(queryParam);
    expect((comp as any).scope).toBe(scopeParam);
  });

});
