parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Focm":[function(require,module,exports) {
const e={initialState:{pokemon:[],selectedPokemonIndex:null,guessedPokemonIndex:null,status:"ready",correctGuesses:0,incorrectGuesses:0},randomIndex:e=>Math.floor(Math.random()*e.length)},t={state:{...e.initialState},init:async function(){console.log(this),this.updateStatus("ready");const e=await fetch("https://pokeapi.co/api/v2/pokemon?limit=368").then(e=>e.json()).catch(e=>{console.log(e)});console.log(e);let{results:t}=e;t=t.map(({name:e},t)=>{return{name:e.charAt(0).toUpperCase()+e.slice(1),avatarUrl:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${t+1}.svg`}}),console.log(t),this.state.pokemon=t,console.log(this);const s=document.getElementById("startGameButton");s.addEventListener("click",this.startGame.bind(this)),console.log(s)},clearHTML:function(){document.getElementById("guessingOptions").innerHTML="",document.getElementById("answer").innerText="";const e=document.getElementById("whoIsThatPokemonBanner");e.querySelectorAll("img").length>1&&e.removeChild(e.lastChild)},startGame:function(){console.log(this),this.clearHTML(),this.updateStatus("viewing");const t=e.randomIndex(this.state.pokemon);this.state.selectedPokemonIndex=t;const s=this.state.pokemon[t];console.log(s);const{avatarUrl:n}=s,o=document.getElementById("whoIsThatPokemonBanner"),i=document.createElement("img");i.src=n,o.appendChild(i),this.beginGuessing()},beginGuessing:function(){console.log(this),this.updateStatus("guessing");const{pokemon:t,selectedPokemonIndex:s}=this.state,{randomIndex:n}=e;let o=[...Array(3)].map(()=>n(t));console.log(o),o.includes(s)?o.push(n(t)):o.splice(n(o),0,s),console.log(o);const i=setTimeout(this.finishGame.bind(this),3e3),a=document.getElementById("guessingOptions");o.forEach(e=>{const s=t[e],{name:n}=s,o=document.createElement("li");o.innerText=n,o.addEventListener("click",t=>{clearTimeout(i);const{target:s}=t,n=s.innerText;console.log(n),this.state.guessedPokemonIndex=e,this.finishGame()}),a.appendChild(o)})},finishGame:function(){console.log(this);const{selectedPokemonIndex:t,guessedPokemonIndex:s,pokemon:n}=this.state,o=null===s,i=t===s&&!o;let a=i?"Yep":"Nope";a=o?"Oops":a;const c=n[t];console.log(c);const{name:l}=c;document.getElementById("answer").innerText=`${a}! It's ${l}!`;const[r,m]=document.querySelectorAll(".count");i?(this.state.correctGuesses++,r.innerText=this.state.correctGuesses):(this.state.incorrectGuesses++,m.innerText=this.state.incorrectGuesses);const{pokemon:d,correctGuesses:u,incorrectGuesses:h,...g}=e.initialState;this.state={...this.state,...g},console.log(e.initialState),console.log("this",this),this.updateStatus("ready")},updateStatus:function(e){this.state.status=e,document.getElementById("gameContainer").classList=[e]}};t.init();
},{}]},{},["Focm"], null)
//# sourceMappingURL=site/who-is-that-pokemon.9e934636.js.map