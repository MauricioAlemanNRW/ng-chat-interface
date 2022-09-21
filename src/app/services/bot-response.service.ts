import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BotResponseService {

  constructor() { }

  comoIniciarSesion(){
    return {
      mensaje:"¿Qué deseas hacer?",
      opciones:[
        {
         id:1,
         opcion:"Recuperar mi usuario"
        },
        {
          id:2,
          opcion:"Recuperar mi contraseña"
        },
        {
          id:3,
          opcion:"Recuperar usuario"
        }
      ] 
    } 
  }

}
