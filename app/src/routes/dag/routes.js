const { Router } = require('express');
const router = Router();
const Graph = require('../../services/dag/Graph');

const graph = new Graph();

if (graph) console.log("Inicializado el DAG correctamente");

/*
    Input: req.body (JSON)
    Output: res (JSON)
    Description: Endpoint para añadir una nueva transacción al grafo
*/
router.post('/create', (req, res) => {
    try {
        const data = req.body;

        const newVertexHash = graph.addVertex(data);

        res.json({ success: true, message: 'Vértice agregado correctamente', hash: newVertexHash });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
});

/*
    Input: none
    Output: res (JSON)
    Description: Endpoint para obtener el grafo
*/
router.get('/getGraph', (req, res) => {
    try {
        res.json({ success: true, vertices: graph.vertices });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
});

/*
    Input: none
    Output: res (JSON)
    Description: Endpoint para obtener el grafo en formato ASCII
*/
router.get('/printGraph', (req, res) => {
    try {
        res.json({ success: true, graph: graph.printGraph(graph) });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
});

module.exports = router;