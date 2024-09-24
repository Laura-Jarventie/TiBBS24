document.getElementById('send-button').addEventListener('click', sendMessage);

function sendMessage(){
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() == '') return;
    console.log(userInput);
    document.getElementById('user-input').value='';
}

