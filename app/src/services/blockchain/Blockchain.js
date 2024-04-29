const Block = require('./Block')

// Clase Blockchain
class Blockchain {
    constructor() {
        this.blockchain = [this.genesisBlock()];
    };

    /*
        Input: none
        Output: String
        Description: Método llamado desde el constructor que crea el bloque génesis
    */
    genesisBlock() {
        return new Block("¡Bloque génesis!")
    }

    /*
        Input: none
        Output: none
        Description: Genera un número aleatorio entre 2 valores dados que será utilizado para la dificultad
    */
    getDificulty() {
        const max = 6;
        const min = 3;

        return Math.floor(Math.random() * ((max - min) + min));
    }

    /*
        Input: none
        Output: none
        Description: Retorna el último bloque de la cadena
    */
    getLatestBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }

    /*
        Input: Object
        Output: none
        Description: Añade un nuevo bloque a la cadena
    */
    async addBlock(newBlock) {
        const dificulty = this.getDificulty()
        await newBlock.validationPOW(dificulty)

        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.index = await this.getLatestBlock().index + 1;

        this.blockchain.push(newBlock);
    }

    /*
        Input: String
        Output: none
        Description: Retorna un bloque en base a su hash
    */
    async findBlockByHash(hash) {
        return await this.blockchain.find(block => block.hash === hash);
    }
}

module.exports = Blockchain;