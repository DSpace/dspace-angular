import {
  ChangeDetectionStrategy,
  Component,
  Injector,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { getMockThemeService } from '../../mocks/theme-service.mock';
import { MenuServiceStub } from '../../testing/menu-service.stub';
import { ThemeService } from '../../theme-support/theme.service';
import { MenuService } from '../menu.service';
import { LinkMenuItemComponent } from '../menu-item/link-menu-item.component';
import { AbstractMenuSectionComponent } from './abstract-menu-section.component';

@Component({
  selector: 'ds-some-menu-section',
  template: '',
  standalone: true,
})
class SomeMenuSectionComponent extends AbstractMenuSectionComponent {
  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    protected themeService: ThemeService,
  ) {
    super(
      menuService,
      injector,
      themeService,
    );
  }
}

describe('MenuSectionComponent', () => {
  let comp: AbstractMenuSectionComponent;
  let fixture: ComponentFixture<AbstractMenuSectionComponent>;
  let menuService: MenuService;
  let dummySection;

  beforeEach(waitForAsync(() => {
    dummySection = {
      id: 'section',
      visible: true,
      active: false,
    } as any;
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, SomeMenuSectionComponent, AbstractMenuSectionComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: MenuService, useClass: MenuServiceStub },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
    }).overrideComponent(SomeMenuSectionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomeMenuSectionComponent);
    comp = fixture.componentInstance;
    comp.section = dummySection;
    menuService = (comp as any).menuService;
    spyOn(comp, 'getMenuItemComponent').and.returnValue(Promise.resolve(LinkMenuItemComponent as GenericConstructor<Component>));
    spyOn(comp as any, 'getItemModelInjector').and.returnValue(of({}));
    fixture.detectChanges();
  });

  describe('toggleSection', () => {
    beforeEach(() => {
      spyOn(menuService, 'toggleActiveSection');
      comp.toggleSection(new Event('click'));
    });
    it('should trigger the toggleActiveSection function on the menu service', () => {
      expect(menuService.toggleActiveSection).toHaveBeenCalledWith(comp.menuID, dummySection.id);
    });
  });

  describe('activateSection', () => {
    beforeEach(() => {
      spyOn(menuService, 'activateSection');
      comp.activateSection(new Event('click'));
    });
    it('should trigger the activateSection function on the menu service', () => {
      expect(menuService.activateSection).toHaveBeenCalledWith(comp.menuID, dummySection.id);
    });
  });

  describe('deactivateSection', () => {
    beforeEach(() => {
      spyOn(menuService, 'deactivateSection');
      comp.deactivateSection(new Event('click'));
    });
    it('should trigger the deactivateSection function on the menu service', () => {
      expect(menuService.deactivateSection).toHaveBeenCalledWith(comp.menuID, dummySection.id);
    });
  });

});
