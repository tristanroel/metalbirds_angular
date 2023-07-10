import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { FriendsComponent } from './components/friends/friends.component';
import { MetalbirdsComponent } from './components/games/metalbirds/metalbirds.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ScoresComponent } from './components/scores/scores.component';
import { SuccessComponent } from './components/success/success.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'metalbirds', component: MetalbirdsComponent},
  {path:'scores', component: ScoresComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'profile', component: ProfileComponent, canActivate:[authGuard]},
  {path:'editprofile', component: EditprofileComponent, canActivate:[authGuard]},
  {path:'friends', component: FriendsComponent, canActivate:[authGuard]},
  {path:'success', component: SuccessComponent, canActivate:[authGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
