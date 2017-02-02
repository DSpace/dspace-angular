import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs';
import { SpinnerShowAction, SpinnerHideAction } from "./spinner.actions";
import { SpinnerState } from "./spinner.reducer";

@Injectable()
export class SpinnerService {
    active:Observable<boolean>;

    constructor(private store:Store<SpinnerState>) {
    }

    activate():void {
        this.store.dispatch(new SpinnerShowAction());
    }

    deactivate():void {
        this.store.dispatch(new SpinnerHideAction());
    }

    isActive():Observable<boolean> {
        return this.active = this.store.select('spinner').map(({ active }: SpinnerState) => active);
    }


}