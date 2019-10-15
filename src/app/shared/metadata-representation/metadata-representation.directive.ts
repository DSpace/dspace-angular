import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dsMetadataRepresentation]',
})
export class MetadataRepresentationDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
