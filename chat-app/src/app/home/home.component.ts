import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { GroupService } from '../group.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user;
  public add_user;
  public del_user;
  public perms;
  public selectedGroup;
  public selectedChannel;
  public groups = [];
  public channels = [];
  public newGroupName:String

  constructor(private router: Router, private _groupService:GroupService, private _userService:UserService) { }

  ngOnInit() {
    if(sessionStorage.getItem('user') === null){
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.user = user;
      console.log(this.user);
      console.log(this.user.username);
      this.groups = user.groups;
      if(this.groups.length > 0){
        this.openGroup(this.groups[0].name);
        if(this.groups[0].channels > 0){
          this.channelChangedHandler(this.groups[0].channels[0].name);
        }
      }
    }
  }
  addUser(event){
    event.preventDefault();
    let new_user = {
      user: this.add_user,
      perms: this.perms
    }
    this._userService.add(new_user).subscribe(
      data => {
        console.log(data);
        if (data != false){
          console.log("Successfully added user");
        }
        else{
          console.log("Could not add user!");
        }
      }
    )
  }
  removeUser(event){
    event.preventDefault();
    let remove_user = {
      user: this.del_user
    }
    this._userService.remove(remove_user).subscribe(
      data => {
        console.log(data);
        if (data != false){
          console.log("Successfully removed user");
        }
        else{
          console.log("Could not remove user!");
        }
      }
    )
  }
  createGroup(event){
    event.preventDefault();
    let data = {'newGroupName': this.newGroupName};
    this._groupService.createGroup(data).subscribe(
      data => { 
        console.log(data);
        this.getGroups();
      },
      error => {
        console.error(error);
      }
    )
  }

  deleteGroup(groupName){
    this._groupService.deleteGroup(groupName, this.user.username).subscribe(
      data=>{
        this.getGroups();
      }, error =>{
        console.error(error)
      }
    )
  }

  getGroups(){
    let data = {
      'username': JSON.parse(sessionStorage.getItem('user')).username
    }
    this._groupService.getGroups(data).subscribe(
      d=>{
        console.log('getGroups()');
        console.log(d);
        this.groups = d['groups'];
      }, 
      error => {
        console.error(error);
      }
    )
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Determine which group is currently selected and pass onto the child panel
  openGroup(name){
    console.log(name);
    for(let i = 0; i < this.groups.length; i++){
      if(this.groups[i].name == name){
        this.selectedGroup = this.groups[i];
      }
    }
    this.channels = this.selectedGroup.channels;
  }


  // Responsible for handling the event call by the child component
  channelChangedHandler(name){
    let found:boolean = false;
    for(let i = 0; i < this.channels.length; i++){
      if(this.channels[i].name == name){
        this.selectedChannel = this.channels[i];
        found = true;
      }
    }
    return found;
  }
  getChannels(groupName){
    let channels = [];
    return channels;
  }
}
