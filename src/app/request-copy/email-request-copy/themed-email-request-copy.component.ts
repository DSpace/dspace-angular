import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { EmailRequestCopyComponent } from './email-request-copy.component';
import { RequestCopyEmail } from './request-copy-email.model';

/**
 * Themed wrapper for email-request-copy.component
 */
@Component({
    selector: 'ds-themed-email-request-copy',
    styleUrls: [],
    templateUrl: './../../shared/theme-support/themed.component.html',
    standalone: true
})
export class ThemedEmailRequestCopyComponent extends ThemedComponent<EmailRequestCopyComponent> {
  /**
   * Event emitter for sending the email
   */
  @Output() send: EventEmitter<RequestCopyEmail> = new EventEmitter<RequestCopyEmail>();

  /**
   * The subject of the email
   */
  @Input() subject: string;

  /**
   * The contents of the email
   */
  @Input() message: string;

  protected inAndOutputNames: (keyof EmailRequestCopyComponent & keyof this)[] = ['send', 'subject', 'message'];

  protected getComponentName(): string {
    return 'EmailRequestCopyComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/request-copy/email-request-copy/email-request-copy.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./email-request-copy.component');
  }
}
