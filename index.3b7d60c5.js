const e={generations:{},selectedGenerations:[],pokemon:[],selectedPokemon:null,guessedPokemon:null,status:"ready",correctGuessesStreak:0,gameTimeout:null};let t={...e};const n=e=>Math.floor(Math.random()*(e+1)),o=e=>{t.status=e,document.getElementById("gameContainer").className=e},s=()=>{document.getElementById("guessingOptions").innerHTML="",document.getElementById("answer").innerText="";let e=document.querySelector(".pokemon-image");e&&e.remove()},a=()=>{let{selectedPokemon:n,guessedPokemon:s}=t,a=n?.id===s?.id&&!!s,{name:r}=n;document.getElementById("answer").innerText=`It's ${r}!`;let m=document.getElementById("streakCount");a?t.correctGuessesStreak++:t.correctGuessesStreak=0,m.innerText=t.correctGuessesStreak;let{generations:l,selectedGenerations:c,pokemon:d,correctGuessesStreak:u,...g}=e;t={...t,...g},o("viewing-result"),t.gameTimeout=setTimeout(i,3e3)},r=()=>{o("guessing");let{pokemon:e,selectedPokemon:s}=t,r=e.length-1,m=[void 0,void 0,void 0].map(()=>e[n(r)]);m.splice(n(3),0,s);let i=setTimeout(a,3e3);t.gameTimeout=i;let l=document.getElementById("guessingOptions");m.forEach(e=>{let{name:n}=e,o=document.createElement("li");o.innerText=n,o.addEventListener("click",()=>{clearTimeout(i),t.guessedPokemon=e,a()}),l.appendChild(o)})},m=()=>{let e=t.pokemon[n(t.pokemon.length-1)];t.selectedPokemon=e;let{avatarUrl:o}=e,s=document.getElementById("pokemonBox"),a=document.createElement("img");a.src=o,a.className="pokemon-image",s.appendChild(a)},i=()=>{s(),m(),r()};(async()=>{let{data:{generations:e}}=await fetch("https://beta.pokeapi.co/graphql/v1beta",{method:"POST",body:JSON.stringify({query:`
          query samplePokeAPIquery {
              generations: pokemon_v2_generation {
              name
              pokemon_species: pokemon_v2_pokemonspecies {
                id
                name
              }
            }
          }`})}).then(e=>e.json()).catch(e=>{console.log(e)});t.generations=e.reduce((e,{name:t,pokemon_species:n})=>({...e,[t]:n.map(({name:e,id:t})=>{let n=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${t}.png`;return{id:t,name:e,avatarUrl:n}})}),{});let n=Object.keys(t.generations);t.selectedGenerations=[n[0]];let s=[].concat(...t.selectedGenerations.map(e=>t.generations[e]));t.pokemon=s;let a=document.getElementById("generationOptions");n.forEach((e,n)=>{let o=document.createElement("li");o.innerText=e.split("-")[1],0===n&&(o.className="active"),o.addEventListener("click",n=>{let o=t.selectedGenerations.includes(e);t.selectedGenerations.length<2&&o||(n.target.classList.toggle("active"),t.selectedGenerations=o?t.selectedGenerations.filter(t=>t!==e):[...t.selectedGenerations,e],t.pokemon=[].concat(...t.selectedGenerations.map(e=>t.generations[e])),clearTimeout(t.gameTimeout),i())}),a.appendChild(o)}),document.getElementById("startGameButton").addEventListener("click",i),o("ready")})();
//# sourceMappingURL=index.3b7d60c5.js.map
