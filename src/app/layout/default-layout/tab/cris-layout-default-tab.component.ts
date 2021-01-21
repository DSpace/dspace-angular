import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Box } from '../../../core/layout/models/box.model';
import { CrisLayoutLoaderDirective } from '../../directives/cris-layout-loader.directive';
import { CrisLayoutTabModelComponent as CrisLayoutTabObj } from '../../models/cris-layout-tab.model';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { BoxDataService } from '../../../core/layout/box-data.service';
import { CrisLayoutTab } from '../../decorators/cris-layout-tab.decorator';
import { getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { getCrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { Subscription } from 'rxjs';
import { hasValue } from '../../../shared/empty.util';

/**
 * This component defines the default layout for all tabs of DSpace Items.
 * This component can be overwritten for a specific Item type using
 * CrisLayoutTabModelComponent decorator
 */
@Component({
  selector: 'ds-cris-layout-default-tab',
  templateUrl: './cris-layout-default-tab.component.html',
  styleUrls: ['./cris-layout-default-tab.component.scss']
})
@CrisLayoutTab(LayoutPage.DEFAULT, LayoutTab.DEFAULT)
export class CrisLayoutDefaultTabComponent extends CrisLayoutTabObj implements OnInit, OnDestroy {

  boxes: Box[];
  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, {static: true}) crisLayoutLoader: CrisLayoutLoaderDirective;

  showLoader: boolean;

  componentRef: ComponentRef<Component>[] = [];
  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    public cd: ChangeDetectorRef,
    private boxService: BoxDataService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super();
  }

  ngOnInit() {
    this.showLoader = true;
    this.subs.push(this.boxService.findByItem(this.item.id, this.tab.id, followLink('configuration'))
      .pipe(getFirstSucceededRemoteListPayload())
      .subscribe({
        next: (next: Box[]) => {
          this.boxes = next;
          this.addBoxes(this.boxes);
          this.cd.markForCheck();
        },
        complete: () => {
          this.showLoader = false;
        }
      }));
  }

  addBoxes(boxes: Box[]) {
    const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
    viewContainerRef.clear();

    boxes.forEach((box) => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.getComponent(box.boxType)
      );
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (componentRef.instance as any).item = this.item;
      (componentRef.instance as any).box = box;
      this.componentRef.push(componentRef);
    });
  }

  private getComponent(boxType: string): GenericConstructor<Component> {
    return getCrisLayoutBox(this.item, this.tab.shortname, boxType);
  }

  ngOnDestroy(): void {
    if (this.componentRef && this.componentRef.length > 0) {
      this.componentRef.forEach((component) => {
        component.destroy();
      });
    }
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
