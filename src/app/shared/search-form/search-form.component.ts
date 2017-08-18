import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
    selector: 'ds-search-form',
    styleUrls: ['./search-form.component.scss'],
    templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements OnInit {
    searchFormGroup: FormGroup;
    //
    // constructor() {
    //
    // }
    //
    ngOnInit(): void {
        this.searchFormGroup = new FormGroup({
            firstName: new FormControl()
        });
    }

}
