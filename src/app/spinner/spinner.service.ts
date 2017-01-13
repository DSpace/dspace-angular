import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import {Observable} from 'rxjs';
import {SpinnerActions} from "./spinner.actions";
import {SpinnerState} from "./spinner.reducer";

@Injectable()
export class SpinnerService {
    active: Observable<boolean>
    constructor(private store: Store<SpinnerState>) {
        this.active = this.store.select('spinner')
            .map(({ active }: SpinnerState) => active);;
    }

    activate(): void {
        this.store.dispatch(SpinnerActions.show());
    }

    deactivate(): void {
        this.store.dispatch(SpinnerActions.hide());
    }

    isActive(): Observable<boolean> {
        return this.active;
    }


}