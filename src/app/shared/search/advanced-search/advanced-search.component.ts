import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { slide } from '../../animations/slide';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  animations: [slide],
})
  /**
   * This component represents the part of the search sidebar that contains advanced filters.
   */
export class AdvancedSearchComponent implements OnInit {
   /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;


  /**
   * Link to the search page
   */
  notab: boolean;

  closed: boolean;
  collapsedSearch = false;
  focusBox = false;

  advSearchForm: FormGroup;
  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private formBuilder: FormBuilder,
    protected searchService: SearchService,
    protected router: Router,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
  }

  ngOnInit(): void {

    this.advSearchForm = this.formBuilder.group({
      textsearch: new FormControl('', {
        validators: [Validators.required],
      }),
      filter: new FormControl('title', {
        validators: [Validators.required],
      }),
      operator: new FormControl('equals',
        { validators: [Validators.required], }),

    });
    this.collapsedSearch = this.isCollapsed();

  }

  get textsearch() {
    return this.advSearchForm.get('textsearch');
  }

  get filter() {
    return this.advSearchForm.get('filter');
  }

  get operator() {
    return this.advSearchForm.get('operator');
  }
  paramName(filter) {
    return 'f.' + filter;
  }
  onSubmit(data) {
    if (this.advSearchForm.valid) {
      let queryParams = { [this.paramName(data.filter)]: data.textsearch + ',' + data.operator };
      if (!this.inPlaceSearch) {
        this.router.navigate([this.searchService.getSearchLink()], { queryParams: queryParams, queryParamsHandling: 'merge' });
      } else {
        if (!this.router.url.includes('?')) {
          this.router.navigateByUrl(this.router.url + '?f.' + data.filter + '=' + data.textsearch + ',' + data.operator);
        } else {
          this.router.navigateByUrl(this.router.url + '&f.' + data.filter + '=' + data.textsearch + ',' + data.operator);
        }
      }

      this.advSearchForm.reset({ operator: data.operator, filter: data.filter, textsearch: '' });
    }
  }
  startSlide(event: any): void {
    if (event.toState === 'collapsed') {
      this.closed = true;
    }
    if (event.fromState === 'collapsed') {
      this.notab = false;
    }
  }
  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.closed = false;
    }
    if (event.toState === 'collapsed') {
      this.notab = true;
    }
  }
  toggle() {
    this.collapsedSearch = !this.collapsedSearch;
  }
  private isCollapsed(): boolean {
    return !this.collapsedSearch;
  }

}

