import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { INotification } from '@dspace/core/notification-system/models/notification.model';
import { NotificationsState } from '@dspace/core/notification-system/notifications.reducers';
import { notificationsStateSelector } from '@dspace/core/notification-system/selectors';
import { select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { NotificationComponent } from '../../../../../app/notification-system/notification/notification.component';
import { NotificationsBoardComponent as BaseComponent } from '../../../../../app/notification-system/notifications-board/notifications-board.component';

/**
 * Avisos como a HU009 CA10.9 pede: no rodapé, por cerca de 5 s (config `notifications`), e abertos depois que o
 * usuário clica neles. A base só pausa com o mouse em cima; aqui o clique fixa os avisos até serem fechados pelo X,
 * e o foco do teclado também pausa (HU009 D4).
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

  private pinSub: Subscription;

  ngOnInit(): void {
    super.ngOnInit();
    this.pinSub = this.store.pipe(select(notificationsStateSelector)).subscribe((state: NotificationsState) => {
      if (state.length === 0 && this.pinned) {
        this.pinned = false;
        this.isPaused$.next(false);
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.pinSub?.unsubscribe();
  }

  /**
   * Todo aviso ganha o X, inclusive os que a base cria com `clickToClose: false`: um aviso fixado pelo clique
   * precisa de um jeito de ser fechado.
   */
  add(item: INotification): void {
    super.add(Object.assign({}, item, { options: Object.assign({}, item.options, { clickToClose: true }) }));
  }

  pause(): void {
    this.isPaused$.next(true);
  }

  resume(): void {
    if (!this.pinned) {
      this.isPaused$.next(false);
    }
  }

  /**
   * Fixa os avisos abertos. O clique no X fecha aquele aviso e não fixa os demais.
   */
  pin(event: MouseEvent): void {
    if ((event.target as HTMLElement)?.closest('.btn-close')) {
      return;
    }
    this.pinned = true;
    this.isPaused$.next(true);
  }
}
