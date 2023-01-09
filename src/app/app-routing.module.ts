import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashbordComponent} from './pages/dashbord/dashbord.component';
import {AuthGuardService} from './services/config/auth-guard.service';
import {GestionUsersComponent} from './pages/auth/gestion-users/gestion-users.component';
import {CampagneComponent} from './pages/modifications/campagnes/campagne.component';
import {CommRecenssementComponent} from './pages/evaluation du marché/comm-recenssement/comm-recenssement.component';
import {CommEvaluationComponent} from './pages/evaluation du marché/comm-evaluation/comm-evaluation.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ThemeNavSidebarComponent } from './components/theme-nav-sidebar/theme-nav-sidebar.component';
import {IntrantsComponent} from './pages/modifications/intrants/intrants.component';
import {MapDashbordComponent} from './pages/dashbord/map-dashbord/map-dashbord.component';
import {InstanceStockComponent} from './pages/dashbord/instance-stock/instance-stock.component';
import {FicheSuiviComponent} from './pages/evaluation du marché/fiche-suivi/fiche-suivi.component';
import {RepartitionDeStockComponent} from './pages/gestion de stock/repartition-de-stock/repartition-de-stock.component';
import {StockGlobalComponent} from './pages/gestion de stock/stock-global/stock-global.component';

const routes: Routes = [
  {path: 'dashbord', component: DashbordComponent},
  {path: 'map', component: MapDashbordComponent},
  {path: 'instanceStock', component: InstanceStockComponent},

  {path: 'sidebar', component: ThemeNavSidebarComponent},
  {path: 'repartitionStock', component: RepartitionDeStockComponent},
  {path: 'stock', component: StockGlobalComponent},

  {path: 'users', component: GestionUsersComponent},
  {path: 'login', component: LoginComponent},

  {path: 'campagnes', component: CampagneComponent},
  {path: 'intrants', component: IntrantsComponent},

  {path: 'commRecenssement', component: CommRecenssementComponent},
  {path: 'fiche', component: FicheSuiviComponent},
  {path: 'commEvaluation', component: CommEvaluationComponent},

  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
