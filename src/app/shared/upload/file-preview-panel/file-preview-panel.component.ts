import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { ThemedFileDownloadLinkComponent } from '../../file-download-link/themed-file-download-link.component';
import { FormsModule } from '@angular/forms';

import { SafeUrlPipe } from '../../utils/safe-url-pipe';

@Component({
    selector: 'ds-file-preview-panel',
    templateUrl: './file-preview-panel.component.html',
    styleUrls: ['./file-preview-panel.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ThemedFileDownloadLinkComponent,
        FormsModule,
        SafeUrlPipe
    ]
})
export class FilePreviewPanelComponent implements OnChanges, OnDestroy {
    @Input() fileList: any[] = [];
    @Input() selectedFile: any;
    @Output() fileSelected = new EventEmitter<any>();

    public pdfUrl: SafeResourceUrl | null = null;
    private objectUrl: string | null = null;

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedFile && this.selectedFile) {
            this.updatePreview();
        }
    }

    private updatePreview() {
        this.cleanup();
        if (this.isPdf(this.selectedFile)) {
            const url = this.getDownloadUrl(this.selectedFile);
            if (url) {
                this.http.get(url, { responseType: 'blob' }).subscribe({
                    next: (blob) => {
                        this.objectUrl = URL.createObjectURL(blob);
                        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
                    },
                    error: (err) => {
                        console.error('FilePreviewPanelComponent: Error fetching blob', err);
                        this.pdfUrl = null;
                    }
                });
            }
        } else {
            this.pdfUrl = null;
        }
    }

    private cleanup() {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = null;
        }
    }

    ngOnDestroy() {
        this.cleanup();
    }

    onFileChange(event: any) {
        const file = this.fileList.find(f => f.uuid === event.target.value);
        this.fileSelected.emit(file);
    }

    isPdf(file: any): boolean {
        console.log('FilePreviewPanelComponent: Checking isPdf for', file);
        if (!file) return false;

        const mimetype = file?.format?.mimetype ||
            file?.metadata?.['dc.format']?.[0]?.value ||
            file?.metadata?.['dc.format.mimetype']?.[0]?.value;

        const isPdf = mimetype === 'application/pdf' ||
            this.getFileName(file).toLowerCase().endsWith('.pdf');

        console.log('FilePreviewPanelComponent: detected mimetype:', mimetype);
        console.log('FilePreviewPanelComponent: isPdf result', isPdf);
        return isPdf;
    }

    getDownloadUrl(file: any): string {
        console.log('FilePreviewPanelComponent: getDownloadUrl for', file);
        // Priority: content link in _links, then url property
        return file?._links?.content?.href || file?.url;
    }

    getFileName(file: any): string {
        if (!file) {
            return '';
        }
        // Try various common metadata keys for filename
        const metadata = file.metadata || {};
        return metadata['dc.title']?.[0]?.value ||
            metadata['dc.title']?.[0]?.display ||
            metadata['dc_title']?.[0]?.value ||
            file.uuid;
    }

    getBitstream(file: any): Bitstream {
        if (!file) {
            return undefined;
        }
        if (file instanceof Bitstream) {
            return file;
        }
        return Object.assign(new Bitstream(), {
            uuid: file.uuid,
            _links: file._links,
            metadata: file.metadata,
            format: file.format,
            sizeBytes: file.sizeBytes,
            checkSum: file.checkSum,
        });
    }
}
