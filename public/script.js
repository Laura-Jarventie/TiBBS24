document.getElementById('send-button').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage(){
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() == '') return;
    console.log(userInput);
    document.getElementById('user-input').value='';

    addMessageToChatbox('Sinä:' + userInput, 'user-message', 'chatbox');
};

function addMessageToChatbox(message, className, box) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
   console.log(messageElement);
    document.getElementById(box).appendChild(messageElement);
   console.log(document.getElementById(box));
  };

