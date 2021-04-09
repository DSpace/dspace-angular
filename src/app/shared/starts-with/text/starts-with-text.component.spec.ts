import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../utils/enum-keys-pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StartsWithTextComponent } from './starts-with-text.component';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../../core/data/request.models';
import { of as observableOf } from 'rxjs';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../testing/pagination-service.stub';

describe('StartsWithTextComponent', () => {
  let comp: StartsWithTextComponent;
  let fixture: ComponentFixture<StartsWithTextComponent>;
  let route: ActivatedRoute;
  let router: Router;

  const options = ['0-9', 'A', 'B', 'C'];

  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
      declarations: [StartsWithTextComponent, EnumKeysPipe],
      providers: [
        { provide: 'startsWithOptions', useValue: options },
        { provide: 'paginationId', useValue: 'page-id' },
        { provide: PaginationService, useValue: paginationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartsWithTextComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    route = (comp as any).route;
    router = (comp as any).router;
    spyOn(router, 'navigate');
  });

  it('should create a FormGroup containing a startsWith FormControl', () => {
    expect(comp.formData.value.startsWith).toBeDefined();
  });

  describe('when selecting the first option in the dropdown', () => {
    let select;

    beforeEach(() => {
      select = fixture.debugElement.query(By.css('select')).nativeElement;
      select.value = select.options[0].value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    });

    it('should set startsWith to undefined', () => {
      expect(comp.startsWith).toBeUndefined();
    });

    it('should not add a startsWith query parameter', () => {
      route.queryParams.subscribe((params) => {
        expect(params.startsWith).toBeUndefined();
      });
    });
  });

  describe('when selecting "0-9" in the dropdown', () => {
    let select;
    let input;
    const expectedValue = '0';
    const extras: NavigationExtras = {
      queryParams: Object.assign({ startsWith: expectedValue }),
      queryParamsHandling: 'merge'
    };

    beforeEach(() => {
      select = fixture.debugElement.query(By.css('select')).nativeElement;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    });

    it('should set startsWith to "0"', () => {
      expect(comp.startsWith).toEqual(expectedValue);
    });

    it('should add a startsWith query parameter', () => {
      expect(router.navigate).toHaveBeenCalledWith([], extras);
    });

    it('should automatically fill in the input field', () => {
      expect(input.value).toEqual(expectedValue);
    });
  });

  describe('when selecting an option in the dropdown', () => {
    let select;
    let input;
    const expectedValue = options[1];
    const extras: NavigationExtras = {
      queryParams: Object.assign({ startsWith: expectedValue }),
      queryParamsHandling: 'merge'
    };

    beforeEach(() => {
      select = fixture.debugElement.query(By.css('select')).nativeElement;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
      select.value = select.options[2].value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    });

    it('should set startsWith to the expected value', () => {
      expect(comp.startsWith).toEqual(expectedValue);
    });

    it('should add a startsWith query parameter', () => {
      expect(router.navigate).toHaveBeenCalledWith([], extras);
    });

    it('should automatically fill in the input field', () => {
      expect(input.value).toEqual(expectedValue);
    });
  });

  describe('when clicking an option in the list', () => {
    let optionLink;
    let input;
    const expectedValue = options[1];
    const extras: NavigationExtras = {
      queryParams: Object.assign({ startsWith: expectedValue }),
      queryParamsHandling: 'merge'
    };

    beforeEach(() => {
      optionLink = fixture.debugElement.query(By.css('.list-inline-item:nth-child(2) > a')).nativeElement;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
      optionLink.click();
      fixture.detectChanges();
    });

    it('should set startsWith to the expected value', () => {
      expect(comp.startsWith).toEqual(expectedValue);
    });

    it('should add a startsWith query parameter', () => {
      expect(router.navigate).toHaveBeenCalledWith([], extras);
    });

    it('should automatically fill in the input field', () => {
      expect(input.value).toEqual(expectedValue);
    });
  });

  describe('when filling in the input form', () => {
    let form;
    const expectedValue = 'A';
    const extras: NavigationExtras = {
      queryParams: Object.assign({ startsWith: expectedValue }),
      queryParamsHandling: 'merge'
    };

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
      expect(router.navigate).toHaveBeenCalledWith([], extras);
    });
  });

});
