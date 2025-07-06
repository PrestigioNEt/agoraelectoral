"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = require("../vectorstore/redis");
const router = (0, express_1.Router)();
router.post('/query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    try {
        const result = yield (0, redis_1.queryMemory)(query);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Error en la consulta de memoria', details: err });
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, vector, metadata } = req.body;
    try {
        const result = yield (0, redis_1.updateMemory)(key, vector, metadata);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Error actualizando memoria', details: err });
    }
}));
exports.default = router;
