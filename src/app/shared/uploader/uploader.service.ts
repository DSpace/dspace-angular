import { Injectable } from '@angular/core';

@Injectable()
export class UploaderService {
  private _overrideDragOverPage = false;

  public overrideDragOverPage() {
    this._overrideDragOverPage = true;
  }

  public allowDragOverPage() {
    this._overrideDragOverPage = false;
  }

  public isAllowedDragOverPage(): boolean {
    return !this._overrideDragOverPage;
  }
}
