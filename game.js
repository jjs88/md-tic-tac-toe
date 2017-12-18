var Game = (function(){

    //add modal for end game
    //add functinality to restart game



    var board, winner, successSpot, boardSpot, element, choiceObj, choiceSlot, move, element,line, img, same, btn,
    modal, modalContent, winningCombos, winnerMsg;

    
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

        userChoice(boardSpot)

    }


    function userChoice(boardSpot) {

        successSpot = false;

        // change game state
        if(boardSpot) {
            for(var x = 0; x < winningCombos.length; x++) {//cycle the array

                for(y = 0; y < winningCombos[x].length-1; y++) { //cycle each object, skip last one

                    if(winningCombos[x][y][boardSpot] !== undefined //must be a valid slot
                        && (winningCombos[x][y][boardSpot] !== boardSpot //can't equal an X already
                        && winningCombos[x][y][boardSpot] !== 'o')) { //can't equal an O already

                        winningCombos[x][y][boardSpot] = 'x'; //override value
                        successSpot = true; //spot updated successfully
                    }      
                }
            }
            

            if(successSpot) { //if the user choice was a success, add the image to the board for that slot

                addBoardIMG(boardSpot,'X');

                if(!isWinner('josh')) { //check if user is the winner, else computers turn

                    computerMove();

                } else { // user is the winner
                    // console.log('josh is winner');

                    //END GAME HERE
                    //create a display a modal
                    toggleModal('josh');
                }
            } else { //wasn't a successful spot, player goes again
                console.log('try again');
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

        while(!successSpot) {

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
            
            //get prop to tie to element class, only one in the object
            for(prop in boardSpot) {
                addBoardIMG(prop, 'O');
            }


            if(isWinner('computer')) {
                console.log('computer wins!');
                
                //END GAME HERE
                toggleModal('computer');
            }
        }
    }


    function addBoardIMG(boardSpot, piece) {

        element = document.getElementsByClassName(boardSpot)[0];

        //add conditonal for adding image here. if not already there, create
        img = document.createElement('img');

        // console.log('img', element.children[0]);

        if(!element.children[0]) {

            img.setAttribute('src', `images/${piece}.png`);
            element.appendChild(img);
        }
    }


    function addLineThrough(combo) {

        for(var x = 0; x < combo.length; x++) {

            for(prop in combo[x]) {

                if(prop === 'line') {

                    line.classList.add(combo[x][prop]);
                }              
            }
        }    
    }

    


    // function exitModal(e) {

    //     e.preventDefault();

    //     console.log(e.target);
    //     console.log(modal);
    //     modal.classList.add('toggle-hidden');
    //     modalContent.classList.add('rotate');
       
    // }

    function toggleModal(user) {
        
        if(user === 'computer') {
            winnerMsg.innerHTML = `The computer has won! :(`
        }

        if(user === 'josh') {
            winnerMsg.innerHTML = 'Congrats! You have won';
        }

        if(!modal.classList.contains('hidden')) {
            modalContent.classList.remove('rotate');
            modal.classList.add('hidden');
            
        } else {
            modalContent.classList.add('rotate');
            modal.classList.remove('hidden');
        }
    }

    function resetGame(e) {

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
        line.classList.remove(line.classList[1]) // 1 position is the added line though class

        winningCombos = createWinningCombosArray(); //reset state
    }











    function init() {

        // console.log('works');
        cacheDOM();
        events();
    }

    function events() {

        board.addEventListener('click', userClick);
        btn.addEventListener('click', resetGame);

    }

    function cacheDOM() {

        board = document.getElementsByClassName('board')[0];
        line = document.getElementsByClassName('line')[0];
        btn = document.getElementsByClassName('btn')[0];
        modal = document.getElementsByClassName('modal')[0];
        modalContent = document.getElementsByClassName('modal-content')[0];
        winnerMsg = document.getElementsByClassName('winner-msg')[0];
        winningCombos =  createWinningCombosArray();
    }










    //expose API
    return {
        init
    }

})();