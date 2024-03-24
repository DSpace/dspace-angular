import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractComponentLoaderComponent } from 'src/app/shared/abstract-component-loader/abstract-component-loader.component';

import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { hasValue } from '../../../shared/empty.util';
import { getAdvancedComponentByWorkflowTaskOption } from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { ThemeService } from '../../../shared/theme-support/theme.service';

/**
 * Component for loading a {@link AdvancedWorkflowActionComponent} depending on the "{@link type}" input
 */
@Component({
  selector: 'ds-advanced-workflow-actions-loader',
  templateUrl: '../../../shared/abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
})
export class AdvancedWorkflowActionsLoaderComponent extends AbstractComponentLoaderComponent<Component> implements OnInit {

  /**
   * The name of the type to render
   * Passed on to the decorator to fetch the relevant component for this option
   */
  @Input() type: string;

  protected inputNames: (keyof this & string)[] = [
    ...this.inputNames,
    'type',
  ];

  constructor(
    protected themeService: ThemeService,
    private router: Router,
  ) {
    super(themeService);
  }

  ngOnInit(): void {
    if (hasValue(this.getComponent())) {
      super.ngOnInit();
    } else {
      void this.router.navigate([PAGE_NOT_FOUND_PATH]);
    }
  }

  public getComponent(): GenericConstructor<Component> {
    return getAdvancedComponentByWorkflowTaskOption(this.type) as GenericConstructor<Component>;
  }

}
