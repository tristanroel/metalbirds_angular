import { Component } from '@angular/core';
import { Isuccess } from 'src/app/interface/isuccess';
import { SuccessService } from 'src/app/services/success.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent {
  successes : Isuccess[] = [];
  success! : Isuccess;

  constructor(
    private userservice : UserService,
    private successervice : SuccessService
  ){};

  ngOnInit(){
    this.successervice.GetAllSuccess().subscribe({
      next : (data)=>{
        console.log(data);
        this.successes = data
        console.log(this.successes);
        
      }
    });
  }
}
