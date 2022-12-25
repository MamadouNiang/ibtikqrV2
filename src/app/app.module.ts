import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ThemeNavSidebarComponent} from './components/theme-nav-sidebar/theme-nav-sidebar.component';
import {DashbordComponent} from './pages/dashbord/dashbord.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

//ej2
// import the GridModule for the Grid component
import {
  AggregateService,
  ColumnMenuService,
  EditService,
  FilterService,
  GridModule,
  GroupService,
  PagerModule,
  PageService,
  ResizeService,
  SortService,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import {ToastModule} from '@syncfusion/ej2-angular-notifications';
import {LoginComponent} from './pages/auth/login/login.component';

import {DialogModule} from '@syncfusion/ej2-angular-popups';
import {GestionUsersComponent} from './pages/auth/gestion-users/gestion-users.component';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  PieSeriesService
} from '@syncfusion/ej2-angular-charts';
import {CampagneComponent} from './pages/modifications/campagnes/campagne.component';
import {InterceptorService} from './services/config/interceptor.service';
import {CommRecenssementComponent} from './pages/evaluation du marché/comm-recenssement/comm-recenssement.component';
import {CommEvaluationComponent} from './pages/evaluation du marché/comm-evaluation/comm-evaluation.component';


//datemodule
import {IntrantsComponent} from './pages/modifications/intrants/intrants.component';
import {MapDashbordComponent} from './pages/dashbord/map-dashbord/map-dashbord.component';
import { InstanceStockComponent } from './pages/dashbord/instance-stock/instance-stock.component';
import { FicheSuiviComponent } from './pages/evaluation du marché/fiche-suivi/fiche-suivi.component';
import { RepartitionDeStockComponent } from './pages/gestion de stock/repartition-de-stock/repartition-de-stock.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ThemeNavSidebarComponent,
    DashbordComponent,
    LoginComponent,
    GestionUsersComponent,
    CampagneComponent,
    CommRecenssementComponent,
    CommEvaluationComponent,
    IntrantsComponent,
    MapDashbordComponent,
    InstanceStockComponent,
    FicheSuiviComponent,
    RepartitionDeStockComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    GridModule,
    PagerModule,
    ToastModule,
    FormsModule,
    DialogModule,
    AccumulationChartModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    GroupService,
    SortService,
    PageService,
    ToolbarService,
    EditService,
    ToolbarService,
    ResizeService,
    ColumnMenuService,
    FilterService,
    PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService,
    AccumulationAnnotationService, AggregateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
