import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    //console.log(`Avaa serveri sivulta http://localhost:${port}`)
    console.log("Avaa serveri sivulta http://localhost:3000")
}
) 