#!/usr/bin/env python3
"""
Servidor MCP básico en Python
Implementa herramientas simples para demostrar funcionalidad MCP
"""

import asyncio
import json
import sys
from typing import Any, Dict, List, Optional
from mcp import ClientSession, StdioServerParameters
from mcp.server import NotificationOptions, Server
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types
import redis

# Crear instancia del servidor
server = Server("ejemplo-servidor")

# Conectar a Redis
# Asumiendo que Redis está disponible en 'redis' (nombre del servicio en docker-compose) y puerto 6379
redis_client = redis.Redis(host='redis', port=6379, db=0)

# Almacenamiento simple en memoria (como fallback o para demostración)
notas = {}
contador = 0

@server.list_resources()
async def handle_list_resources() -> list[types.Resource]:
    """Lista todos los recursos disponibles"""
    return [
        types.Resource(
            uri="notas://todas",
            name="Todas las notas",
            description="Todas las notas almacenadas",
            mimeType="application/json"
        )
    ]

@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """Lee un recurso específico"""
    if uri == "notas://todas":
        # Intentar obtener de Redis primero
        all_notes_json = redis_client.get("all_notes")
        if all_notes_json:
            return all_notes_json.decode('utf-8')
        else:
            # Si no está en Redis, usar el almacenamiento en memoria y cachear
            notes_json = json.dumps(notas, indent=2)
            redis_client.set("all_notes", notes_json)
            return notes_json
    else:
        raise ValueError(f"Recurso no encontrado: {uri}")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """Lista todas las herramientas disponibles"""
    return [
        types.Tool(
            name="agregar_nota",
            description="Agrega una nueva nota",
            inputSchema={
                "type": "object",
                "properties": {
                    "titulo": {
                        "type": "string",
                        "description": "Título de la nota"
                    },
                    "contenido": {
                        "type": "string",
                        "description": "Contenido de la nota"
                    }
                },
                "required": ["titulo", "contenido"]
            }
        ),
        types.Tool(
            name="obtener_nota",
            description="Obtiene una nota por su ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "description": "ID de la nota"
                    }
                },
                "required": ["id"]
            }
        ),
        types.Tool(
            name="contar_notas",
            description="Cuenta el número total de notas",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        types.Tool(
            name="calcular",
            description="Realiza cálculos matemáticos simples",
            inputSchema={
                "type": "object",
                "properties": {
                    "operacion": {
                        "type": "string",
                        "description": "Operación matemática (ej: 2+3, 10*5)"
                    }
                },
                "required": ["operacion"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict[str, Any]
) -> list[types.TextContent]:
    """Maneja las llamadas a herramientas"""
    global contador
    
    if name == "agregar_nota":
        contador += 1
        nota_id = contador
        nota = {
            "id": nota_id,
            "titulo": arguments["titulo"],
            "contenido": arguments["contenido"]
        }
        notas[nota_id] = nota # Almacenar en memoria
        redis_client.set(f"nota:{nota_id}", json.dumps(nota)) # Almacenar en Redis
        redis_client.delete("all_notes") # Invalidar caché de todas las notas
        return [
            types.TextContent(
                type="text",
                text=f"Nota agregada con ID: {nota_id}"
            )
        ]
    
    elif name == "obtener_nota":
        nota_id = arguments["id"]
        # Intentar obtener de Redis primero
        nota_json = redis_client.get(f"nota:{nota_id}")
        if nota_json:
            nota = json.loads(nota_json.decode('utf-8'))
            return [
                types.TextContent(
                    type="text",
                    text=f"Título: {nota['titulo']}\nContenido: {nota['contenido']}"
                )
            ]
        elif nota_id in notas:
            nota = notas[nota_id]
            return [
                types.TextContent(
                    type="text",
                    text=f"Título: {nota['titulo']}\nContenido: {nota['contenido']}"
                )
            ]
        else:
            return [
                types.TextContent(
                    type="text",
                    text=f"Nota con ID {nota_id} no encontrada"
                )
            ]
    
    elif name == "contar_notas":
        return [
            types.TextContent(
                type="text",
                text=f"Número total de notas: {len(notas)}"
            )
        ]
    
    elif name == "calcular":
        try:
            operacion = arguments["operacion"]
            # Evaluación segura de operaciones matemáticas básicas
            resultado = eval(operacion, {"_builtins_": {}}, {})
            return [
                types.TextContent(
                    type="text",
                    text=f"{operacion} = {resultado}"
                )
            ]
        except Exception as e:
            return [
                types.TextContent(
                    type="text",
                    text=f"Error en cálculo: {str(e)}"
                )
            ]
    
    else:
        raise ValueError(f"Herramienta desconocida: {name}")

async def main():
    """Función principal del servidor"""
    # Configuración del servidor
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="ejemplo-servidor",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={}
                )
            )
        )

if __name__ == "__main__":
    asyncio.run(main())