import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/initial-menus-state';
import { MenuSection } from '../../shared/menu/menu.reducer';
import { first, map } from 'rxjs/operators';
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
  menuPreviewCollapsed: Observable<boolean>;
  menuVisible: Observable<boolean>;
  sections: Observable<MenuSection[]>;
  sectionInjectors: Map<string, Injector> = new Map<string, Injector>();
  sectionComponents: Map<string, GenericConstructor<MenuSectionComponent>> = new Map<string, GenericConstructor<MenuSectionComponent>>();
  changeDetection: ChangeDetectionStrategy.OnPush;

  constructor(protected menuService: MenuService, protected injector: Injector) {
  }

  ngOnInit(): void {
    this.menuCollapsed = this.menuService.isMenuCollapsed(this.menuID);
    this.menuPreviewCollapsed = this.menuService.isMenuPreviewCollapsed(this.menuID);
    this.menuVisible = this.menuService.isMenuVisible(this.menuID);
    this.sections = this.menuService.getMenuTopSections(this.menuID).pipe(first());
    this.sections.subscribe((sections: MenuSection[]) => {
      sections.forEach((section: MenuSection) => {
        this.sectionInjectors.set(section.id, this.getSectionDataInjector(section));
        this.getSectionComponent(section).pipe(first()).subscribe((constr) => this.sectionComponents.set(section.id, constr));
      })
    })
  }

  toggle(event: Event) {
    event.preventDefault();
    this.menuService.toggleMenu(this.menuID);
  }

  expand(event: Event) {
    event.preventDefault();
    this.menuService.expandMenu(this.menuID);
  }

  collapse(event: Event) {
    event.preventDefault();
    this.menuService.collapseMenu(this.menuID);
  }

  expandPreview(event: Event) {
    console.log("HOI IK HOVER");
    event.preventDefault();
    this.menuService.expandMenuPreview(this.menuID);
  }

  collapsePreview(event: Event) {
    event.preventDefault();
    this.menuService.collapseMenuPreview(this.menuID);
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
