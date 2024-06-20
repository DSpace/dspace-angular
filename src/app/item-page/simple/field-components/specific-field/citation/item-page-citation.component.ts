import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
@Component({
  selector: 'ds-item-page-citation-field',
  templateUrl: './item-page-citation.component.html',
})
export class ItemPageCitationFieldComponent implements OnInit {
  @Input() handle: string;

  citaceProStatus = true;
  private citaceProURL: SafeResourceUrl | null;

  constructor(
    private sanitizer: DomSanitizer,
    private configService: ConfigurationDataService
  ) {}


ngOnInit() {
  const citaceProUrl$ = this.configService.findByPropertyName('citace.pro.url');
  const universityUsingDspace$ = this.configService.findByPropertyName('citace.pro.university');
  const citaceProAllowed$ = this.configService.findByPropertyName('citace.pro.allowed');

  combineLatest([citaceProUrl$, universityUsingDspace$, citaceProAllowed$]).subscribe(([citaceProUrlData, universityData, citaceProAllowedData]) => {
    const citaceProBaseUrl = citaceProUrlData?.payload?.values?.[0];
    const universityUsingDspace = universityData?.payload?.values?.[0];
    this.citaceProURL = this.makeCitaceProURL(citaceProBaseUrl, universityUsingDspace);

    const citaceProAllowed = citaceProAllowedData?.payload?.values?.[0];
    this.citaceProStatus = citaceProAllowed === 'true';
  });
}


  makeCitaceProURL(
    citaceProBaseUrl: string,
    universityUsingDspace: string
  ): SafeResourceUrl | null {
    const url = `${citaceProBaseUrl}:${universityUsingDspace}:${this.handle}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get iframeSrc(): SafeResourceUrl | null {
    return this.citaceProURL;
  }
}
