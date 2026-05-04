import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  AfterViewChecked,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuID } from 'src/app/shared/menu/menu-id.model';
import { MenuSection } from 'src/app/shared/menu/menu-section.model';
import { AbstractMenuSectionComponent } from 'src/app/shared/menu/menu-section/abstract-menu-section.component';

import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { MenuService } from '../../../menu/menu.service';
import { rendersSectionForMenu } from '../../../menu/menu-section.decorator';
import { ThemeService } from '../../../theme-support/theme.service';

/**
 * Represents an expandable section in the dso edit menus
 */
@Component({
  selector: 'ds-dso-edit-menu-expandable-section',
  templateUrl: './dso-edit-menu-expandable-section.component.html',
  styleUrls: ['./dso-edit-menu-expandable-section.component.scss'],
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbTooltip,
    NgComponentOutlet,
    TranslateModule,
  ],
})
@rendersSectionForMenu(MenuID.DSO_EDIT, true)
export class DsoEditMenuExpandableSectionComponent extends AbstractMenuSectionComponent implements AfterViewChecked, OnInit, OnDestroy {

  @ViewChild(NgbDropdown) private dropdown: NgbDropdown;

  /**
   * This section resides in the DSO edit menu
   */
  menuID: MenuID = MenuID.DSO_EDIT;

  /**
   * When true, focus moves to the first menuitem after the menu opens.
   */
  focusOnFirstChildSection = false;

  /**
   * When true, focus moves to the last menuitem after the menu opens.
   */
  focusOnLastChildSection = false;

  /**
   * Emits whether one of the subsections contains an icon
   */
  renderIcons$: Observable<boolean>;

  /**
   * Emits true when the top section has subsections, else emits false
   */
  hasSubSections$: Observable<boolean>;

  override useAriaMenuRoles = true;

  /**
   * When true, attach keydown listeners to menuitems on the next view check.
   */
  private addArrowEventListeners = false;

  /**
   * Dropdown items that currently have navigateDropdown listeners
   */
  private dropdownItems: NodeListOf<HTMLElement>;

  private readonly boundNavigateDropdown = (event: KeyboardEvent) => this.navigateDropdown(event);

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    protected themeService: ThemeService,
    protected router: Router,
  ) {
    super(
      menuService,
      injector,
      themeService,
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.renderIcons$ = this.subSections$.pipe(
      map((sections: MenuSection[]) => {
        return sections.some(section => hasValue(section.icon));
      }),
    );

    this.hasSubSections$ = this.subSections$.pipe(
      map((subSections) => isNotEmpty(subSections)),
    );
  }

  ngAfterViewChecked(): void {
    if (this.addArrowEventListeners) {
      this.unsubscribeFromEventListeners();
      this.dropdownItems = document.querySelectorAll(`#${this.expandableSectionId()} *[role="menuitem"]`);
      this.dropdownItems.forEach((item: HTMLElement) => {
        item.addEventListener('keydown', this.boundNavigateDropdown);
      });
      if (this.dropdownItems.length > 0) {
        if (this.focusOnFirstChildSection) {
          this.dropdownItems.item(0).focus();
        } else if (this.focusOnLastChildSection) {
          this.dropdownItems.item(this.dropdownItems.length - 1).focus();
        }
      }
      this.focusOnFirstChildSection = false;
      this.focusOnLastChildSection = false;
      this.addArrowEventListeners = false;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribeFromEventListeners();
  }

  expandableSectionId(): string {
    return `expandable-dso-section-${this.section.id}-dropdown`;
  }

  /**
   * Keeps keyboard listeners in sync with the ng-bootstrap open state
   */
  onOpenChange(isOpen: boolean): void {
    if (isOpen) {
      this.addArrowEventListeners = true;
    } else {
      this.focusOnFirstChildSection = false;
      this.focusOnLastChildSection = false;
      this.unsubscribeFromEventListeners();
    }
  }

  /**
   * Removes keydown listeners from dropdown menuitems
   */
  unsubscribeFromEventListeners(): void {
    if (this.dropdownItems) {
      this.dropdownItems.forEach((item: HTMLElement) => {
        item.removeEventListener('keydown', this.boundNavigateDropdown);
      });
      this.dropdownItems = undefined;
    }
  }

  /**
   * Handles keyboard navigation between menuitems inside the open menu
   */
  navigateDropdown(event: KeyboardEvent): void {
    if (event.code === 'Tab') {
      // Put focus back on the toggle dropdown button element before closing the dropdown
      this.getToggleElement()?.focus();
      this.dropdown?.close();
      return;
    } else if (event.code === 'Escape') {
      this.dropdown?.close();
      this.getToggleElement()?.focus();
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const items: NodeListOf<Element> = document.querySelectorAll(`#${this.expandableSectionId()} *[role="menuitem"]`);
    if (items.length === 0) {
      return;
    }
    const currentIndex: number = Array.from(items).findIndex((item: Element) => item === event.target);

    if (event.key === 'ArrowDown') {
      (items[(currentIndex + 1) % items.length] as HTMLElement).focus();
    } else if (event.key === 'ArrowUp') {
      (items[(currentIndex - 1 + items.length) % items.length] as HTMLElement).focus();
    } else if (event.key === 'Home') {
      (items[0] as HTMLElement).focus();
    } else if (event.key === 'End') {
      (items[items.length - 1] as HTMLElement).focus();
    }
  }

  /**
   * Menu Button keyboard interaction while focus is on the toggle
   */
  keyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Tab':
        if (this.dropdown?.isOpen()) {
          this.dropdown.close();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        this.openAndFocusChild(true);
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.openAndFocusChild(false);
        break;
      case 'Space':
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        // Open now if not already open and handle Space / Enter specific behaviour in keyUp event handler
        if (this.dropdown?.isOpen()) {
          this.addArrowEventListeners = true;
        } else {
          this.dropdown?.open();
        }
        break;
    }
  }

  keyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Space':
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        this.openAndFocusChild(true);
        break;
    }
  }

  /**
   * Opens the menu (if needed) and focuses the first or last menuitem
   */
  private openAndFocusChild(focusFirst: boolean): void {
    if (focusFirst) {
      this.focusOnFirstChildSection = true;
      this.focusOnLastChildSection = false;
    } else {
      this.focusOnFirstChildSection = false;
      this.focusOnLastChildSection = true;
    }

    if (this.dropdown?.isOpen()) {
      this.addArrowEventListeners = true;
    } else {
      this.dropdown?.open();
    }
  }

  private getToggleElement(): HTMLElement | null {
    return document.querySelector(`button[aria-controls="${this.expandableSectionId()}"]`);
  }
}
