import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Parent container for the annotation uploader.
 */
@Component({
  selector: 'ds-iiif-annotation',
  templateUrl: './annotation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationComponent  {

  showComponent = false;

  constructor() {}

  toggleComponent(): void {
    this.showComponent = !this.showComponent;
  }

}
