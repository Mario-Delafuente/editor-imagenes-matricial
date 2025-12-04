// ===========================================
// EDITOR DE IMÁGENES CON ÁLGEBRA MATRICIAL
// ============================================
// Nombre del estudiante: Mario Alberto de la fuente ruiz
// Fecha: 30/12/2024
// Grupo: 1 C

const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

// Importar funciones auxiliares (puedes usarlas)
const {
  crearMatrizVacia,
  validarMatriz,
  obtenerDimensiones,
  limitarValorColor,
  crearPixel,
  copiarMatriz,
  asegurarDirectorio
} = require('./utilidades');

// Importar operaciones matriciales (puedes usarlas)
const {
  sumarMatrices,
  restarMatrices,
  multiplicarPorEscalar,
  multiplicarMatrices,
  transponerMatriz
} = require('./matriz');

// ============================================
// SECCIÓN 1: FUNDAMENTOS (20 puntos)
// Conversión entre imágenes y matrices
// ============================================

/**
 * Ejercicio 1.1: Cargar imagen PNG y convertir a matriz de píxeles (5 puntos)
 */
function imagenAMatriz(rutaImagen) {
  // 1. Leer el archivo PNG
  const buffer = fs.readFileSync(rutaImagen);
  const png = PNG.sync.read(buffer);
  
  // 2. Crear la matriz vacía
  const matriz = [];
  
  // 3. Recorrer cada fila (y) y cada columna (x)
  for (let y = 0; y < png.height; y++) {
    const fila = [];
    for (let x = 0; x < png.width; x++) {
      // 4. Calcular el índice en el buffer
      const idx = (png.width * y + x) * 4;
      
      // 5. Extraer los valores RGBA
      const pixel = {
        r: png.data[idx],
        g: png.data[idx + 1],
        b: png.data[idx + 2],
        a: png.data[idx + 3]
      };
      
      fila.push(pixel);
    }
    matriz.push(fila);
  }
  
  // 6. Retornar la matriz
  return matriz;
}

/**
 * Ejercicio 1.2: Convertir matriz de píxeles a imagen PNG (5 puntos)
 */
function matrizAImagen(matriz, rutaSalida) {
  // 1. Validar la matriz
  validarMatriz(matriz);
  
  // 2. Obtener dimensiones
  const dims = obtenerDimensiones(matriz);
  
  // 3. Crear el PNG
  const png = new PNG({
    width: dims.columnas,
    height: dims.filas
  });
  
  // 4. Llenar png.data
  for (let y = 0; y < dims.filas; y++) {
    for (let x = 0; x < dims.columnas; x++) {
      const idx = (dims.columnas * y + x) * 4;
      const pixel = matriz[y][x];
      
      png.data[idx] = limitarValorColor(pixel.r);
      png.data[idx + 1] = limitarValorColor(pixel.g);
      png.data[idx + 2] = limitarValorColor(pixel.b);
      png.data[idx + 3] = limitarValorColor(pixel.a);
    }
  }
  
  // 5. Asegurar que existe el directorio de salida
  asegurarDirectorio(path.dirname(rutaSalida));
  
  // 6. Guardar el archivo
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(rutaSalida, buffer);
}

/**
 * Ejercicio 1.3: Obtener un canal específico de color (5 puntos)
 */
function obtenerCanal(matriz, canal) {
  // 1. Validar parámetros
  if (!['r', 'g', 'b'].includes(canal)) {
    throw new Error("El canal debe ser 'r', 'g', o 'b'");
  }
  
  // 2. Crear matriz resultado
  const resultado = copiarMatriz(matriz);
  
  // 3. Para cada pixel, usar solo el valor del canal seleccionado
  for (let i = 0; i < resultado.length; i++) {
    for (let j = 0; j < resultado[i].length; j++) {
      const valor = matriz[i][j][canal];
      resultado[i][j] = {
        r: valor,
        g: valor,
        b: valor,
        a: matriz[i][j].a
      };
    }
  }
  
  return resultado;
}

/**
 * Ejercicio 1.4: Obtener dimensiones de una imagen (5 puntos)
 */
