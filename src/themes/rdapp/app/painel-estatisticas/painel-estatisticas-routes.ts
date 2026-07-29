import { Route } from '@angular/router';

import { PainelEstatisticasComponent } from './painel-estatisticas.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: PainelEstatisticasComponent,
    pathMatch: 'full',
    data: { title: 'Painel de Estatísticas' },
  },
];
