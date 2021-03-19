import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegistriesModule } from '../../app/+admin/admin-registries/admin-registries.module';
import { AdminSearchModule } from '../../app/+admin/admin-search-page/admin-search.module';
import { AdminWorkflowModuleModule } from '../../app/+admin/admin-workflow-page/admin-workflow.module';
import { BitstreamFormatsModule } from '../../app/+admin/admin-registries/bitstream-formats/bitstream-formats.module';
import { BrowseByModule } from '../../app/+browse-by/browse-by.module';
import { CollectionFormModule } from '../../app/+collection-page/collection-form/collection-form.module';
import { CommunityFormModule } from '../../app/+community-page/community-form/community-form.module';
import { CoreModule } from '../../app/core/core.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditItemPageModule } from '../../app/+item-page/edit-item-page/edit-item-page.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IdlePreloadModule } from 'angular-idle-preload';
import { JournalEntitiesModule } from '../../app/entity-groups/journal-entities/journal-entities.module';
import { MyDspaceSearchModule } from '../../app/+my-dspace-page/my-dspace-search.module';
import { MenuModule } from '../../app/shared/menu/menu.module';
import { NavbarModule } from '../../app/navbar/navbar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfilePageModule } from '../../app/profile-page/profile-page.module';
import { RegisterEmailFormModule } from '../../app/register-email-form/register-email-form.module';
import { ResearchEntitiesModule } from '../../app/entity-groups/research-entities/research-entities.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SearchPageModule } from '../../app/+search-page/search-page.module';
import { SharedModule } from '../../app/shared/shared.module';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateModule } from '@ngx-translate/core';
import { HomeNewsComponent } from './app/+home-page/home-news/home-news.component';
import { HomePageComponent } from './app/+home-page/home-page.component';
import { HomePageModule } from '../../app/+home-page/home-page.module';
import { RootComponent } from './app/root/root.component';
import { AppModule } from '../../app/app.module';
import { PublicationComponent } from './app/+item-page/simple/item-types/publication/publication.component';
import { ItemPageModule } from '../../app/+item-page/item-page.module';
import { RouterModule } from '@angular/router';
import { AccessControlModule } from '../../app/access-control/access-control.module';

const DECLARATIONS = [
  HomePageComponent,
  HomeNewsComponent,
  RootComponent,
  PublicationComponent
];

@NgModule({
  imports: [
    AccessControlModule,
    AdminRegistriesModule,
    AdminSearchModule,
    AdminWorkflowModuleModule,
    AppModule,
    BitstreamFormatsModule,
    BrowseByModule,
    CollectionFormModule,
    CommonModule,
    CommunityFormModule,
    CoreModule,
    DragDropModule,
    ItemPageModule,
    EditItemPageModule,
    FormsModule,
    HomePageModule,
    HttpClientModule,
    IdlePreloadModule,
    JournalEntitiesModule,
    MenuModule,
    MyDspaceSearchModule,
    NavbarModule,
    NgbModule,
    ProfilePageModule,
    RegisterEmailFormModule,
    ResearchEntitiesModule,
    RouterModule,
    ScrollToModule,
    SearchPageModule,
    SharedModule,
    StatisticsModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
  ],
  declarations: DECLARATIONS
})

/**
 * This module serves as an index for all the components in this theme.
 * It should import all other modules, so the compiler knows where to find any components referenced
 * from a component in this theme
 * It is purposefully not exported, it should never be imported anywhere else, its only purpose is
 * to give lazily loaded components a context in which they can be compiled successfully
 */
class ThemeModule {
}
