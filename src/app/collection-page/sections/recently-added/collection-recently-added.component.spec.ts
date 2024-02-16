import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionRecentlyAddedComponent } from './collection-recently-added.component';
import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment.test';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { SearchServiceStub } from '../../../shared/testing/search-service.stub';
import { SearchService } from '../../../core/shared/search/search.service';
import { VarDirective } from '../../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CollectionRecentlyAddedComponent', () => {
  let component: CollectionRecentlyAddedComponent;
  let fixture: ComponentFixture<CollectionRecentlyAddedComponent>;

  let activatedRoute: ActivatedRouteStub;
  let paginationService: PaginationServiceStub;
  let searchService: SearchServiceStub;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
    paginationService = new PaginationServiceStub();
    searchService = new SearchServiceStub();

    await TestBed.configureTestingModule({
      declarations: [
        CollectionRecentlyAddedComponent,
        VarDirective,
      ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchService, useValue: SearchServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionRecentlyAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
