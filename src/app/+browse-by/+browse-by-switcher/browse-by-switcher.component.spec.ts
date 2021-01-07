import { BrowseBySwitcherComponent } from './browse-by-switcher.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as decorator from './browse-by-decorator';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import createSpy = jasmine.createSpy;

xdescribe('BrowseBySwitcherComponent', () => {
  let comp: BrowseBySwitcherComponent;
  let fixture: ComponentFixture<BrowseBySwitcherComponent>;

  const types = environment.browseBy.types;

  const params = new BehaviorSubject(createParamsWithId('initialValue'));

  const activatedRouteStub = {
    params: params
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseBySwitcherComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(BrowseBySwitcherComponent);
    comp = fixture.componentInstance;
    spyOnProperty(decorator, 'getComponentByBrowseByType').and.returnValue(createSpy('getComponentByItemType'));
  }));

  types.forEach((type) => {
    describe(`when switching to a browse-by page for "${type.id}"`, () => {
      beforeEach(() => {
        params.next(createParamsWithId(type.id));
        fixture.detectChanges();
      });

      it(`should call getComponentByBrowseByType with type "${type.type}"`, () => {
        expect(decorator.getComponentByBrowseByType).toHaveBeenCalledWith(type.type);
      });
    });
  });
});

export function createParamsWithId(id) {
  return { id: id };
}
