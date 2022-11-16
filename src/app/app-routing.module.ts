import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashbordComponent} from './pages/dashbord/dashbord.component';
import {AuthGuardService} from './services/config/auth-guard.service';
import {GestionUsersComponent} from './pages/auth/gestion-users/gestion-users.component';
import {CampagneComponent} from './pages/modifications/campagnes/campagne.component';
import {CommRecenssementComponent} from './pages/comm-recenssement/comm-recenssement.component';
import {CommEvaluationComponent} from './pages/comm-evaluation/comm-evaluation.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ThemeNavSidebarComponent } from './components/theme-nav-sidebar/theme-nav-sidebar.component';
import {IntrantsComponent} from './pages/modifications/intrants/intrants.component';
import {MapDashbordComponent} from './pages/map-dashbord/map-dashbord.component';

const routes: Routes = [
  {path: 'dashbord', component: DashbordComponent},
  {path: 'sidebar', component: ThemeNavSidebarComponent},
  {path: 'users', component: GestionUsersComponent},
  {path: 'login', component: LoginComponent},

  {path: 'campagnes', component: CampagneComponent},
  {path: 'map', component: MapDashbordComponent},
  {path: 'intrants', component: IntrantsComponent},
  {path: 'commRecenssement', component: CommRecenssementComponent},
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
