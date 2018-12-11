import * as ngrx from '@ngrx/store';
import { Store } from '@ngrx/store';
import { async, TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { cold, hot } from 'jasmine-marbles';
import { MenuID } from './initial-menus-state';
import { of as observableOf } from 'rxjs';

fdescribe('MenuService', () => {
  let service: MenuService;
  let selectSpy;
  const store = observableOf({}) as any;
  const fakeMenu = { id: MenuID.ADMIN } as any;
  const visibleSection1 = {
    id: 'section',
    visible: true
  };
  const visibleSection2 = {
    id: 'section_2',
    visible: true
  };
  const hiddenSection3 = {
    id: 'section_3',
    visible: false
  };
  const subSection4 = {
    id: 'section_4',
    visible: true,
    parentID: 'section1'
  };

  const topSections = {
    section: visibleSection1,
    section_2: visibleSection2,
    section_3: hiddenSection3,
    section_4: subSection4
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: store },
        { provide: MenuService, useValue: service }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = new MenuService(store);
    selectSpy = spyOnProperty(ngrx, 'select');
  });

  describe('getMenu', () => {
    beforeEach(() => {
      selectSpy.and.callFake(() => {
        return () => {
          return () => hot('a', {
              a: fakeMenu
            }
          );
        };
      });
    });
    it('should return the menu', () => {

      const result = service.getMenu(MenuID.ADMIN);
      const expected = cold('b', {
        b: fakeMenu
      });

      expect(result).toBeObservable(expected);
    })
  });

  describe('getMenuTopSections', () => {
    beforeEach(() => {
      selectSpy.and.callFake(() => {
        return () => {
          return () => hot('a', {
              a: topSections
            }
          );
        };
      });
    });
    it('should return only the visible top MenuSections', () => {

      const result = service.getMenuTopSections(MenuID.ADMIN);
      const expected = cold('b', {
        b: [visibleSection1, visibleSection2]
      });

      expect(result).toBeObservable(expected);
    })
  });

  // TODO finish this test
  describe('getSubSectionsByParentID', () => {
    beforeEach(() => {
      selectSpy.and.callFake(() => {
        return () => {
          return () => hot('a', {
              a: topSections
            }
          );
        };
      });
    });
    it('should return only the visible top MenuSections', () => {

      const result = service.getMenuTopSections(MenuID.ADMIN);
      const expected = cold('b', {
        b: [visibleSection1, visibleSection2]
      });

      expect(result).toBeObservable(expected);
    })
  })
});
