import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ifriend } from '../interface/ifriend';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  Api_Url : string = "https://localhost:5001/api/Friends/";

  constructor(private readonly _httpclient : HttpClient) { }

  GetAllFriends(){
    return this._httpclient.get<Ifriend[]>(this.Api_Url + "GetAllFriends");
  }

  GetAllFriendOfUser(id : number){
    return this._httpclient.get<Ifriend[]>(this.Api_Url + "GetAllFriendOfUser/" + id);
  }

  AddNewFriend(id_user : number, id_friend : number){
    return this._httpclient.post(this.Api_Url + "AddNewFriend", id_user + id_friend);
  }

  DeleteFriend(id : number){
    return this._httpclient.delete(this.Api_Url + id)
  }
}
