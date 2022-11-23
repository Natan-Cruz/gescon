// https://github.com/Romulosanttos/secure-storage/blob/master/example/app.js
import { SHA256, AES, enc } from 'crypto-js';
import SecureStorage from './SecureStorage';
const SECRET_KEY = 'AQcERqlLISRdf7jFMYXn6D3cvHPZvnD4'; //Definir key

const sessionPreference = localStorage.getItem("session_preference")

let drive;
switch(sessionPreference){
  case "1": drive = window.sessionStorage; break
  case "2":
    case "3":
      case "4":
        drive = window.localStorage; break
  default:
    drive = window.localStorage;
}
const secureStorage = new SecureStorage(drive, {
  hash: function hash(key) {
    const newKey = SHA256(key, SECRET_KEY);
    return newKey.toString();
  },
  encrypt: function encrypt(data) {
    const newData = AES.encrypt(data, SECRET_KEY);
    return newData.toString();
  },
  decrypt: function decrypt(data) {
    const newData = AES.decrypt(data, SECRET_KEY);
    return newData.toString(enc.Utf8);
  },
});

export default secureStorage;