import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Icountry } from 'src/app/interface/icountry';
import { Iuser } from 'src/app/interface/iuser';
import { IuserEdit } from 'src/app/interface/iuser-edit';
import { CountryService } from 'src/app/services/country.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { UserService } from 'src/app/services/user.service';
import { aliasRegexValidator } from 'src/app/validators/aliasRegex.validator';
import { emailRegexValidator } from 'src/app/validators/emailRegex.validator';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent {
  countryForm! : FormGroup; 
  avatarForm! : FormGroup; 
  aliasForm! : FormGroup;
  emailForm! : FormGroup;
  user! : Iuser;
  useredit! : IuserEdit;
  selectedCountry!: Icountry | undefined;
  countries : Icountry[] = [];
  isEditCountry : boolean = false;
  imgNbr : number = 1;
  flagNbr! : number;
  // la fonction de mappage (_, i) => i attribue à chaque élément sa valeur correspondante (0 à 6)
  //options: number[] = Array.from({length: 6}, (_, i) => i);
  //selectedOption : number = 1;


  constructor(
    private readonly countryservice : CountryService,
    private userservice : UserService,
    private storageservice : SessionStorageService,
    private formbuilder : FormBuilder
    ) { }

  ngOnInit() {
    this.countryForm = this.formbuilder.group({
      country : ['']
    });
    this.avatarForm = this.formbuilder.group({
      avatarUrl : ['']
    });
    this.aliasForm = this.formbuilder.group({
      alias : ['', aliasRegexValidator]
    });
    this.emailForm = this.formbuilder.group({
      email : ['', emailRegexValidator]
    });
    
    this.userservice.GetUserById(this.storageservice.GetIdTknStorage()).subscribe({

      next : (data) => {
        this.user = data;
        console.log(data);
      },

      error:(err)=>{ console.log("echec getTkn");
      },

      complete : ()=>{
        this.countryservice.getAllCountries().subscribe({
          next : (listCountry) => {
            this.countries = listCountry
            console.log(this.countries);
          },

          error:(err)=>{ console.log("echec getAllcntry");
          },

          complete : ()=>{
            this.countryservice.getCountryByName(this.user.country).subscribe({
              next : (data) => {
                console.log(data);
                this.selectedCountry = data;
                
                this.imgNbr = this.user.avatarKey;
                console.log(this.selectedCountry);
              }
            });  
            console.log(this.user.country);
            //console.log(this.countryservice.findCountryByName(this.user.country, this.countries));
          }
        });

      }
    });
    // this.selectedCountry = this.countryservice.findCountryByName(this.user.country,this.countries);
    // console.log(this.selectedCountry);
    
  }
  editCountry(){
    this.isEditCountry = !this.isEditCountry;
  }
  submitCountryForm(){
    if (this.countryForm.valid) {
      this.user.country = this.countryForm.value.country.name;
      this.user.flagUrl = this.countryForm.value.country.flagUrl;
      console.log(this.countryForm.value.country.flagUrl);
      console.log(this.countryForm.value.country.name);
      
      this.selectedCountry = this.countryservice.findCountryByName(this.user.country,this.countries);

      this.userservice.UpdateCountry(this.user.id, this.user.country, this.user.flagUrl).subscribe({
        next : (data) => {
          console.log(data);
        }
      })
    }
  }
  submitAvatarForm(){
    if (this.avatarForm.valid) {
      // this.user.avatarUrl = this.avatarForm.value.avatarUrl;
      this.user.avatarKey = this.imgNbr;
      //console.log(this.avatarForm.value.avatarUrl);
      this.userservice.UpdateAvatar(this.user.id, this.imgNbr).subscribe({
        next : (data)=>{
          console.log(data);
          console.log(this.user);
        },
      });
    }
  }
  submitAliasForm(){
    if(this.aliasForm.valid){
      console.log(this.aliasForm.value);
      this.user.alias = this.aliasForm.value.alias;
      this.userservice.UpdateAlias(this.user.id, this.aliasForm.value.alias).subscribe({
        next : (data)=>{
          console.log(data);
          
        },
      });
    }
  }
  submitEmailForm(){
    if(this.emailForm.valid){
      this.user.email = this.aliasForm.value.email;
    }
  }

  updateUser(){
    
  }

  nextimgnbr(){
      this.imgNbr < 9 ? this.imgNbr++ : this.imgNbr = 1; 
      // this.user.avatarUrl = this.imgNbr.toString();
      //this.imgNbr++
      //this.user.avatarUrl = "fdp"
      //console.log(this.user);
  }
  

  // onSubmit() {
  //   // Obtenir les valeurs soumises
  //   const formValue = this.editForm.value;
  //   console.log(this.editForm.value);
    

  //   // Effectuer des actions avec les valeurs soumises (par exemple, enregistrer les modifications)

  //   // Réinitialiser le formulaire après la soumission
  //   this.editForm.reset();
  // }
  
}
