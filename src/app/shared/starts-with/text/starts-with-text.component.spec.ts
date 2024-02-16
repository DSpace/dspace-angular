import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../utils/enum-keys-pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StartsWithTextComponent } from './starts-with-text.component';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../testing/pagination-service.stub';
import { ActivatedRouteStub } from '../../testing/active-router.stub';
import { RouterStub } from '../../testing/router.stub';

describe('StartsWithTextComponent', () => {
  let comp: StartsWithTextComponent;
  let fixture: ComponentFixture<StartsWithTextComponent>;

  let paginationService: PaginationServiceStub;
  let route: ActivatedRouteStub;
  let router: RouterStub;

  const options = ['0-9', 'A', 'B', 'C'];

  beforeEach(waitForAsync(async () => {
    paginationService = new PaginationServiceStub();
    route = new ActivatedRouteStub();
    router = new RouterStub();

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
      declarations: [StartsWithTextComponent, EnumKeysPipe],
      providers: [
        { provide: PaginationService, useValue: paginationService },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartsWithTextComponent);
    comp = fixture.componentInstance;
    comp.paginationId = 'page-id';
    comp.startsWithOptions = options;
    fixture.detectChanges();
  });

  it('should create a FormGroup containing a startsWith FormControl', () => {
    expect(comp.formData.value.startsWith).toBeDefined();
  });

  describe('when filling in the input form', () => {
    let form;
    const expectedValue = 'A';

    beforeEach(() => {
      form = fixture.debugElement.query(By.css('form'));
      comp.formData.value.startsWith = expectedValue;
      form.triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
    });

    it('should set startsWith to the correct value', () => {
      expect(comp.startsWith).toEqual(expectedValue);
    });

    it('should add a startsWith query parameter', () => {
      expect(paginationService.updateRoute).toHaveBeenCalledWith('page-id', {page: 1}, {startsWith: expectedValue});
    });
  });

});
