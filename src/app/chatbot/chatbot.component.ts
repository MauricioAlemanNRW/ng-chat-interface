import { Component, OnInit } from '@angular/core';
import { BotResponseService } from '../services/bot-response.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  //sound
  sound = new Audio('./assets/sonido.mp3')
  mute:boolean=false;
  changeMuteState(){
    this.mute=!this.mute!;
  }
  reproducir() {
    if(this.mute==false){
      this.sound.play();
    }
  }

  //mensaje inicial
  mensajeInicial=false;
  

  // Diccionario de preguntas y respuestas predefinidas
  respuestas = new Map([
    ['hola', { mensaje: "馃憢 Hola soy Habbi 馃, el Bot de HA Bicicletas!", redireccionar:"inicio" }],
    ['inicio', { mensaje: "驴en qu茅 puedo ayudarte?", opciones: ["馃懆馃徎鈥嶐煉籌niciar sesi贸n", "鉁婹uiero ser comercializador"] }],

    ['Recuperar usuario', { mensaje: "Por favor, sigue los siguientes pasos: 猬囷笍", redireccionar: "Recuperar usuario paso1" }],
    ['Recuperar usuario paso1', { mensaje: "Haga clic sobre '驴Olvid贸 su usuario?'", img: "assets/chatbotImagenes/olvidosu usuario.png", redireccionar: "Recuperar usuario paso2"}],
    ['Recuperar usuario paso2', { mensaje: "Ingrese su correo electr贸nico asociado a su cuenta y haga clic en el bot贸n enviar!", img: "assets/chatbotImagenes/confirmar olvido de usuario.png", redireccionar: "Recuperar usuario paso3"}],
    ['Recuperar usuario paso3', { mensaje: "Revise su correo electr贸nico. Recibir谩 instrucciones para recordar su usuario馃懆馃徎鈥嶐煉?", redireccionar: "Preguntar si necesita m谩s ayuda"}],
    
    ['Recuperar contrase帽a', { mensaje: "Por favor, sigue los siguientes pasos: 猬囷笍", redireccionar: "Recuperar contrase帽a paso1" }],
    ['Recuperar contrase帽a paso1', { mensaje: "Da click en el vinculo 'Olvid贸 su contrase帽a': 猬囷笍", img: "assets/chatbotImagenes/recuperarcontrase帽a1.jpg", redireccionar: "Recuperar contrase帽a paso2"}],
    ['Recuperar contrase帽a paso2', { mensaje: "Ingrese el correo asociado a su usuario y haga clic en el bot贸n 'Enviar'", img: "assets/chatbotImagenes/recuperarcontrase帽a2.png", redireccionar: "Recuperar contrase帽a paso3"}],
    ['Recuperar contrase帽a paso3', { mensaje: "Revise su correo electr贸nico. Recibir谩 instrucciones para restablecer su contrase帽a 馃攼", redireccionar: "Preguntar si necesita m谩s ayuda"}],
    
    ['Registrarme', {mensaje: "Por favor, sigue los siguientes pasos: 猬囷笍", redireccionar: "Registrarme paso1"}],
    ['Registrarme paso1', { mensaje: "Si es primera vez que ingresas al portal debes crear una cuenta haciendo clic en 'Registrarse'", img: "assets/chatbotImagenes/boton registrase.jpg", redireccionar: "Registrarme paso2"}],
    ['Registrarme paso2', { mensaje: "Luego diligencia el formulario con tus datos y has clic en el bot贸n verde para enviarlos", img: "assets/chatbotImagenes/registrarse.png", redireccionar: "Registrarme paso3"}],
    ['Registrarme paso3', { mensaje: "Perfecto!馃憣 Ahora solo debes esperar que en las pr贸ximas horas un administrador valide tus datos 鉁?", redireccionar: "Registrarme paso4"}],
    ['Registrarme paso4', { mensaje: "Recibir谩s una notificaci贸n en tu correo electr贸nico  鉁?", redireccionar: "Preguntar si necesita m谩s ayuda"}],
    
    ['Preguntar si necesita m谩s ayuda', { mensaje: "驴Necesitas ayuda con algo m谩s?馃槉", opciones: ["Si, una cosa m谩s!", "No, muchas gracias!"]}],
    ['Si, una cosa m谩s!', { mensaje: "驴馃Con todo gusto, por favor dime", redireccionar:"inicio"}],
    ['No, muchas gracias!', { mensaje: "Ha sido un placer, estar茅 cerca en caso de que necesites mi ayuda馃憤"}],
    
    ['quiero vender', { mensaje: "Que buena decisi贸n 馃憦馃徎, dejanos tus datos en el siguiente formulario para comunicarnos contigo 猬囷笍", enlace: "https://habicicletas.com/quieres-ser-comercializador/" }],
    ['鉁婹uiero ser comercializador', { mensaje: "Que buena decisi贸n 馃憦馃徎, dejanos tus datos en el siguiente formulario para comunicarnos contigo 猬囷笍", enlace: "https://habicicletas.com/quieres-ser-comercializador/" }],
    ['馃懆馃徎鈥嶐煉籌niciar sesi贸n', { mensaje: "Qu茅 deseas hacer?", opciones: ["Registrarme", "Recuperar usuario", "Recuperar contrase帽a"] }],
    ['gracias', { mensaje: "Con gusto 馃憣" }],
    ['ok', { mensaje: "馃憤"}],
    ['muchas gracias', { mensaje: "Ha sido un placer 馃憣" }],
    ['chao', { mensaje: "Fue un placer, hasta luego 馃憢" }]
  ]);

  constructor(private botResponseService: BotResponseService) { }

  ngOnInit(): void {
    this.chatInit('#chat-app')
  }

  chatInit(selector: string) {
    // document.addEventListener('DOMContentLoaded', () => {
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
    // })

  }

  sendMessage(msg: any) {
    // mostrar el mensaje enviado en la conversacion
    this.generateParrafo(msg, "same");

    // colocar animaci贸n de cargando
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

        const btnModal = document.createElement("div");
        btnModal.setAttribute("type", "button")
        btnModal.setAttribute("data-toggle", "modal")
        btnModal.setAttribute("data-target", "#exampleModalCenter")
        btnModal.setAttribute("class", "btnOpcion");
        // cambiar imagen del modal por la seleccionada
        btnModal.addEventListener("click",(e)=>{
          const element = e.target as HTMLTextAreaElement;
          const src=element.getAttribute("src");
          const imgModal = document.getElementById("imgModal");
          imgModal?.setAttribute("src",src?src:""); 
        })
        
        const imgRes = document.createElement("img");
        imgRes.setAttribute("src", msg.img);
        imgRes.setAttribute("width", "100%");
        
        btnModal.appendChild(imgRes)
        this.insertIntoChat(btnModal);
      }

      if (msg.redireccionar) {
        // colocar animaci贸n de cargando
        this.setLoading(2000);
        setTimeout(() => {
          this.redireccionar(msg)
        }, 5000);
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

    
    
    setTimeout(() => {
      this.generateParrafo(res, "reply");
    }, 3000);
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

      default: return { mensaje: "No tengo una respuesta para esta petici贸n, por favor elije una de las siguientes opciones:", opciones: ["Iniciar sesi贸n", "鉁婹uiero ser comercializador"] }

    }

  };

  // colocar y quitar animaci贸n de escribiendo / cargando
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
    if(fakeMessage){
      fakeMessage.remove();
    }
   
  }

}
