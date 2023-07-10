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
  scr? : number;
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
          console.log(data);
        },
        complete : ()=>{
          if(sessionStorage.getItem('score')!= null){
            var scrtxt : string | null = sessionStorage.getItem('score');
            if(scrtxt != null){
              //this.user.score = parseInt(scrtxt);
              // this.userservice.UpdateScore(this.user.id, this.user.score).subscribe({
              this.userservice.UpdateScore(1, 98).subscribe({
                next : (data : string) =>{
                  console.log(data);
                }
              })
              console.log(parseInt(scrtxt));
              console.log('score envoyé?');
              
            } 
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
