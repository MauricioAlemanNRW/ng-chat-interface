import { Component, OnInit } from '@angular/core';
import { BotResponseService } from '../services/bot-response.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit {

  //sound
  sound = new Audio('./assets/sonido.mp3')
  reproducir() {
    this.sound.play();
  }

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

  constructor(private botResponseService: BotResponseService) { }

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
      this.setLoading()

      let res = this.getBotResponse(msg);
      setTimeout(() => {
        this.generateParrafo(res, "reply");
      }, 2000);

    }

  }

  generateParrafo(msg: any, type: string) {
    // crear el parrafo del mensaje
    const p = document.createElement("p");
    p.setAttribute("class", "text");

    // crear el div del mensaje y agregar el parrafo
    const Template = document.createElement("div");

    if (type == "reply") {
      p.innerHTML = msg.mensaje;
      Template.setAttribute("class", "message reply fade-in");
      let contentOpcion = document.createElement("div");

      if (msg.opciones) {
        msg.opciones.map((element: any) => {
          let opcion = document.createElement("button");
          opcion.innerHTML = element.opcion
          opcion.setAttribute("id", element.id);
          contentOpcion.appendChild(opcion)
          Template.appendChild(contentOpcion);
        })
      }
      
      this.deleteLoading();
      this.reproducir()
      Template.appendChild(p);
      
      // agregar el mensaje al chatbot
      let box_message = document.getElementById('box_message');
      box_message?.appendChild(Template);
      box_message?.appendChild(contentOpcion);

    } else if (type == "loadding") {

      p.setAttribute("id", "fakeMessage");
      Template.appendChild(p);
      // agregar el mensaje al chatbot
      let box_message = document.getElementById('box_message');
      box_message?.appendChild(Template);
      (<HTMLInputElement>document.getElementsByClassName('chat-app_content')[0]).scrollTop = (<HTMLInputElement>document.getElementsByClassName('messages')[0]).offsetHeight
      return

    } else {
      p.innerHTML = msg;
      Template.setAttribute("class", "message fade-in");
      Template.appendChild(p);
      // agregar el mensaje al chatbot
      let box_message = document.getElementById('box_message');
      box_message?.appendChild(Template);
    }





    // limpiar el input y bajar el scroll
    (<HTMLInputElement>document.getElementsByClassName('chat-input')[0]).value = "";
    (<HTMLInputElement>document.getElementsByClassName('chat-app_content')[0]).scrollTop = (<HTMLInputElement>document.getElementsByClassName('messages')[0]).offsetHeight
  }

  getBotResponse(quest: any) {

    // if (this.respuestas.get(quest)) {
    //   return this.respuestas.get(quest)
    // }

    switch (quest) {
      case "0": return this.botResponseService.comoIniciarSesion();
        break;

      case "hola": return { mensaje: "Hola, soy el Bot de Numrot, y estoy aquí para ayudarte, ¿en que necesitas ayuda?" }
      default: return {
        mensaje: "No tengo una respuesta para esta pregunta, por favor elije una de las siguientes opciones:", opciones: [{ id: 0, opcion: "Iniciar sesión" }, { id: 1, opcion: "Quiero ser comercializador 🤠" }]
      }
        break;
    }
  };

  // loading
  setLoading() {
    this.generateParrafo("...", "loadding");
  }
  deleteLoading() {
    let fakeMessage = document.querySelector("#fakeMessage");
    fakeMessage?.remove();
  }

}
