import { ClaimedTaskActionsLoaderComponent } from './claimed-task-actions-loader.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { spyOnExported } from '../../../testing/utils';
import * as decorators from './claimed-task-actions-decorator';
import { ClaimedTaskActionsDirective } from './claimed-task-actions.directive';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { TranslateModule } from '@ngx-translate/core';
import { ClaimedTaskActionsEditMetadataComponent } from '../edit-metadata/claimed-task-actions-edit-metadata.component';

describe('ClaimedTaskActionsLoaderComponent', () => {
  let comp: ClaimedTaskActionsLoaderComponent;
  let fixture: ComponentFixture<ClaimedTaskActionsLoaderComponent>;

  const option = 'test_option';
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ClaimedTaskActionsLoaderComponent, ClaimedTaskActionsEditMetadataComponent, ClaimedTaskActionsDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ComponentFactoryResolver]
    }).overrideComponent(ClaimedTaskActionsLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [ClaimedTaskActionsEditMetadataComponent]
      }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsLoaderComponent);
    comp = fixture.componentInstance;

    comp.object = object;
    comp.option = option;
    spyOnExported(decorators, 'getComponentByWorkflowTaskOption').and.returnValue(ClaimedTaskActionsEditMetadataComponent);
    fixture.detectChanges();
  }));

  describe('When the component is rendered', () => {
    it('should call the getComponentByWorkflowTaskOption function with the right option', () => {
      expect(decorators.getComponentByWorkflowTaskOption).toHaveBeenCalledWith(option);
    })
  });
});
