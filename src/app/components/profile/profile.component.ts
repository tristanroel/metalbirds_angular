import { Component } from '@angular/core';
import { Istats } from 'src/app/interface/istats';
import { Iuser } from 'src/app/interface/iuser';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { StatsService } from 'src/app/services/stats.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
isAdmin: Boolean = false;
user! : Iuser;
stats! : Istats;

constructor(
  private userservice : UserService,
  private statservice : StatsService,
  private storageservice : SessionStorageService
){}

ngOnInit() : void{ 
  this.userservice.GetUserById(this.storageservice.GetIdTknStorage()).subscribe({
    next : (data) => {
      this.user = data;
    }
  });
  this.statservice.GetStatsById(this.storageservice.GetIdTknStorage()).subscribe({
    next : (data) => {
      this.stats = data;
    }
  });
}
}
