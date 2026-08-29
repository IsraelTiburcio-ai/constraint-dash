/* Banco basado en Gimnasio 2: Modelos de Programación Lineal. */
(function () {
  "use strict";

  var questions = [
    {
      id: "materia-prima",
      kind: "keyword",
      text: "Se dispone de 40 kilos de materia prima.",
      mark: "dispone de 40 kilos",
      answer: "lte",
      reveal: "3x1 + 2x2 ≤ 40",
      source: "Gimnasio 2, p. 6",
      tip: "Una disponibilidad o capacidad marca un techo: ≤."
    },
    {
      id: "demanda-bolsas",
      kind: "keyword",
      text: "Se tiene una demanda de 10 bolsas de lujo.",
      mark: "demanda",
      answer: "gte",
      reveal: "x1 ≥ 10",
      source: "Gimnasio 2, p. 6",
      tip: "La demanda que se debe cubrir pone un piso: ≥."
    },
    {
      id: "oferta-bolsas",
      kind: "keyword",
      text: "La oferta de bolsas normales es de 3 piezas.",
      mark: "oferta",
      answer: "lte",
      reveal: "x2 ≤ 3",
      source: "Gimnasio 2, p. 6",
      tip: "La oferta disponible limita lo que puede producirse: ≤."
    },
    {
      id: "bombas-minimo",
      kind: "keyword",
      text: "Se espera vender cuando menos 300 bombas normales.",
      mark: "cuando menos",
      answer: "gte",
      reveal: "x1 ≥ 300",
      source: "Gimnasio 2, p. 14",
      tip: "«Cuando menos» indica un mínimo, así que va con ≥."
    },
    {
      id: "bombas-maximo",
      kind: "keyword",
      text: "Se venderán a lo más 180 bombas extragrandes.",
      mark: "a lo más",
      answer: "lte",
      reveal: "x2 ≤ 180",
      source: "Gimnasio 2, p. 14",
      tip: "«A lo más» indica un máximo, así que va con ≤."
    },
    {
      id: "latas-total",
      kind: "keyword",
      text: "La tienda no vende más de 500 latas diarias.",
      mark: "no vende más de",
      answer: "lte",
      reveal: "x1 + x2 ≤ 500",
      source: "Gimnasio 2, p. 14",
      tip: "«No vende más de» pone un límite superior: ≤."
    },
    {
      id: "latas-a1",
      kind: "keyword",
      text: "Se estima que se venden cuando menos 100 latas de A1.",
      mark: "cuando menos",
      answer: "gte",
      reveal: "x1 ≥ 100",
      source: "Gimnasio 2, p. 14",
      tip: "«Cuando menos» equivale a «por lo menos»: ≥."
    },
    {
      id: "m2-maximo",
      kind: "keyword",
      text: "El uso diario de M2 es de 6 toneladas cuando mucho.",
      mark: "cuando mucho",
      answer: "lte",
      reveal: "M2 ≤ 6",
      source: "Gimnasio 2, p. 17",
      tip: "«Cuando mucho» es un techo de disponibilidad: ≤."
    },
    {
      id: "m2-minimo",
      kind: "keyword",
      text: "El uso diario de M2 es de 3 toneladas cuando menos.",
      mark: "cuando menos",
      answer: "gte",
      reveal: "M2 ≥ 3",
      source: "Gimnasio 2, p. 17",
      tip: "«Cuando menos» es un piso: ≥."
    },
    {
      id: "empaque-maximo",
      kind: "keyword",
      text: "El departamento de empaquetado tiene máximo 45 horas disponibles.",
      mark: "máximo 45 horas",
      answer: "lte",
      reveal: "2x1 + x2 ≤ 45",
      source: "Gimnasio 2, p. 5",
      tip: "Las horas disponibles son una capacidad máxima: ≤."
    },
    {
      id: "rendimiento-minimo",
      kind: "keyword",
      text: "El rendimiento anual debe ser de $10,000 como mínimo.",
      mark: "como mínimo",
      answer: "gte",
      reveal: "R ≥ 10,000",
      source: "Gimnasio 2, p. 19",
      tip: "«Como mínimo» exige alcanzar un piso: ≥."
    },
    {
      id: "demanda-producto-1",
      kind: "keyword",
      text: "La demanda mensual mínima del producto 1 es de 500 unidades.",
      mark: "mínima",
      answer: "gte",
      reveal: "x1 ≥ 500",
      source: "Gimnasio 2, p. 18",
      tip: "Una demanda mínima se expresa con ≥."
    },
    {
      id: "demanda-producto-2",
      kind: "keyword",
      text: "La demanda mensual máxima del producto 2 es de 6000 unidades.",
      mark: "máxima",
      answer: "lte",
      reveal: "x2 ≤ 6000",
      source: "Gimnasio 2, p. 18",
      tip: "Una demanda máxima se expresa con ≤."
    },
    {
      id: "inversion-maxima",
      kind: "keyword",
      text: "Se asignan cuando mucho $75,000 a cualquier inversión.",
      mark: "cuando mucho",
      answer: "lte",
      reveal: "xj ≤ 75,000",
      source: "Gimnasio 2, p. 40",
      tip: "«Cuando mucho» limita por arriba: ≤."
    },
    {
      id: "total-minimo",
      kind: "keyword",
      text: "La cantidad mínima total a producir es de 3 toneladas.",
      mark: "mínima total",
      answer: "gte",
      reveal: "x1 + x2 ≥ 3",
      source: "Gimnasio 2, p. 17",
      tip: "Una cantidad mínima exige al menos ese valor: ≥."
    },
    {
      id: "operarios-exactos",
      kind: "equal",
      text: "Se requieren exactamente 20 operarios en corte.",
      mark: "exactamente",
      answer: "eq",
      reveal: "x1 = 20",
      source: "Actividad Constraint Dash",
      tip: "«Exactamente» fija el valor: =."
    },
    {
      id: "turno-exacto",
      kind: "equal",
      text: "El turno diario dura exactamente 8 horas.",
      mark: "exactamente",
      answer: "eq",
      reveal: "h = 8",
      source: "Gimnasio 2, p. 14",
      tip: "«Exactamente» no deja margen: =."
    },
    {
      id: "no-negatividad-1",
      kind: "nonnegative",
      text: "No se pueden producir bolsas negativas.",
      mark: "negativas",
      answer: "gte",
      options: ["xj ≤ 0", "xj ≥ 0", "xj = 0"],
      reveal: "xj ≥ 0",
      source: "Gimnasio 2, p. 6",
      tip: "La condición de no negatividad es xj ≥ 0."
    },
    {
      id: "no-negatividad-2",
      kind: "nonnegative",
      text: "Las variables de decisión cumplen la condición de no negatividad.",
      mark: "no negatividad",
      answer: "gte",
      options: ["xj ≤ 0", "xj ≥ 0", "xj = 0"],
      reveal: "xj ≥ 0",
      source: "Gimnasio 2, p. 12",
      tip: "En las restricciones implícitas: xj ≥ 0."
    },
    {
      id: "mesas-sillas",
      kind: "symbolic",
      text: "La producción de mesas no puede exceder a la de sillas.",
      mark: "no puede exceder",
      vars: "x1 = sillas · x2 = mesas",
      answer: "lte",
      options: ["x2 ≤ x1", "x2 ≥ x1", "x2 = x1"],
      reveal: "x2 ≤ x1",
      source: "Actividad Constraint Dash",
      tip: "Si mesas no exceden a sillas: x2 ≤ x1."
    },
    {
      id: "interior-exterior",
      kind: "symbolic",
      text: "La demanda de pintura de interiores no puede ser menor que la de exteriores.",
      mark: "no puede ser menor",
      vars: "x1 = exterior · x2 = interior",
      answer: "gte",
      options: ["x2 ≤ x1", "x2 ≥ x1", "x2 = x1"],
      reveal: "x2 ≥ x1",
      source: "Gimnasio 2, p. 17",
      tip: "Si interiores no pueden ser menores: x2 ≥ x1."
    },
    {
      id: "byk-margen",
      kind: "symbolic",
      text: "ByK se vende más que A1 con un margen mínimo de 2:1.",
      mark: "margen mínimo",
      vars: "x1 = Cola A1 · x2 = Cola ByK",
      answer: "gte",
      options: ["x2 ≤ 2x1", "x2 ≥ 2x1", "x2 = 2x1"],
      reveal: "x2 ≥ 2x1",
      source: "Gimnasio 2, p. 14",
      tip: "El margen mínimo 2:1 exige x2 ≥ 2x1."
    },
    {
      id: "inversion-mitad",
      kind: "symbolic",
      text: "La inversión A debe ser por lo menos la mitad de la inversión B.",
      mark: "por lo menos",
      vars: "xA = inversión A · xB = inversión B",
      answer: "gte",
      options: ["xA ≤ xB/2", "xA ≥ xB/2", "xA = xB/2"],
      reveal: "xA ≥ xB/2",
      source: "Gimnasio 2, p. 19",
      tip: "«Por lo menos» marca un piso: xA ≥ xB/2."
    },
    {
      id: "pintura-excede",
      kind: "symbolic",
      text: "La pintura de interiores no puede exceder a la de exteriores en una tonelada.",
      mark: "no puede exceder",
      vars: "x1 = exterior · x2 = interior",
      answer: "lte",
      options: ["x2 ≤ x1 + 1", "x2 ≥ x1 + 1", "x2 = x1 + 1"],
      reveal: "x2 ≤ x1 + 1",
      source: "Gimnasio 2, p. 16",
      tip: "No exceder por más de una tonelada: x2 ≤ x1 + 1."
    },
    {
      id: "pinturas-minimo",
      kind: "symbolic",
      text: "La cantidad mínima total entre ambas pinturas es de 3 toneladas.",
      mark: "mínima total",
      vars: "x1 = exterior · x2 = interior",
      answer: "gte",
      options: ["x1 + x2 ≤ 3", "x1 + x2 ≥ 3", "x1 + x2 = 3"],
      reveal: "x1 + x2 ≥ 3",
      source: "Gimnasio 2, p. 17",
      tip: "La cantidad mínima total exige x1 + x2 ≥ 3."
    }
  ];

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function firstByAnswer(list, answer) {
    return shuffle(list.filter(function (question) { return question.answer === answer; }))[0];
  }

  function buildRun() {
    var keywords = questions.filter(function (question) { return question.kind === "keyword"; });
    var lte = shuffle(keywords.filter(function (question) { return question.answer === "lte"; }));
    var gte = shuffle(keywords.filter(function (question) { return question.answer === "gte"; }));
    var selectedKeywords = [lte[0], gte[0], lte[1], gte[1]];
    var equal = shuffle(questions.filter(function (question) { return question.kind === "equal"; }))[0];
    var nonnegative = shuffle(questions.filter(function (question) { return question.kind === "nonnegative"; }))[0];
    var symbolic = shuffle(questions.filter(function (question) { return question.kind === "symbolic"; }));

    var first = selectedKeywords[0];
    var middle = shuffle([
      selectedKeywords[1],
      selectedKeywords[2],
      selectedKeywords[3],
      equal,
      nonnegative,
      symbolic[0]
    ]);
    return [first].concat(middle, symbolic[1]);
  }

  window.ConstraintQuestions = {
    all: questions,
    buildRun: buildRun
  };
}());
