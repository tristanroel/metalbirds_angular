import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetalbirdsComponent } from './components/games/metalbirds/metalbirds.component';
import { HomeComponent } from './components/home/home.component';
import { ScoresComponent } from './components/scores/scores.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SuccessComponent } from './components/success/success.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { FriendsComponent } from './components/friends/friends.component';

@NgModule({
  declarations: [
    AppComponent,
    MetalbirdsComponent,
    HomeComponent,
    ScoresComponent,
    LoginComponent,
    SuccessComponent,
    ProfileComponent,
    RegisterComponent,
    EditprofileComponent,
    FriendsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    // Location
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
