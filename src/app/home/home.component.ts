import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { SpinnerService } from "../spinner/spinner.service";

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.Emulated,
    providers: [SpinnerService],
    selector: 'ds-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent {

    data:any = {};

    constructor(private spinner:SpinnerService) {
        spinner.activate();

        /* This small delay was merely added to mimic the spinner's behaviour when a page is loading */
        /* Please remove it and call the deactivate method when all components have been loaded instead */
        setTimeout(() => {
            spinner.deactivate();
        }, 100);

        this.universalInit();
    }

    universalInit() {

    }

}
