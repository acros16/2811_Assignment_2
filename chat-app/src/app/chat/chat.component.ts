import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username: string;
  obj;
  groups = [];
  messages = [];
  message = '';
  connection;
  @Input() channel;
  constructor(private sockServ: SocketService, private router: Router) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.connection = this.sockServ.getMessages().subscribe(message=>{
      this.messages.push(message);
      this.message = '';
    });
  }
  sendMessage(){
    //Send a chat message back to the server.
    console.log("message: "+this.message);
    this.sockServ.sendMessage("["+this.username+"]\t"+this.message);
    //this.message = '';
  }
}
