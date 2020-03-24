import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

@Component({
    selector: 'ds-epeople-registry',
    templateUrl: './epeople-registry.component.html',
})
/**
 * A component used for managing all existing epeople within the repository.
 * The admin can create, edit or delete epeople here.
 */
export class EPeopleRegistryComponent {

    labelPrefix = 'admin.access-control.epeople.';

    /**
     * A list of all the current EPeople within the repository or the result of the search
     */
    ePeople: Observable<RemoteData<PaginatedList<EPerson>>>;

    /**
     * Pagination config used to display the list of epeople
     */
    config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
        id: 'epeople-list-pagination',
        pageSize: 5,
        currentPage: 1
    });

    /**
     * Whether or not to show the EPerson form
     */
    isEPersonFormShown: boolean;

    // The search form
    searchForm;

    constructor(private epersonService: EPersonDataService,
                private translateService: TranslateService,
                private notificationsService: NotificationsService,
                private formBuilder: FormBuilder) {
        this.updateEPeople({
            currentPage: 1,
            elementsPerPage: this.config.pageSize
        });
        this.isEPersonFormShown = false;
        this.searchForm = this.formBuilder.group(({
            scope: 'metadata',
            query: '',
        }));
    }

    /**
     * Event triggered when the user changes page
     * @param event
     */
    onPageChange(event) {
        this.updateEPeople({
            currentPage: event,
            elementsPerPage: this.config.pageSize
        });
    }

    /**
     * Update the list of EPeople by fetching it from the rest api or cache
     */
    private updateEPeople(options) {
        this.ePeople = this.epersonService.getEPeople(options);
    }

    /**
     * Force-update the list of EPeople by first clearing the cache related to EPeople, then performing
     * a new REST call
     */
    public forceUpdateEPeople() {
        this.epersonService.clearEPersonRequests();
        this.isEPersonFormShown = false;
        this.search({ query: '', scope: 'metadata' })
    }

    /**
     * Search in the EPeople by metadata (default) or email
     * @param data  Contains scope and query param
     */
    search(data: any) {
        this.ePeople = this.epersonService.searchByScope(data.scope, data.query, {
            currentPage: 1,
            elementsPerPage: this.config.pageSize
        });
    }

    /**
     * Checks whether the given EPerson is active (being edited)
     * @param eperson
     */
    isActive(eperson: EPerson): Observable<boolean> {
        return this.getActiveEPerson().pipe(
            map((activeEPerson) => eperson === activeEPerson)
        );
    }

    /**
     * Gets the active eperson (being edited)
     */
    getActiveEPerson(): Observable<EPerson> {
        return this.epersonService.getActiveEPerson();
    }

    /**
     * Start editing the selected EPerson
     * @param ePerson
     */
    toggleEditEPerson(ePerson: EPerson) {
        this.getActiveEPerson().pipe(take(1)).subscribe((activeEPerson: EPerson) => {
            if (ePerson === activeEPerson) {
                this.epersonService.cancelEditEPerson();
                this.isEPersonFormShown = false;
            } else {
                this.epersonService.editEPerson(ePerson);
                this.isEPersonFormShown = true;
            }
        });
        this.scrollToTop()
    }

    /**
     * Deletes EPerson, show notification on success/failure & updates EPeople list
     */
    deleteEPerson(ePerson: EPerson) {
        if (hasValue(ePerson.id)) {
            this.epersonService.deleteEPerson(ePerson).pipe(take(1)).subscribe((success: boolean) => {
                if (success) {
                    this.notificationsService.success(this.translateService.get(this.labelPrefix + 'notification.deleted.success', { name: ePerson.name }));
                    this.forceUpdateEPeople();
                } else {
                    this.notificationsService.error(this.translateService.get(this.labelPrefix + 'notification.deleted.failure', { name: ePerson.name }));
                }
                this.epersonService.cancelEditEPerson();
                this.isEPersonFormShown = false;
            })
        }
    }

    scrollToTop() {
        (function smoothscroll() {
            const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        })();
    }
}
