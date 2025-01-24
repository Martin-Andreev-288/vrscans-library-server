// @ts-types="npm:@types/json-server@0.14.7"
import jsonServer from 'npm:json-server@0.17.4';
import auth from 'npm:json-server-auth@2.1.0';
import data from "./data.json" with { type: "json" };
// @ts-types="npm:@types/express@4.17.21"
import 'npm:express@4.17.1';
import QueryString from '../../../AppData/Local/deno/npm/registry.npmjs.org/@types/qs/6.9.18/index.d.ts';

const server = jsonServer.create()

const router = jsonServer.router(data)

// json-server-auth does not have any types
const rules = (auth as any).rewriter({
    vrscans: 644,
    materials: 644,
    colors: 644,
    tags: 644,
    industries: 644,
    manufacturers: 644,
    favorites: 664
});

// required by json-server-auth
(server as any).db = router.db


function readNumberQueryParam(name: string, query: QueryString.ParsedQs): Set<number> {
    if (!query[name]) return new Set();
    const elements = Array.isArray(query[name]) ? query[name] : [query[name]];
    const numberElements = elements.map((color) => parseInt(color as string));
    return new Set(numberElements);
}

const filterVrscans = (vrscans: typeof data.vrscans, query: { colors: Set<number>, materials: Set<number>, tags: Set<number> }) =>
    vrscans.filter((vrscan) => {
        const acceptsMaterials =
            !query.materials.size || query.materials.has(vrscan.materialTypeId);
        const acceptsColors =
            !query.colors.size ||
            vrscan.colors.some((color) => query.colors.has(color));
        const acceptsTags =
            !query.tags.size || vrscan.tags.some((tag) => query.tags.has(tag));

        return acceptsMaterials && acceptsColors && acceptsTags;
    });

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
server.use(rules)
server.use(auth)
server.get('/searchVrscans', (req, res) => {
    const colors = readNumberQueryParam('colors', req.query);
    const materials = readNumberQueryParam('materials', req.query);
    const tags = readNumberQueryParam('tags', req.query);
    const filteredVrScans = filterVrscans(data.vrscans, { colors, materials, tags });
    res.send(filteredVrScans);
})
server.use(router)

server.listen(3000, () => {
    console.log('JSON Server is running on port 3000')
})