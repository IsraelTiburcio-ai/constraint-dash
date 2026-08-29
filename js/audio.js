/* Audio breve generado con Web Audio. No necesita archivos externos. */
(function () {
  "use strict";

  var context = null;
  var master = null;
  var muted = false;

  try {
    muted = window.localStorage.getItem("constraint-dash-muted") === "1";
  } catch (error) {
    muted = false;
  }

  function ensureContext() {
    if (!context) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = 0.58;
      master.connect(context.destination);
    }

    if (context.state === "suspended") {
      context.resume().catch(function () {});
    }
    return true;
  }

  function tone(frequency, duration, type, volume, delay, glideTo) {
    if (muted || !ensureContext()) return;

    var start = context.currentTime + (delay || 0);
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    if (glideTo) oscillator.frequency.linearRampToValueAtTime(glideTo, start + duration);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume || 0.08, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function noise(duration, volume, delay) {
    if (muted || !ensureContext()) return;

    var start = context.currentTime + (delay || 0);
    var buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    var source = context.createBufferSource();
    var filter = context.createBiquadFilter();
    var gain = context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 850;
    filter.Q.value = 1.4;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume || 0.025, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  var AudioKit = {
    unlock: function () {
      ensureContext();
    },

    tap: function () {
      tone(680, 0.07, "square", 0.045);
    },

    step: function () {
      noise(0.045, 0.018);
    },

    correct: function () {
      tone(523.25, 0.16, "sine", 0.085, 0);
      tone(659.25, 0.18, "sine", 0.085, 0.07);
      tone(783.99, 0.24, "sine", 0.1, 0.14);
    },

    error: function () {
      tone(170, 0.24, "sawtooth", 0.075, 0, 72);
      noise(0.13, 0.028, 0.035);
    },

    finish: function () {
      tone(392, 0.18, "sine", 0.075, 0);
      tone(523.25, 0.2, "sine", 0.08, 0.1);
      tone(659.25, 0.24, "sine", 0.09, 0.2);
      tone(783.99, 0.36, "sine", 0.1, 0.3);
    },

    toggleMute: function () {
      muted = !muted;
      try {
        window.localStorage.setItem("constraint-dash-muted", muted ? "1" : "0");
      } catch (error) {}
      return muted;
    },

    isMuted: function () {
      return muted;
    }
  };

  window.AudioKit = AudioKit;
}());
