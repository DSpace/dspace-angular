import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'dsSafeUrl'})
export class SafeUrlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {}
    transform(url) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    }
}