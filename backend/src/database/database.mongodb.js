import mongoose from "mongoose";
import config from "../config/database.mongodb.json";
const uri = `mongodb+srv://${ config.username }:${ config.password }@cluster0.kvo35.mongodb.net/gescon?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.log(err))
mongoose.set('useFindAndModify', false);

export default mongoose;