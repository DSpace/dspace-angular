import {
  LowerCasePipe,
  NgClass,
  NgForOf,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { SearchService } from '../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { slide } from '../../animations/slide';
import { BrowserOnlyPipe } from '../../utils/browser-only.pipe';

@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  animations: [slide],
  imports: [
    NgClass,
    TranslateModule,
    ReactiveFormsModule,
    BrowserOnlyPipe,
    LowerCasePipe,
    NgForOf,
  ],
  standalone: true,
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
        { validators: [Validators.required] }),

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
      const queryParams = { [this.paramName(data.filter)]: data.textsearch + ',' + data.operator };
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

