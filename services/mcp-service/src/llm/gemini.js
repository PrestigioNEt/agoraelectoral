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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSentiment = analyzeSentiment;
exports.predictPolitical = predictPolitical;
exports.analyzePolitical = analyzePolitical;
const axios_1 = __importDefault(require("axios"));
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
function analyzeSentiment(text) {
    return __awaiter(this, void 0, void 0, function* () {
        // Cambia la ruta y payload según la API real de Gemini
        const response = yield axios_1.default.post(`${GEMINI_API_URL}/sentiment`, { text }, { headers: { 'Authorization': `Bearer ${GEMINI_API_KEY}` } });
        return response.data;
    });
}
function predictPolitical(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Placeholder para predicción política
        // Implementa según la API real
        return { prediction: 'No prediction (placeholder)' };
    });
}
function analyzePolitical(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Placeholder para análisis político
        // Implementa según la API real
        return { analysis: 'No analysis (placeholder)' };
    });
}
