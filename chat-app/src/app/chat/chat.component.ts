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
  image = '';
  obj;
  groups = [];
  messages = [];
  images = [];
  message = '';
  prof_img = 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/person.png';
  connection;
  @Input() channel;
  constructor(private sockServ: SocketService, private router: Router) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.connection = this.sockServ.getMessages().subscribe(message=>{
      this.messages.push(message);
      this.message = '';
    });
    this.connection = this.sockServ.getImages().subscribe(image=>{
      this.images.push(image);
      this.image = '';
    });
  }
  sendMessage(){
    //Send a chat message back to the server.
    console.log("message: "+this.message);
    this.sockServ.sendMessage("["+this.username+"]\t"+this.message);
  }

  sendImage(){
    //Send an image to the server
    console.log("image: "+this.image);
    this.sockServ.sendMessage("~~~["+this.username+"]~~~ has posted an image!");
    this.sockServ.sendImage(this.image);
  }

  changeProf(){
    this.prof_img = 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/person.png';
  }
  changeProf1(){
    this.prof_img = 'http://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png';
  }
  changeProf2(){
    this.prof_img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3hR-seMSWq5eEBfRqLgOxyOOPJOsvATM6nPv3-XxlA0U9ctWcIQ';
  }
  changeProf3(){
    this.prof_img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1wWcsKlLqfPJ0xggFfVqMiOlfVO-Sm9k4OnsfA25ktwKSsUGVmg';
  }
}
