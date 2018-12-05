import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/initial-menus-state';
import { MenuSection } from '../../shared/menu/menu.reducer';
import { map, tap } from 'rxjs/operators';
import { getComponentForMenu } from './menu.decorator';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { MenuSectionComponent } from './menu-section/menu-section.component';

@Component({
  selector: 'ds-menu',
  template: ''
})
export class MenuComponent implements OnInit {
  menuID: MenuID;
  menuCollapsed: Observable<boolean>;
  sections: Observable<MenuSection[]>;

  constructor(protected menuService: MenuService, protected injector: Injector) {
  }

  ngOnInit(): void {
    this.menuCollapsed = this.menuService.isMenuCollapsed(this.menuID);
    this.sections = this.menuService.getMenuTopSections(this.menuID);
  }

  toggle(event: Event) {
    event.preventDefault();
    this.menuService.toggleMenu(this.menuID);
  }

  getSectionComponent(section: MenuSection): Observable<GenericConstructor<MenuSectionComponent>> {
    return this.menuService.hasSubSections(this.menuID, section.id).pipe(
      map((expandable: boolean) => {
          return getComponentForMenu(this.menuID, expandable);
        }
      ),
    );
  }

  getSectionDataInjector(section: MenuSection) {
    return Injector.create({
      providers: [{ provide: 'sectionDataProvider', useFactory: () => (section), deps: [] }],
      parent: this.injector
    });
  }
}
