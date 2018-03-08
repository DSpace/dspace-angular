import { Component } from '@angular/core';
import { PRIMARY_OUTLET, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    // const url = '/mydspace?view=list';
    // const urlTree: UrlTree = this.router.parseUrl(url);
    // const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    // const s: UrlSegment[] = g.segments;
    // const path = g.toString();
    // const params =  urlTree.queryParams;
    // console.log('set redirect ', urlTree);
    // console.log('set redirect ', path);
    // console.log('set redirect ', params);
    // const params = {view: 'list'}
    // this.router.navigate(['/mydspace', params]);
  }
}
