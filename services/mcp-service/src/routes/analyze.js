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
const gemini_1 = require("../llm/gemini");
const router = (0, express_1.Router)();
router.post('/sentiment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    try {
        const result = yield (0, gemini_1.analyzeSentiment)(text);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Error en el análisis de sentimiento', details: err });
    }
}));
router.post('/predict', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, gemini_1.predictPolitical)(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Error en la predicción política', details: err });
    }
}));
router.post('/political', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, gemini_1.analyzePolitical)(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Error en el análisis político', details: err });
    }
}));
exports.default = router;
