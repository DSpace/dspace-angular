import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, combineLatest as observableCombineLatest, Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, first, map, take, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { slideHorizontal, slideSidebar } from '../../shared/animations/slide';
import { CreateCollectionParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';
import { CreateCommunityParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component';
import { CreateItemParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { EditCollectionSelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component';
import { EditCommunitySelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';
import { EditItemSelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';
import { ExportMetadataSelectorComponent } from '../../shared/dso-selector/modal-wrappers/export-metadata-selector/export-metadata-selector.component';
import { MenuID, MenuItemType } from '../../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../../shared/menu/menu-item/models/link.model';
import { OnClickMenuItemModel } from '../../shared/menu/menu-item/models/onclick.model';
import { TextMenuItemModel } from '../../shared/menu/menu-item/models/text.model';
import { MenuComponent } from '../../shared/menu/menu.component';
import { MenuService } from '../../shared/menu/menu.service';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Component representing the admin sidebar
 */
@Component({
  selector: 'ds-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  animations: [slideHorizontal, slideSidebar]
})
export class AdminSidebarComponent extends MenuComponent implements OnInit {
  /**
   * The menu ID of the Navbar is PUBLIC
   * @type {MenuID.ADMIN}
   */
  menuID = MenuID.ADMIN;

  /**
   * Observable that emits the width of the collapsible menu sections
   */
  sidebarWidth: Observable<string>;

  /**
   * Is true when the sidebar is open, is false when the sidebar is animating or closed
   * @type {boolean}
   */
  sidebarOpen = true; // Open in UI, animation finished

  /**
   * Is true when the sidebar is closed, is false when the sidebar is animating or open
   * @type {boolean}
   */
  sidebarClosed = !this.sidebarOpen; // Closed in UI, animation finished

  /**
   * Emits true when either the menu OR the menu's preview is expanded, else emits false
   */
  sidebarExpanded: Observable<boolean>;

  inFocus$: BehaviorSubject<boolean>;

  constructor(protected menuService: MenuService,
    protected injector: Injector,
    private variableService: CSSVariableService,
    private authService: AuthService,
    public authorizationService: AuthorizationDataService,
    public route: ActivatedRoute
  ) {
    super(menuService, injector, authorizationService, route);
    this.inFocus$ = new BehaviorSubject(false);
  }

  /**
   * Set and calculate all initial values of the instance variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.sidebarWidth = this.variableService.getVariable('sidebarItemsWidth');
    this.authService.isAuthenticated()
      .subscribe((loggedIn: boolean) => {
        if (loggedIn) {
          this.menuService.showMenu(this.menuID);
        }
      });
    this.menuCollapsed.pipe(first())
      .subscribe((collapsed: boolean) => {
        this.sidebarOpen = !collapsed;
        this.sidebarClosed = collapsed;
      });
    this.sidebarExpanded = combineLatest([this.menuCollapsed, this.menuPreviewCollapsed])
      .pipe(
        map(([collapsed, previewCollapsed]) => (!collapsed || !previewCollapsed))
      );
    this.inFocus$.pipe(
      debounceTime(50),
      distinctUntilChanged(),  // disregard focusout in situations like --(focusout)-(focusin)--
      withLatestFrom(
        combineLatest([this.menuCollapsed, this.menuPreviewCollapsed])
      ),
    ).subscribe(([inFocus, [collapsed, previewCollapsed]]) => {
      if (collapsed) {
        if (inFocus && previewCollapsed) {
          this.expandPreview(new Event('focusin → expand'));
        } else if (!inFocus && !previewCollapsed) {
          this.collapsePreview(new Event('focusout → collapse'));
        }
      }
    });
  }

  @HostListener('focusin')
  public handleFocusIn() {
    this.inFocus$.next(true);
  }

  @HostListener('focusout')
  public handleFocusOut() {
    this.inFocus$.next(false);
  }

  public handleMouseEnter(event: any) {
    if (!this.inFocus$.getValue()) {
      this.expandPreview(event);
    } else {
      event.preventDefault();
    }
  }

  public handleMouseLeave(event: any) {
    if (!this.inFocus$.getValue()) {
      this.collapsePreview(event);
    } else {
      event.preventDefault();
    }
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  startSlide(event: any): void {
    if (event.toState === 'expanded') {
      this.sidebarClosed = false;
    } else if (event.toState === 'collapsed') {
      this.sidebarOpen = false;
    }
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'expanded') {
      this.sidebarClosed = true;
    } else if (event.fromState === 'collapsed') {
      this.sidebarOpen = true;
    }
  }
}
