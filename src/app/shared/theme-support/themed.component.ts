import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  SimpleChanges,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  OnChanges
} from '@angular/core';
import { hasValue, isNotEmpty } from '../empty.util';
import { Subscription } from 'rxjs';
import { ThemeService } from './theme.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, switchMap, map } from 'rxjs/operators';
import { GenericConstructor } from '../../core/shared/generic-constructor';

@Component({
  selector: 'ds-themed',
  styleUrls: ['./themed.component.scss'],
  templateUrl: './themed.component.html',
})
export abstract class ThemedComponent<T> implements OnInit, OnDestroy, OnChanges {
  @ViewChild('vcr', { read: ViewContainerRef }) vcr: ViewContainerRef;
  protected compRef: ComponentRef<T>;

  protected lazyLoadSub: Subscription;
  protected themeSub: Subscription;

  protected inAndOutputNames: (keyof T & keyof this)[] = [];

  constructor(
    protected resolver: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected themeService: ThemeService
  ) {
  }

  protected abstract getComponentName(): string;

  protected abstract importThemedComponent(themeName: string): Promise<any>;
  protected abstract importUnthemedComponent(): Promise<any>;

  ngOnChanges(changes: SimpleChanges): void {
    // if an input or output has changed
    if (this.inAndOutputNames.some((name: any) => hasValue(changes[name]))) {
      this.connectInputsAndOutputs();
    }
  }

  ngOnInit(): void {
    this.destroyComponentInstance();
    this.themeSub = this.themeService.getThemeName$().subscribe(() => {
      this.renderComponentInstance();
    });
  }

  ngOnDestroy(): void {
    [this.themeSub, this.lazyLoadSub].filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
    this.destroyComponentInstance();
  }

  protected renderComponentInstance(): void {
    this.destroyComponentInstance();

    if (hasValue(this.lazyLoadSub)) {
      this.lazyLoadSub.unsubscribe();
    }

    this.lazyLoadSub =
      fromPromise(this.importThemedComponent(this.themeService.getThemeName())).pipe(
        // if there is no themed version of the component an exception is thrown,
        // catch it and return null instead
        catchError(() => [null]),
        switchMap((themedFile: any) => {
          if (hasValue(themedFile) && hasValue(themedFile[this.getComponentName()])) {
            // if the file is not null, and exports a component with the specified name,
            // return that component
            return [themedFile[this.getComponentName()]];
          } else {
            // otherwise import and return the default component
            return fromPromise(this.importUnthemedComponent()).pipe(
              map((unthemedFile: any) => {
                return unthemedFile[this.getComponentName()];
              })
            );
          }
        }),
      ).subscribe((constructor: GenericConstructor<T>) => {
        const factory = this.resolver.resolveComponentFactory(constructor);
        this.compRef = this.vcr.createComponent(factory);
        this.connectInputsAndOutputs();
        this.cdr.markForCheck();
      });
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
    if (isNotEmpty(this.inAndOutputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.inAndOutputNames.forEach((name: any) => {
        this.compRef.instance[name] = this[name];
      });
    }
  }
}
