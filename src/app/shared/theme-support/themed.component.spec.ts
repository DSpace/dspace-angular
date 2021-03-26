import { ThemedComponent } from './themed.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VarDirective } from '../utils/var.directive';
import { ThemeService } from './theme.service';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { TestComponent } from './test/test.component.spec';

/* tslint:disable:max-classes-per-file */
@Component({
  selector: 'ds-test-themed-component',
  templateUrl: './themed.component.html'
})
class TestThemedComponent extends ThemedComponent<TestComponent> {
  protected inAndOutputNames: (keyof TestComponent & keyof this)[] = ['testInput'];

  testInput = 'unset';

  protected getComponentName(): string {
    return 'TestComponent';
  }
  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`./test/${themeName}/themed-test.component.spec`);
  }
  protected importUnthemedComponent(): Promise<any> {
    return import('./test/test.component.spec');
  }
}

describe('ThemedComponent', () => {
  let component: TestThemedComponent;
  let fixture: ComponentFixture<TestThemedComponent>;
  let themeService: ThemeService;

  function setupTestingModuleForTheme(theme: string) {
    themeService = getMockThemeService(theme);
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestThemedComponent, VarDirective],
      providers: [
        { provide: ThemeService, useValue: themeService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }

  describe('when the current theme matches a themed component', () => {
    beforeEach(waitForAsync(() => {
      setupTestingModuleForTheme('custom');
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestThemedComponent);
      component = fixture.componentInstance;
      component.testInput = 'changed';
      fixture.detectChanges();
    });

    it('should set compRef to the themed component', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect((component as any).compRef.instance.type).toEqual('themed');
      });
    }));

    it('should sync up this component\'s input with the themed component', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect((component as any).compRef.instance.testInput).toEqual('changed');
      });
    }));
  });

  describe('when the current theme doesn\'t match a themed component', () => {
    beforeEach(waitForAsync(() => {
      setupTestingModuleForTheme('non-existing-theme');
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestThemedComponent);
      component = fixture.componentInstance;
      component.testInput = 'changed';
      fixture.detectChanges();
    });

    it('should set compRef to the default component', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect((component as any).compRef.instance.type).toEqual('default');
      });
    }));

    it('should sync up this component\'s input with the default component', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect((component as any).compRef.instance.testInput).toEqual('changed');
      });
    }));
  });
});
/* tslint:enable:max-classes-per-file */
