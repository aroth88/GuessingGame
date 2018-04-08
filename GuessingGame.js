function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1)
}

function shuffle(arr){
    let x = arr.length;
    while (x > 0){
        let num = Math.floor(Math.random() * x);
        x--;
        let holder = arr[x];
        arr[x] = arr[num];
        arr[num] = holder;
    }
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
}
Game.prototype.isLower = function(){
    return this.winningNumber > this.playersGuess ? 'Guess Higher!' : 'Guess Lower!';
}
Game.prototype.playersGuessSubmission = function(num){
    if (num > 100 || num < 1 || typeof num !== 'number'|| isNaN(num)){
        return 'That is an invalid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
}
Game.prototype.checkGuess = function(){
    if (this.playersGuess === this.winningNumber){
        //also disable the enter ability
        $("#submit, #hint, #player-input").prop('disabled', true);
        $('#title').text('You Win!');
        $('#subtitle').text(`${this.winningNumber} was the correct number`);
        return 'Press reset to play again';
    }
    if (this.pastGuesses.includes(this.playersGuess)){
        return 'You have already guessed that number.';
    }
    this.pastGuesses.push(this.playersGuess);
    if (this.pastGuesses.length >= 5){
        $("#submit, #hint, #player-input").prop('disabled', true);
        $('#title').text('You Lose');
        $('#subtitle').text(`The correct number was ${this.winningNumber}`);
        return 'Press reset to play again';
    }
    let diff = this.difference();
    if (diff < 10){
        return 'You\'re burning up! ' + this.isLower();
    }
    if (diff < 25){
        return 'You\'re lukewarm. ' + this.isLower();
    }
    if (diff < 50){
        return 'You\'re a bit chilly. ' + this.isLower();
    }
    else {
        return 'You\'re ice cold! ' + this.isLower();
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    let hintCount = 0;
    let num1 = generateWinningNumber();
    let num2 = generateWinningNumber();
    let num3 = this.winningNumber;
    let arr = shuffle([num1, num2, num3]).join(', ');
    function hinter(){
        if (hintCount >= 2){
            $('#subtitle').text('The answer is one of these numbers: ' + arr);
            $('#hint').prop('disabled', true);
        }
        else if (hintCount % 2 === 0){
            hintCount++;
            $('#subtitle').text('The answer is one of these numbers: ' + arr);
        }
        else {
            hintCount++;
            $('#subtitle').text('One hint per game');
        }
    }
    
    return hinter;
}



$(document).ready(function(){
    let game = new Game();

    let hintttt = game.provideHint();

    function getInput(){
        let input = +$('#player-input').val();
        $('#player-input').val('');
        let hotCold = game.playersGuessSubmission(input);
        let direction;
        addGuess();
        $('#hot-cold').text(hotCold);
        
    }

    function addGuess(){
        let guessLength = game.pastGuesses.length-1
        let lastGuess = game.pastGuesses[guessLength];
        $('#guess-list li').eq(guessLength).text(lastGuess);
        
    }

    $('#submit').click(function(){
        getInput();
        $('#player-input').focus();
    })

    $("#player-input").keypress(function(key){
        if (key.which === 13){
            getInput();
        }
    })

    $('#reset').click(function(){
        game = new Game();
        hintttt = game.provideHint();
        $('#submit, #hint, #player-input').prop('disabled', false);
        $('#title').text('Guessing Game!');
        $('#guess-list li').text('-');
        $('#hot-cold').text('');
        $('#subtitle').text('Guess a number between 1-100');
        $('#player-input').focus();
    })

    $('#hint').click(function(){
        hintttt();
        $('#player-input').focus();
    })

})
