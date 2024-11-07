// PokeAPI URL for fetching pokemon data
const pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/";

let randomPokemon;
let attemptsLeft = 3;

// Get random Pokemon and display the image
async function getRandomPokemon() {
  // Generate 100 random pokemon
  const pokemonId = Math.floor(Math.random() * 100) + 1;
  const response = await fetch(`${pokeApiUrl}${pokemonId}`);
  const data = await response.json();

  randomPokemon = data;
  // onsole.log(randomPokemon);
  const pokemonImage = randomPokemon.sprites.front_default;
  console.log(pokemonImage);

  // Display the Pokemon image
  document.getElementById("pokemonImage").src = pokemonImage;
}

// Handle the guess submission
function submitGuess() {
  const userGuess = document
    .getElementById("userGuess")
    .value.toLowerCase()
    .trim();
  const feedback = document.getElementById("feedback");
  const attemptsCount = document.getElementById("attemptsCount");

  if (userGuess === randomPokemon.name.toLowerCase()) {
    feedback.classList.remove("hidden");
    feedback.innerHTML = `Correct!  You guessed the Pokemon, ${randomPokemon.name}!`;
    feedback.style.color = "green";
  } else {
    attemptsLeft--;
    attemptsCount.textContent = attemptsLeft;

    if (attemptsLeft === 0) {
      feedback.classList.remove("hidden");
      feedback.innerHTML = `Game Over!  The correct answer was ${randomPokemon.name}.`;
      feedback.style.color = "red";
      document.getElementById("submitGuess").disabled = true;
    } else {
      feedback.classList.remove("hidden");
      feedback.innerHTML = `Incorrect! Try again.  You have ${attemptsLeft} attempt(s) left.`;
      feedback.style.color = "orange";
    }
  }
}

// Event listener for the submit button
document.getElementById("submitGuess").addEventListener("click", submitGuess);

// Initialize the game
window.onload = () => {
  getRandomPokemon();
};
