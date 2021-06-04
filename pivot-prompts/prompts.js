/** UPDATE THIS WITH PROMPTS **/
/** You can use audreystjohn.github.io/discomfort-prompts/toArray.html **/
var prompts = ["I am able to name my feelings.","I spend time sorting out my feelings and reflecting on them.","My emotions impact my motivation.","I recognize the impact I have on others.","I know myself so well; I can laugh about my shortcomings.","When I worry, I can calm myself down.","I'm not afraid to get angry; I have strategies so I don't blow up.","I am open to change.","I have been known to \"fly off the handle\" or be a \"loose cannon\".","When the rug gets pulled out from under me, I know I can recover.","Sometimes situations are uncomfortable because I don't know what is going to happen, but I work through that feeling.","I maintain a sense of positivity or optimism even when things are tough.","I can keep myself motivated even when I face setbacks.","I take a long time to recover from an unexpected problem that comes out of nowhere","I can sense how other people feel.","I can read the cues other people provide.","Even if I disagree with someone, I can understand where they are coming from.","I have a strong sense of empathy for others' hardships.","I realize the way I see the world is not the only way.","I am not open to changing my mind.","I'm the kind of person who can bring other people along.","I have never quite figured out how to be a leader.","If the door closes, I am the person who finds a window.","I do not feel deterred just because something did not work as I had planned.","When I have put so much into something, I find it hard to regroup and pursue a new direction.","I have a set list of things I know how to do, and I cannot do anything new.","I like to try on new perspectives.","When things go wrong, I curl up in a ball and hide from other people.","I have no problem sharing my emotions, but I can get stuck in them for a while."];

//SELECT ELEMENTS AND ASSIGN THEM TO VARS
var likeMeBtn = document.querySelector('#likeMe');
var notLikeMeBtn = document.querySelector('#notLikeMe');
// var neutralBtn = document.querySelector('#neutral');

var promptUl = document.querySelector(".prompt-list ul");
var likeMeUl = document.querySelector(".like-me-list ul");
// var neutralUl = document.querySelector(".neutral-list ul");
var notLikeMeUl =  document.querySelector(".not-like-me-list ul");

var createNewPrompt = function(){
  console.log("Creating prompt...");
  
  if ( prompts.length > 0 )
  {
      //SET UP THE NEW LIST ITEM
      var listItem = document.createElement("li"); //<li>
      var label = document.createElement("label"); // <label>
  
      //PULL THE INPUTED TEXT INTO LABEL
      label.innerText = prompts.pop();
      
      //ADD ITEMS TO THE LI
      listItem.appendChild(label);

      promptUl.appendChild( listItem );  
  }
  else 
  {
      allPromptsProcessed = true;
      likeMeBtn.style.visibility = "hidden";
      notLikeMeBtn.style.visibility = "hidden";
      // neutralBtn.style.visibility = "hidden";
  }
  
};

//ADD THE PROMPT INTO COMFORT LIST
var assignComfort = function(){
    assignTo( likeMeUl );
};

function assignTo( list ) {
    console.log("Adding task...");
    
    // get the prompt
    var listItem = promptUl.children[0];

    list.appendChild(listItem); 
    
    // make it possible to reset
    //CREATE AND INSERT THE RESET BUTTON
    var resetBtn = document.createElement("button"); // <button>
    resetBtn.innerText ="Reset"; 
    resetBtn.className = "reset";
    resetBtn.onclick = resetPrompt;
    
    listItem.insertBefore(resetBtn, listItem.children[0]);
      
    // add a new prompt
    createNewPrompt();
}


//ADD THE PROMPT INTO DisCOMFORT LIST
var assignDisComfort = function(){
    assignTo( notLikeMeUl );
};


// //ADD THE PROMPT INTO NEUTRAL LIST
// var assignNeutral = function() {
//     assignTo( neutralUl );
// };

// RESET PROMPT FUNCTION
var resetPrompt = function(){
  console.log("Resetting prompt...");

  var listItem = this.parentNode;
  var promptText = listItem.querySelector("label").innerText;
  prompts.push( promptText );
  console.log( promptText );
  var ul = listItem.parentNode;
  ul.removeChild(listItem);

  console.log( prompts.length );
  if ( allPromptsProcessed )
  {
      allPromptsProcessed = false;
      likeMeBtn.style.visibility = "visible";
      notLikeMeBtn.style.visibility = "visible";
      // neutralBtn.style.visibility = "visible";
      
      createNewPrompt();
  }

};

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

// addTaskBtn.addEventListener("click", addTask);
likeMeBtn.addEventListener("click", assignComfort);
notLikeMeBtn.addEventListener("click", assignDisComfort);
// neutralBtn.addEventListener("click", assignNeutral);
prompts = shuffle( prompts );
createNewPrompt();
