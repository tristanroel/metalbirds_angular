import { Injectable } from '@angular/core';
import { Itkn } from '../interface/itkn';
import jwt_Decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  tkn! : Itkn;
  isConnected : boolean = false;
  constructor() { }

  GetIdTknStorage() : number {
    const token : string | null = sessionStorage.getItem('tkn');
      if(token){
      this.tkn = jwt_Decode(token);
      return parseInt(this.tkn.nameid);
      }
      else{
        throw new Error('Token not found');
      }
  }
  GetTknStorage() : void{
    const token : string | null = sessionStorage.getItem('tkn');
      if(token){
        console.log('token trouvé');
        this.isConnected = true;
      }else{
        console.log('token non trouvé');
        this.isConnected = false;
      }
  }

  ClearTknStorage(){
    sessionStorage.clear();
    this.isConnected = false;
  }
}
