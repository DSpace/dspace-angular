import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ComponentRef,
} from '@angular/core';
import { getComponentByWorkflowTaskOption } from './claimed-task-actions-decorator';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskActionsDirective } from './claimed-task-actions.directive';
import { hasValue, isNotEmpty, hasNoValue } from '../../../empty.util';
import { MyDSpaceActionsResult } from '../../mydspace-actions';
import { Item } from '../../../../core/shared/item.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';

@Component({
    selector: 'ds-claimed-task-actions-loader',
    templateUrl: './claimed-task-actions-loader.component.html',
    standalone: true,
    imports: [ClaimedTaskActionsDirective]
})
/**
 * Component for loading a ClaimedTaskAction component depending on the "option" input
 * Passes on the ClaimedTask to the component and subscribes to the processCompleted output
 */
export class ClaimedTaskActionsLoaderComponent implements OnInit, OnChanges {
  /**
   * The item object that belonging to the ClaimedTask object
   */
  @Input() item: Item;

  /**
   * The ClaimedTask object
   */
  @Input() object: ClaimedTask;

  /**
   * The name of the option to render
   * Passed on to the decorator to fetch the relevant component for this option
   */
  @Input() option: string;

  /**
   * The workflowitem object that belonging to the ClaimedTask object
   */
  @Input() workflowitem: WorkflowItem;

  /**
   * Emits the success or failure of a processed action
   */
  @Output() processCompleted = new EventEmitter<MyDSpaceActionsResult>();

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild(ClaimedTaskActionsDirective, {static: true}) claimedTaskActionsDirective: ClaimedTaskActionsDirective;

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<Component>;

  /**
   * The list of input and output names for the dynamic component
   */
  protected inAndOutputNames: (keyof ClaimedTaskActionsAbstractComponent & keyof this)[] = [
    'object',
    'option',
    'processCompleted',
  ];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  /**
   * Fetch, create and initialize the relevant component
   */
  ngOnInit(): void {
    this.instantiateComponent();
  }

  /**
   * Whenever the inputs change, update the inputs of the dynamic component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (hasNoValue(this.compRef)) {
      // sometimes the component has not been initialized yet, so it first needs to be initialized
      // before being called again
      this.instantiateComponent(changes);
    } else {
      // if an input or output has changed
      if (this.inAndOutputNames.some((name: any) => hasValue(changes[name]))) {
        this.connectInputsAndOutputs();
        if (this.compRef?.instance && 'ngOnChanges' in this.compRef.instance) {
          (this.compRef.instance as any).ngOnChanges(changes);
        }
      }
    }
  }

  private instantiateComponent(changes?: SimpleChanges): void {
    const comp = this.getComponentByWorkflowTaskOption(this.option);
    if (hasValue(comp)) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(comp);

      const viewContainerRef = this.claimedTaskActionsDirective.viewContainerRef;
      viewContainerRef.clear();

      this.compRef = viewContainerRef.createComponent(componentFactory);

      if (hasValue(changes)) {
        this.ngOnChanges(changes);
      } else {
        this.connectInputsAndOutputs();
      }
    }
  }

  getComponentByWorkflowTaskOption(option: string) {
    return getComponentByWorkflowTaskOption(option);
  }

  /**
   * Connect the in and outputs of this component to the dynamic component,
   * to ensure they're in sync
   */
  protected connectInputsAndOutputs(): void {
    if (isNotEmpty(this.inAndOutputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.inAndOutputNames.filter((name: any) => this[name] !== undefined).forEach((name: any) => {
        this.compRef.instance[name] = this[name];
      });
    }
  }
}
