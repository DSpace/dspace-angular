import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ContributorsComponent as BaseComponent } from '../../../../../app/info/contributors/contributors.component';

export interface ContribPerson {
  nameKey: string;
  roleKey: string;
}

export interface ContribSubsection {
  titleKey: string;
  contributors: ContribPerson[];
}

export interface ContribSection {
  index: number;
  icon: string;
  titleKey: string;
  contributors?: ContribPerson[];
  subsections?: ContribSubsection[];
}

@Component({
  selector: 'ds-themed-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss'],
  imports: [TranslateModule],
})
export class ContributorsComponent extends BaseComponent {
  openSections: Set<number> = new Set();

  readonly sections: ContribSection[] = [
    {
      index: 0, icon: 'fas fa-layer-group', titleKey: 'contrib.accordion.design',
      contributors: [
        { nameKey: 'contrib.d.p1', roleKey: 'contrib.role.design-impl' },
        { nameKey: 'contrib.d.p2', roleKey: 'contrib.role.design-impl' },
        { nameKey: 'contrib.d.p3', roleKey: 'contrib.role.design-impl' },
        { nameKey: 'contrib.d.p4', roleKey: 'contrib.role.design-impl' },
        { nameKey: 'contrib.d.p5', roleKey: 'contrib.role.impl' },
      ],
    },
    {
      index: 1, icon: 'fas fa-tools', titleKey: 'contrib.accordion.project',
      contributors: [
        { nameKey: 'contrib.pa.p1',  roleKey: 'contrib.role.archive-coord' },
        { nameKey: 'contrib.pa.p2',  roleKey: 'contrib.role.iface-metadata' },
        { nameKey: 'contrib.pa.p3',  roleKey: 'contrib.role.iface-metadata' },
        { nameKey: 'contrib.pa.p4',  roleKey: 'contrib.role.tech-assist' },
        { nameKey: 'contrib.pa.p5',  roleKey: 'contrib.role.tech-assist' },
        { nameKey: 'contrib.pa.p6',  roleKey: 'contrib.role.tech-assist' },
        { nameKey: 'contrib.pa.p7',  roleKey: 'contrib.role.tech-assist' },
        { nameKey: 'contrib.pa.p8',  roleKey: 'contrib.role.tech-assist' },
        { nameKey: 'contrib.pa.p9',  roleKey: 'contrib.role.tech-assist' },
        { nameKey: 'contrib.pa.p10', roleKey: 'contrib.role.tech-assist' },
        { nameKey: 'contrib.pa.p11', roleKey: 'contrib.role.net-server' },
        { nameKey: 'contrib.pa.p12', roleKey: 'contrib.role.net-server' },
      ],
    },
    {
      index: 2, icon: 'fas fa-globe-asia', titleKey: 'contrib.accordion.sppel',
      contributors: [
        { nameKey: 'contrib.sp.p1',  roleKey: 'contrib.role.coll-admin' },
        { nameKey: 'contrib.sp.p2',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p3',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p4',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p5',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p6',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p7',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p8',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p9',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p10', roleKey: 'contrib.role.lang-profile-ed' },
        { nameKey: 'contrib.sp.p11', roleKey: 'contrib.role.content-writer' },
        { nameKey: 'contrib.sp.p12', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p13', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p14', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p15', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p16', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p17', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p18', roleKey: 'contrib.role.lang-profile-ed' },
        { nameKey: 'contrib.sp.p19', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p20', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p21', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p22', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p23', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p24', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p25', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p26', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p27', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p28', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p29', roleKey: 'contrib.role.metadata-lp-ed' },
        { nameKey: 'contrib.sp.p30', roleKey: 'contrib.role.metadata-lp-ed' },
        { nameKey: 'contrib.sp.p31', roleKey: 'contrib.role.metadata-lp-ed' },
        { nameKey: 'contrib.sp.p32', roleKey: 'contrib.role.metadata-lp-ed' },
        { nameKey: 'contrib.sp.p33', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p34', roleKey: 'contrib.role.metadata-lp-ed' },
        { nameKey: 'contrib.sp.p35', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p36', roleKey: 'contrib.role.metadata-lp-ed' },
        { nameKey: 'contrib.sp.p37', roleKey: 'contrib.role.metadata-lp-ed' },
        { nameKey: 'contrib.sp.p38', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p39', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p40', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p41', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p42', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p43', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p44', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p45', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p46', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p47', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p48', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p49', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p50', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p51', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.sp.p52', roleKey: 'contrib.role.acct-assist' },
        { nameKey: 'contrib.sp.p53', roleKey: 'contrib.role.office-assist' },
      ],
    },
    {
      index: 3, icon: 'fas fa-video', titleKey: 'contrib.accordion.bhasha',
      contributors: [
        { nameKey: 'contrib.bm.p1',  roleKey: 'contrib.role.coll-admin' },
        { nameKey: 'contrib.bm.p2',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p3',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p4',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p5',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p6',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p7',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p8',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p9',  roleKey: 'contrib.role.tech-support' },
        { nameKey: 'contrib.bm.p10', roleKey: 'contrib.role.data-coll' },
        { nameKey: 'contrib.bm.p11', roleKey: 'contrib.role.data-coll' },
        { nameKey: 'contrib.bm.p12', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p13', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p14', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p15', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p16', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p17', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p18', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bm.p19', roleKey: 'contrib.role.metadata-ed' },
      ],
    },
    {
      index: 4, icon: 'fas fa-book-reader', titleKey: 'contrib.accordion.bharatavani',
      contributors: [
        { nameKey: 'contrib.bv.p1',  roleKey: 'contrib.role.coll-admin' },
        { nameKey: 'contrib.bv.p2',  roleKey: 'contrib.role.metadata-rev' },
        { nameKey: 'contrib.bv.p3',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p4',  roleKey: 'contrib.role.tech-support' },
        { nameKey: 'contrib.bv.p5',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p6',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p7',  roleKey: 'contrib.role.content-ed' },
        { nameKey: 'contrib.bv.p8',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p9',  roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p10', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p11', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p12', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p13', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p14', roleKey: 'contrib.role.metadata-ed' },
        { nameKey: 'contrib.bv.p15', roleKey: 'contrib.role.metadata-ed' },
      ],
    },
    {
      index: 5, icon: 'fas fa-university', titleKey: 'contrib.accordion.ciil',
      subsections: [
        {
          titleKey: 'contrib.ciil.sub.publications',
          contributors: [
            { nameKey: 'contrib.cp.p1', roleKey: 'contrib.role.coll-admin' },
            { nameKey: 'contrib.cp.p2', roleKey: 'contrib.role.contributor' },
            { nameKey: 'contrib.cp.p3', roleKey: 'contrib.role.metadata-ed' },
            { nameKey: 'contrib.cp.p4', roleKey: 'contrib.role.scanner' },
          ],
        },
        {
          titleKey: 'contrib.ciil.sub.tape-archive',
          contributors: [
            { nameKey: 'contrib.nta.p1', roleKey: 'contrib.role.coll-admin' },
            { nameKey: 'contrib.nta.p2', roleKey: 'contrib.role.metadata-ed' },
          ],
        },
        {
          titleKey: 'contrib.ciil.sub.classical',
          contributors: [
            { nameKey: 'contrib.cl.p1', roleKey: 'contrib.role.kannada-admin' },
            { nameKey: 'contrib.cl.p2', roleKey: 'contrib.role.telugu-admin' },
            { nameKey: 'contrib.cl.p3', roleKey: 'contrib.role.odia-admin' },
          ],
        },
      ],
    },
  ];

  toggleSection(index: number): void {
    if (this.openSections.has(index)) {
      this.openSections.delete(index);
    } else {
      this.openSections.add(index);
    }
  }
}
