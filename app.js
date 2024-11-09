// PokeAPI URL for fetching pokemon data
const pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/";

let randomPokemon;
let attemptsLeft = 3;
let firstGuessMade = false;
let correctGuesses = 0;

// Get random Pokemon and display the image
async function getRandomPokemon() {
  try {
    // Generate 100 random pokemon
    const pokemonId = Math.floor(Math.random() * 100) + 1;
    const response = await fetch(`${pokeApiUrl}${pokemonId}`);
    const data = await response.json();

    randomPokemon = data;
    const pokemonName = randomPokemon.name;
    const pokemonImage = randomPokemon.sprites.front_default;

    if (pokemonImage) {
      // Display the Pokemon image
      document.getElementById("pokemonImage").src = pokemonImage;
    } else {
      console.error("Image not found for this pokemon");
    }

    // Clear any previous guesses
    document.getElementById("guessRowsContainer").innerHTML = "";
    document.getElementById("feedback").classList.add("hidden");
    document.getElementById("userGuess").value = "";
    firstGuessMade = false;

    // Initial grey boxes showing the length of pokemon name
    const letterBoxesContainer = document.getElementById(
      "letterBoxesContainer"
    );
    letterBoxesContainer.innerHTML = "";

    // Create a box for each letter in the Pokemon name, all gray initially
    for (let i = 0; i < pokemonName.length; i++) {
      const box = document.createElement("div");
      box.classList.add("letter-box");
      letterBoxesContainer.appendChild(box);
    }

    // Set max length for input field based on the pokemon name length
    document.getElementById("userGuess").maxLength = pokemonName.length;
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
  }
}

// Restrict input to only letters (A-Z)
function restrictToLetters(event) {
  const inputField = document.getElementById("userGuess");
  const regex = /^[A-Za-z]*$/; // allow only alphabet characters
  const currentInput = inputField.value;

  if (!regex.test(currentInput)) {
    // if the input doesn't match, remove the last character
    inputField.value = currentInput.slice(0, -1);
  }
}

// Handle the guess submission
function submitGuess() {
  const userGuess = document
    .getElementById("userGuess")
    .value.toLowerCase()
    .trim();
  const feedback = document.getElementById("feedback");
  const guessRowsContainer = document.getElementById("guessRowsContainer");

  let letterFeedback = [];

  const pokemonName = randomPokemon.name;

  // Check if the guess length matches the pokemon name length
  if (userGuess.length !== pokemonName.length) {
    alert(`Your guess must be exactly ${pokemonName.length} letters!`);
    return;
  }

  // Loop through each letter in the user's guess and compare with the pokemon's name
  for (let i = 0; i < randomPokemon.name.length; i++) {
    const guessedLetter = userGuess[i];
    const actualLetter = pokemonName[i];

    if (guessedLetter === actualLetter) {
      letterFeedback.push("correct");
    } else if (randomPokemon.name.includes(guessedLetter)) {
      letterFeedback.push("wrong-position");
    } else {
      letterFeedback.push("incorrect");
    }
  }

  // handle cases where user guess is shorter than pokemon name
  for (let i = userGuess.length; i < pokemonName.length; i++) {
    letterFeedback.push("incorrect");
  }

  // Create a new guess row with letter boxes for feedback
  const guessRow = document.createElement("div");
  guessRow.classList.add("guess-row");

  // Create letter boxes for the guess and display the feedback
  for (let i = 0; i < pokemonName.length; i++) {
    const letterBox = document.createElement("div");

    // log values for debugging
    //console.log(`Letter: ${userGuess[i]} Feedback: ${letterFeedback[i]}`);
    letterBox.classList.add("letter-box", letterFeedback[i]);
    letterBox.textContent = userGuess[i].toUpperCase();
    guessRow.appendChild(letterBox);
  }

  // Add the guess row to the guess container (this keeps previous guesses visible)
  guessRowsContainer.appendChild(guessRow);

  // After the first guess, hide the gray boxes and show the user's guess
  if (!firstGuessMade) {
    const letterBoxesContainer = document.getElementById(
      "letterBoxesContainer"
    );
    letterBoxesContainer.innerHTML = "";
    firstGuessMade = true;
  }

  if (userGuess === randomPokemon.name.toLowerCase()) {
    feedback.classList.remove("hidden");
    feedback.innerHTML = `Correct!  You guessed the Pokemon, ${randomPokemon.name}!`;
    feedback.style.color = "green";

    // Increment the correct guesses counter
    correctGuesses++;

    // Update the correct guesses display
    document.getElementById(
      "correctGuessesCount"
    ).textContent = `Correct Guesses: ${correctGuesses}`;

    // Reset attempts to 3 and get a new Pokemon
    attemptsLeft = 3;

    // Wait 1.5 seconds before getting a new Pokemon to play again
    setTimeout(() => {
      getRandomPokemon();
      document.getElementById("userGuess").value = ""; // clear input field
      feedback.classList.add("hidden"); //hide feedback
    }, 1500); // delay to show the feedback message before new image appears
  } else {
    attemptsLeft--;

    if (attemptsLeft === 0) {
      feedback.classList.remove("hidden");
      feedback.innerHTML = `Game Over!  The correct answer was ${randomPokemon.name}.`;
      feedback.style.color = "red";
      document.getElementById("submitGuess").disabled = true;
      document.getElementById("resetButton").classList.remove("hidden");
      document.getElementById("resetButton").classList.add("block");
    } else {
      feedback.classList.remove("hidden");
      feedback.innerHTML = `Incorrect! Try again.  You have ${attemptsLeft} attempt(s) left.`;
      feedback.style.color = "orange";
    }
  }
}

// Event listener for the submit button
document.getElementById("submitGuess").addEventListener("click", submitGuess);

document.getElementById("resetButton").addEventListener("click", () => {
  location.reload();
});

// Event listener to restrict input to letters only
document
  .getElementById("userGuess")
  .addEventListener("input", restrictToLetters);

// Initialize the game
window.onload = () => {
  getRandomPokemon();
};
