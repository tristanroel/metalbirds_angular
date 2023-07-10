import { Component, AfterViewChecked } from '@angular/core';
import { Icountry } from 'src/app/interface/icountry';
import { Iuser } from 'src/app/interface/iuser';
import { CountryService } from 'src/app/services/country.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {

  user! : Iuser;
  theUsers : Iuser[] = [];
  countries : Icountry[] = [];
  // selectedCountry!: Icountry;

  constructor(
    private userService : UserService,
    private countryservice : CountryService
  ){}

  ngOnInit() : void{
    this.userService.GetAllUsers().subscribe({
      next : (letype) => {
        this.theUsers = letype
        console.log(letype);
      },
      error:(err)=>{ console.log("echec getTkn");
      },
      complete : ()=>{
      }
    });
    this.countryservice.getAllCountries().subscribe({
      next : (listCountry) => {
        this.countries = listCountry
        console.log(listCountry);
        
        console.log(this.countries);
      },

      error:(err)=>{ console.log("echec getAllcntry");
      },

      complete : ()=>{
        
        //console.log(this.countryservice.findCountryByName(this.user.country, this.countries));
      }
    });
  }
  
  GetAllScores(){
    this.userService.GetAllUsers().subscribe({
      next : (letype) => {
        this.theUsers = letype
        console.log(letype);
      },
      error:(err)=>{ console.log("echec getTkn");}
    });
  }

  GetScoresByCountry(selectedCountry : string){
    console.log(selectedCountry);
    this.userService.GetUsersByCountry(selectedCountry).subscribe({
      next : (data) =>{
        console.log(data);
        this.theUsers = data;
        
      }
    })
  }
}
