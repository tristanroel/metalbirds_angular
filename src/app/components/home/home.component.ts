import { Component } from '@angular/core';
import { Iuser } from 'src/app/interface/iuser';
import jwt_Decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { Itkn } from 'src/app/interface/itkn';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user! : Iuser;
  isConnected: Boolean = false;
  tkn! : Itkn;
  constructor(
    private userservice : UserService,
    private storageservice : SessionStorageService
    ){}

  ngOnInit (): void {
    
    this.isConnected = this.storageservice.isConnected;

    if(this.isConnected){
      this.userservice.GetUserById(this.storageservice.GetIdTknStorage()).subscribe({
        next : (data) => {
          this.user = data;
        },
        complete : ()=>{
          if(sessionStorage.getItem('score')){
            console.log('score');
            
            //this.userservice.UpdateScore(this.user.id, parseInt(sessionStorage.getItem('score')))
          }
        }
      });
    }else{
      console.log('non connecté');
    }
  }
  login (): void {
    this.storageservice.GetTknStorage();
    this.isConnected = this.storageservice.isConnected
  }
  logout (): void {
    this.storageservice.ClearTknStorage();
    this.isConnected = this.storageservice.isConnected
    window.location.reload();
  }
}
