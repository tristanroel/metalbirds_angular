import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Itkn } from 'src/app/interface/itkn';
import { IuserLogin } from 'src/app/interface/iuser-login';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { UserService } from 'src/app/services/user.service';
import { emailRegexValidator } from 'src/app/validators/emailRegex.validator';
import { passwdRegexValidator } from 'src/app/validators/passwdRegex.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm! : FormGroup;
  userlog! : IuserLogin;
  tkn! : Itkn;
  isConnected : boolean = false;
  
  constructor(
    private router : Router,
    private formBuilder: FormBuilder,
    private userService : UserService,
    //private authService : AuthService,
    private storageService : SessionStorageService
    ) { }
    
    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email : ['', emailRegexValidator],
        passwd : ['', passwdRegexValidator]
      });
    }
    
  submitLoginForm() {
    if (this.loginForm.valid) {
      this.userlog = {
        email : this.loginForm.value.email,
        passwd : this.loginForm.value.passwd
      }
      this.userService.LoginUser(this.userlog).subscribe({
        next : (data)=>{
          sessionStorage.setItem('tkn', data)
          console.log("token set");
          
          this.login();//login
          this.router.navigate(['/home']);
        },
      });
    }
  }

  login():void{
    // this.authService.login();
    // this.isConnected = this.authService.isConnected;
    this.storageService.GetTknStorage();
    this.isConnected = this.storageService.isConnected
  }
}
