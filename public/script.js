document.getElementById('send-button').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage(){
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() == '') return;
    console.log(userInput);
    document.getElementById('user-input').value='';

    addMessageToChatbox('Sinä:' + userInput, 'user-message', 'chatbox');

    try {

        const response = await fetch('/get-question',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({question:userInput})
        });
    
        console.log(response);
        const data = await response.json();
        console.log(data);
        addMessageToChatbox('CHAT: ' + data.question, "chat-message", 'chatbox')

    }catch (error) {
    console.error('Error:', error);
    addMessageToChatbox('ChatGPT: Jotain meni pieleen. Yritä uudelleen myöhemmin.', 'bot-message','chatbox');
   
    }

    

};

 function addMessageToChatbox(message, className, box) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
   console.log(messageElement);
    document.getElementById(box).appendChild(messageElement);
   console.log(document.getElementById(box));
  }; 

