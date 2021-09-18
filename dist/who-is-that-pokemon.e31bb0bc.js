// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
const utils = {
  initialState: {
    pokemon: [],
    selectedPokemonIndex: null,
    guessedPokemonIndex: null,
    status: 'ready',
    correctGuesses: 0,
    incorrectGuesses: 0
  },
  randomNumUpTo: max => Math.floor(Math.random() * (max + 1))
};
const pokemonApp = {
  state: { ...utils.initialState
  },

  /*
        In the regular function, a function always defines its this value. 
        Arrow functions treat this keyword differently. They don’t define their 
        own context since it doesn’t have its own this context. They inherit 
        that from the parent scope whenever you call this.
            init: () => {
            console.log(this) // -> {}
        }
    */
  init: async function () {
    console.log(this);
    this.updateStatus('ready');
    const pokemonCount = 368;
    const pokemonAPIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonCount}`).then(res => res.json()).catch(error => {
      console.log(error);
    });
    console.log(pokemonAPIResponse);
    let {
      results: pokemon
    } = pokemonAPIResponse;
    pokemon = pokemon.map(({
      name
    }, i) => {
      const capitalizedPokemonName = name.charAt(0).toUpperCase() + name.slice(1);
      const avatarUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${i + 1}.svg`;
      return {
        name: capitalizedPokemonName,
        avatarUrl
      };
    });
    console.log(pokemon);
    this.state.pokemon = pokemon;
    console.log(this);
    const startGameButtonEl = document.getElementById("startGameButton");
    startGameButtonEl.addEventListener('click', this.startGame.bind(this));
    console.log(startGameButtonEl);
  },
  clearHTML: function () {
    const guessingOptionsEl = document.getElementById('guessingOptions');
    guessingOptionsEl.innerHTML = '';
    const answerEl = document.getElementById('answer');
    answerEl.innerText = '';
    const whoIsThatPokemonBannerEl = document.getElementById('whoIsThatPokemonBanner');
    if (whoIsThatPokemonBannerEl.querySelectorAll('img').length > 1) whoIsThatPokemonBannerEl.removeChild(whoIsThatPokemonBannerEl.lastChild);
  },
  startGame: function () {
    console.log(this);
    this.clearHTML();
    this.updateStatus('viewing');
    const selectedPokemonIndex = utils.randomNumUpTo(this.state.pokemon.length - 1);
    this.state.selectedPokemonIndex = selectedPokemonIndex;
    const selectedPokemon = this.state.pokemon[selectedPokemonIndex];
    console.log(selectedPokemon);
    const {
      avatarUrl
    } = selectedPokemon;
    const whoIsThatPokemonBannerEl = document.getElementById('whoIsThatPokemonBanner');
    const pokemonImage = document.createElement('img');
    pokemonImage.src = avatarUrl;
    whoIsThatPokemonBannerEl.appendChild(pokemonImage);
    this.beginGuessing();
  },
  beginGuessing: function () {
    console.log(this);
    this.updateStatus('guessing');
    const {
      pokemon,
      selectedPokemonIndex
    } = this.state;
    const {
      randomNumUpTo
    } = utils;
    const pokemonIndexMax = pokemon.length - 1;
    const numOfOtherOptions = 3;
    let guessingOptionIndexes = [...Array(numOfOtherOptions)].map(() => randomNumUpTo(pokemonIndexMax));
    console.log(guessingOptionIndexes);
    guessingOptionIndexes.splice(randomNumUpTo(numOfOtherOptions), 0, selectedPokemonIndex);
    const timeoutToEndGame = setTimeout(this.finishGame.bind(this), 3000);
    const guessingOptionsEl = document.getElementById('guessingOptions');
    guessingOptionIndexes.forEach(guessingOptionIndex => {
      const pokemonOption = pokemon[guessingOptionIndex];
      const {
        name
      } = pokemonOption;
      const pokemonOptionEl = document.createElement('li');
      pokemonOptionEl.innerText = name;
      pokemonOptionEl.addEventListener('click', event => {
        clearTimeout(timeoutToEndGame);
        const {
          target
        } = event;
        const targetPokemon = target.innerText;
        console.log(targetPokemon);
        this.state.guessedPokemonIndex = guessingOptionIndex;
        this.finishGame();
      });
      guessingOptionsEl.appendChild(pokemonOptionEl);
    });
  },
  finishGame: function () {
    console.log(this);
    const {
      selectedPokemonIndex,
      guessedPokemonIndex,
      pokemon
    } = this.state;
    const didNotGuess = guessedPokemonIndex === null;
    const guessedCorrectly = selectedPokemonIndex === guessedPokemonIndex && !didNotGuess;
    let textResult = guessedCorrectly ? 'Yep' : 'Nope';
    textResult = didNotGuess ? 'Oops' : textResult;
    const selectedPokemon = pokemon[selectedPokemonIndex];
    console.log(selectedPokemon);
    const {
      name
    } = selectedPokemon;
    const answerEl = document.getElementById('answer');
    answerEl.innerText = `${textResult}! It's ${name}!`;
    const [correctGuessesEl, incorrectGuessesEl] = document.querySelectorAll('.count');

    if (guessedCorrectly) {
      this.state.correctGuesses++;
      correctGuessesEl.innerText = this.state.correctGuesses;
    } else {
      this.state.incorrectGuesses++;
      incorrectGuessesEl.innerText = this.state.incorrectGuesses;
    }

    const {
      pokemon: initialPokemon,
      correctGuesses,
      incorrectGuesses,
      ...restInitialState
    } = utils.initialState;
    this.state = { ...this.state,
      ...restInitialState
    };
    console.log(utils.initialState);
    console.log('this', this);
    this.updateStatus('ready');
  },
  updateStatus: function (status) {
    this.state.status = status;
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList = [status];
  }
}; // Call our initialization of the application

pokemonApp.init();
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53302" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/who-is-that-pokemon.e31bb0bc.js.map