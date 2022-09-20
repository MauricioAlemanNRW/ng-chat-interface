import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit {

  respuestas = new Map([
    ['hola', 'Hola, en que necesitas ayuda?'],
    ['buenos dias', 'Buenos días, en que necesitas ayuda?'],
    ['buenas tardes', 'Buenas tardes, en que necesitas ayuda?'],
    ['buenas noches', 'Buenas noches, en que necesitas ayuda?'],

    ['gracias', 'Con gusto! 😊'],
    ['muchas gracias', 'Siempre es un gusto! 👌'],
    
    ['hasta luego', 'Ha sido un placer, hasta luego!'],
    ['bye', 'Ha sido un placer, hasta luego!'],
    ['chao', 'Ha sido un placer, hasta luego!'],
    ['fin', 'Ha sido un placer']
  ]);

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

        // abrir el chat 
        toggles.forEach((toggle: any) => {
          toggle.addEventListener('click', () => {
            chat.classList.add('is-active')
          })
        })

        // enviar mensaje
        send.addEventListener('click', () => {
          this.sendMessage()
        })

        // cerrar chat 
        close.addEventListener('click', () => {
          chat.classList.remove('is-active')
        })

        // enviar mensaje presionando la tecla enter 
        document.querySelector("#chatInput")?.addEventListener("keyup", (e) => {
          let keyboardEvent = <KeyboardEvent>e;
          if (keyboardEvent.keyCode === 13) {
            this.sendMessage();
          }
        });

        // activar chat 
        window.LIVE_CHAT_UI = true
      }
    })

  }

  sendMessage() {
    // recuperar el texto del mensaje
    let texto = (<HTMLInputElement>document.getElementsByClassName('chat-input')[0]).value
    let msg = texto.toLowerCase().trim();

    if (msg != "") {

      this.generateParrafo(msg, "same");

      let res = this.getBotResponse(msg);

      this.generateParrafo(res, "reply");

    }
  }

  generateParrafo(msg: any, type: string) {
    // crear el parrafo del mensaje
    const p = document.createElement("p");
    p.setAttribute("class", "text");
    p.innerHTML = msg;
    // crear el div del mensaje y agregar el parrafo
    const Template = document.createElement("div");

    if (type == "reply") {
      Template.setAttribute("class", "message reply");
    } else {
      Template.setAttribute("class", "message");
    }

    Template.appendChild(p);

    // agregar el mensaje al chatbot
    let box_message = document.getElementById('box_message');
    box_message?.appendChild(Template);

    // limpiar el input y bajar el scroll
    (<HTMLInputElement>document.getElementsByClassName('chat-input')[0]).value = "";
    (<HTMLInputElement>document.getElementsByClassName('chat-app_content')[0]).scrollTop = (<HTMLInputElement>document.getElementsByClassName('messages')[0]).offsetHeight
  }

  getBotResponse(quest: any) {

    if (this.respuestas.get(quest)) {
      return this.respuestas.get(quest)
    }

    return "No tengo una respuesta para esta pregunta, por favor elije una de las siguientes opciones:"
    // if(menus.get(input)){
    //   return "redirect to menu"
    // }else if(respuestas.get(input)) {
    //   return respuestas.get(input)
    // } else {
    //   return "Lo siento no tengo respuesta para esta petición"
    // }
  };

}
