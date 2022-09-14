function chatInit(selector) {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.LIVE_CHAT_UI) {
        let chat = document.querySelector(selector);
        let toggles = chat.querySelectorAll('.toggle')
        let close = chat.querySelector('.close')
        let send = chat.querySelector('.send')
        
        toggles.forEach( toggle => {
          toggle.addEventListener('click', () => {
            chat.classList.add('is-active')
          })
        })
        
        send.addEventListener('click', () => {
          sendMessage()
        })
        
        close.addEventListener('click', () => {
          chat.classList.remove('is-active')
        })
        
        document.onkeydown = function(evt) {
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
              sendMessage()
            }
  
            
        };
        
        window.LIVE_CHAT_UI = true
      }
    })
  }
  
  chatInit('#chat-app')
  
  
  function sendMessage() {
      msg = document.getElementsByClassName('chat-input')[0].value
      if(msg != "") {
          Template = '<div class="message"><p class="text">Xmsg</p></div>'
          document.getElementsByClassName('messages')[0].innerHTML = document.getElementsByClassName('messages')[0].innerHTML + Template.replace('Xmsg', msg)
          document.getElementsByClassName('chat-input')[0].value = ""
      }
      document.getElementsByClassName('chat-app_content')[0].scrollTop = document.getElementsByClassName('messages')[0].offsetHeight
  }
  
  