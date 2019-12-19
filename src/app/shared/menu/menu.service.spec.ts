import * as ngrx from '@ngrx/store';
import { Store } from '@ngrx/store';
import { async, TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { cold, hot } from 'jasmine-marbles';
import { MenuID } from './initial-menus-state';
import { of as observableOf } from 'rxjs';
import {
  ActivateMenuSectionAction,
  AddMenuSectionAction,
  CollapseMenuAction, CollapseMenuPreviewAction, DeactivateMenuSectionAction,
  ExpandMenuAction, ExpandMenuPreviewAction, HideMenuAction,
  RemoveMenuSectionAction, ShowMenuAction, ToggleActiveMenuSectionAction, ToggleMenuAction
} from './menu.actions';
import { MenuSection } from './menu.reducer';

describe('MenuService', () => {
  let service: MenuService;
  let selectSpy;
  const store = Object.assign(observableOf({}), {
    dispatch: () => {/***/
    }
  }) as any;
  const fakeMenu = {
    id: MenuID.ADMIN,
    collapsed: true,
    visible: false,
    previewCollapsed: true
  } as any;
  const visibleSection1 = {
    id: 'section',
    visible: true,
    active: false
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
    spyOn(store, 'dispatch');
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
    it('should return only the visible top MenuSections when mustBeVisible is true', () => {

      const result = service.getMenuTopSections(MenuID.ADMIN);
      const expected = cold('b', {
        b: [visibleSection1, visibleSection2]
      });

      expect(result).toBeObservable(expected);
    });

    it('should return only the all top MenuSections when mustBeVisible is false', () => {

      const result = service.getMenuTopSections(MenuID.ADMIN, false);
      const expected = cold('b', {
        b: [visibleSection1, visibleSection2, hiddenSection3]
      });

      expect(result).toBeObservable(expected);
    })
  });

  describe('getSubSectionsByParentID', () => {
    describe('when the subsection list is not empty', () => {

      beforeEach(() => {
        spyOn(service, 'getMenuSection').and.returnValue(observableOf(visibleSection1 as MenuSection));
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', {
                a: ['id1', 'id2']
              }
            );
          };
        });
      });
      it('should return the MenuSections with the given parentID', () => {

        const result = service.getSubSectionsByParentID(MenuID.ADMIN, 'fakeId');
        const expected = cold('b', {
          b: [visibleSection1, visibleSection1]
        });

        expect(result).toBeObservable(expected);
      })
    });
    describe('when the subsection list is undefined', () => {

      beforeEach(() => {
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', {
                a: undefined
              }
            );
          };
        });
      });
      it('should return an observable that emits nothing', () => {

        const result = service.getSubSectionsByParentID(MenuID.ADMIN, 'fakeId');
        const expected = cold('');

        expect(result).toBeObservable(expected);
      })
    });
  });

  describe('hasSubSections', () => {
    describe('when the subsection list is not empty', () => {
      beforeEach(() => {
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', {
                a: ['id1', 'id2']
              }
            );
          };
        });
      });
      it('should return true', () => {

        const result = service.hasSubSections(MenuID.ADMIN, 'fakeId');
        const expected = cold('b', {
          b: true
        });

        expect(result).toBeObservable(expected);
      });
    });

    describe('when the subsection list is empty', () => {
      beforeEach(() => {
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', {
                a: []
              }
            );
          };
        });
      });
      it('should return false', () => {

        const result = service.hasSubSections(MenuID.ADMIN, 'fakeId');
        const expected = cold('b', {
          b: false
        });

        expect(result).toBeObservable(expected);
      });
    })
  });

  describe('getMenuSection', () => {
    beforeEach(() => {
      selectSpy.and.callFake(() => {
        return () => {
          return () => hot('a', {
              a: hiddenSection3
            }
          );
        };
      });
    });
    it('should return false', () => {

      const result = service.getMenuSection(MenuID.ADMIN, 'fakeId');
      const expected = cold('b', {
        b: hiddenSection3
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('isMenuCollapsed', () => {
    beforeEach(() => {
      spyOn(service, 'getMenu').and.returnValue(observableOf(fakeMenu));
    });
    it('should return true when the menu is collapsed', () => {

      const result = service.isMenuCollapsed(MenuID.ADMIN);
      const expected = cold('(b|)', {
        b: fakeMenu.collapsed
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('isMenuPreviewCollapsed', () => {
    beforeEach(() => {
      spyOn(service, 'getMenu').and.returnValue(observableOf(fakeMenu));
    });
    it('should return true when the menu\'s preview is collapsed', () => {

      const result = service.isMenuPreviewCollapsed(MenuID.ADMIN);
      const expected = cold('(b|)', {
        b: fakeMenu.previewCollapsed
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('isMenuVisible', () => {
    beforeEach(() => {
      spyOn(service, 'getMenu').and.returnValue(observableOf(fakeMenu));

    });
    it('should return false when the menu is hidden', () => {

      const result = service.isMenuVisible(MenuID.ADMIN);
      const expected = cold('(b|)', {
        b: fakeMenu.visible
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('isSectionActive', () => {
    beforeEach(() => {
      spyOn(service, 'getMenuSection').and.returnValue(observableOf(visibleSection1 as MenuSection));
    });

    it('should return false when the section is not active', () => {
      const result = service.isSectionActive(MenuID.ADMIN, 'fakeID');
      const expected = cold('(b|)', {
        b: visibleSection1.active
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('isSectionVisible', () => {
    beforeEach(() => {
      spyOn(service, 'getMenuSection').and.returnValue(observableOf(hiddenSection3 as MenuSection));
    });

    it('should return false when the section is hidden', () => {
      const result = service.isSectionVisible(MenuID.ADMIN, 'fakeID');
      const expected = cold('(b|)', {
        b: hiddenSection3.visible
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('addSection', () => {
    it('should dispatch an AddMenuSectionAction with the correct arguments', () => {
      service.addSection(MenuID.ADMIN, visibleSection1 as any);
      expect(store.dispatch).toHaveBeenCalledWith(new AddMenuSectionAction(MenuID.ADMIN, visibleSection1 as any));
    });
  });

  describe('removeSection', () => {
    it('should dispatch an RemoveMenuSectionAction with the correct arguments', () => {
      service.removeSection(MenuID.ADMIN, 'fakeID');
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveMenuSectionAction(MenuID.ADMIN, 'fakeID'));
    });
  });

  describe('expandMenu', () => {
    it('should dispatch an ExpandMenuAction with the correct arguments', () => {
      service.expandMenu(MenuID.ADMIN);
      expect(store.dispatch).toHaveBeenCalledWith(new ExpandMenuAction(MenuID.ADMIN));
    });
  });

  describe('collapseMenu', () => {
    it('should dispatch an CollapseMenuAction with the correct arguments', () => {
      service.collapseMenu(MenuID.ADMIN);
      expect(store.dispatch).toHaveBeenCalledWith(new CollapseMenuAction(MenuID.ADMIN));
    });
  });

  describe('expandMenuPreview', () => {
    it('should dispatch an ExpandMenuPreviewAction with the correct arguments', () => {
      service.expandMenuPreview(MenuID.ADMIN);
      expect(store.dispatch).toHaveBeenCalledWith(new ExpandMenuPreviewAction(MenuID.ADMIN));
    });
  });

  describe('collapseMenuPreview', () => {
    it('should dispatch an CollapseMenuPreviewAction with the correct arguments', () => {
      service.collapseMenuPreview(MenuID.ADMIN);
      expect(store.dispatch).toHaveBeenCalledWith(new CollapseMenuPreviewAction(MenuID.ADMIN));
    });
  });

  describe('toggleMenu', () => {
    it('should dispatch an ToggleMenuAction with the correct arguments', () => {
      service.toggleMenu(MenuID.ADMIN);
      expect(store.dispatch).toHaveBeenCalledWith(new ToggleMenuAction(MenuID.ADMIN));
    });
  });

  describe('showMenu', () => {
    it('should dispatch an ShowMenuAction with the correct arguments', () => {
      service.showMenu(MenuID.ADMIN);
      expect(store.dispatch).toHaveBeenCalledWith(new ShowMenuAction(MenuID.ADMIN));
    });
  });

  describe('hideMenu', () => {
    it('should dispatch an HideMenuAction with the correct arguments', () => {
      service.hideMenu(MenuID.ADMIN);
      expect(store.dispatch).toHaveBeenCalledWith(new HideMenuAction(MenuID.ADMIN));
    });
  });

  describe('toggleActiveSection', () => {
    it('should dispatch an ToggleActiveMenuSectionAction with the correct arguments', () => {
      service.toggleActiveSection(MenuID.ADMIN, 'fakeID');
      expect(store.dispatch).toHaveBeenCalledWith(new ToggleActiveMenuSectionAction(MenuID.ADMIN, 'fakeID'));
    });
  });

  describe('activateSection', () => {
    it('should dispatch an ActivateMenuSectionAction with the correct arguments', () => {
      service.activateSection(MenuID.ADMIN, 'fakeID');
      expect(store.dispatch).toHaveBeenCalledWith(new ActivateMenuSectionAction(MenuID.ADMIN, 'fakeID'));
    });
  });

  describe('deactivateSection', () => {
    it('should dispatch an DeactivateMenuSectionAction with the correct arguments', () => {
      service.deactivateSection(MenuID.ADMIN, 'fakeID');
      expect(store.dispatch).toHaveBeenCalledWith(new DeactivateMenuSectionAction(MenuID.ADMIN, 'fakeID'));
    });
  });
});
