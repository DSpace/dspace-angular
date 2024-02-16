import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

/**
 * Interface for the route parameters.
 */
<<<<<<<< HEAD:src/app/quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page-resolver.service.ts
export interface NotificationsSuggestionTargetsPageParams {
========
export interface AdminNotificationsPublicationClaimPageParams {
>>>>>>>> main:src/app/admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page-resolver.service.ts
  pageId?: string;
  pageSize?: number;
  currentPage?: number;
}

/**
 * This class represents a resolver that retrieve the route data before the route is activated.
 */
@Injectable()
<<<<<<<< HEAD:src/app/quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page-resolver.service.ts
export class NotificationsSuggestionTargetsPageResolver implements Resolve<NotificationsSuggestionTargetsPageParams> {
========
export class AdminNotificationsPublicationClaimPageResolver implements Resolve<AdminNotificationsPublicationClaimPageParams> {
>>>>>>>> main:src/app/admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page-resolver.service.ts

  /**
   * Method for resolving the parameters in the current route.
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns AdminNotificationsSuggestionTargetsPageParams Emits the route parameters
   */
<<<<<<<< HEAD:src/app/quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page-resolver.service.ts
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): NotificationsSuggestionTargetsPageParams {
========
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AdminNotificationsPublicationClaimPageParams {
>>>>>>>> main:src/app/admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page-resolver.service.ts
    return {
      pageId: route.queryParams.pageId,
      pageSize: parseInt(route.queryParams.pageSize, 10),
      currentPage: parseInt(route.queryParams.page, 10)
    };
  }
}
