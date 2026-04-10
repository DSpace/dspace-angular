import { DOCUMENT, isPlatformBrowser, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Item } from '../../../../../../app/core/shared/item.model';
import { CitationFormatterService } from '../../../../../../app/item-page/simple/citation/citation-formatter.service';
import { CitationData, CitationTab } from '../../../../../../app/item-page/simple/citation/models/citation.model';

@Component({
  selector: 'ds-item-cite',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss'],
  imports: [NgClass, FormsModule, TranslateModule],
})
export class CitationComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() item!: Item;
  @ViewChild('backdropRef') backdropRef!: ElementRef<HTMLElement>;

  private readonly citationService = inject(CitationFormatterService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  showModal = false;
  activeTab: CitationTab = 'apa';
  copySuccess = false;
  includeDescription = false;

  citationData!: CitationData;

  ngOnInit(): void {
    if (!this.item) { return; }
    const pageUrl = isPlatformBrowser(this.platformId) ? window.location.href : '';
    this.citationData = this.citationService.extractCitationData(this.item, pageUrl);
  }

  // Move backdrop to <body> so it escapes overflow:hidden + flex stacking context
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.backdropRef?.nativeElement) {
      this.document.body.appendChild(this.backdropRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    const el = this.backdropRef?.nativeElement;
    if (el?.parentNode) { el.parentNode.removeChild(el); }
  }

  get activeText(): string {
    if (!this.citationData) { return ''; }
    if (this.activeTab === 'bibtex') {
      return this.citationService.formatBibTeX(this.citationData, this.includeDescription);
    }
    if (this.activeTab === 'ris') {
      return this.citationService.formatRIS(this.citationData, this.includeDescription);
    }
    return this.citationService.formatAPA(this.citationData, this.includeDescription);
  }

  get hasDescription(): boolean {
    return !!this.citationData?.description;
  }

  openModal(): void  { this.showModal = true;  this.copySuccess = false; }
  closeModal(): void { this.showModal = false; this.copySuccess = false; }
  setTab(tab: CitationTab): void { this.activeTab = tab; this.copySuccess = false; }

  copyToClipboard(): void {
    if (!isPlatformBrowser(this.platformId)) { return; }
    navigator.clipboard.writeText(this.activeText).then(
      () => { this.copySuccess = true; setTimeout(() => { this.copySuccess = false; }, 2500); },
      () => { /* silent fail */ },
    );
  }

  downloadFile(tab: 'bibtex' | 'ris'): void {
    if (!isPlatformBrowser(this.platformId)) { return; }
    const isRis    = tab === 'ris';
    const content  = isRis
      ? this.citationService.formatRIS(this.citationData, this.includeDescription)
      : this.citationService.formatBibTeX(this.citationData, this.includeDescription);
    const filename = isRis ? 'citation.ris' : 'citation.bib';
    const mime     = isRis ? 'application/x-research-info-systems' : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cite-backdrop')) {
      this.closeModal();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') { this.closeModal(); }
  }
}
