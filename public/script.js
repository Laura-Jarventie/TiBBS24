let currentQuestion = ''; //Muuttuja kysymyksen tallentamiseen
let correctAnswer = ''; // Muuttuja oikean vastauksen tallentamiseen

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('send-answer-button').addEventListener('click', sendImage);

document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendImage(){
    const imageInput = document.getElementById('image-input');
    const files = imageInput.files;

    if(files.length === 0){
        alert('Valitse kuvia ensin');
        return;
    }

    const formData = new FormData();
    for (let i=0; i<files.length; i++ ){
        formData.append('images', files[i]);
    }

    console.log(formData.getAll('images'));

    try {

        const response = await fetch('/upload-images',{
            method: 'POST',
            body:formData
        });

        const data = await response.json();
        currentQuestion = data.question;
        correctAnswer = data.answer;
        console.log(currentQuestion);
        console.log(correctAnswer);
        addMessageToChatbox('OmaOpe: ' + data.question, 'bot-message', 'omaopebox');


        console.log(response);
       
        console.log(data);

    }catch (error) {
    console.error('Error:', error);
    addMessageToChatbox('ChatGPT: Jotain meni pieleen. Yritä uudelleen myöhemmin.', 'bot-message','chatbox');
   
    }


}

async function sendMessage(){
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() == '') return;
    console.log(userInput);
    document.getElementById('user-input').value='';

    addMessageToChatbox('Sinä:' + userInput, 'user-message', 'chatbox');

    try {

        const response = await fetch('/chat',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({question:userInput})
        });
    
        console.log(response);
        const data = await response.json();
        console.log(data);
        addMessageToChatbox('CHATGPT:n vastaus: ' + data.reply, "chat-message", 'chatbox')

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

