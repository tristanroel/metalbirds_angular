import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Istats } from '../interface/istats';
import { Isuccess } from '../interface/isuccess';
import { IsuccessRegistered } from '../interface/isuccess-registered';
import { Iuser } from '../interface/iuser';

@Injectable({
  providedIn: 'root'
})
export class SuccessService {
  
  Api_Url : string = "https://localhost:5001/api/Success/";

  constructor(private readonly _httpclient : HttpClient) { }

  GetAllSuccess(){
    return this._httpclient.get<Isuccess[]>(this.Api_Url + "GetAllSuccess");
  }

  GetSuccessById(id : number){
    return this._httpclient.get<Isuccess>(this.Api_Url + "GetSuccessById/" + id);
  }
  AddSuccess(successRegister : IsuccessRegistered){
    return this._httpclient.post<Isuccess>(this.Api_Url + "AddSuccess/", successRegister);
  }

  EditSuccess(id : number, successregister : IsuccessRegistered){
    const url = `${this.Api_Url}EditSuccess/${id}`;
    return this._httpclient.put<IsuccessRegistered>(url, successregister)

  }

  DeleteSuccess(id : number){
    const url = `${this.Api_Url}DeleteSuccess/${id}`;
    return this._httpclient.delete(url)
  }
  SuccessRateCompare(success : Isuccess, stats : Istats, user : Iuser){
    // for(let i = 0; i < success; i++)
  }

}
