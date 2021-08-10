const utils = {
    initialState: {
        pokemon: [],
        selectedPokemonIndex: null,
        guessedPokemonIndex: null,
        status: 'ready',
        correctGuesses: 0,
        incorrectGuesses: 0
    },
    randomIndex: (arr) => Math.floor(Math.random() * arr.length)
}

const pokemonApp = {
    state: { ...utils.initialState },
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
        this.updateStatus('ready')

        const pokemonCount = 368;
        const pokemonAPIResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${pokemonCount}`
        )
            .then((res) => res.json())
            .catch((error) => {
                console.log(error);
            });
        console.log(pokemonAPIResponse);

        let { results: pokemon } = pokemonAPIResponse;
        pokemon = pokemon.map(({ name }, i) => {
            const capitalizedPokemonName =
                name.charAt(0).toUpperCase() + name.slice(1);
            const avatarUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${i + 1
                }.svg`
            return {
                name: capitalizedPokemonName,
                avatarUrl,
            };
        });
        console.log(pokemon);

        this.state.pokemon = pokemon;

        console.log(this);

        const startGameButtonEl = document.getElementById("startGameButton");
        startGameButtonEl.addEventListener('click', this.startGame.bind(this))

        console.log(startGameButtonEl);
    },
    clearHTML: function () {
        const guessingOptionsEl = document.getElementById('guessingOptions')
        guessingOptionsEl.innerHTML = ''

        const answerEl = document.getElementById('answer')
        answerEl.innerText = ''

        const whoIsThatPokemonBannerEl = document.getElementById('whoIsThatPokemonBanner')
        if (whoIsThatPokemonBannerEl.querySelectorAll('img').length > 1)
            whoIsThatPokemonBannerEl.removeChild(whoIsThatPokemonBannerEl.lastChild)
    },
    startGame: function () {
        console.log(this)
        this.clearHTML()
        this.updateStatus('viewing')

        const selectedPokemonIndex = utils.randomIndex(this.state.pokemon)
        this.state.selectedPokemonIndex = selectedPokemonIndex
        const selectedPokemon = this.state.pokemon[selectedPokemonIndex]
        console.log(selectedPokemon)
        const { avatarUrl } = selectedPokemon

        const whoIsThatPokemonBannerEl = document.getElementById('whoIsThatPokemonBanner')
        const pokemonImage = document.createElement('img');
        pokemonImage.src = avatarUrl
        whoIsThatPokemonBannerEl.appendChild(pokemonImage)

        this.beginGuessing()

    },
    beginGuessing: function () {
        console.log(this)
        this.updateStatus('guessing')
        const { pokemon, selectedPokemonIndex } = this.state
        const { randomIndex } = utils
        let guessingOptionIndexes = [...Array(3)].map(() => randomIndex(pokemon))
        console.log(guessingOptionIndexes)

        if (!guessingOptionIndexes.includes(selectedPokemonIndex))
            guessingOptionIndexes.splice(randomIndex(guessingOptionIndexes), 0, selectedPokemonIndex)
        else guessingOptionIndexes.push(randomIndex(pokemon))
        console.log(guessingOptionIndexes)

        const timeoutToEndGame = setTimeout(this.finishGame.bind(this), 3000)

        const guessingOptionsEl = document.getElementById('guessingOptions')
        guessingOptionIndexes.forEach(guessingOptionIndex => {
            const pokemonOption = pokemon[guessingOptionIndex]
            const { name } = pokemonOption

            const pokemonOptionEl = document.createElement('li');
            pokemonOptionEl.innerText = name
            pokemonOptionEl.addEventListener('click', (event) => {
                clearTimeout(timeoutToEndGame)
                const { target } = event;
                const targetPokemon = target.innerText
                console.log(targetPokemon)
                this.state.guessedPokemonIndex = guessingOptionIndex
                this.finishGame()
            })

            guessingOptionsEl.appendChild(pokemonOptionEl)
        })


    },
    finishGame: function () {
        console.log(this)
        const { selectedPokemonIndex, guessedPokemonIndex, pokemon } = this.state
        const didNotGuess = guessedPokemonIndex === null
        const guessedCorrectly = selectedPokemonIndex === guessedPokemonIndex && !didNotGuess
        let textResult = guessedCorrectly ? 'Yep' : 'Nope'
        textResult = didNotGuess ? 'Oops' : textResult
        const selectedPokemon = pokemon[selectedPokemonIndex]
        console.log(selectedPokemon)
        const { name } = selectedPokemon

        const answerEl = document.getElementById('answer')
        answerEl.innerText = `${textResult}! It's ${name}!`

        const [correctGuessesEl, incorrectGuessesEl] = document.querySelectorAll('.count')
        if (guessedCorrectly) {
            this.state.correctGuesses++
            correctGuessesEl.innerText = this.state.correctGuesses
        } else {
            this.state.incorrectGuesses++
            incorrectGuessesEl.innerText = this.state.incorrectGuesses
        }

        const { pokemon: initialPokemon, correctGuesses, incorrectGuesses, ...restInitialState } = utils.initialState
        this.state = { ...this.state, ...restInitialState }
        console.log(utils.initialState)
        console.log('this', this)
        this.updateStatus('ready')
    },
    updateStatus: function (status) {
        this.state.status = status
        const gameContainer = document.getElementById('gameContainer')
        gameContainer.classList = [status]
    }
};

// Call our initialization of the application
pokemonApp.init();
