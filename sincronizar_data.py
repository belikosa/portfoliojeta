import re

print("Leyendo data.js...")
with open("data.js", "r", encoding="utf-8") as f:
    contenido = f.read()

# Expresión regular para encontrar cualquier ruta o texto que esté entre comillas y contenga 'assets/'
patron = r'["\'][^"\']*assets/[^"\']*["\']'

# Función para convertir toda esa ruta a minúsculas automáticamente
def pasar_a_minusculas(match):
    return match.group(0).lower()

contenido_nuevo = re.sub(patron, pasar_a_minusculas, contenido)

# Guardar los cambios en data.js
with open("data.js", "w", encoding="utf-8") as f:
    f.write(contenido_nuevo)

print("¡Listo! Todas las rutas de assets en data.js se han convertido a minúsculas automáticamente.")
