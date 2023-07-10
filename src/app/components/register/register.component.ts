import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IuserRegister } from 'src/app/interface/iuser-register';
import { aliasRegexValidator } from 'src/app/validators/aliasRegex.validator';
import { emailRegexValidator } from 'src/app/validators/emailRegex.validator';
import { passwdRegexValidator } from 'src/app/validators/passwdRegex.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm! : FormGroup;
  userReg! : IuserRegister;

constructor(
  private formbuilder : FormBuilder
  ){}

  ngOnInit(){
    this.registerForm = this.formbuilder.group({
      alias : ['', aliasRegexValidator],
      email : ['', emailRegexValidator],
      password : ['', passwdRegexValidator]
    })
  }

  onSubmit() {
    // Logique à exécuter lors de la soumission du formulaire
    console.log(this.registerForm.value);
  }
}
