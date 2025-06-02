/* eslint-disable max-classes-per-file */
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  Router,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { getMockThemeService } from 'src/app/shared/mocks/theme-service.mock';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';

import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';
import { DynamicComponentLoaderDirective } from '../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { RouterStub } from '../../../shared/testing/router.stub';
import { AdvancedWorkflowActionType } from '../advanced-workflow-action-type';
import { AdvancedWorkflowActionsLoaderComponent } from './advanced-workflow-actions-loader.component';

const ADVANCED_WORKFLOW_ACTION_TEST = 'testaction' as AdvancedWorkflowActionType;

describe('AdvancedWorkflowActionsLoaderComponent', () => {
  let component: AdvancedWorkflowActionsLoaderComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionsLoaderComponent>;

  let router: RouterStub;
  let themeService: ThemeService;

  beforeEach(async () => {
    router = new RouterStub();
    themeService = getMockThemeService();

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        DynamicComponentLoaderDirective,
        AdvancedWorkflowActionsLoaderComponent,
        AdvancedWorkflowActionTestComponent,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: ThemeService, useValue: themeService },
      ],
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
    it('should display the AdvancedWorkflowActionTestComponent when the type has been defined in a rendersAdvancedWorkflowTaskOption', async () => {
      spyOn(component, 'getComponent').and.returnValue(Promise.resolve(AdvancedWorkflowActionTestComponent));
      router.navigate.calls.reset();

      component.ngOnInit();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.getComponent).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('#AdvancedWorkflowActionsLoaderComponent'))).not.toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to page not found when the type has not been defined in a rendersAdvancedWorkflowTaskOption', () => {
      spyOn(component, 'getComponent').and.returnValue(undefined);
      component.type = 'nonexistingaction' as any;

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getComponent).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([PAGE_NOT_FOUND_PATH]);
    });
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '<span id="AdvancedWorkflowActionsLoaderComponent"></span>',
  standalone: true,
})
// @rendersAdvancedWorkflowTaskOption(ADVANCED_WORKFLOW_ACTION_TEST)
class AdvancedWorkflowActionTestComponent {
}
