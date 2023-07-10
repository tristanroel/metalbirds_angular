import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isConnected : boolean = false;

  constructor(
    private storageservice : SessionStorageService
  ) { }

  login() : void{
    this.isConnected = true;
  }

  logout() : void{
    this.isConnected = false;
  }
}
