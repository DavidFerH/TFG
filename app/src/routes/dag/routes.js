const { Router } = require('express');
const router = Router();
const Graph = require('../../services/dag/Graph');

const graph = new Graph();

router.post('/vertex', (req, res) => {
    const { data, info } = req.body;
    const vertex = graph.addVertex(data, info);
    res.json({ hash: vertex });
});

router.post('/create', (req, res) => {
    try {
        const data = req.body;

        const newVertexHash = graph.addVertex(data);

        // Respuesta exitosa
        res.json({ success: true, message: 'Vértice agregado correctamente', hash: newVertexHash });
    } catch (error) {
        // Manejar errores
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/getGraph', (req, res) => {
    try {
        res.json({ success: true, vertices: graph.vertices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/printGraph', (req, res) => {
    try {
        res.json({ success: true, graph: graph.printGraph(graph) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;