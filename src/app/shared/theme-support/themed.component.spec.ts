/* eslint-disable max-classes-per-file */
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { ThemeConfig } from '../../../config/theme.config';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { VarDirective } from '../utils/var.directive';
import { TestComponent } from './test/test.component.spec';
import { ThemeService } from './theme.service';
import { ThemedComponent } from './themed.component';

@Component({
  selector: 'ds-test-themed-component',
  templateUrl: './themed.component.html',
  standalone: true,
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

  function setupTestingModuleForTheme(theme: string, themes?: ThemeConfig[]) {
    themeService = getMockThemeService(theme, themes);
    TestBed.configureTestingModule({
      imports: [TestThemedComponent, VarDirective],
      providers: [
        { provide: ThemeService, useValue: themeService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }

  function initComponent() {
    fixture = TestBed.createComponent(TestThemedComponent);
    component = fixture.componentInstance;
    spyOn(component as any, 'importThemedComponent').and.callThrough();
    component.testInput = 'changed';
    fixture.detectChanges();
  }

  describe('when the current theme matches a themed component', () => {
    beforeEach(waitForAsync(() => {
      setupTestingModuleForTheme('custom');
    }));

    beforeEach(initComponent);

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

    it(`should set usedTheme to the name of the matched theme`, waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(component.usedTheme).toEqual('custom');
      });
    }));

    describe('it checks for ngContent and', () => {

      it('returns all child nodes when selector is *', () => {
        const element = document.createElement('div');
        element.innerHTML = '<span>1</span><span>2</span>';
        const result = (component as any).getNgContent(element, ['*']);
        expect(result.length).toBe(1);
        expect(result[0].length).toBe(2);
        expect(result[0][0].textContent).toBe('1');
        expect(result[0][1].textContent).toBe('2');
      });

      it('returns nodes matching specific selector', () => {
        const element = document.createElement('div');
        element.innerHTML = '<span class="match">1</span><span>2</span>';
        const result = (component as any).getNgContent(element, ['.match']);
        expect(result.length).toBe(1);
        expect(result[0].length).toBe(1);
        expect(result[0][0].textContent).toBe('1');
      });

      it('removes selected elements from the DOM', () => {
        const element = document.createElement('div');
        element.innerHTML = '<span class="match">1</span><span>2</span>';
        (component as any).getNgContent(element, ['.match']);
        expect(element.querySelectorAll('.match').length).toBe(0);
      });

      it('returns empty array when no elements match the selector', () => {
        const element = document.createElement('div');
        element.innerHTML = '<span>1</span><span>2</span>';
        const result = (component as any).getNgContent(element, ['.no-match']);
        expect(result.length).toBe(1);
        expect(result[0].length).toBe(0);
      });

      it('handles multiple selectors', () => {
        const element = document.createElement('div');
        element.innerHTML = '<span class="match1">1</span><span class="match2">2</span>';
        const result = (component as any).getNgContent(element, ['.match1', '.match2']);
        expect(result.length).toBe(2);
        expect(result[0].length).toBe(1);
        expect(result[0][0].textContent).toBe('1');
        expect(result[1].length).toBe(1);
        expect(result[1][0].textContent).toBe('2');
      });
    });
  });

  describe('when the current theme doesn\'t match a themed component', () => {
    describe('and it doesn\'t extend another theme', () => {
      beforeEach(waitForAsync(() => {
        setupTestingModuleForTheme('non-existing-theme');
      }));

      beforeEach(initComponent);

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

      it(`should set usedTheme to the name of the base theme`, waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(component.usedTheme).toEqual('base');
        });
      }));
    });

    describe('and it extends another theme', () => {
      describe('that doesn\'t match it either', () => {
        beforeEach(waitForAsync(() => {
          setupTestingModuleForTheme('current-theme', [
            { name: 'current-theme', extends: 'non-existing-theme' },
          ]);
        }));

        beforeEach(initComponent);

        it('should set compRef to the default component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('current-theme');
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('non-existing-theme');
            expect((component as any).compRef.instance.type).toEqual('default');
          });
        }));

        it('should sync up this component\'s input with the default component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).compRef.instance.testInput).toEqual('changed');
          });
        }));

        it(`should set usedTheme to the name of the base theme`, waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect(component.usedTheme).toEqual('base');
          });
        }));
      });

      describe('that does match it', () => {
        beforeEach(waitForAsync(() => {
          setupTestingModuleForTheme('current-theme', [
            { name: 'current-theme', extends: 'custom' },
          ]);
        }));

        beforeEach(initComponent);

        it('should set compRef to the themed component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('current-theme');
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('custom');
            expect((component as any).compRef.instance.type).toEqual('themed');
          });
        }));

        it('should sync up this component\'s input with the themed component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).compRef.instance.testInput).toEqual('changed');
          });
        }));

        it(`should set usedTheme to the name of the matched theme`, waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect(component.usedTheme).toEqual('custom');
          });
        }));
      });

      describe('that extends another theme that doesn\'t match it either', () => {
        beforeEach(waitForAsync(() => {
          setupTestingModuleForTheme('current-theme', [
            { name: 'current-theme', extends: 'parent-theme' },
            { name: 'parent-theme', extends: 'non-existing-theme' },
          ]);
        }));

        beforeEach(initComponent);

        it('should set compRef to the default component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('current-theme');
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('parent-theme');
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('non-existing-theme');
            expect((component as any).compRef.instance.type).toEqual('default');
          });
        }));

        it('should sync up this component\'s input with the default component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).compRef.instance.testInput).toEqual('changed');
          });
        }));

        it(`should set usedTheme to the name of the base theme`, waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect(component.usedTheme).toEqual('base');
          });
        }));
      });

      describe('that extends another theme that does match it', () => {
        beforeEach(waitForAsync(() => {
          setupTestingModuleForTheme('current-theme', [
            { name: 'current-theme', extends: 'parent-theme' },
            { name: 'parent-theme', extends: 'custom' },
          ]);
        }));

        beforeEach(initComponent);

        it('should set compRef to the themed component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('current-theme');
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('parent-theme');
            expect((component as any).importThemedComponent).toHaveBeenCalledWith('custom');
            expect((component as any).compRef.instance.type).toEqual('themed');
          });
        }));

        it('should sync up this component\'s input with the themed component', waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect((component as any).compRef.instance.testInput).toEqual('changed');
          });
        }));

        it(`should set usedTheme to the name of the matched theme`, waitForAsync(() => {
          fixture.whenStable().then(() => {
            expect(component.usedTheme).toEqual('custom');
          });
        }));
      });
    });
  });
});
