import { BrowseByStartsWithDateComponent } from './browse-by-starts-with-date.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../../utils/enum-keys-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRouteStub } from '../../../testing/active-router-stub';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RouterStub } from '../../../testing/router-stub';
import { By } from '@angular/platform-browser';

describe('BrowseByStartsWithDateComponent', () => {
  let comp: BrowseByStartsWithDateComponent;
  let fixture: ComponentFixture<BrowseByStartsWithDateComponent>;
  let route: ActivatedRoute;
  let router: Router;

  const options = [2019, 2018, 2017, 2016, 2015];

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
    queryParams: observableOf({})
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [BrowseByStartsWithDateComponent, EnumKeysPipe],
      providers: [
        { provide: 'startsWithOptions', useValue: options },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: new RouterStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByStartsWithDateComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    route = (comp as any).route;
    router = (comp as any).router;
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

  describe('when selecting the second option in the dropdown', () => {
    let select;
    let input;
    const expectedValue = '' + options[0];
    const extras = {
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

    it('should set startsWith to the correct value', () => {
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
    const expectedValue = '2015';
    const extras = {
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
