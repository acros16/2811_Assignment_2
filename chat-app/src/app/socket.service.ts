import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() { }
  sendMessage(message){
    console.log("working");
    this.socket.emit('add-message',message);
  }
  getMessages(){
    let obmessages = new Observable(
      //observer is a javascrpt object that defines the handlers for the notifications we will receive
      observer =>{
        this.socket = io("http://localhost:3000");
        //listen for "new-message" event from the server
        this.socket.on('message',(data)=> {
          observer.next(data);
        });

        //when the observer ends (unsubscribed) then disconnect the socket
        return ()=>{
          this.socket.disconnect();
        }
         
      }
    )
     return obmessages;
  }
}
