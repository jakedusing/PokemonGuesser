// PokeAPI URL for fetching pokemon data
const pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/";

let randomPokemon;
let attemptsLeft = 3;

// Get random Pokemon and display the image
async function getRandomPokemon() {
  try {
    // Generate 100 random pokemon
    const pokemonId = Math.floor(Math.random() * 100) + 1;
    const response = await fetch(`${pokeApiUrl}${pokemonId}`);
    const data = await response.json();

    randomPokemon = data;
    // console.log(randomPokemon);
    const pokemonImage = randomPokemon.sprites.front_default;
    console.log(pokemonImage);

    if (pokemonImage) {
      // Display the Pokemon image
      document.getElementById("pokemonImage").src = pokemonImage;
    } else {
      console.error("Image not found for this pokemon");
    }
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
  }
}

// Handle the guess submission
function submitGuess() {
  const userGuess = document
    .getElementById("userGuess")
    .value.toLowerCase()
    .trim();
  const feedback = document.getElementById("feedback");
  const attemptsCount = document.getElementById("attemptsCount");
  const correctLettersDiv = document.getElementById("correctLetters");
  const incorrectLettersDiv = document.getElementById("incorrectLetters");

  let correctLetters = [];
  let incorrectLetters = [];

  // Loop through each letter in the user's guess and compare with the pokemon's name
  for (let i = 0; i < randomPokemon.name.length; i++) {
    if (userGuess[i] === randomPokemon.name[i]) {
      correctLetters.push(userGuess[i]);
    } else {
      incorrectLetters.push(userGuess[i] || ""); // push an empty string if the userGuess is shorter than the pokemon name
    }
  }

  // Show correct and incorrect letters in the corresponding divs
  correctLettersDiv.innerHTML = `Correct Letters: ${correctLetters.join(
    ", "
  )};`;
  incorrectLettersDiv.innerHTML = `Incorrect Letters: ${incorrectLetters.join(
    ", "
  )};`;

  console.log(correctLetters);
  console.log(incorrectLetters);

  if (userGuess === randomPokemon.name.toLowerCase()) {
    feedback.classList.remove("hidden");
    feedback.innerHTML = `Correct!  You guessed the Pokemon, ${randomPokemon.name}!`;
    feedback.style.color = "green";

    // Reset attempts to 3 and get a new Pokemon
    attemptsLeft = 3;
    attemptsCount.textContent = attemptsLeft;

    // Wait 1.5 seconds before getting a new Pokemon to play again
    setTimeout(() => {
      getRandomPokemon();
      document.getElementById("userGuess").value = ""; // clear input field
      feedback.classList.add("hidden"); //hide feedback
    }, 1500); // delay to show the feedback message before new image appears
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
