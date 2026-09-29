import os
from PIL import Image

# Carpeta donde buscas las imágenes (cambia 'rutaaqui' si están en una carpeta específica, ej: 'img/')
# Si tus imágenes están repartidas, pon '.' para buscar en todo el proyecto
directorio = '.' 

extensiones = ('.jpg', '.jpeg', '.png')

print("Comprimiendo imágenes...")
for root, dirs, files in os.walk(directorio):
    # Evitamos entrar en .git o node_modules si existen
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.lower().endswith(extensiones):
            ruta_completa = os.path.join(root, file)
            try:
                img = Image.open(ruta_completa)
                # Guardamos la imagen optimizada reduciendo un poco la calidad (ej: 75) y manteniendo formato
                img.save(ruta_completa, optimize=True, quality=75)
                print(f"Optimizada: {ruta_completa}")
            except Exception as e:
                print(f"No se pudo procesar {file}: {e}")

print("¡Listo! Todas las imágenes han sido comprimidas.")
