import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Icountry } from '../interface/icountry';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

//countries! : Icountry[];
  constructor(
    private readonly http : HttpClient
  ) { }

  // getAllCountries() : Observable<any[]>
  // {
  //   return this.http.get<any[]>("https://restcountries.com/v3.1/all")
  // }
  getAllCountries(): Observable<any[]> {
    return this.http.get<any[]>("https://restcountries.com/v3.1/all").pipe(
      map(countries => countries.map(country => ({
        flags: country.flags.png,
        name: country.name.common
      })).sort((a,b) => { //tri le name par ordre alphabetique 
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      }))
    );
  }
  getCountryByName(inputName: string): Observable<any> {
    return this.http.get<any[]>("https://restcountries.com/v3.1/all").pipe(
      map(countries => {
        const country = countries.find(country => country.name.common.toLowerCase() === inputName.toLowerCase());
        if (country) {
          return {
            flags: country.flags.png,
            name: country.name.common
          };
        } else {
          return null; // Pays non trouvé
        }
      })
    );
  }

  findCountryByName(countryName: string, countries : Icountry[]): Icountry | undefined {
    return countries.find(country => country.name === countryName);
  }
}
