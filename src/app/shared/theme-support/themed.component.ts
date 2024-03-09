import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  from as fromPromise,
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  hasValue,
  isNotEmpty,
} from '../empty.util';
import { BASE_THEME_NAME } from './theme.constants';
import { ThemeService } from './theme.service';

@Component({
  selector: 'ds-themed',
  templateUrl: './themed.component.html',
})
export abstract class ThemedComponent<T> implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('vcr', { read: ViewContainerRef }) vcr: ViewContainerRef;
  @ViewChild('content') themedElementContent: ElementRef;
  protected compRef: ComponentRef<T>;

  protected subs: Subscription[] = [];

  /**
   * This variable should not be used anymore, since this has been split into separate lists that are automatically
   * filled in.
   */
  private inAndOutputNames: (keyof T & keyof this)[];

  private inputNames: string[] = [];

  private outputNames: string[] = [];

  /**
   * A data attribute on the ThemedComponent to indicate which theme the rendered component came from.
   */
  @HostBinding('attr.data-used-theme') usedTheme: string;

  constructor(
    protected themeService: ThemeService,
  ) {
  }

  protected abstract getComponentName(): string;

  protected abstract importThemedComponent(themeName: string): Promise<any>;
  protected abstract importUnthemedComponent(): Promise<any>;

  ngOnChanges(): void {
    if (hasValue(this.compRef)) {
      this.connectInputsAndOutputs();
    }
  }

  ngAfterViewInit(): void {
    this.initComponentInstance();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    this.destroyComponentInstance();
  }

  initComponentInstance(): void {
    this.subs.push(this.themeService?.getThemeName$().pipe(
      switchMap((themeName: string) => this.resolveThemedComponent(themeName)),
      switchMap((themedFile: Component) => {
        if (hasValue(themedFile) && hasValue(themedFile[this.getComponentName()])) {
          // if the file is not null, and exports a component with the specified name,
          // return that component
          return [themedFile[this.getComponentName()]];
        } else {
          // otherwise import and return the default component
          return fromPromise(this.importUnthemedComponent()).pipe(
            tap(() => this.usedTheme = BASE_THEME_NAME),
            map((unthemedFile: any) => {
              return unthemedFile[this.getComponentName()];
            }),
          );
        }
      }),
      map((constructor: GenericConstructor<T>) => {
        if (hasValue((constructor as any)?.ɵcmp?.inputs)) {
          this.inputNames = Object.keys((constructor as any)?.ɵcmp?.inputs);
        }
        if (hasValue((constructor as any)?.ɵcmp?.outputs)) {
          this.outputNames = Object.keys((constructor as any)?.ɵcmp?.outputs);
        }
        this.destroyComponentInstance();
        return this.vcr.createComponent(constructor, {
          projectableNodes: [this.themedElementContent.nativeElement.childNodes],
        });
      }),
    ).subscribe((compRef: ComponentRef<T>) => {
      this.compRef = compRef;
      this.connectInputsAndOutputs();
      this.themedElementContent.nativeElement.remove();
    }));
  }

  protected destroyComponentInstance(): void {
    if (hasValue(this.compRef)) {
      this.compRef.destroy();
      this.compRef = null;
    }
    if (hasValue(this.vcr)) {
      this.vcr.clear();
    }
  }

  protected connectInputsAndOutputs(): void {
    if (hasValue(this.compRef?.instance)) {
      this.inputNames.filter((name: any) => this[name] !== undefined).forEach((name: any) => {
        this.compRef.setInput(name, this[name]);
      });
      this.outputNames.filter((name: any) => this[name] !== undefined).forEach((name: any) => {
        this.compRef.instance[name] = this[name];
      });
    }
  }

  /**
   * Attempt to import this component from the current theme or a theme it {@link NamedThemeConfig.extends}.
   * Recurse until we succeed or when until we run out of themes to fall back to.
   *
   * @param themeName The name of the theme to check
   * @param checkedThemeNames The list of theme names that are already checked
   * @private
   */
  private resolveThemedComponent(themeName?: string, checkedThemeNames: string[] = []): Observable<Component> {
    if (isNotEmpty(themeName)) {
      return fromPromise(this.importThemedComponent(themeName)).pipe(
        tap(() => this.usedTheme = themeName),
        catchError(() => {
          // Try the next ancestor theme instead
          const nextTheme = this.themeService.getThemeConfigFor(themeName)?.extends;
          const nextCheckedThemeNames = [...checkedThemeNames, themeName];
          if (checkedThemeNames.includes(nextTheme)) {
            throw new Error('Theme extension cycle detected: ' + [...nextCheckedThemeNames, nextTheme].join(' -> '));
          } else {
            return this.resolveThemedComponent(nextTheme, nextCheckedThemeNames);
          }
        }),
      );
    } else {
      // If we got here, we've failed to import this component from any ancestor theme → fall back to unthemed
      return observableOf(null);
    }
  }
}
