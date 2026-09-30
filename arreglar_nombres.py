import os
import re
import unicodedata

def limpiar_nombre(nombre):
    # Separar nombre y extensión
    base, ext = os.path.splitext(nombre)
    # Quitar acentos y eñes
    base = unicodedata.normalize('NFKD', base).encode('ASCII', 'ignore').decode('utf-8')
    # Reemplazar espacios y caracteres raros por guiones
    base = re.sub(r'[^a-zA-Z0-9_-]', '_', base)
    # Limpiar guiones bajos dobles o múltiples
    base = re.sub(r'_+', '_', base).strip('_')
    return base.lower() + ext.lower()

def procesar_carpeta(ruta_raiz):
    cambios = {}
    for root, dirs, files in os.walk(ruta_raiz):
        for file in files:
            nombre_limpio = limpiar_nombre(file)
            if file != nombre_limpio:
                ruta_antigua = os.path.join(root, file)
                ruta_nueva = os.path.join(root, nombre_limpio)
                os.rename(ruta_antigua, ruta_nueva)
                # Guardar ruta relativa para reemplazarla en data.js
                rel_antigua = os.path.relpath(ruta_antigua, ruta_raiz).replace("\\", "/")
                rel_nueva = os.path.relpath(ruta_nueva, ruta_raiz).replace("\\", "/")
                cambios[rel_antigua] = rel_nueva
                print(f"Renombrado: {file} -> {nombre_limpio}")
    return cambios

# Ejecutar limpieza en assets
print("Limpiando archivos en assets...")
cambios_archivos = procesar_carpeta("assets")

# Actualizar data.js automáticamente
if cambios_archivos and os.path.exists("data.js"):
    print("Actualizando data.js...")
    with open("data.js", "r", encoding="utf-8") as f:
        contenido = f.read()
    
    for antiguo, nuevo in cambios_archivos.items():
        contenido = contenido.replace(antiguo, nuevo)
        # Por si acaso la ruta tenía codificación %20 o mayúsculas previas
        contenido = contenido.replace(antiguo.replace(" ", "%20"), nuevo)
        
    with open("data.js", "w", encoding="utf-8") as f:
        f.write(contenido)
    print("¡data.js actualizado correctamente!")

print("¡Proceso terminado con éxito!")