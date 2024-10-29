import express from 'express';
import bodyParser from 'body-parser';
import dotevn from 'dotenv';

dotevn.config();
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());


app.post('/chat', async (req, res) => {
  const question = req.body.question;
  console.log(question);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: question }
        ],
        max_tokens: 150
      })
    });

//vastaanotetaan ja käsitellään API-vastaus    
const data = await response.json();
console.log('API vastaus:', data.choices[0].message.content);

const reply = data.choices[0].message.content;
res.json ({ reply })

  
  }catch (error) {
  console.error('Virheviesti:', error.message);
  res.status(500).json({error: 'Internal Server Error' });
  }
   }); 



app.listen(port, () => {
    //console.log(`Avaa serveri sivulta http://localhost:${port}`)
    console.log("Avaa serveri sivulta http://localhost:3000")
}
)


/* 

app.post('/chat', async (req, res) => {
  try {
   
  }catch (error) {
  console.error('Virheviesti:', error.message);
  res.status(500).json({error: 'Internal Server Error' });
  }
   }); 
   
   */