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

  //mensaje inicial
  mensajeInicial=false;
  reproducir() {
    this.sound.play();
  }

  // Diccionario de preguntas y respuestas predefinidas
  respuestas = new Map([
    ['hola', { mensaje: "👋🤖 Hola soy NumRobot, ¿en qué puedo ayudarte?", opciones: ["Iniciar sesión", "✋Quiero ser comercializador"] }],

    // imagenes
    ['Recuperar contraseña', { mensaje: "Por favor, sigue los siguientes pasos: ⬇️", redireccionar: "Recuperar contraseña paso1" }],
    ['Recuperar contraseña paso1', { mensaje: "Da click en el vinculo 'Olvidó su contraseña': ⬇️", img: "assets/chatbotImagenes/recuperarcontraseña1.jpg", redireccionar: "Recuperar contraseña paso2" }],
    ['Recuperar contraseña paso2', { mensaje: "Ingrese el correo asociado a su usuario y hagaclic en el botón 'Enviar'", img: "assets/chatbotImagenes/recuperarcontraseña2.png" }],

    ['quiero vender', { mensaje: "Nos alegra que estés aquí 🤠 Dejanos tus datos en el siguiente formulario para comunicarnos contigo ⬇️", enlace: "https://habicicletas.com/quieres-ser-comercializador/" }],
    ['✋Quiero ser comercializador', { mensaje: "Nos alegra que estés aquí 🤠 Dejanos tus datos en el siguiente formulario para comunicarnos contigo ⬇️", enlace: "https://habicicletas.com/quieres-ser-comercializador/" }],
    ['Iniciar sesión', { mensaje: "Qué deseas hacer?", opciones: ["Registrarme", "Recuperar usuario", "Recuperar contraseña"] }],
    ['gracias', { mensaje: "Con gusto 👌" }],
    ['muchas gracias', { mensaje: "Ha sido un placer 👌" }],
    ['chao', { mensaje: "Hasta pronto 👋" }]
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
            if(!this.mensajeInicial){
              //Generar primera interaccion de saludo
              this.redireccionar({redireccionar:'hola'});
              this.mensajeInicial=true;
            }
          })
        })

        // enviar mensaje
        send.addEventListener('click', () => {
          // recuperar el texto del mensaje
          let texto = (<HTMLInputElement>document.getElementsByClassName('chat-input')[0]).value
          let msg = texto.toLowerCase().trim();
          if (msg != "") {
            this.sendMessage(msg)
          }
        })

        // cerrar chat 
        close.addEventListener('click', () => {
          chat.classList.remove('is-active')
        })

        // enviar mensaje presionando la tecla enter 
        document.querySelector("#chatInput")?.addEventListener("keyup", (e) => {
          let keyboardEvent = <KeyboardEvent>e;
          if (keyboardEvent.keyCode === 13) {
            // recuperar el texto del mensaje
            let texto = (<HTMLInputElement>document.getElementsByClassName('chat-input')[0]).value
            let msg = texto.toLowerCase().trim();
            if (msg != "") {
              this.sendMessage(msg);
            }
          }
        });

        // activar chat 
        window.LIVE_CHAT_UI = true
      }
    })

  }

  sendMessage(msg: any) {
    // mostrar el mensaje enviado en la conversacion
    this.generateParrafo(msg, "same");

    // colocar animación de cargando
    this.setLoading(1000)

    //Solicitar una respuesta al mensaje del usuario
    let res = this.getBotResponse(msg);

    setTimeout(() => {
      this.generateParrafo(res, "reply");
    }, 3000);
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
      let itemsRes = document.createElement("div");
      itemsRes.setAttribute("style", "margin-top: 5px; width: inherit;");

      if (msg.opciones) {
        msg.opciones.map((element: any) => {
          let opcion = document.createElement("button");

          opcion.innerHTML = element
          opcion.setAttribute("id", element);
          opcion.setAttribute("class", "btnOptions");
          opcion.addEventListener("click", (event: any) => {
            const optionSelected = event.target
            let option = optionSelected.getAttribute("id");
            optionSelected.parentNode.remove();

            this.sendMessage(option);
          })
          itemsRes.appendChild(opcion)
        })
        Template.appendChild(itemsRes);
      }

      if (msg.enlace) {
        let link = document.createElement("a");
        link.setAttribute("href", msg.enlace)
        link.setAttribute("target", "_blank")
        link.innerHTML = msg.enlace

        itemsRes.appendChild(link)
        Template.appendChild(itemsRes);
      }

      // quitar la animacion de carga y reproducir sonido de respuesta o nuevo mensaje
      this.deleteLoading();
      this.reproducir()


      Template.appendChild(p);

      this.insertIntoChat(Template)
      this.insertIntoChat(itemsRes)


      if (msg.img) {

        const linkModal = document.createElement("a");
        linkModal.setAttribute("href", "#modal")
        
        
        
        const imgRes = document.createElement("img");
        imgRes.setAttribute("src", msg.img);
        imgRes.setAttribute("width", "100%");
        
        linkModal.appendChild(imgRes)
        this.insertIntoChat(linkModal);
      }

      if (msg.redireccionar) {
        setTimeout(() => {
          this.redireccionar(msg)
        }, 3000);
      }

    } else {
      p.innerHTML = msg;
      Template.setAttribute("class", "message fade-in");
      Template.appendChild(p);
      this.insertIntoChat(Template)
    }

  }

  redireccionar(msg:any) {
    //Generar otras replicas
    let res = this.getBotResponse(msg.redireccionar);

    // colocar animación de cargando
    this.setLoading(2000);
    
    setTimeout(() => {
      this.generateParrafo(res, "reply");
    }, 3000);
    (<HTMLInputElement>document.getElementsByClassName('chat-app_content')[0]).scrollTop = (<HTMLInputElement>document.getElementsByClassName('messages')[0]).offsetHeight
  }

  // insertar elemento en la conversacion
  insertIntoChat(element: any) {
    // agregar el mensaje al chatbot
    let box_message = document.getElementById('box_message');
    box_message?.appendChild(element);
    // limpiar el input y bajar el scroll
    (<HTMLInputElement>document.getElementsByClassName('chat-input')[0]).value = "";
    (<HTMLInputElement>document.getElementsByClassName('chat-app_content')[0]).scrollTop = (<HTMLInputElement>document.getElementsByClassName('messages')[0]).offsetHeight
  }

  getBotResponse(quest: any) {

    if (this.respuestas.get(quest)) {
      return this.respuestas.get(quest)
    }

    switch (quest) {

      case "Consultar cartera":
        return this.botResponseService.comoIniciarSesion();

      default: return { mensaje: "No tengo una respuesta para esta petición, por favor elije una de las siguientes opciones:", opciones: ["Iniciar sesión", "✋Quiero ser comercializador"] }

    }

  };



  // colocar y quitar animación de escribiendo / cargando
  setLoading(segundos: any) {
    let loadding = document.createElement("div");
    loadding.setAttribute("id", "fakeMessage");
    loadding.innerHTML = `<div class="container">
                          <div class="col-3">
                              <div class="" data-title=".dot-typing">
                                <div class="stage">
                                  <div class="dot-typing"></div>
                                </div>
                              </div>
                          </div>
                        </div>`
    setTimeout(() => {
      this.insertIntoChat(loadding);
      (<HTMLInputElement>document.getElementsByClassName('chat-app_content')[0]).scrollTop = (<HTMLInputElement>document.getElementsByClassName('messages')[0]).offsetHeight
    }, segundos);
  }
  deleteLoading() {
    let fakeMessage = document.querySelector("#fakeMessage");
    fakeMessage?.remove();
  }

}
