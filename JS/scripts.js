
/* Set Variables & Elements */
var employees = [];
var selected = [];
var filtered = [];
var averageTime = [];
var game, timer, chosen, choice, stopwatch, seconds;
var removing = false;
var right = 0, wrong = 0;
var modes = document.querySelectorAll('.mode-select');
var gameTitle = document.getElementById('game-title');
var playArea = document.getElementById('game-playarea');
//-----------------------------------
//Load data from API
window.onload = fetchData;
//Fetch Data Function
function fetchData() {
    fetch('https://willowtreeapps.com/api/v1.0/profiles')
    .then(res => res.json())
    .then(function(data){
    
        //set data to employees variable
        employees = data;
        
    }).catch(err => console.error(err));
}
//-----------------------------------
//Game Mode Selection
modes.forEach(mode => mode.addEventListener('click', gameMode));
function gameMode(){  
    //Check & Load Selected Game mode
    if(modes[0].checked) {
        game = 'team';
        teamMode();
    } else if (modes[1].checked){
        game = 'reverse';
        reverseMode();
    } else if (modes[2].checked){
        game = 'hint';
        hintMode();
    } else {
        game = 'stats';
        statsMode();
    }
}
//Team Mode
function teamMode() {

    clearPlayArea(); //Check to see if there is anyone in Selected and Clear
    shuffle(); //Chose 5 Random Employees

    //Show their pictures
    for (var i = 0; i < selected.length; i++){
        img = document.createElement('input');
        img.type = 'image';
        img.src = selected[i].headshot.url;
        img.dataset.key = selected[i].headshot.id;
        img.id = 'img';
        playArea.appendChild(img);
    }

    chosen = selected[Math.floor(Math.random()*selected.length)]; //Choose one person from Selected Employees

    //Show selected persons name
    gameTitle.innerHTML = "";
    var header = document.createElement('H1');
    var text = document.createTextNode("Who is " + chosen.firstName + " " + chosen.lastName + "?");
    header.appendChild(text);
    gameTitle.appendChild(header);

    //Assign Listen Event to each image/check choice
    var choices = document.querySelectorAll('#img');
    choices.forEach(choice => choice.addEventListener('click', checkChoice));

}
//Reverse Mode
function reverseMode() {
    clearPlayArea(); //Check to see if there is anyone in Selected and Clear
    shuffle(); //Chose 5 Random Employees

    //Show their names
    for (var i = 0; i < selected.length; i++){
        btn = document.createElement('input');
        btn.type = 'button';
        btn.value = selected[i].firstName + " " + selected[i].lastName;
        btn.dataset.key = selected[i].headshot.id;
        btn.className = 'btn-sel';
        btn.id = 'btn';
        playArea.appendChild(btn);
    }
    chosen = selected[Math.floor(Math.random()*selected.length)]; //Choose one person from Selected Employees

    //Show selected persons picture
    gameTitle.innerHTML = "";
    var header = document.createElement('H1');
    var image = document.createElement('IMG');
    var text = document.createTextNode("Who is this?");
    image.src = chosen.headshot.url;
    image.id = 'img';
    header.appendChild(text);
    gameTitle.appendChild(header);
    gameTitle.appendChild(image);

    //Assign Listen Event to each image/check choice
    var choices = document.querySelectorAll('#btn');
    choices.forEach(choice => choice.addEventListener('click', checkChoice));
}
//Hint Mode
function hintMode() {
    clearPlayArea(); //Check to see if there is anyone in Selected and Clear
    shuffle(); //Chose 5 Random Employees

    //Show their pictures
    for (var i = 0; i < selected.length; i++){
        img = document.createElement('input');
        img.type = 'image';
        img.src = selected[i].headshot.url;
        img.dataset.key = selected[i].headshot.id;
        img.id = 'img';
        playArea.appendChild(img);
    }

    chosen = selected[Math.floor(Math.random()*selected.length)]; //Choose one person from Selected Employees

    //Show selected persons name
    gameTitle.innerHTML = ""; //Clear current text
    var header = document.createElement('H1'); //Create H1 Element for text
    var text = document.createTextNode("Who is " + chosen.firstName + " " + chosen.lastName + "?"); //Format text
    header.appendChild(text); //Append text to H1 Element
    gameTitle.appendChild(header); //Append

    //Assign Listen Event to each image/check choice
    var choices = document.querySelectorAll('#img');
    choices.forEach(choice => choice.addEventListener('click', checkChoice));

    //Remove Random Images that arent the chosen one
    choices.forEach(function(c){
        if(c.dataset.key == chosen.headshot.id){
            return;
        }
        filtered.push(c);
    });
    clearTimeout(timer);
    if(!removing){
        timer = setTimeout(function(){removeSelection();},5000);
    }
}
//Stat Mode
function statsMode() {
    clearPlayArea();
    //Mode Name
    gameTitle.innerHTML = "";
    var header = document.createElement('H1');
    var text = document.createTextNode("Statistics");
    header.appendChild(text);
    gameTitle.appendChild(header);

    var sum, avg = 0;

    if (averageTime.length){
        sum = averageTime.reduce(function(a,b) {
            return a + b;
        });
        avg = sum/averageTime.length;
        var roundedAverage = Math.round( avg * 10 ) / 10;
    } else {
        roundedAverage = 0;
    }

    //Reset Button
    var resetButton = document.createElement('button');
    resetButton.textContent = "Resest Stats";//Text for reset button
    resetButton.setAttribute('class', 'btn-reset' );
    resetButton.addEventListener('click', function(){
        scoreReset();
    });

    //Data
    var className = document.createElement('H3');

    var data = document.createTextNode("Correct Answers: " + right);
    className.appendChild(data);

    var linebrk = document.createElement('br');
    className.appendChild(linebrk);

    data = document.createTextNode("Incorrect Answers: " + wrong);
    className.appendChild(data);

    var linebrk = document.createElement('br');
    className.appendChild(linebrk);
    
    data = document.createTextNode("Average Time to Answer: " + roundedAverage + " seconds");
    className.appendChild(data);

    var linebrk = document.createElement('br');
    className.appendChild(linebrk);
    className.appendChild(resetButton);
    playArea.appendChild(className);
}
//-----------------------------------
//Helper Functions
function checkChoice() {   
    choice = this; //Set Image Clicked to Choice
    clearInterval(stopwatch); //Reset Stopwatch
    clearTimeout(timer);
    //Check if Choice matches Chosen
    if(choice.dataset.key == chosen.headshot.id){
        removing = false;
        choice.classList.add("right");
        right++; //increase Right Score Count   
        averageTime.push(seconds); //Push current time in seconds to averageTime array
        
        //Reload Game Mode
        switch(game){
            case 'team':
                setTimeout(teamMode, 2000);
                break;
            case 'reverse':
                setTimeout(reverseMode, 2000);
                break;
            case 'hint':
                setTimeout(hintMode, 2000);
                break;
            default:
                setTimeout(statsMode, 2000);
        }
    } else {
        wrong++; //increase Wrong Score Count
        choice.classList.add("wrong");
    }
}
function shuffle() {
    //Choose 5 random employees, then check if they have an image. If they do then push into Selected array. If not then choose another random employee and rerun the check.
    for (var i = 0; i < 5; i++){
        var person = employees[Math.floor(Math.random()*employees.length)];
        if (typeof person.headshot.url === "undefined" || person.headshot.id === "no id configured"){
            person = employees[Math.floor(Math.random()*employees.length)];
        } else if (selected.indexOf(person) >= 0) {
            person = employees[Math.floor(Math.random()*employees.length)];
        }
        selected.push(person);
    }
    seconds = 0; //Set seconds to 0
    stopwatch = setInterval(function(){seconds += 1;}, 1000); //Add 1 to seconds every second
}
function clearPlayArea() {
    filtered = []; //Empty Filtered Array
    selected = []; //Empty Selected Array
    playArea.innerHTML = ""; //Clear Play Area
    clearTimeout(timer); //Reset Timer
}
function scoreReset() {
    right=0; //Set Right Score to 0
    wrong=0; //Set Wrong Score to 0
    averageTime = []; //Reset Average Time Array
    statsMode();
}
function removeSelection() {
    var len = filtered.length;
    removing = true;
    if(len == 0){
        removing = false;
        return;
    }
    var randomImg = filtered[Math.floor(Math.random()*filtered.length)]; //Select Random Person from Filtered
    filtered.splice(filtered.indexOf(randomImg),1); //Remove Person from Filtered
    playArea.removeChild(randomImg); //Remove Input element of selected person from parent node
    timer = setTimeout(function(){removeSelection();},5000); //Recall function every 5 seconds 
}

