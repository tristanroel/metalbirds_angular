import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Iuser } from '../interface/iuser';
import { IuserLogin } from '../interface/iuser-login';
import { IuserRegister } from '../interface/iuser-register';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  Api_Url : string = "https://localhost:5001/api/User/";

  constructor(private readonly _httpclient : HttpClient) { }

  GetAllUsers(){
    return this._httpclient.get<Iuser[]>(this.Api_Url + "GetAll");
  }

  GetUserById(id : number){
    return this._httpclient.get<Iuser>(this.Api_Url + "GetById/" + id);
    // .pipe(catchError((error)=> {return new Error("")}))
  }

  GetUsersByCountry(country : string){
    return this._httpclient.get<Iuser[]>(this.Api_Url + "GetByCountry/" + country);
    // .pipe(catchError((error)=> {return new Error("")}))
  }

  RegisterUser(userRegister : IuserRegister){
    return this._httpclient.post<Iuser>(this.Api_Url + "Register", userRegister);
  }

  LoginUser(userLogin : IuserLogin) : Observable<string>{
    return this._httpclient.post(this.Api_Url + "Login", userLogin,{'responseType': 'text'})
  }
  
  UpdateAlias(userId: number, alias: string): Observable<any> {
    const url = `${this.Api_Url}UpdateAlias/${userId}`;
    const body = { alias: alias };
    return this._httpclient.patch(url, body);
  }

  UpdateAvatar(id : number, avatarKey : number): Observable<any> {
    const url = `${this.Api_Url}UpdateAvatar/${id}`;
    const body = { avatarKey: avatarKey };
    return this._httpclient.patch(url, body);
  }

  UpdateCountry(id: number, country: string, flagUrl: string): Observable<any> {
    const url = `${this.Api_Url}UpdateCountry/${id}`;
    const body = { country: country, flagUrl: flagUrl };
    //console.log('ca passe ? country :' + country +'flagUrl : '+ flagUrl);
    return this._httpclient.patch(url, body);
  }

  UpdateCredits(id : number, credits : number) : Observable<any>{
    const url = `${this.Api_Url}UpdateCredits/${id}`;
    const body = { credits: credits };
    return this._httpclient.patch(url, body);
  }
  // UpdateScore(){
  //   return this._httpclient.post('https://localhost:5001/api/User/UpdateScore/1', 12345)
  // }

  UpdateScore(id : number, score : number) : Observable<any>{
    const url = `${this.Api_Url}UpdateScore/${id}`;
    const body = { score: score };
    
    return this._httpclient.patch<any>(url, body);
  }
}
  
