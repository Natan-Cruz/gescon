import Controller from "../../../../utils/Controller";
import { getInformations } from "../models/models"
import axios from "axios"
import GesconError from "../../../../utils/GesconError"

const HG_WEATHER_KEY = "c013a66a";

export const getWeatherData = (req, res) => Controller( async () => {
    const { city } = await getInformations(req.params.id);
    if(!city)
        throw new GesconError("Endereço não definido!");

    const URL_WEATHER = `https://api.hgbrasil.com/weather?key=${ HG_WEATHER_KEY }&fields=only_results&city_name=${ city }`
    
    const { data } = await axios.get(URL_WEATHER)
    return data
}, res, "controllerWeatherData -> getWeatherData", 200)