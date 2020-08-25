import { Component, OnInit } from '@angular/core';
import {  map, take } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { SectionDataService } from '../core/layout/section-data.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { Observable } from 'rxjs';
import { SectionComponent } from '../core/layout/models/section.model';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component representing the explore section.
 */
@Component({
    selector: 'ds-explore',
    templateUrl: './explore.component.html'
})
export class ExploreComponent implements OnInit {

    /**
     * The id of the current section.
     */
    sectionId: string;

    /**
     * Resolved section components splitted in rows.
     */
    sectionComponentRows: Observable<SectionComponent[][]>;

    constructor(
        private route: ActivatedRoute,
        private sectionDataService: SectionDataService ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => this.setupSectionComponents(params));
    }

    /**
     * Setup the section components of the explore page based on the section id.
     *
     * @param params the route params
     */
    setupSectionComponents( params: Params ) {
        this.sectionId = params.id;
        this.sectionComponentRows = this.sectionDataService.findById(params.id ).pipe(
            getFirstSucceededRemoteDataPayload(),
            map ( (section) => section.componentRows)
        );
    }
}
