import jsonServer from 'npm:json-server@0.17.4';
import auth from 'npm:json-server-auth@2.1.0';
import data from "./data.json" with { type: "json" };

const server = jsonServer.create()

const router = jsonServer.router(data)

const rules = auth.rewriter({
    vrscans: 644,
    materials: 644,
    colors: 644,
    tags: 644,
    industries: 644,
    manufacturers: 644,
    favorites: 664
})

server.db = router.db

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
server.use(rules)
server.use(auth)
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running on port 3000')
})