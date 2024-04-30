// Importamos sha256 de la librería crypto-js. Este módulo nos servirá para calcular los hashes de los bloques.
const SHA256 = require('crypto-js/sha256');

// Clase Block
class Block {
    /*
        Input: none
        Output: none
        Description: Constructor de la clase Block
    */
    constructor(payload) {
        this.index = 0;
        this.timestamp = new Date();
        this.payload = payload;
        this.previousHash = '';
        this.hash = this.createHash();
        this.nonce = 0;
    }

    /*
        Input: none
        Output: String
        Description: Crea un hash para el bloque a través de los parámetros indicados en la función
    */
    createHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.payload) + this.previousHash + this.nonce).toString();
    }

    /*
        Input: Int
        Output: none
        Description: Obtiene, del hash, una parte de la cadena entre el índie 0 y el valor de dificultad.
            Se crea una cadena de ceros de longitud dificulty + 1.
            Mientras el inicio del hash sea distinto a la cadena de ceros se incrementará el nonce y se creará un nuevo hash hasta que esto sea verdadero
    */
    async validationPOW(dificulty) {
        while (this.hash.substring(0, dificulty) !== Array(dificulty + 1).join("0")) {
            this.nonce++;
            this.hash = await this.createHash();
        }
    }
}

module.exports = Block;