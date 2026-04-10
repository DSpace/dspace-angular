import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FullFileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';

export interface FormatIcon { icon: string; color: string; bg: string; }

@Component({
  selector: 'ds-themed-item-page-full-file-section',
  styleUrls: ['./full-file-section.component.scss'],
  templateUrl: './full-file-section.component.html',
  imports: [
    AsyncPipe,
    FileSizePipe,
    MetadataFieldWrapperComponent,
    PaginationComponent,
    ThemedFileDownloadLinkComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class FullFileSectionComponent extends BaseComponent {

  getFormatIcon(filename: string): FormatIcon {
    const ext = (filename || '').toLowerCase().split('.').pop() || '';

    if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'opus'].includes(ext)) {
      return { icon: 'fas fa-music',           color: '#6366f1', bg: '#eef2ff' };
    }
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v'].includes(ext)) {
      return { icon: 'fas fa-video',           color: '#0891b2', bg: '#ecfeff' };
    }
    if (['pdf'].includes(ext)) {
      return { icon: 'fas fa-file-pdf',        color: '#dc2626', bg: '#fef2f2' };
    }
    if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) {
      return { icon: 'fas fa-file-word',       color: '#2563eb', bg: '#eff6ff' };
    }
    if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) {
      return { icon: 'fas fa-file-excel',      color: '#16a34a', bg: '#f0fdf4' };
    }
    if (['ppt', 'pptx', 'odp'].includes(ext)) {
      return { icon: 'fas fa-file-powerpoint', color: '#ea580c', bg: '#fff7ed' };
    }
    if (['zip', 'tar', 'gz', 'rar', '7z', 'bz2'].includes(ext)) {
      return { icon: 'fas fa-file-archive',    color: '#b45309', bg: '#fffbeb' };
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tif', 'tiff'].includes(ext)) {
      return { icon: 'fas fa-image',           color: '#7c3aed', bg: '#f5f3ff' };
    }
    if (['txt', 'md', 'log'].includes(ext)) {
      return { icon: 'fas fa-file-alt',        color: '#475569', bg: '#f8fafc' };
    }
    return   { icon: 'fas fa-file',            color: '#64748b', bg: '#f1f5f9' };
  }
}
