# Memory Game Project

## Table of Contents

* [Description](#description)
* [Note](#note)
* [Getting Started](#getting-started)
* [How It Works](#how-it-works)
	* [Creating the Deck](#creating-the-deck)
	* [Initializing the Game](#initializing-the-game)
	* [Opening and Showing a Card](#opening-and-showing-a-card)
	* [Updating the Score](#updating-the-score)
	* [Winning the Game](#winning-the-game)
	* [Keeping Track of Play Time](#keeping-track-of-play-time)

## Description

The memory game consists of matching cards with the same icon together until all cards are opened and correctly matched. Once all cards are matched, the total number of moves made by the player will determine their star rating. The total time to finish the game will also be displayed. The deck is shuffled every time the game runs, increasing replay value.

## Note

The HTML and CSS code are based on the Udacity starter project which was made interactive using JavaScript. However, some modifications were made to the starting HTML and CSS.

## Getting Started

To play/test the game, just open the **index.html** file in any browser.

## How It Works

### Creating the Deck

To generate the deck, the HTML for the cards is added via JavaScript through a series of steps;

* The `cardOptions` array contains all card possibilities in pairs.
* Using the `deck` variable, the deck in the HTML is selected. This is where the cards will be created.
* The `generateCard()` method creates the HTML for a single card.
* The deck is created using the `generateDeck()` method which calls `generateCard()` as needed, shuffles the cards and sets `deck`'s innerHTML to the resulting string.

### Initializing the Game

The `initGame()` method serves as an initializer. In this method all variables are set to their initial value, all required functions are called, and all event listeners are added. In addition to starting the game, this method is used to reset or restart the game.

### Opening and Showing a Card

To see the content of a card, the user must click on it. The `deck` has an event listener that calls the `openAndShowCard()` function. This function is only triggered if the target of the click is a list item, which represents a card. This is done to optimize performance and only implement 1 event listener instead of having 1 listener per card. This function calls a number of other functions based on the state of the game;

* The `openCards` array keeps track of the number of opened cards. If its length is less than two then the user is allowed to open and show a card.
* To reveal a card the `displayCard()` function is called. This function adds the *open* and *show* classes to the clicked card which serve to flip, change the color and reveal the icon on the card. A revealed card is added to the `openCards` array. An already opened or matched card cannot be clicked on or re-added to the array.
* Once the length of `openCards` reaches 2, both cards' datasets are compared.
	* In case of a match, the `matchCards()` function is used to add the *match* class to both cards and the `openCards` array is emptied.
	* If the cards do not match, the `noMatchedCards()` function is called to remove the *open* and *show* classes, thus closing the selected cards. The `openCards` array is also emptied in this case.

### Updating the Score

Every time two cards are opened, the score is updated using the `updateMoveCount()` function as follows;

* `numberOfMoves` is incremented by 1.
* `movesHTML`'s text content is updated to match `numberOfMoves`'s value.
* If `numberOfMoves` reaches 15, the player loses a star.
* If `numberOfMoves` reaches 19, the player loses another star.
* `starCount` is decremented every time a star is lost and the stars on screen fade by updating the `stars` array; each time `numberOfMoves` reaches a milestone value, the *star-fade* class is added to the corresponding element of the `stars` array, causing it to fade.

### Winning the Game

Anytime a card is matched, the `matchCards()` function calls the `addMatchCount()` function which keeps track of the number of cards that have been matched using the `matchCount` variable. When `matchCount` reaches half the length of `cardOptions` (the array contains duplicate entries of each card), `displayWinScreen()` is called; the deck is hidden and a win screen appears showing the values of `numberOfMoves`, `starCount` and `timeElapsed`.

### Keeping Track of Play Time

To keep track of play time, the `setInterval()` function is called every second and increments the `timeElapsed` variable by 1, yielding the total play time in seconds. When a game is started, reset, restarted or won the interval is cleared to stop the timer.