function obtenerDimensionesImagen(rutaImagen) {
  // Leer solo lo necesario para obtener dimensiones
  const buffer = fs.readFileSync(rutaImagen);
  const png = PNG.sync.read(buffer);
  
  return { 
    ancho: png.width, 
    alto: png.height, 
    totalPixeles: png.width * png.height 
  };
}

// ============================================
// SECCIÓN 2: OPERACIONES BÁSICAS (25 puntos)
// Aplicar álgebra matricial a píxeles
// ============================================

/**
 * Ejercicio 2.1: Ajustar brillo (8 puntos)
 */
function ajustarBrillo(matriz, factor) {
  // 1. Crear matriz resultado
  const resultado = copiarMatriz(matriz);
  
  // 2. Para cada pixel, multiplicar R, G, B por el factor
  for (let i = 0; i < resultado.length; i++) {
    for (let j = 0; j < resultado[i].length; j++) {
      const pixel = matriz[i][j];
      resultado[i][j] = {
        r: limitarValorColor(pixel.r * factor),
        g: limitarValorColor(pixel.g * factor),
        b: limitarValorColor(pixel.b * factor),
        a: pixel.a
      };
    }
  }
  
  return resultado;
}

/**
 * Ejercicio 2.2: Invertir colores (8 puntos)
 */
function invertirColores(matriz) {
  // 1. Crear matriz resultado
  const resultado = copiarMatriz(matriz);
  
  // 2. Para cada pixel, invertir los colores
  for (let i = 0; i < resultado.length; i++) {
    for (let j = 0; j < resultado[i].length; j++) {
      const pixel = matriz[i][j];
      resultado[i][j] = {
        r: 255 - pixel.r,
        g: 255 - pixel.g,
        b: 255 - pixel.b,
        a: pixel.a
      };
    }
  }
  
  return resultado;
}

/**
 * Ejercicio 2.3: Convertir a escala de grises (9 puntos)
 */
function convertirEscalaGrises(matriz) {
  // 1. Crear matriz resultado
  const resultado = copiarMatriz(matriz);
  
  // 2. Para cada pixel, calcular el valor de gris
  for (let i = 0; i < resultado.length; i++) {
    for (let j = 0; j < resultado[i].length; j++) {
      const pixel = matriz[i][j];
      const gris = 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
      
      resultado[i][j] = {
        r: limitarValorColor(gris),
        g: limitarValorColor(gris),
        b: limitarValorColor(gris),
        a: pixel.a
      };
    }
  }
  
  return resultado;
}

// ============================================
// SECCIÓN 3: TRANSFORMACIONES GEOMÉTRICAS (30 puntos)
// Aplicar operaciones matriciales para transformar
// ============================================

/**
 * Ejercicio 3.1: Voltear horizontal (espejo) (10 puntos)
 */
function voltearHorizontal(matriz) {
  const resultado = [];
  
  for (let i = 0; i < matriz.length; i++) {
    const fila = [];
    // Recorrer la fila en orden inverso
    for (let j = matriz[i].length - 1; j >= 0; j--) {
      fila.push(matriz[i][j]);
    }
    resultado.push(fila);
  }
  
  return resultado;
}

/**
 * Ejercicio 3.2: Voltear vertical (10 puntos)
 */
function voltearVertical(matriz) {
  const resultado = [];
  
  // Recorrer filas en orden inverso
  for (let i = matriz.length - 1; i >= 0; i--) {
    resultado.push([...matriz[i]]);
  }
  
  return resultado;
}

/**
 * Ejercicio 3.3: Rotar 90 grados en sentido horario (10 puntos)
 */
function rotar90Grados(matriz) {
  const filas = matriz.length;
  const columnas = matriz[0].length;
  const resultado = [];
  
  // Crear matriz rotada (dimensiones invertidas)
  for (let j = 0; j < columnas; j++) {
    const fila = [];
    for (let i = filas - 1; i >= 0; i--) {
      fila.push(matriz[i][j]);
    }
    resultado.push(fila);
  }
  
  return resultado;
}

