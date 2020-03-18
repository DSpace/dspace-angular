import { BrowseBySwitcherComponent } from './browse-by-switcher.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as decorator from './browse-by-decorator';
import createSpy = jasmine.createSpy;
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../../../environments/environment';

describe('BrowseBySwitcherComponent', () => {
  let comp: BrowseBySwitcherComponent;
  let fixture: ComponentFixture<BrowseBySwitcherComponent>;

  const types = environment.browseBy.types;

  const params = new BehaviorSubject(createParamsWithId('initialValue'));

  const activatedRouteStub = {
    params: params
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseBySwitcherComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
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
