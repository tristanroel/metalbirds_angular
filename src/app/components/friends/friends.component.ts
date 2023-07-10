import { Component } from '@angular/core';
import { Ifriend } from 'src/app/interface/ifriend';
import { Iuser } from 'src/app/interface/iuser';
import { FriendService } from 'src/app/services/friend.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent {
  user! : Iuser;
  users : Iuser[] = [];
  friends : Ifriend[] = [];
  imgNbr! : number;

  constructor(
    private userservice : UserService,
    private friendservice : FriendService,
    private storageservice : SessionStorageService
  ){}
  ngOnInit(){
    this.userservice.GetUserById(this.storageservice.GetIdTknStorage()).subscribe({
      next : (data) => {
        this.user = data;
      },
      error : (err:any)=>{console.log('missing tkn');
      },
      complete : ()=>{
        this.userservice.GetAllUsers().subscribe({
          next : (letype) => {
            this.users = letype
            console.log(letype);
          },
          error:(err)=>{ console.log("missing users");},
          complete : ()=>{
            this.friendservice.GetAllFriendOfUser(this.user.id).subscribe({
              next : (data) => {
                console.log(data);
                this.friends = data;
                
              }
            })
          }
        });

      }
    });
  }
}