// ============================================
// SECCIÓN 4: FILTROS AVANZADOS (25 puntos)
// Operaciones más complejas
// ============================================

/**
 * Ejercicio 4.1: Mezclar dos imágenes (8 puntos)
 */
function mezclarImagenes(matriz1, matriz2, factor) {
  // 1. Verificar que tengan las mismas dimensiones
  const dims1 = obtenerDimensiones(matriz1);
  const dims2 = obtenerDimensiones(matriz2);
  if (dims1.filas !== dims2.filas || dims1.columnas !== dims2.columnas) {
    throw new Error('Las imágenes deben tener el mismo tamaño');
  }
  
  // 2. Crear matriz resultado
  const resultado = [];
  
  // 3. Para cada pixel: mezcla lineal
  for (let i = 0; i < dims1.filas; i++) {
    const fila = [];
    for (let j = 0; j < dims1.columnas; j++) {
      const pixel1 = matriz1[i][j];
      const pixel2 = matriz2[i][j];
      
      fila.push({
        r: limitarValorColor(pixel1.r * (1 - factor) + pixel2.r * factor),
        g: limitarValorColor(pixel1.g * (1 - factor) + pixel2.g * factor),
        b: limitarValorColor(pixel1.b * (1 - factor) + pixel2.b * factor),
        a: limitarValorColor(pixel1.a * (1 - factor) + pixel2.a * factor)
      });
    }
    resultado.push(fila);
  }
  
  return resultado;
}

/**
 * Ejercicio 4.2: Filtro Sepia (9 puntos)
 */
function aplicarSepia(matriz) {
  const resultado = copiarMatriz(matriz);
  
  for (let i = 0; i < resultado.length; i++) {
    for (let j = 0; j < resultado[i].length; j++) {
      const pixel = matriz[i][j];
      
      const r = 0.393 * pixel.r + 0.769 * pixel.g + 0.189 * pixel.b;
      const g = 0.349 * pixel.r + 0.686 * pixel.g + 0.168 * pixel.b;
      const b = 0.272 * pixel.r + 0.534 * pixel.g + 0.131 * pixel.b;
      
      resultado[i][j] = {
        r: limitarValorColor(r),
        g: limitarValorColor(g),
        b: limitarValorColor(b),
        a: pixel.a
      };
    }
  }
  
  return resultado;
}

/**
 * Ejercicio 4.3: Detectar bordes (simplificado) (8 puntos)
 */
function detectarBordes(matriz, umbral = 50) {
  // 1. Convertir a escala de grises primero
  const grises = convertirEscalaGrises(matriz);
  const resultado = copiarMatriz(grises);
  
  const filas = grises.length;
  const columnas = grises[0].length;
  
  // 2. Para cada pixel (excepto bordes de la imagen)
  for (let i = 0; i < filas - 1; i++) {
    for (let j = 0; j < columnas - 1; j++) {
      const actual = grises[i][j].r;
      const derecha = grises[i][j + 1].r;
      const abajo = grises[i + 1][j].r;
      
      const diffDerecha = Math.abs(actual - derecha);
      const diffAbajo = Math.abs(actual - abajo);
      
      // 3. Si hay diferencia significativa, es borde
      const esBorde = diffDerecha > umbral || diffAbajo > umbral;
      const valor = esBorde ? 255 : 0;
      
      resultado[i][j] = {
        r: valor,
        g: valor,
        b: valor,
        a: grises[i][j].a
      };
    }
  }
  
  return resultado;
}

// ============================================
// NO MODIFICAR - Exportación de funciones
// ============================================
module.exports = {
  // Sección 1: Fundamentos
  imagenAMatriz,
  matrizAImagen,
  obtenerCanal,
  obtenerDimensionesImagen,
  
  // Sección 2: Operaciones Básicas
  ajustarBrillo,
  invertirColores,
  convertirEscalaGrises,
  
  // Sección 3: Transformaciones
  voltearHorizontal,
  voltearVertical,
  rotar90Grados,
  
  // Sección 4: Filtros Avanzados
  mezclarImagenes,
  aplicarSepia,
  detectarBordes
};
