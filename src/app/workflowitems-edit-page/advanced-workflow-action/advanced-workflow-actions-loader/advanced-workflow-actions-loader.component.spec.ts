/* eslint-disable max-classes-per-file */
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Directive,
  Injector,
  NO_ERRORS_SCHEMA,
  ViewContainerRef,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { getMockThemeService } from 'src/app/shared/mocks/theme-service.mock';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';

import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';
import { DynamicComponentLoaderDirective } from '../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { rendersAdvancedWorkflowTaskOption } from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { RouterStub } from '../../../shared/testing/router.stub';
import { AdvancedWorkflowActionsLoaderComponent } from './advanced-workflow-actions-loader.component';

const ADVANCED_WORKFLOW_ACTION_TEST = 'testaction';

describe('AdvancedWorkflowActionsLoaderComponent', () => {
  let component: AdvancedWorkflowActionsLoaderComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionsLoaderComponent>;

  let router: RouterStub;
  let mockComponentFactoryResolver: any;
  let themeService: ThemeService;

  beforeEach(async () => {
    router = new RouterStub();
    mockComponentFactoryResolver = {
      resolveComponentFactory: jasmine.createSpy('resolveComponentFactory').and.returnValue(
        AdvancedWorkflowActionTestComponent,
      ),
    };
    themeService = getMockThemeService();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        DynamicComponentLoaderDirective,
        AdvancedWorkflowActionsLoaderComponent,
        AdvancedWorkflowActionTestComponent,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: ComponentFactoryResolver, useValue: mockComponentFactoryResolver },
        { provide: Injector, useValue: {} },
        ViewContainerRef,
        { provide: ThemeService, useValue: themeService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(AdvancedWorkflowActionsLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionsLoaderComponent);
    component = fixture.componentInstance;
    component.type = ADVANCED_WORKFLOW_ACTION_TEST;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });

  describe('When the component is rendered', () => {
    it('should display the AdvancedWorkflowActionTestComponent when the type has been defined in a rendersAdvancedWorkflowTaskOption', () => {
      spyOn(component, 'getComponent').and.returnValue(AdvancedWorkflowActionTestComponent);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getComponent).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('#AdvancedWorkflowActionsLoaderComponent'))).not.toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to page not found when the type has not been defined in a rendersAdvancedWorkflowTaskOption', () => {
      spyOn(component, 'getComponent').and.returnValue(undefined);
      component.type = 'nonexistingaction';

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getComponent).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([PAGE_NOT_FOUND_PATH]);
    });
  });
});

@rendersAdvancedWorkflowTaskOption(ADVANCED_WORKFLOW_ACTION_TEST)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '<span id="AdvancedWorkflowActionsLoaderComponent"></span>',
  standalone: true,
})
class AdvancedWorkflowActionTestComponent {
}

@Directive({
  selector: '[dsAdvancedWorkflowActions]',
  standalone: true,
})
export class MockAdvancedWorkflowActionsDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
