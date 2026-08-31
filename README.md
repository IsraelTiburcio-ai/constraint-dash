# CONSTRAINT DASH

**Corre hacia la restricción correcta.**

Microjuego educativo mobile-first para practicar la traducción de lenguaje verbal a restricciones de programación lineal.

## Propósito

Constraint Dash refuerza el reconocimiento rápido de las palabras clave que aparecen al plantear modelos: máximos, mínimos, disponibilidad, capacidad, demanda, oferta, no exceder, no ser menor y no negatividad.

La actividad está basada principalmente en **Gimnasio 2. Modelos de Programación Lineal**, especialmente la sección **2.4 Planteamientos de modelo**:

- Páginas 5-6: disponibilidad, demanda, oferta y no producción negativa.
- Páginas 11-12: función objetivo, variables de decisión, restricciones explícitas e implícitas.
- Página 13: ejemplos de restricciones explícitas e implícitas con `xj ≥ 0` y `xj ∈ ℤ`.
- Páginas 14, 16-17, 18-19 y 40: ejercicios con máximos, mínimos, cuando menos, a lo más, cuando mucho, no puede exceder y relaciones entre variables.

## Mecánica

1. El personaje corre automáticamente por una pista digital.
2. En cada ronda aparece un enunciado breve.
3. El jugador toca una de tres puertas grandes: `≤`, `≥` o `=`.
4. Hay **10 decisiones por partida**.
5. Un error muestra la respuesta correcta y la carrera continúa; no se reinicia la partida.
6. Al final se revisan las 10 respuestas: aciertos, errores, elección realizada y formulación correcta.

Las preguntas simbólicas muestran relaciones como `x2 ≤ x1`, `x2 ≥ 2x1` o `xA ≥ xB/2` para conectar la palabra clave con la formulación.

## Duración

La ventana máxima de decisión es de 7 segundos por ronda. Una partida completa dura normalmente **45-80 segundos** y nunca necesita superar los 2 minutos.

## Traducciones practicadas

| Lenguaje del enunciado | Restricción |
| --- | --- |
| máximo, a lo más, cuando mucho | `≤` |
| mínimo, al menos, cuando menos, por lo menos | `≥` |
| exactamente | `=` |
| no puede exceder a | `≤` |
| no puede ser menor que | `≥` |
| condición de no negatividad | `xj ≥ 0` |

La condición de integridad (`xj ∈ ℤ`) aparece en el material como restricción implícita. El juego se concentra en la traducción de las tres relaciones de sus puertas para mantener la partida rápida.

## Accesibilidad y plataforma

- Diseño mobile-first para 390 × 844.
- Zonas de toque amplias y sin dependencia del teclado.
- Contraste alto, foco visible y etiquetas semánticas.
- `prefers-reduced-motion` desactiva animaciones intensas.
- Sonidos sintéticos opcionales y vibración breve en dispositivos compatibles.
- También se puede jugar con las teclas `1`, `2` y `3` en escritorio.

## Desarrollo local

No requiere compilación ni dependencias:

```bash
python3 -m http.server 8000
```

Después abre `http://localhost:8000`.

## Despliegue

El proyecto se publica con **GitHub Pages** mediante `.github/workflows/deploy.yml`. Cada push a `main` vuelve a desplegar automáticamente los archivos estáticos.

## Estructura

- `index.html`: pantallas, HUD, pista y puertas.
- `css/styles.css`: sistema visual responsive y accesibilidad.
- `js/questions.js`: banco de preguntas y selección de partidas.
- `js/game.js`: estado de la carrera, puntuación y feedback.
- `js/audio.js`: efectos generados con Web Audio API.
- `.github/workflows/deploy.yml`: autodeploy a GitHub Pages.

## Tecnología

HTML, CSS y JavaScript vanilla. Los efectos de audio se generan en el navegador, sin archivos de audio ni backend.
