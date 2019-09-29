// VARIABLE DECLARATIONS

/*
 * Select the game and win screens to manipulate as needed
 */

let container = document.querySelector(".container");

let winScreen = document.querySelector(".win-screen");

/*
 * Select the spans for the score screen to be able to assign them as needed
 */

let finalNumberOfMoves = document.querySelector(".number-of-moves");

let finalNumberOfStars = document.querySelector(".number-of-stars");

let totalTime = document.querySelector(".total-time");

/*
 * Select the replay button
 */

let replayButton = document.querySelector(".replay-button");

/* Create all potential card options in duplicates since we have 2
 * instances of each card
 */
let cardOptions = ["fa-diamond", "fa-diamond",
				"fa-paper-plane-o", "fa-paper-plane-o",
				"fa-anchor", "fa-anchor",
				"fa-bolt", "fa-bolt",
				"fa-cube", "fa-cube",	
				"fa-leaf", "fa-leaf",
				"fa-bicycle", "fa-bicycle",
				"fa-bomb", "fa-bomb"];
/*
 * Select the deck to enable the insertion of the cards within it
 */
let deck = document.querySelector('.deck');

/*
 * Array to hold the cards that are open
 */
let openCards = [];


/*
 * Variables to keep track of the number of moves
 * numberOfMoves is incremented every time a move is made
 * movesHTML is used to update the page based on numberOfMoves' value
 */
let numberOfMoves;

let movesHTML = document.querySelector(".moves");

/*
 * Variable to keep track of the number of matches to determine when the game is won
 */
let matchCount;


/*
 * Variables to update and keep track of the number of stars a player had based
 * on the number of moves
 */
let stars = document.getElementsByClassName("star");

let starCount;


/*
 * Timer related variables
 */

let time = document.querySelector(".time");

let timeElapsed;

let myTimer;


/*
 * Select the restart element to add an event listener to it
 */
let restart = document.querySelector(".restart");

// FUNCTION DEFINITIONS

/*
 * Generate a single card HTML as a string
 * The dataset will be used for matching 2 correct cards
 * The template literal allows different cards to be passed using the card parameter
 */
function generateCard(card){
	return `<li class="card" data-card="${card}">
                <i class="fa ${card}"></i>
            </li>`
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Generate a random deck using cards generated from the cardOptions array
 * Join the resulting array into one string to be converted to HTML
 */

function generateDeck(){
	let cardString = shuffle(cardOptions.map(function(card){
		return generateCard(card);
	}));
	let deckString = cardString.join('');
	deck.innerHTML = deckString;
}

/*
 * Game initializer function that sets initial parameters
 * Also serves as a reset function as it restores the game to its initial state
 */

function initGame(){

	container.classList.remove("hide-screen");
	winScreen.classList.add("hide-screen");

	generateDeck();
	numberOfMoves = 0;
	movesHTML.textContent = numberOfMoves;
	matchCount = 0;
	starCount = 3;

	stars[1].classList.remove("star-fade");
	stars[2].classList.remove("star-fade");

	clearInterval(myTimer);
	timeElapsed = 0;

 	myTimer = setInterval(function(){
 		timeElapsed += 1;
 		time.textContent = timeElapsed;
 	}, 1000);

 	// because the target of the click is being checked for, only the deck is given an event listener
 	deck.addEventListener('click', openAndShowCard);

	// clicking on the restart icon will reset the game to its initial state
 	restart.addEventListener('click', initGame);
 	replayButton.addEventListener('click', initGame);
}

 /*
 * Given requirement: display the card's symbol
 * Show a given card by adding the open and show classes
 * A timeout was added for the show class for the symbol to only appear
 * once the card is fully opened
 */
function displayCard(card){
 	card.classList.add('open');
	setTimeout(function(){
	 	card.classList.add('show');
	 }, 300);
 }

 /*
 * Given Requirement: add the card to a *list* of "open" cards
 * Add a given card to the openCards list to keep track of the cards that have been clicked
 */
 function addToOpenCards(card){
 	openCards.push(card);
 }

/*
 * Function to increment the number of matched cards and check for win condition
 * If the counter reaches 8, then all cards have been matched and the player has won
 * Timeout set to 2 seconds so that the last match is seen before the win screen appears
 */
 function addMatchCount(){
 	setTimeout(function(){
 		matchCount++;
 		if(matchCount === cardOptions.length/2){
 			clearInterval(myTimer);
 			displayWinScreen();
 		}
 	}, 2000);
 }

 /*
 * Given Requirement: if the cards do match, lock the cards in the open position
 * In case of a match add the match class to both open cards
 * This takes place after a 1 second delay for a better user experience
 */
 function matchCards(){
 	setTimeout(function(){
	 	openCards[0].classList.add('match');
	 	openCards[1].classList.add('match');
	 	openCards = [];

	 	addMatchCount();
	}, 1000);
 }

 /*
 * Given Requirement: if the cards do not match, remove the cards from the list and hide the card's symbol
 * In case of a lack of match remove the open and show classes to close the cards
 * The open class is removed first followed by the show class to create the effect
 * of a card flipping over rather than the face just disappearing
 */
 function noMatchedCards(){
 	setTimeout(function(){
	 	openCards[0].classList.remove('open');
	 	openCards[1].classList.remove('open');
	}, 1000);

 	setTimeout(function(){
	 	openCards[0].classList.remove('show');
	 	openCards[1].classList.remove('show');
	 	openCards = [];
	}, 1300);

 }

 /*
  * Given Requirement: increment the move counter and display it on the page
  * Increment the number of moves and update the page accordingly
  * This means both the score count and stars will be updated
  */
 function updateMoveCount(){
 	numberOfMoves++;
	movesHTML.textContent = numberOfMoves;

	if(numberOfMoves === 19) {
		stars[1].classList.add("star-fade");
		starCount--;
	} else if(numberOfMoves === 15) {
		stars[2].classList.add("star-fade");
		starCount--;
	}

 }

 function openAndShowCard(event){
 	// only trigger the event if the list of open cards contains less than 2 cards
 	// this prevents users from opening more than 2 cards before the timeout function ends
 	if(openCards.length < 2){
	 	let clickedCard = event.target;
	 	// check that the clicked card is neither opened nor matched
	 	// this prevents the user from clicking on matched cards or clicking twice on an open card
	 	// there is no need to check for the show class since open and show are added in the same function
	 	// so checking for one is the same as checking for the other
	 	if(!clickedCard.classList.contains('open') && !clickedCard.classList.contains('match')){
	 		// check that the target of the click is a list item, meaning it's a card
	 		// this allows to have only one event listener on the whole deck and then
	 		// executing the function based on the target instead of having one event
	 		// listener for each list item/card
	 		if(clickedCard.nodeName === 'LI'){
	 			displayCard(clickedCard);
				addToOpenCards(clickedCard);
				// if two cards have been opened, check if they match or not and respond accordingly
	 			if(openCards.length >= 2){
	 				if(openCards[0].dataset.card == openCards[1].dataset.card){
	 					matchCards();
	 				} else {
	 					noMatchedCards();
	 				}
	 				// update the number of moves regardless of matching
	 				updateMoveCount();
	 			}
	 		}
	 	}
 	}
 }

/*
 * Function to be called when the game is won
 * Hides the game screen and displays the results screen
 */
 function displayWinScreen(){
 	finalNumberOfMoves.textContent = numberOfMoves;
 	finalNumberOfStars.textContent = starCount;
 	totalTime.textContent = timeElapsed;

 	winScreen.classList.toggle("hide-screen");
 	container.classList.toggle("hide-screen");
 }

 // FUNCTION CALLS

// start the game
initGame();