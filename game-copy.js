var Game = (function(){
    
    
        //create 3 different line class.
        //add a new object with the class for each winning combo
        //make the game do the Y for y-1
    
    
        var board, winner, successSpot, slot, element, choiceObj, choiceSlot, move, element;
    
        var winningCombos = [
    
            [{"top-left": 0},{"top-mid": 1},{"top-right": 2}], 
            [{"mid-left": 3},{"mid-mid": 4},{"mid-right": 5}], 
            [{"bottom-left": 6},{"bottom-mid": 7},{"bottom-right": 8}], 
    
            [{"top-left": 0},{"mid-left": 3},{"bottom-left": 6}], 
            [{"top-mid": 1},{"mid-mid": 4},{"bottom-mid": 7}], 
            [{"top-right":2},{"mid-right":5},{"bottom-right":8}], 
    
            [{"top-left":0},{"mid-mid":4},{"bottom-right":8}], 
            [{"top-right":2}, {"mid-mid":4}, {"bottom-left":6}] 
        ];
    
       
    
    
    
        function userClick(e) {
    
            e.preventDefault();
    
            slot = e.target.getAttribute('data-slot');
            element = e.target;
    
            userChoice(slot, element)
    
        }
    
    
        function userChoice(slot, element) {
    
            successSpot = false;
    
            // change game state
            if(slot) {
                for(var x = 0; x < winningCombos.length; x++) {//cycle the array
    
                    for(y = 0; y < winningCombos[x].length; y++) { //cycle each object
    
                        if(winningCombos[x][y][slot] !== undefined && (winningCombos[x][y][slot] !== slot && winningCombos[x][y][slot] !== 'o')) {
    
                            winningCombos[x][y][slot] = 'x';
                            successSpot = true;
                        }      
                    }
                }
                
    
                if(successSpot) {
    
                    //add image here
                    addBoardIMG(slot,'X');
    
                    if(!isWinner('josh')) {
    
                        computerMove();
    
                    } else {
                        console.log('josh is winner');
    
                        //END GAME HERE
                    }
                } else {
                    console.log('try again');
                } 
            }
        }
    
    
        function isWinner(player) {
    
    
            for(var x = 0; x < winningCombos.length; x++) { //cycle the inner arrays
    
                
                winner = 0;
                var same = null;
    
    
                for(var y = 0; y < winningCombos[x].length; y++) { //cycle the objects
                    
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
                slot = winningCombos[choiceObj][choiceSlot]; //computer selection
    
                //figure out a way to set the HTML. Just once though
    
    
    
                for(var x = 0; x < winningCombos.length; x++) { //get array spot
    
                    for(var y = 0; y < winningCombos[x].length; y++) { //get object
                        
                        for(var prop in winningCombos[x][y]) { //get props
    
                            for(var prop1 in slot) { //get computer props
    
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
                for(prop in slot) {
                    addBoardIMG(prop, 'O');
                }
    
    
                if(isWinner('computer')) {
                    console.log('computer wins!');
                    
                    //END GAME HERE
                }
            }
        }
    
    
        function addBoardIMG(slot, piece) {
            let element = document.getElementsByClassName(slot)[0];
    
            //add conditonal for adding image here. if not already there, create
            let img = document.createElement('img');
            img.setAttribute('src', `images/${piece}.png`);
            element.appendChild(img);
        }
    
    
        function addLineThrough(combo) {
    
            for(var x = 0; x < combo.length; x++) {
    
                for(prop in combo[x]) {
    
                    element = document.getElementsByClassName(prop)[0];
                    element.firstElementChild.classList.add('line-right-diag');
                }
            }    
        }
    
        
    
    
    
    
    
    
    
    
    
    
    
    
    
        function init() {
    
            // console.log('works');
            cacheDOM();
            events();
        }
    
        function events() {
    
            board.addEventListener('click', userClick);
    
        }
    
        function cacheDOM() {
    
            board = document.getElementsByClassName('board')[0];
        }
    
    
    
    
    
    
    
    
    
    
        //expose API
        return {
            init
        }
    
    })();