"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const analyze_1 = __importDefault(require("./routes/analyze"));
const memory_1 = __importDefault(require("./routes/memory"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.MCP_API_KEY || 'lacaracortadacubanaes12';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware de autenticación simple por API key
app.use((req, res, next) => {
    const key = req.headers['x-api-key'];
    if (key !== API_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
});
app.use('/analyze', analyze_1.default);
app.use('/memory', memory_1.default);
app.get('/', (req, res) => {
    res.send('Agora MCP Service is running');
});
app.listen(PORT, () => {
    console.log(`MCP Service listening on port ${PORT}`);
});
