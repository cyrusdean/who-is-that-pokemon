const initialState = {
  generations: {},
  selectedGenerations: [],
  pokemon: [],
  selectedPokemon: null,
  guessedPokemon: null,
  status: "ready",
  correctGuessesStreak: 0,
  gameTimeout: null,
};

let state = { ...initialState };

const randomNumUpTo = (max) => Math.floor(Math.random() * (max + 1));

const updateGameStatus = (status) => {
  state.status = status;
  const gameContainer = document.getElementById("gameContainer");
  gameContainer.className = status;
};
const resetHTML = () => {
  const guessingOptionsEl = document.getElementById("guessingOptions");
  guessingOptionsEl.innerHTML = "";

  const answerEl = document.getElementById("answer");
  answerEl.innerText = "";

  const pokemonImage = document.querySelector(".pokemon-image");
  if (pokemonImage) pokemonImage.remove();
};
const finishGame = () => {
  const { selectedPokemon, guessedPokemon } = state;
  const didNotGuess = !guessedPokemon;
  const guessedCorrectly =
    selectedPokemon?.id === guessedPokemon?.id && !didNotGuess;
  const { name } = selectedPokemon;

  const answerEl = document.getElementById("answer");
  answerEl.innerText = `It's ${name}!`;

  const correctGuessesStreakEl = document.getElementById("streakCount");
  if (guessedCorrectly) state.correctGuessesStreak++;
  else state.correctGuessesStreak = 0;

  correctGuessesStreakEl.innerText = state.correctGuessesStreak;

  const {
    generations,
    selectedGenerations,
    pokemon: initialPokemon,
    correctGuessesStreak,
    ...restInitialState
  } = initialState;
  state = {
    ...state,
    ...restInitialState,
  };
  updateGameStatus("viewing-result");
  state.gameTimeout = setTimeout(startGame, 3000);
};
const beginGuessing = () => {
  updateGameStatus("guessing");
  const { pokemon, selectedPokemon } = state;
  const pokemonIndexMax = pokemon.length - 1;
  const numOfOtherOptions = 3;
  let guessingOptions = [...Array(numOfOtherOptions)].map(
    () => pokemon[randomNumUpTo(pokemonIndexMax)]
  );
  guessingOptions.splice(randomNumUpTo(numOfOtherOptions), 0, selectedPokemon);

  const gameTimeout = setTimeout(finishGame, 3000);
  state.gameTimeout = gameTimeout;

  const guessingOptionsEl = document.getElementById("guessingOptions");
  guessingOptions.forEach((pokemonOption) => {
    const { name } = pokemonOption;

    const pokemonOptionEl = document.createElement("li");
    pokemonOptionEl.innerText = name;
    pokemonOptionEl.addEventListener("click", () => {
      clearTimeout(gameTimeout);
      state.guessedPokemon = pokemonOption;
      finishGame();
    });

    guessingOptionsEl.appendChild(pokemonOptionEl);
  });
};
const setupRandomPokemon = () => {
  const selectedPokemon =
    state.pokemon[randomNumUpTo(state.pokemon.length - 1)];
  state.selectedPokemon = selectedPokemon;
  const { avatarUrl } = selectedPokemon;

  const pokemonBoxEl = document.getElementById("pokemonBox");
  const pokemonImage = document.createElement("img");
  pokemonImage.src = avatarUrl;
  pokemonImage.className = "pokemon-image";
  pokemonBoxEl.appendChild(pokemonImage);
};
const startGame = () => {
  resetHTML();
  setupRandomPokemon();
  beginGuessing();
};
const init = async () => {
  const pokemonAPIResponse = await fetch(
    "https://beta.pokeapi.co/graphql/v1beta",
    {
      method: "POST",
      body: JSON.stringify({
        query: `
          query samplePokeAPIquery {
              generations: pokemon_v2_generation {
              name
              pokemon_species: pokemon_v2_pokemonspecies {
                id
                name
              }
            }
          }`,
      }),
    }
  )
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    });
  const {
    data: { generations },
  } = pokemonAPIResponse;
  state.generations = generations.reduce(
    (a, { name, pokemon_species: pokemon }) => ({
      ...a,
      [name]: pokemon.map(({ name, id }) => {
        const avatarUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        return {
          id,
          name,
          avatarUrl,
        };
      }),
    }),
    {}
  );
  const generationNames = Object.keys(state.generations);
  state.selectedGenerations = [generationNames[0]];

  let pokemon = [].concat(
    ...state.selectedGenerations.map(
      (selectedGeneration) => state.generations[selectedGeneration]
    )
  );

  state.pokemon = pokemon;

  const generationOptionsEl = document.getElementById("generationOptions");
  generationNames.forEach((generationName, i) => {
    const generationOptionEl = document.createElement("li");
    generationOptionEl.innerText = generationName.split("-")[1];
    if (i === 0) generationOptionEl.className = "active";

    generationOptionEl.addEventListener("click", (e) => {
      const isRemoving = state.selectedGenerations.includes(generationName);
      if (state.selectedGenerations.length < 2 && isRemoving) return;
      e.target.classList.toggle("active");
      state.selectedGenerations = isRemoving
        ? state.selectedGenerations.filter(
            (selectedGeneration) => selectedGeneration !== generationName
          )
        : [...state.selectedGenerations, generationName];
      state.pokemon = [].concat(
        ...state.selectedGenerations.map(
          (generationName) => state.generations[generationName]
        )
      );
      clearTimeout(state.gameTimeout);
      startGame();
    });

    generationOptionsEl.appendChild(generationOptionEl);
  });

  const startGameButtonEl = document.getElementById("startGameButton");
  startGameButtonEl.addEventListener("click", startGame);

  updateGameStatus("ready");
};

// Call our initialization of the application
init();
