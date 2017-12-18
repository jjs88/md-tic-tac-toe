var Game = (function(){


    //private variables for the game
    var board, winner, successSpot, boardSpot, element, choiceObj, choiceSlot, element, line, img, same, btn,
    modal, modalContent, winningCombos, winnerMsg, stallMateWatch;

    
    function createWinningCombosArray() {
        
        let combos = [
            
            //contains the winning combos plus the js hook for the line through the set
            //each object value will get replaced with X or O as game progresses, until there is a winner
    
            // across
            [{"top-left": 0},{"top-mid": 1},{"top-right": 2},{"line": "line-top-across" }], 
            [{"mid-left": 3},{"mid-mid": 4},{"mid-right": 5},{"line": "line-mid-across"}], 
            [{"bottom-left": 6},{"bottom-mid": 7},{"bottom-right": 8}, {"line": "line-bottom-across"}], 
    
            //down
            [{"top-left": 0},{"mid-left": 3},{"bottom-left": 6},{"line": "line-left-down"}], 
            [{"top-mid": 1},{"mid-mid": 4},{"bottom-mid": 7},{"line": "line-mid-down"}], 
            [{"top-right":2},{"mid-right":5},{"bottom-right":8},{"line": "line-right-down"}], 
    
            // diagonal
            [{"top-left":0},{"mid-mid":4},{"bottom-right":8}, {"line": "line-right-diag"}], 
            [{"top-right":2}, {"mid-mid":4}, {"bottom-left":6},{"line": "line-left-diag"}] 
        ];
        
        let arr = combos;
        
        return arr;
    }



    function userClick(e) { //game starts here with user's click

        e.preventDefault();

        boardSpot = e.target.getAttribute('data-slot');
        element = e.target;

        userChoice(boardSpot);
    }


    function userChoice(boardSpot) {

        successSpot = false;

        // change game state
        if(boardSpot) {

            for(var x = 0; x < winningCombos.length; x++) {//cycle the array

                for(y = 0; y < winningCombos[x].length-1; y++) { //cycle each object, skip last one

                    if(winningCombos[x][y][boardSpot] !== undefined //must be a valid slot
                        && (winningCombos[x][y][boardSpot] !== 'x' //can't equal an X already
                        && winningCombos[x][y][boardSpot] !== 'o')) { //can't equal an O already

                        winningCombos[x][y][boardSpot] = 'x'; //override value
                        successSpot = true; //spot updated successfully
                    }      
                }
            }
            

            if(successSpot) { // user turn was a success

                addBoardIMG(boardSpot,'X'); //add image to board
                addToStallMateWatch(boardSpot); //add spot to stallmate watch array
                

                if(isWinner('josh')) {

                    gameOver('josh');

                } else if(checkForStallMate()) {

                    gameOver('stall');
                    
                } else {

                    computerMove();
                }

            } 
    
        }
    }


    function isWinner(player) {


        for(var x = 0; x < winningCombos.length; x++) { //cycle the inner arrays

            
            winner = 0;
            same = null;


            for(var y = 0; y < winningCombos[x].length-1; y++) { //cycle the objects, skip last
                
                for(var prop in winningCombos[x][y]) { //cycle the props
 
                    if(winningCombos[x][y][prop] === same) {
                        winner++;
                    }

                    same = winningCombos[x][y][prop];
                }

            }

            
            if (winner === 2) {

                addLineThrough(winningCombos[x]);

                return true;
            }
        }
    }

    function computerMove() {
  
        successSpot = false;

        while(!successSpot) { //keep going until computer gets a valid board spot (one that isn't taken)

            choiceObj = Math.floor(Math.random() * 8) + 0 //random between 0-8 for array selection
            choiceSlot = Math.floor(Math.random() * 3) + 0 //random 0-2 for object selection
            boardSpot = winningCombos[choiceObj][choiceSlot]; //computer selection

   
            for(var x = 0; x < winningCombos.length; x++) { //get array spot

                for(var y = 0; y < winningCombos[x].length-1; y++) { //get object, skip last
                    
                    for(var prop in winningCombos[x][y]) { //get props

                        for(var prop1 in boardSpot) { //get computer props

                            if(prop === prop1) { //compare props to make sure they are the same (same spot)

                                if(winningCombos[x][y][prop] !== 'x' && winningCombos[x][y][prop] !== 'o') {

                                    winningCombos[x][y][prop] = 'o';
                                    successSpot = true;
                                    // console.log(prop, winningCombos[x][y][prop]);
                                }
                            }
                        }
                    }
                }
            }
        }   


        if(successSpot) {

            // checkForStallMate();
            
            //get prop to tie to element class, only one in the object
            for(prop in boardSpot) {
                addBoardIMG(prop, 'O');
                addToStallMateWatch(prop);
            }

          
            if(isWinner('computer')) {
                // console.log('computer wins!');
                //END GAME HERE
                // console.log(winningCombos);
                gameOver('computer');

            } else if(checkForStallMate()) {

                gameOver('stall');

            } else {
                //user turn again
            }

       
        }

    }


    function addBoardIMG(boardSpot, piece) {

        element = document.getElementsByClassName(boardSpot)[0];

        img = document.createElement('img');

        if(!element.children[0]) { //only add the img once if it doesn't exist on the board

            img.setAttribute('src', `images/${piece}.png`);
            element.appendChild(img);
        }
    }


    function addLineThrough(combo) { // adds the line through class for the winning combo

        for(var x = 0; x < combo.length; x++) {

            for(prop in combo[x]) {

                if(prop === 'line') {

                    line.classList.add(combo[x][prop]);
                }              
            }
        }    
    }

    
    function addToStallMateWatch(spot) {
        //keep track of the successful game spots 
        stallMateWatch.push(spot);
    }

    function checkForStallMate() {

        // console.log('stall', stallMateWatch);
        let cnt = 0;
        if(stallMateWatch.length === 8) { //one spot left, perform logic to see if user will win game or it will be a stallmate

            for(var x = 0; x < winningCombos.length; x++) { //cycle the inner arrays
                
                cnt = 0;

                for(var y = 0; y < winningCombos[x].length-1; y++) { //cycle the objects, skip last
                    
                    for(var prop in winningCombos[x][y]) { //cycle the object props

                        // console.log(prop);
        
                        if(winningCombos[x][y][prop] === 'x') { 

                            cnt++;

                        } else if (winningCombos[x][y][prop] === 'o') {

                            cnt = cnt-1;

                        } else {

                            cnt;
                        }
                    }

                    // console.log(prop, cnt);

                }

            
                if (cnt === 2) { //this means that there is 2 X's for the winning combo on the board. Let user take last turn to win game

                    // console.log('user goes');
                    break;
                }
            }

            
            if(cnt !== 2) { // users last turn won't result in a win, end game as stallmate
                // console.log('end game', 'stall game');
                return true;
                // gameOver('stall');
            }
            
        }
    }

    
    function restartGame(e) {

        e.preventDefault();

        toggleModal();

        let boardSlots = document.querySelectorAll('[class^="board-piece"]');
        // console.log(boardSlots);

        //remove X and O
        boardSlots.forEach(function(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });

        //remove line through
        line.classList.remove(line.classList[1]) // 2nd position is the added line through class

        winningCombos = createWinningCombosArray(); //reset state
        // console.log('new state', winningCombos);
        stallMateWatch = [];
    }


    function gameOver(input) {
        // console.log('passed into gameOver:', input);
        if(input === 'computer') {
            winnerMsg.innerHTML = `The computer has won! :(`
        } else if(input === 'josh') {
            winnerMsg.innerHTML = 'Congrats! You have won'; 
        } else {
            winnerMsg.innerHTML = 'Stallmate, no winner :(';
        }

        toggleModal();
    }



    function toggleModal() {
        
        if(!modal.classList.contains('hidden')) {
            // console.log('hide modal');
            modalContent.classList.remove('rotate');
            modal.classList.add('hidden');
            
        } else {
            // console.log('reveal modal');
            modalContent.classList.add('rotate');
            modal.classList.remove('hidden');
        }
    }


 











    // config functions for the Module

    function init() {

        cacheDOM();
        events();
    }

    function events() {

        board.addEventListener('click', userClick);
        btn.addEventListener('click', restartGame);

    }

    function cacheDOM() {

        board = document.getElementsByClassName('board')[0];
        line = document.getElementsByClassName('line')[0];
        btn = document.getElementsByClassName('btn')[0];
        modal = document.getElementsByClassName('modal')[0];
        modalContent = document.getElementsByClassName('modal-content')[0];
        winnerMsg = document.getElementsByClassName('winner-msg')[0];
        winningCombos =  createWinningCombosArray();
        stallMateWatch = [];
    }



    //expose API
    return {
        init
    }

})();