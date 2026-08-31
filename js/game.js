/* Motor del runner: una carrera, diez decisiones y tres puertas. */
(function () {
  "use strict";

  var ROUND_MS = 7000;
  var RESOLVE_MS = 1000;
  var RELATIONS = ["lte", "gte", "eq"];
  var SYMBOLS = ["≤", "≥", "="];
  var RELATION_NAMES = ["menor o igual que", "mayor o igual que", "igual que"];

  var screens = {
    home: document.getElementById("screen-home"),
    game: document.getElementById("screen-game"),
    result: document.getElementById("screen-result")
  };
  var btnPlay = document.getElementById("btn-play");
  var btnAgain = document.getElementById("btn-again");
  var btnHome = document.getElementById("btn-home");
  var btnSound = document.getElementById("btn-sound");
  var hudScore = document.getElementById("hud-score");
  var hudDots = document.getElementById("hud-dots");
  var stmtText = document.getElementById("stmt-text");
  var stmtVars = document.getElementById("stmt-vars");
  var track = document.getElementById("track");
  var timerFill = document.getElementById("timer-fill");
  var gates = Array.prototype.slice.call(document.querySelectorAll(".gate"));
  var zones = Array.prototype.slice.call(document.querySelectorAll(".zone"));
  var character = document.getElementById("char");
  var floaters = document.getElementById("floaters");
  var resultReview = document.getElementById("result-review");
  var reviewPanel = document.getElementById("review-panel");
  var btnReview = document.getElementById("btn-review");

  var gameRun = null;
  var round = null;
  var nextTimer = null;
  var stepTimer = null;
  var currentLane = 1;

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle("active", key === name);
    });
  }

  function relationIndex(answer) {
    return RELATIONS.indexOf(answer);
  }

  function answerLabel(question, index) {
    if (index < 0) return "Sin respuesta";
    return question.options ? question.options[index] : SYMBOLS[index];
  }

  function correctAnswerLabel(question, index) {
    return question.options ? question.options[index] : question.reveal;
  }

  function setReviewOpen(open) {
    reviewPanel.hidden = !open;
    btnReview.setAttribute("aria-expanded", String(open));
    btnReview.textContent = open ? "OCULTAR RESPUESTAS" : "VER RESPUESTAS";
    if (open) reviewPanel.scrollIntoView({ block: "nearest" });
  }

  function renderDots(total) {
    hudDots.replaceChildren();
    for (var i = 0; i < total; i += 1) {
      hudDots.appendChild(document.createElement("i"));
    }
  }

  function updateDots(current, result) {
    var dotNodes = Array.prototype.slice.call(hudDots.children);
    dotNodes.forEach(function (dot, index) {
      dot.className = "";
      if (result && result[index] !== undefined) dot.classList.add(result[index] ? "ok" : "bad");
      if (index === current && !result) dot.classList.add("cur");
    });
  }

  function renderStatement(question) {
    stmtText.replaceChildren();
    var markStart = question.mark ? question.text.indexOf(question.mark) : -1;

    if (markStart < 0) {
      stmtText.textContent = question.text;
    } else {
      stmtText.appendChild(document.createTextNode(question.text.slice(0, markStart)));
      var marked = document.createElement("mark");
      marked.textContent = question.mark;
      stmtText.appendChild(marked);
      stmtText.appendChild(document.createTextNode(question.text.slice(markStart + question.mark.length)));
    }
    stmtVars.textContent = question.vars || "";
  }

  function configureGates(question) {
    gates.forEach(function (gate, index) {
      gate.className = "gate";
      gate.dataset.ans = RELATIONS[index];
      gate.style.left = ((index * 2 + 1) * 100 / 6) + "%";
      gate.style.opacity = "";
      gate.querySelector(".sym").textContent = SYMBOLS[index];
      gate.querySelector(".formula").textContent = question.options ? question.options[index] : "";
      gate.style.transform = "translateX(-50%) scale(.52)";
      zones[index].setAttribute(
        "aria-label",
        "Puerta " + (index + 1) + ": " + RELATION_NAMES[index] +
          (question.options ? ", " + question.options[index] : "")
      );
    });
  }

  function setCharacterLane(lane) {
    currentLane = Math.max(0, Math.min(2, lane));
    var width = track.clientWidth;
    var x = width * ((currentLane * 2 + 1) / 6) - width / 2;
    character.style.setProperty("--char-x", x + "px");
  }

  function applyApproach(progress) {
    var depth = Math.min(190, track.clientHeight * 0.26);
    var scale = reducedMotion() ? 1 : 0.52 + progress * 0.48;
    var y = reducedMotion() ? 0 : -Math.round((1 - progress) * depth);
    gates.forEach(function (gate) {
      gate.style.transform = "translateX(-50%) translateY(" + y + "px) scale(" + scale + ")";
      gate.style.opacity = reducedMotion() ? "1" : String(0.58 + progress * 0.42);
    });
    timerFill.style.transform = "scaleX(" + (1 - progress) + ")";
    timerFill.classList.toggle("low", progress > 0.72);
  }

  function startStepLoop() {
    stopStepLoop();
    stepTimer = window.setInterval(function () {
      if (round && !round.done && !round.pausedAt) AudioKit.step();
    }, 165);
  }

  function stopStepLoop() {
    if (stepTimer !== null) {
      window.clearInterval(stepTimer);
      stepTimer = null;
    }
  }

  function animateClass(element, className, duration) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(function () { element.classList.remove(className); }, duration);
  }

  function vibrate(duration) {
    if (navigator.vibrate) {
      try { navigator.vibrate(duration); } catch (error) {}
    }
  }

  function addFloater(text, className, lane) {
    var floater = document.createElement("span");
    floater.className = "floater " + className;
    floater.textContent = text;
    floater.style.left = (track.clientWidth * ((lane * 2 + 1) / 6)) + "px";
    floater.style.top = Math.max(80, track.clientHeight * 0.46) + "px";
    floaters.appendChild(floater);
    window.setTimeout(function () {
      if (floater.parentNode) floater.parentNode.removeChild(floater);
    }, 950);
  }

  function animationFrame(now) {
    if (!round || round.done || round.pausedAt) return;
    var progress = Math.min(1, (now - round.startedAt) / ROUND_MS);
    applyApproach(progress);
    if (progress >= 1) {
      resolveChoice(-1);
    } else {
      round.raf = window.requestAnimationFrame(animationFrame);
    }
  }

  function startRound() {
    if (!gameRun) return;
    if (round && round.raf) window.cancelAnimationFrame(round.raf);
    var question = gameRun.rounds[gameRun.index];
    if (!question) {
      finishRun();
      return;
    }

    round = {
      question: question,
      answerIndex: relationIndex(question.answer),
      startedAt: performance.now(),
      pausedAt: null,
      raf: 0,
      done: false
    };

    renderStatement(question);
    configureGates(question);
    zones.forEach(function (zone) { zone.className = "zone"; });
    hudScore.textContent = String(gameRun.score);
    updateDots(gameRun.index);
    setCharacterLane(currentLane);
    timerFill.style.transform = "scaleX(1)";
    timerFill.classList.remove("low");
    track.classList.add("running");
    applyApproach(0);
    startStepLoop();
    round.raf = window.requestAnimationFrame(animationFrame);
  }

  function resolveChoice(choiceIndex) {
    if (!round || round.done || !gameRun) return;
    round.done = true;
    if (round.raf) window.cancelAnimationFrame(round.raf);
    stopStepLoop();
    applyApproach(1);

    var question = round.question;
    var correct = choiceIndex === round.answerIndex;
    var correctGate = gates[round.answerIndex];
    var selectedZone = choiceIndex >= 0 ? zones[choiceIndex] : null;

    gameRun.answers[gameRun.index] = {
      correct: correct,
      selected: answerLabel(question, choiceIndex),
      expected: correctAnswerLabel(question, round.answerIndex)
    };

    if (selectedZone) selectedZone.classList.add("picked");
    gates.forEach(function (gate, index) {
      if (index === round.answerIndex) gate.classList.add("good");
      if (!correct && index === choiceIndex) gate.classList.add("bad");
    });

    if (correct) {
      gameRun.hits += 1;
      gameRun.streak += 1;
      gameRun.maxStreak = Math.max(gameRun.maxStreak, gameRun.streak);
      var points = 100 + (gameRun.streak - 1) * 25;
      gameRun.score += points;
      setCharacterLane(choiceIndex);
      animateClass(character, "boost", 520);
      addFloater("+" + points, "plus", choiceIndex);
      AudioKit.correct();
      vibrate(24);
    } else {
      gameRun.streak = 0;
      gameRun.misses.push(question);
      if (!question.options) correctGate.querySelector(".formula").textContent = question.reveal;
      var errorLane = choiceIndex >= 0 ? choiceIndex : currentLane;
      addFloater("Era: " + question.reveal, "info", round.answerIndex);
      if (choiceIndex >= 0) setCharacterLane(errorLane);
      animateClass(character, "bump", 480);
      if (!reducedMotion()) animateClass(track, "shake", 380);
      AudioKit.error();
      vibrate(65);
    }

    hudScore.textContent = String(gameRun.score);
    gameRun.results[gameRun.index] = correct;
    updateDots(gameRun.index, gameRun.results);

    nextTimer = window.setTimeout(function () {
      nextTimer = null;
      if (!gameRun) return;
      if (gameRun.index >= gameRun.rounds.length - 1) {
        finishRun();
      } else {
        gameRun.index += 1;
        startRound();
      }
    }, RESOLVE_MS);
  }

  function startRun() {
    if (nextTimer !== null) window.clearTimeout(nextTimer);
    if (round && round.raf) window.cancelAnimationFrame(round.raf);
    stopStepLoop();
    AudioKit.unlock();
    gameRun = {
      rounds: ConstraintQuestions.buildRun(),
      index: 0,
      score: 0,
      hits: 0,
      streak: 0,
      maxStreak: 0,
      results: [],
      misses: [],
      answers: [],
      startedAt: performance.now()
    };
    round = null;
    currentLane = 1;
    renderDots(gameRun.rounds.length);
    setReviewOpen(false);
    showScreen("game");
    startRound();
  }

  function finishRun() {
    if (!gameRun) return;
    stopStepLoop();
    track.classList.remove("running");
    if (round && round.raf) window.cancelAnimationFrame(round.raf);
    round = null;

    var total = gameRun.rounds.length;
    var percent = gameRun.hits / total;
    var rankText;
    var rankClass;
    if (percent === 1) {
      rankText = "RANGO S · MODELADOR DE ÉLITE";
      rankClass = "s";
    } else if (percent >= 0.75) {
      rankText = "RANGO A · SIMPLEX MASTER";
      rankClass = "a";
    } else if (percent >= 0.5) {
      rankText = "RANGO B · EN PROGRESO";
      rankClass = "b";
    } else {
      rankText = "RANGO C · A ENTRENAR";
      rankClass = "c";
    }

    var elapsed = Math.max(1, Math.round((performance.now() - gameRun.startedAt) / 1000));
    var rank = document.getElementById("result-rank");
    rank.textContent = rankText;
    rank.className = "rank " + rankClass;
    document.getElementById("result-score").textContent = String(gameRun.score);
    document.getElementById("stat-hits").textContent = gameRun.hits + "/" + total;
    document.getElementById("stat-streak").textContent = String(gameRun.maxStreak);
    document.getElementById("stat-time").textContent = elapsed + "s";

    renderReview();
    setReviewOpen(false);

    var tip = document.getElementById("result-tip");
    tip.textContent = gameRun.misses.length ? gameRun.misses[0].tip : "Lectura perfecta: cada palabra clave encontró su desigualdad.";
    AudioKit.finish();
    showScreen("result");
  }

  function renderReview() {
    resultReview.replaceChildren();
    gameRun.rounds.forEach(function (question, index) {
      var answer = gameRun.answers[index];
      var item = document.createElement("li");
      var top = document.createElement("div");
      var number = document.createElement("span");
      var status = document.createElement("span");
      var prompt = document.createElement("p");
      var yourAnswer = document.createElement("p");
      var expected = document.createElement("p");

      item.className = "review-item " + (answer && answer.correct ? "ok" : "bad");
      item.title = question.text;
      top.className = "review-top";
      number.className = "review-number";
      status.className = "review-status";
      prompt.className = "review-prompt";
      yourAnswer.className = "review-answer";
      expected.className = "review-answer review-expected";

      number.textContent = String(index + 1).padStart(2, "0");
      status.textContent = answer && answer.correct ? "BIEN" : "REVISAR";
      prompt.textContent = question.text;
      yourAnswer.textContent = "Tu: " + (answer ? answer.selected : "Sin respuesta");
      expected.textContent = "Correcta: " + (answer ? answer.expected : question.reveal);

      top.appendChild(number);
      top.appendChild(status);
      item.appendChild(top);
      item.appendChild(prompt);
      item.appendChild(yourAnswer);
      item.appendChild(expected);
      resultReview.appendChild(item);
    });
  }

  function goHome() {
    if (nextTimer !== null) window.clearTimeout(nextTimer);
    nextTimer = null;
    if (round && round.raf) window.cancelAnimationFrame(round.raf);
    stopStepLoop();
    round = null;
    gameRun = null;
    track.classList.remove("running");
    showScreen("home");
  }

  function updateSoundButton() {
    var muted = AudioKit.isMuted();
    btnSound.classList.toggle("muted", muted);
    btnSound.setAttribute("aria-pressed", String(!muted));
    btnSound.setAttribute("aria-label", muted ? "Activar sonido" : "Silenciar sonido");
  }

  zones.forEach(function (zone) {
    zone.addEventListener("click", function () {
      if (!round || round.done) return;
      AudioKit.tap();
      resolveChoice(Number(zone.dataset.lane));
    });
  });

  btnPlay.addEventListener("click", startRun);
  btnAgain.addEventListener("click", startRun);
  btnHome.addEventListener("click", goHome);
  btnReview.addEventListener("click", function () {
    setReviewOpen(reviewPanel.hidden);
  });
  btnSound.addEventListener("click", function () {
    AudioKit.toggleMute();
    updateSoundButton();
  });

  document.addEventListener("keydown", function (event) {
    if (!screens.game.classList.contains("active") || !round || round.done) return;
    var key = Number(event.key);
    if (key >= 1 && key <= 3) {
      event.preventDefault();
      AudioKit.tap();
      resolveChoice(key - 1);
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (!round || round.done) return;
    if (document.hidden) {
      round.pausedAt = performance.now();
      if (round.raf) window.cancelAnimationFrame(round.raf);
      stopStepLoop();
    } else if (round.pausedAt) {
      round.startedAt += performance.now() - round.pausedAt;
      round.pausedAt = null;
      startStepLoop();
      round.raf = window.requestAnimationFrame(animationFrame);
    }
  });

  window.addEventListener("resize", function () {
    setCharacterLane(currentLane);
  });

  updateSoundButton();
}());
