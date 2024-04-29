const SHA256 = require('crypto-js/sha256');

// Clase grafo
class Graph {
    constructor() {
        this.vertices = {};
        this.createGenesisNodes();
    }

    /*
        Input: none
        Output: none
        Description: Crea 4 nodos génesis
    */
    async createGenesisNodes() {
        for (let i = 0; i < 4; i++) {
            const data = { transaction: `Génesis ${i + 1}` };
            const hash = await this.createHash(data);
            this.vertices[hash] = { info: data, edges: [] };

            console.log("Hash : " + hash + " Data: " + JSON.stringify(data));
        }
    }

    /*
        Input: none
        Output: String
        Description: Crea un hash para el bloque a través de los parámetros indicados en la función
    */
    async createHash(data) {
        const date = new Date().toString();
        const randNone = Math.floor(Math.random() * 100);

        const hash = SHA256(JSON.stringify(data) + date + randNone).toString();

        return hash
    }

    /*
        Input: data (Object), info (Object)
        Output: hash (String)
        Description: Agrega un vértice al grafo y retorna su hash único.
    */
    async addVertex(data, info) {
        const hash = await this.createHash(data);

        if (!this.vertices[hash]) {
            this.vertices[hash] = { info: info, edges: [] };
        }

        // Agregar automáticamente aristas para crear un DAG
        const vertices = Object.keys(this.vertices);
        for (const vertex of vertices) {
            if (vertex !== hash && !this.hasCycleAfterAddingEdge(vertex, hash)) {
                this.addEdge(vertex, hash);
            }
        }

        return hash;
    }

    /*
        Input: fromVertex (String), toVertex (String)
        Output: None
        Description: Agrega una arista dirigida del vértice fromVertex al vértice toVertex.
    */
    addEdge(fromVertex, toVertex) {
        this.vertices[fromVertex].edges.push(toVertex); // Agregar el identificador del vértice de destino
    }

    /*
        Input: fromVertex (String), toVertex (String)
        Output: Boolean
        Description: Verifica si agregar una arista de fromVertex a toVertex crea un ciclo en el grafo.
    */
    hasCycleAfterAddingEdge(fromVertex, toVertex) {
        this.vertices[fromVertex].edges.push(toVertex);
        const hasCycle = this.hasCycle();
        this.vertices[fromVertex].edges.pop();
        return hasCycle;
    }

    /*
        Input: Ninguno
        Output: Booleano
        Description: Este método verifica si agregar una arista a cualquier vértice del grafo crea un ciclo. Utiliza el algoritmo de búsqueda en profundidad (DFS) para recorrer el grafo y detectar ciclos. Devuelve true si encuentra un ciclo y false si no lo encuentra.
    */
    hasCycle() {
        const visited = {};
        const recursionStack = {};

        const isCyclicUtil = (vertex) => {
            if (!visited[vertex]) {
                visited[vertex] = true;
                recursionStack[vertex] = true;

                const neighbors = this.vertices[vertex].edges;
                for (let i = 0; i < neighbors.length; i++) {
                    const neighbor = neighbors[i];
                    if (!visited[neighbor] && isCyclicUtil(neighbor)) {
                        return true;
                    } else if (recursionStack[neighbor]) {
                        return true;
                    }
                }
            }
            recursionStack[vertex] = false;
            return false;
        };

        const vertices = Object.keys(this.vertices);
        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            if (isCyclicUtil(vertex)) {
                return true;
            }
        }

        return false;
    }

    /*
        Input: Un objeto `graph` que representa un grafo. Este objeto debe tener la estructura adecuada, con cada vértice representado como una clave y sus aristas como valores en un arreglo.
        Output: Una cadena de caracteres que representa la representación ASCII del grafo, donde cada vértice está rodeado por un círculo y las aristas se muestran como flechas que apuntan a los vértices de destino.
        Description: Esta función toma un objeto que representa un grafo y genera una representación ASCII visual del mismo. Cada vértice se muestra como un círculo (`o`), y las aristas
    */
    printGraph(graph) {
        const vertices = Object.keys(graph.vertices);
        const edges = [];

        // Construir un objeto para mapear los índices de los vértices
        const indexMap = {};
        for (let i = 0; i < vertices.length; i++) {
            indexMap[vertices[i]] = i;
        }

        // Inicializar la matriz de adyacencia con ceros
        const adjacencyMatrix = Array(vertices.length).fill(0).map(() => Array(vertices.length).fill(' '));

        // Llenar la matriz de adyacencia con 1s donde haya una arista
        for (const vertex of vertices) {
            const vertexIndex = indexMap[vertex];
            const vertexEdges = graph.vertices[vertex].edges;
            for (const edge of vertexEdges) {
                const edgeIndex = indexMap[edge];
                adjacencyMatrix[vertexIndex][edgeIndex] = '1';
            }
        }

        // Crear la representación ASCII del grafo
        let asciiGraph = '';
        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            const vertexIndex = indexMap[vertex];

            // Dibujar el círculo alrededor del vértice
            asciiGraph += '  o  \n';
            asciiGraph += ' /|\\ \n';
            asciiGraph += '(___)';
            asciiGraph += `  ${vertex}  `; // Agregar el nombre del vértice

            // Agregar las aristas salientes del vértice
            for (let j = 0; j < vertices.length; j++) {
                if (adjacencyMatrix[vertexIndex][j] === '1') {
                    asciiGraph += '->' + vertices[j] + ' ';
                }
            }
            asciiGraph += '\n\n';
        }

        console.log(asciiGraph)
    }
}

module.exports = Graph;
