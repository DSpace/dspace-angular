import {
  isPlatformBrowser,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { coreSelector } from '@dspace/core/core.selectors';
import { CoreState } from '@dspace/core/core-state.model';
import { isLoading } from '@dspace/core/data/request-entry-state.model';
import { INotification } from '@dspace/core/notification-system/models/notification.model';
import { NotificationsState } from '@dspace/core/notification-system/notifications.reducers';
import { notificationsStateSelector } from '@dspace/core/notification-system/selectors';
import {
  createSelector,
  select,
} from '@ngrx/store';
import {
  NEVER,
  race,
  Subscription,
  timer,
} from 'rxjs';
import {
  distinctUntilChanged,
  switchMap,
  take,
} from 'rxjs/operators';

import { NotificationComponent } from '../../../../../app/notification-system/notification/notification.component';
import { NotificationsBoardComponent as BaseComponent } from '../../../../../app/notification-system/notifications-board/notifications-board.component';

/**
 * Tempo máximo que um aviso espera a página terminar de carregar. Se a aplicação não estabilizar até lá, o aviso aparece
 * assim mesmo, para nunca ficar preso.
 */
export const MAX_WAIT_FOR_PAGE_MS = 15000;

/**
 * Tempo sem nenhuma requisição carregando para considerar a página pronta. Cobre o intervalo entre o aviso ser criado e
 * a página nova começar a pedir dados.
 */
export const QUIET_MS = 300;

/**
 * Verdadeiro enquanto alguma requisição ao backend está pendente no store do DSpace.
 */
const requestsLoadingSelector = createSelector(
  coreSelector,
  (core: CoreState) => Object.values(core['data/request'] || {}).some((entry) => isLoading(entry?.state)),
);

/**
 * Avisos como a HU009 CA10.9 pede: no rodapé, por cerca de 5 s (config `notifications`), e abertos depois que o
 * usuário clica neles (HU009 D4).
 *
 * - O aviso só entra no quadro quando nenhuma requisição está carregando há {@link QUIET_MS}. Na base o tempo começa
 *   na criação e corre enquanto a página nova carrega: num servidor lento o aviso sumia menos de 1 s depois de a tela
 *   aparecer. Pausar não resolve, porque o cronômetro da base compensa o tempo parado e termina acelerado. O
 *   `ApplicationRef.isStable` também não serve: algum processo periódico do DSpace deixa a aplicação sempre instável.
 * - O clique fixa os avisos até serem fechados pelo X; mouse e foco do teclado pausam.
 */
@Component({
  selector: 'ds-notifications-board',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './notifications-board.component.html',
  styleUrls: ['../../../../../app/notification-system/notifications-board/notifications-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NotificationComponent,
  ],
})
export class NotificationsBoardComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * Verdadeiro depois de um clique num aviso: o tempo para até a lista esvaziar.
   */
  pinned = false;

  private hovered = false;

  private focused = false;

  private pinSub: Subscription;

  private readonly waitSubs = new Subscription();

  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    super.ngOnInit();
    this.pinSub = this.store.pipe(select(notificationsStateSelector)).subscribe((state: NotificationsState) => {
      if (state.length === 0 && this.pinned) {
        this.pinned = false;
        this.updatePause();
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.pinSub?.unsubscribe();
    this.waitSubs.unsubscribe();
  }

  /**
   * Todo aviso ganha o X, inclusive os que a base cria com `clickToClose: false`: um aviso fixado pelo clique
   * precisa de um jeito de ser fechado. No navegador, o aviso espera a página terminar de carregar antes de entrar.
   */
  add(item: INotification): void {
    const withClose = Object.assign({}, item, { options: Object.assign({}, item.options, { clickToClose: true }) });
    if (!isPlatformBrowser(this.platformId)) {
      super.add(withClose);
      return;
    }
    const pageReady$ = this.store.pipe(
      select(requestsLoadingSelector),
      distinctUntilChanged(),
      switchMap((loading) => loading ? NEVER : timer(QUIET_MS)),
    );
    this.waitSubs.add(race(pageReady$, timer(MAX_WAIT_FOR_PAGE_MS)).pipe(take(1)).subscribe(() => {
      super.add(withClose);
      this.cdr.detectChanges();
    }));
  }

  pause(): void {
    this.hovered = true;
    this.updatePause();
  }

  resume(): void {
    this.hovered = false;
    this.updatePause();
  }

  focusIn(): void {
    this.focused = true;
    this.updatePause();
  }

  focusOut(): void {
    this.focused = false;
    this.updatePause();
  }

  /**
   * Fixa os avisos abertos. O clique no X fecha aquele aviso e não fixa os demais.
   */
  pin(event: MouseEvent): void {
    if ((event.target as HTMLElement)?.closest('.btn-close')) {
      return;
    }
    this.pinned = true;
    this.updatePause();
  }

  private updatePause(): void {
    this.isPaused$.next(this.hovered || this.focused || this.pinned);
  }
}
