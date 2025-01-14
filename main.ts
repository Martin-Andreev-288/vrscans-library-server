import jsonServer from 'npm:json-server@0.17.4';

const server = jsonServer.create()

// const fs = require('fs')
// const path = require('path')
// const filePath = path.join('db.json')
// const data = fs.readFileSync(filePath, "utf-8");
// const db = JSON.parse(data);
const router = jsonServer.router({})

server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})