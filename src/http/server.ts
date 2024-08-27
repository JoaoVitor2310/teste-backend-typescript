import express from "express";

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Hello World!');
})

server.listen(3000, () => console.log("Server running on port 3000"));


export { server };