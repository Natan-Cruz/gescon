import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function nanoid(length = 16){
    return customAlphabet(alphabet, length)();
}

export default nanoid;