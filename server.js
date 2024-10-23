import express from 'express';
import bodyParser from 'body-parser';
import dotevn from 'dotenv';

dotevn.config();
// HUOM! UUSI API KEY .ENV FILEEN
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());


app.post('/get-question', (req,res) =>{
    const userMessage = req.body.question;
    console.log(userMessage);
    if(userMessage){
        res.json({question: `Tämä on serverin palauttama viesti frontille: ${userMessage}`});
      }else{
        res.status(400).json({error:'Kysymys puuttuu.'});
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