/** UPDATE THIS WITH PROMPTS **/
/** You can use audreystjohn.github.io/discomfort-prompts/toArray.html **/
var prompts = ["I like to create a game plan before jumping into a complex project.","I can step back and troubleshoot how I am thinking about a project. ","I notice when I am getting \"off-track\"-- and I can pull myself back on-track. ","I write down in a log or record what I try as I go along, so when I'm ready to pause my work, I'll know where to pick back up when I come back.","I try strategies systematically and see which one(s) work and why they work.","I ask other people to observe me and reflect back what they see me doing/not doing.","I say \"help me!\" without specifying how the person can help.","I can spend hours on something, come up empty handed, and not know how I spent the time.","I can find it difficult to abandon an approach even when it is clearly not working for me.","I like to engage in guesswork rather than read up on what has been done before.","I feel defeated when I receive harsh feedback.","If an expert in the field tells me I'm not cut out for it, I feel I should give up.","Even if someone doesn't package comments in a helpful way, I'm good at pulling out the useful information from the exchange so I can move forward.","I spend more time rehashing what happened in a feedback session rather than moving ahead on revising my work."];

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
