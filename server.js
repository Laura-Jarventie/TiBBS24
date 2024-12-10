import express from 'express';
import bodyParser from 'body-parser';
import dotevn from 'dotenv';
import multer from 'multer';
import vision from '@google-cloud/vision';
import fs from 'fs';


dotevn.config();
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'omaope-vision.json' 
});

let koealueTekstina = '';
let context = [];



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

const reply = data.choices[0].message.content
res.json ({ reply })

  
  }catch (error) {
    console.error('Virheviesti:', error.message);
    res.status(500).json({error: 'Internal Server Error' });
  }
  }); 


//upload-images rajapinta
app.post('/upload-images', upload.array('images', 10), async (req, res) => {
    try {
      
      const files = req.files;
      console.log(files);
      
      //Odotetaan, että kaikki kuvat on käsitelty OCR:n avulla, eli jokaisen kuvan teksti tunnistetaan.
      const texts = await Promise.all(files.map(async file => {
      // suoritetaan, että saadaan tiedostopolku kuvalle, jonka OCR-tunnistus halutaan suorittaa. 
      const imagePath = file.path;
      console.log(imagePath);
      // kutsu GCV API:lle, joka suorittaa OCR:n annetulle kuvalle
      const [result] = await client.textDetection(imagePath);
      //ottaa result-muuttujasta kaikki tekstintunnistusmerkinnät (textAnnotations), jotka sisältävät kaikki kuvasta tunnistetut tekstialueet.
      const detections = result.textAnnotations;
      console.log(detections);
      // poistaa tiedoston, joka on luotu kuvan lähettämisen yhteydessä
      fs.unlinkSync(imagePath); 
      // Koodi tarkistaa, löytyykö kuvasta OCR-tunnistuksen perusteella tekstiä. Jos löytyy, se palauttaa tämän tekstin. Jos ei, se palauttaa tyhjän merkkijonon 
      return detections.length > 0 ? detections[0].description : '';
      }));

      koealueTekstina = texts.join(' ');
      console.log('OCR Combined Text:', koealueTekstina);

      context = [{ role: 'user', content: koealueTekstina }];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: context.concat([{ role: 'user', content: 'Luo yksi yksinkertainen ja selkeä kysymys ja sen vastaus yllä olevasta tekstistä suomeksi. Kysy vain yksi asia kerrallaan.' }]),
          max_tokens: 150
        })
      }); 

      const data = await response.json();
      console.log(data.choices[0].message.content.trim());

      const responseText = data.choices[0].message.content.trim();

      const [question, answer] = responseText.includes('Vastaus:') ? responseText.split('Vastaus:'): [responseText, null]; 

      console.log('Parsed Question:', question);
      console.log('Parsed Answer:', answer);

      if (!question || !answer) {
        return res.status(400).json({ error: 'Model could not generate a valid question. Please provide a clearer text.' })
      }


  



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