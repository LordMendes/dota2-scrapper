import express from "express";
import {getMetaData} from './services/getMetaData'

const app = express();
const PORT = 3000;

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server runing on port: ${PORT}`);
});

getMetaData('carry')