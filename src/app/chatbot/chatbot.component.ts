import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.chatInit('#chat-app')
  }

  chatInit(selector: string) {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.LIVE_CHAT_UI) {
        let chat: any = document.querySelector(selector);
        let toggles: any = chat.querySelectorAll('.toggle')
        let close = chat.querySelector('.close')
        let send = chat.querySelector('.send')

        toggles.forEach((toggle: any) => {
          toggle.addEventListener('click', () => {
            chat.classList.add('is-active')
          })
        })

        send.addEventListener('click', () => {
          this.sendMessage()
        })

        close.addEventListener('click', () => {
          chat.classList.remove('is-active')
        })

        document.onkeydown = function (evt) {
          evt = evt || window.event;

          var isEscape = false;
          if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
          } else {
            isEscape = (evt.keyCode === 27);
          }
          if (isEscape) {
            chat.classList.remove('is-active')
          }


          var isEnter = false;
          if ("key" in evt) {
            isEnter = (evt.key === "Enter" || evt.key === "Etr");
          } else {
            isEnter = (evt.keyCode === 13);
          }
          if (isEnter) {
            // this.sendMessage()
          }


        };

        document.querySelector("#chatInput")?.addEventListener("keyup", (e) => {
          let keyboardEvent = <KeyboardEvent> e;
          if (keyboardEvent.keyCode === 13) {
            this.sendMessage();
          }
      });

        window.LIVE_CHAT_UI = true


      }
    })

  }


  sendMessage() {
    debugger
    let msg = (<HTMLInputElement>document.getElementsByClassName('chat-input')[0]).value
    if (msg != "") {
      const Template = '<div class="message"><p class="text">Xmsg</p></div>'
      document.getElementsByClassName('messages')[0].innerHTML = document.getElementsByClassName('messages')[0].innerHTML + Template.replace('Xmsg', msg)
      // document.getElementsByClassName('chat-input')[0].value = "" 
      
      console.log(document.querySelector("#chatInput"));
    }
    (<HTMLInputElement>document.getElementsByClassName('chat-app_content')[0]).scrollTop = (<HTMLInputElement>document.getElementsByClassName('messages')[0]).offsetHeight
  }



}
