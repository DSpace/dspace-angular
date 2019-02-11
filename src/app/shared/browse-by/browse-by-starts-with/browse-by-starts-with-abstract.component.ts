import { Inject } from '@angular/core';

export class BrowseByStartsWithAbstractComponent {
  public constructor(@Inject('startsWithOptions') public startsWithOptions: any[]) {
  }
}
