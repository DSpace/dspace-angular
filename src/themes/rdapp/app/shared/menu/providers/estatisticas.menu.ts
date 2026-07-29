import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';

import { MenuItemType } from '../../../../../../app/shared/menu/menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../../../../../../app/shared/menu/menu-provider.model';

/**
 * Menu provider for the "Painel de Estatísticas" link in the rdapp public navbar.
 * Points to the public dashboard at /estatisticas (HU006). The native DSpace
 * usage-statistics pages remain reachable at /statistics/** via the core
 * StatisticsMenuProvider (visible only to authorized users).
 */
@Injectable()
export class EstatisticasMenuProvider extends AbstractMenuProvider {
  public getSections(): Observable<PartialMenuSection[]> {
    return of([
      {
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'rdapp.menu.estatisticas',
          link: '/estatisticas',
        },
        icon: 'chart-column',
      },
    ] as PartialMenuSection[]);
  }
}
