import Home from './home.js';
import { sound } from './../data/sound.js'
import End from './end.js';
import Board from './board.js'


const Game = (_ => {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v','w', 'x', 'y', 'z']
  const words = ['apple', 'ball', 'cat', 'dog', 'elephant'];
  let chosenWord;
  let guessingWord;
  let lives;
  let guesses;

  //cache the DOM
  const $hangman = document.querySelector(".hangman");

  const init = _=> {
    //1. choose a word
    chosenWord = chooseWord();
    // 2. build out our guessing word to render
    guessingWord = Array(chosenWord.length).fill("_");
    guesses = [];
    lives = 7;
    // show initial screen or page
    showInitPage();
    listeners();
    Board.init();
  }

  const listeners = _ => {
    $hangman.addEventListener('click', event => {
      if (event.target.matches('.hangman__letter')) {
        sound.click.play();
        check(event.target.innerHTML);

      }
      if (event.target.matches('.hangman__trigger')) {
        sound.click.play();
        Home.init();
      }
    })
  }

  const isAlreadyTaken = letter => {
    return guesses.includes(letter);
  }

  const check = guess => {
    if (isAlreadyTaken(guess)) return;

    guesses.push(guess);

    // check if the guess exists in chosen word
    if (chosenWord.includes(guess)) {
      //update the guessing word
      updateGuessingWord(guess);

    } else {
      lives--;
      // render the board accordingly
      Board.setLives(lives);
    }
    render();
    // check if game is over 
    isGameOver();
  }

  const hasWon = _ => guessingWord.join("") === chosenWord;
  const hasLost = _ => lives <= 0;

  const isGameOver = _ => {
    // if won, alert win
    if (hasWon()) {
      End.setState({
        chosenWord,
        result: "win"
      })
    }
    if (hasLost()) {
      End.setState({
        chosenWord,
        result: "lose"
      })
    }

    // if lost, then alert lost
  }

  const render = _ => {
    document.querySelector(".hangman__lives").innerHTML = lives;
    document.querySelector(".hangman__word").innerHTML = guessingWord.join("");
    document.querySelector(".hangman__letters").innerHTML = createLetters();

  }
  
  const updateGuessingWord = letter => {
    chosenWord.split("").forEach((elem, index) => {
      if (elem === letter ) {
        guessingWord[index] = elem;
      }
    })
  }


  const showInitPage = _ => {
    let markup = `
      <p class="hangman__stats">Lives:
        <span class="hangman__lives">${lives}</span>
        </p>
      <h1 class="hangman__title">Hangman</h1>
      <canvas class="hangman__board" height="155px"></canvas>
      <div class="hangman__word">${guessingWord.join("")}</div>
      <p class="hangman__instructions">Pick a letter below to guess the whole word.</p>
      <ul class="hangman__letters">
        ${createLetters()}
        </ul>
      <button class="button hangman__trigger">Main Menu</button>
      `
    $hangman.innerHTML = markup;
  }

  const createLetters = _ => {
    let markup = ``;
    letters.forEach(letter => {
      const isActive = isAlreadyTaken(letter) ? 'hangman__letter--active' : '';
      markup +=`
      <li class="hangman__letter ${isActive}">${letter}</li>
      `
    })
    return markup;
  }

  const chooseWord = _ => {
    let randNum = Math.floor(Math.random() * words.length);
    return words[randNum];
  }





return {
  init
}
})();

export default Game;