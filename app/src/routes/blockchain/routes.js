const { Router } = require('express');
const router = Router();
const Blockchain = require('../../services/blockchain/Blockchain');
const Block = require('../../services/blockchain/Block');

const blockchain = new Blockchain();

// Endpoint para añadir un bloque
router.post('/addBlock', async (req, res) => {
    try {
        const data = req.body;
        const newBlock = new Block(data);

        await blockchain.addBlock(newBlock);
        res.status(200).send({ message: "ok" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
});

// Endpoint para obtener todos los bloque de la blockchain
router.get('/getBlocks', (req, res) => {
    try {
        res.json(blockchain);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
});

// Endpoint para obtener un bloque a través de su hash
router.get('/getBlock', (req, res) => {
    try {
        const hash = req.query.hash;
        if (hash) {
            blockchain.findBlockByHash(hash)
                .then(block => {
                    if (!block) {
                        return res.status(404).json({ message: "Block not found" });
                    }
                    res.json(block);
                })
                .catch(error => {
                    console.error("Error:", error);
                    res.status(500).json({ message: "Internal server error" });
                });
        } else {
            console.log("No se ha propocionado un hash de transacción");
        }

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
});

module.exports = router;