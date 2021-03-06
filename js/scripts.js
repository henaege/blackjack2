$(document).ready(function() {

    ///////////////////
    //MAIN VARIABLES//
    /////////////////

    const freshDeck = createDeck();
    let playersHand = [];
    let playersTotal = 0;
    let dealersHand = [];
    let theDeck = freshDeck.slice();
    let standing = false;
    let PlayerCash = 500;
    let bet = 0;
    ////////////////////
    // EVENT HANDLERS//
    //////////////////

        // Deal Cards...
    $('.deal-button').click(function() {
        reset();
        // playersTotal = 0;
        // Deck is now shuffled, add the 1st and 3rd cards to the player's hand and the DOM. Do the same for the dealer with 2nd and 4th cards
        
        // setTimeout(function(){calculateTotal(dealersHand, 'dealer');},2600)
       
    });

        // Hit Player with ClipboardEvent.apply.apply.
    $('.hit-button').click(function() {
        // Player wants a new card:
        // 1. shift OFF of theDeck
        // 2. push onto player's hand
        // 3. run placeCard to put the new card (image) in the DOM
        // 4. run calculateTotal to find out the new hand total
        if (calculateTotal(playersHand, 'player') <= 21) {
            playersHand.push(theDeck.shift());
            let lastCardIndex = playersHand.length - 1;
            let slotForNewCard = playersHand.length;
            placeCard('player', slotForNewCard, playersHand[lastCardIndex]);
            calculateTotal(playersHand, 'player');
            // checkWin();
        } 
        if (calculateTotal(playersHand, 'player') >= 21) {
            checkWin();
        }
        
    });
        // Player stands...
    $('.stand-button').click(function() {
        // Player has given control over to the dealersHand. Dealer must hit until dealer has 17 or more
        let dealerTotal = calculateTotal(dealersHand, 'dealer');
        while (dealerTotal < 17) {
            dealersHand.push(theDeck.shift());
            let lastCardIndex = dealersHand.length - 1;
            let slotForNewCard = dealersHand.length;
            dealerTotal = calculateTotal(dealersHand, 'dealer');
            placeCard('dealer', slotForNewCard, dealersHand[lastCardIndex]);
            
        }
        $('.hit-button').prop("disabled", true);
        checkWin();


    });

    ///////////////////////
    // UTILITY FUNCTIONS//
    /////////////////////

    function checkWin() {
        let playerTotal = calculateTotal(playersHand, 'player');
        let dealerTotal = calculateTotal(dealersHand, 'dealer');
        let winner = "";
        if (playerTotal > 21) {
            winner = "You busted! The House wins!"
        }else if (playerTotal == 21){
            $('.hit-button').prop("disabled", true);
            winner = "Blackjack! You win!"
        } else if (dealerTotal > 21) {
            $('.hit-button').prop("disabled", true);
            winner = "The House busted, you Win!!";
        } else {
            if ((playerTotal > dealerTotal) && (dealerTotal < 21)) {
                $('.hit-button').prop("disabled", true);
                winner = "You beat the House!";
            } else if (dealerTotal == 21) {
                winner = "Blackjack! The House wins"
            } else if (playerTotal < dealerTotal) {
                winner = "You lose!";
            } else {
                $('.hit-button').prop("disabled", true);
                winner = "It's a push.";
            }
        }
        console.log(dealersHand);
        $('#dealercard1').html('<img src="./cards/' + dealersHand[0] + '.png">')
        $('.message').text(winner);
    };

    function createDeck() {
        let newDeck = [];
        let suits = ['h', 's', 'd', 'c'];
        for (let s = 0; s < suits.length; s++) {
            for (let c = 1; c <= 13; c++) {
                newDeck.push(c + suits[s]);
            }
        }
        return newDeck;
    }

    function shuffleDeck() {
        // swap elements in the array many times to shuffle...
        for (let i = 0; i < 14000; i++) {
            let random1 = Math.floor(Math.random() * 52);
            let random2 = Math.floor(Math.random() * 52);
            let temp = theDeck[random1];
            theDeck[random1] = theDeck[random2];
            theDeck[random2] = temp;
        }
    }

    function placeCard(who, where, what) {
        // Find the DOM element based on the args we want to change
        // (find the element we want to put the image in)
        if (who == 'dealer' && where == 1) {
            var slotForCard = '.' + who + '-cards .card-' + where;
        imgTag = '<img src="./cards/deck.png">';
        }else {
            var slotForCard = '.' + who + '-cards .card-' + where;
        imgTag = '<img src="./cards/' + what + '.png">';
        }
        
        $(slotForCard).html(imgTag);
        $(slotForCard).addClass('dealt');

        // if (calculateTotal(playersHand, 'player') == 21) {
        //     checkWin();
            // }
    }

    function calculateTotal(hand, who) {
        // hand will be an array
        // who will be what the DOM knows the player as
        let totalHandValue = 0;
        let thisCardValue = 0;
        let totalAces = 0;
        for (i = 0; i < hand.length; i++) {
            thisCardValue = Number(hand[i].slice(0, -1));
            if (thisCardValue > 10) {
                thisCardValue = 10;
            }else if (thisCardValue == 1) {
                totalAces += 1;
                thisCardValue = 11;
            }
            totalHandValue += thisCardValue;
            
        }
        for (let i = 0; i < totalAces; i++) {
            if (totalHandValue > 21)  {
            totalHandValue -= 10;
            }
        }
        
        // We have the total, now update the DOM
        let totalUpdate = '.' + who + '-total-number';
        $(totalUpdate).text(totalHandValue);
        // checkWin();
        return totalHandValue;
    }

    function reset() {
        // In order to rest the game:
        // 1. Reset theDeck
        theDeck = freshDeck.slice();
        shuffleDeck();
        // 2. reset play and dealer hands
        playersHand = [];
        dealersHand = [];
        // 3. rest cards in the DOM
        $('.card').html('');
        // // 4. reset totals for player and dealer
        $('.dealer-total-number').html(' ?');
        $('.player-total-number').html(' 0');
        $('.message').text('');
        $('.card').removeClass('dealt');
        $('.card').removeClass('dealt');
        $('.hit-button').prop("disabled", false);
        playersHand.push(theDeck.shift()) //top card -> player's hand
        dealersHand.push(theDeck.shift()) //(next) top card -> dealer's hand
        playersHand.push(theDeck.shift()) //(next) top card -> player's hand
        dealersHand.push(theDeck.shift()) //(next) top card -> dealer's hand

        // update the DOM with images
        // placeCard('player', 1, playersHand[0]);
        // placeCard('player', 2, playersHand[1]);

        // placeCard('dealer', 1, dealersHand[0]);
        // placeCard('dealer', 2, dealersHand[1]);
        
        setTimeout(function(){placeCard('player',1,playersHand[0]);},200)
        setTimeout(function(){placeCard('player',2,playersHand[1]);},1400)
        setTimeout(function(){placeCard('dealer',1,dealersHand[0]);},600)
        setTimeout(function(){placeCard('dealer',2,dealersHand[1]);},1800)
        playersTotal = setTimeout(function(){calculateTotal(playersHand, 'player');},2400);
        let totalHandValue = 0;
        let thisCardValue = 0;
        let totalAces = 0;
        for (i = 0; i < playersHand.length; i++) {
            thisCardValue = Number(playersHand[i].slice(0, -1));
            if (thisCardValue > 10) {
                thisCardValue = 10;
            }else if (thisCardValue == 1) {
                totalAces += 1;
                thisCardValue = 11;
            }
            totalHandValue += thisCardValue;
            
        }
        for (let i = 0; i < totalAces; i++) {
            if (totalHandValue > 21)  {
            totalHandValue -= 10;
            }
        }
        console.log(totalHandValue)
        if (totalHandValue == 21) {
                setTimeout(()=>{checkWin();}, 2500);
            }
        // if(calculateTotal(playersHand, ))
    }

});