import {Component, Input, OnInit} from '@angular/core';
import {DSpaceObjectType} from "../../core/shared/dspace-object-type.model";
import {SelectorActionType} from "../dso-selector/modal-wrappers/dso-selector-modal-wrapper.component";
import {DSpaceObject} from "../../core/shared/dspace-object.model";
import {NavigationExtras, Router} from "@angular/router";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {
    isAuthenticated,
} from '../../core/auth/selectors';
import {CoreState} from "../../core/core-state.model";

@Component({
    selector: 'ds-submission-modal',
    templateUrl: './submission-modal.component.html',
    styleUrls: ['./submission-modal.component.scss']
})
export class SubmissionModalComponent implements OnInit {

    objectType = DSpaceObjectType.ITEM;
    selectorTypes = [DSpaceObjectType.COLLECTION];
    action = SelectorActionType.CREATE;


    @Input() entityType: string;

    private router: Router;

    public isAuthenticated: Observable<boolean>;

    constructor(private store: Store<CoreState>, router: Router) {
        this.router = router;
    }

    ngOnInit(): void {
        this.isAuthenticated = this.store.pipe(select(isAuthenticated));
    }

    selectObject(dso: DSpaceObject) {
        document.getElementById('submissionModal').style.removeProperty('display');
        document.querySelector('body').style.removeProperty('modal-open');

        let mdbackdrop = document.querySelector('.modal-backdrop');
        if (mdbackdrop){
            mdbackdrop.classList.remove('modal-backdrop', 'show');
        }

        this.navigate(dso);
    }

    navigate(dso: DSpaceObject) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                ['collection']: dso.uuid,
            }
        };
        if (this.entityType) {
            navigationExtras.queryParams.entityType = this.entityType;
        }
        this.router.navigate(['/submit'], navigationExtras);
    }

}
