import { getRemoteDataPayload } from './../../core/shared/operators';
import { CorrectionTypeDataService } from './../../core/submission/correctiontype-data.service';
import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { CorrectionTypeMode } from '../../core/submission/models/correction-type-mode.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { getCorrectionComponent } from './correction-suggestion-page.decorator';
import { ActivatedRoute, Params } from '@angular/router';
import { hasValue } from '../empty.util';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-correction-suggestion',
  templateUrl: './correction-suggestion.component.html',
  styleUrls: ['./correction-suggestion.component.scss']
})
export class CorrectionSuggestionComponent implements OnInit {

  /**
   * The correction type object
   */
  public correctionTypeObject: CorrectionTypeMode;

  /**
   * The correction type id
   */
  private correctionTypeId: string;

  /**
   * The creation form
   */
  private creationForm: string;

  /**
   * The injector for the component
   */
  public objectInjector: Injector;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private aroute: ActivatedRoute,
    private correctionTypeDataService: CorrectionTypeDataService,
    private injector: Injector,
  ) {
    this.aroute.params.subscribe((params: Params) => {
      this.correctionTypeId = params.correctionType;
    });
  }

  ngOnInit(): void {
    this.initComponent();
  }

  /**
   * Initialize the component by fetching the correction type object
   * and rendering the correct component based on the creation form
   */
  initComponent(): void {
    if (hasValue(this.correctionTypeId)) {
      this.correctionTypeDataService.getCorrectionTypeById(this.correctionTypeId)
        .pipe(
          getFirstCompletedRemoteData(),
          getRemoteDataPayload(),
        )
        .subscribe((correctionType: CorrectionTypeMode) => {
          if (hasValue(correctionType)) {
            this.correctionTypeObject = correctionType;
            this.creationForm = correctionType.creationForm;
            this.componentFactoryResolver.resolveComponentFactory(this.getComponent());
            this.injectData();
          }
        });
    }
  }

  /**
   * Inject the data into the component
   */
  private injectData(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'correctionTypeObjectProvider', useValue: this.correctionTypeObject, deps: [] },
      ],
      parent: this.injector,
    });
  }

  /**
 * Fetch the component depending on the creation form
 * @returns {GenericConstructor<Component>}
 */
  getComponent(): GenericConstructor<Component> {
    return getCorrectionComponent(this.creationForm);
  }
}
