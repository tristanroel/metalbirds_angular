import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Istats } from '../interface/istats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  Api_Url : string = "https://localhost:5001/api/Stats/";

  constructor(private readonly _httpclient :HttpClient) { }

  GetAllStats(){
    return this._httpclient.get<Istats[]>(this.Api_Url + "GetAllStats");
  }

  GetStatsById(id : number){
    return this._httpclient.get<Istats>(this.Api_Url + "GetStatById/"+ id);
  }

  UpdateStats(stats : Istats){
    return this._httpclient.put<Istats[]>(this.Api_Url + "UpdateStats", stats);
  }
  

}
