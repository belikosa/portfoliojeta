let categoriaSeleccionada = 'todos';

function normalizarTexto(texto) {
  if (!texto) return '';
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

async function renderizarSecciones() {
  const container = document.getElementById('app-container');
  if (!container) return;
  container.innerHTML = '';

  const catSelNormalizada = normalizarTexto(categoriaSeleccionada);

  // SI SE SELECCIONA CV, CARGAMOS EL ARCHIVO HTML EXTERNO
  if (catSelNormalizada === 'cv') {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'seccion-proyecto';
    sectionEl.id = 'seccion-cv';
    sectionEl.style.paddingTop = '50px';

    const galeriaContenedor = document.createElement('div');
    galeriaContenedor.className = 'galeria-contenedor';
    galeriaContenedor.style.width = '100%';

    try {
      const respuesta = await fetch('cv.html');
      if (!respuesta.ok) throw new Error('No se pudo cargar el archivo');
      const contenidoHtml = await respuesta.text();
      
      galeriaContenedor.innerHTML = contenidoHtml;
    } catch (error) {
      galeriaContenedor.innerHTML = '<p class="description">Error al cargar el archivo de CV.</p>';
    }

    sectionEl.appendChild(galeriaContenedor);
    container.appendChild(sectionEl);
    return; 
  }

  // Resto del código para las demás categorías (basado en data.js)
  if (typeof secciones === 'undefined') return;

  const proyectosVisibles = secciones.filter(sec => {
    const catProyecto = sec.categoria || sec.categoría;
    
    let catsNormalizadas = [];
    if (Array.isArray(catProyecto)) {
      catsNormalizadas = catProyecto.map(c => normalizarTexto(c));
    } else if (catProyecto) {
      catsNormalizadas = [normalizarTexto(catProyecto)];
    }

    if (catSelNormalizada === 'todos') {
      const esExcluido = catsNormalizadas.some(cat => 
        cat === 'bio' || 
        cat === 'cv'
      );
      return !esExcluido;
    }

    return catsNormalizadas.includes(catSelNormalizada);
  });

  proyectosVisibles.forEach((seccionData, index) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'seccion-proyecto';
    sectionEl.id = seccionData.id;

    const header = document.createElement('header');
    
    if (seccionData.subhead) {
      const subhead = document.createElement('p');
      subhead.className = 'subhead';
      subhead.innerHTML = seccionData.subhead;
      header.appendChild(subhead);
    }

    if (seccionData.descripciones) {
      seccionData.descripciones.forEach(desc => {
        const p = document.createElement('p');
        p.className = 'description';
        p.innerHTML = desc;
        header.appendChild(p);
      });
    }

    sectionEl.appendChild(header);

    const galeriaContenedor = document.createElement('div');
    galeriaContenedor.className = 'galeria-contenedor';

    if (seccionData.elementos) {
      seccionData.elementos.forEach(item => {
        let el;
        if (item.tipo === 'img') {
          el = document.createElement('img');
          el.src = item.src;
          el.className = 'draggable-image';
        } else if (item.tipo === 'video') {
          el = document.createElement('video');
          el.src = item.src;
          el.autoplay = true;
          el.loop = true;
          el.muted = true;
          el.playsInline = true;
          el.className = 'draggable-image';
        } else if (item.tipo === 'box' || item.tipo === 'text-elipse') {
          el = document.createElement('div');
          el.className = item.tipo === 'box' ? 'text-box' : 'text-elipse';
          el.innerHTML = item.texto;
        }

        if (el) {
          if (item.top) el.style.top = item.top;
          if (item.left) el.style.left = item.left;
          if (item.right) el.style.right = item.right;
          if (item.width) el.style.width = item.width;
          galeriaContenedor.appendChild(el);
        }
      });
    }

    sectionEl.appendChild(galeriaContenedor);

    if (index < proyectosVisibles.length - 1) {
      const separador = document.createElement('div');
      separador.className = 'separador';
      sectionEl.appendChild(separador);
    }

    container.appendChild(sectionEl);
  });
}

function filtrarCategoria(cat, elementoBoton) {
  categoriaSeleccionada = cat;
  document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
  if (elementoBoton) elementoBoton.classList.add('active');
  renderizarSecciones();
}

// Función para filtrar los elementos del CV mediante botones
function filtrarCV(categoria, el) {
  document.querySelectorAll('#filtro-cv button').forEach(btn => {
      btn.classList.remove('active');
  });
  
  if (el) {
      el.classList.add('active');
  }

  const items = document.querySelectorAll('#curriculum .grid-item');
  items.forEach(item => {
      if (categoria === '*') {
          item.style.display = 'block';
      } else {
          if (item.classList.contains(categoria)) {
              item.style.display = 'block';
          } else {
              item.style.display = 'none';
          }
      }
  });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderizarSecciones();
});