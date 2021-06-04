/** UPDATE THIS WITH PROMPTS **/
/** You can use audreystjohn.github.io/discomfort-prompts/toArray.html **/
var prompts = ["Create a design for a user interface (UI/UX)","Find a team to work with","Talk to a recruiter","Ask a teammate/mentor for help","Learn a new developer technology in 4 hours","Remove broken features/code for a demo in 30 minutes","Pitch an idea in 90 seconds to a room full of people","Speak up if a team/social dynamic is not working","Engage in a difficult conversation around identity","Plan a timeline of feature milestones against a deadline","Take a break that regains my focus","Estimate the skills and time required for a task","Recover from failure (bugs, technical choice, feature)","Regulate emotional reactions to my suggestion being rejected","Communicate my needs (rest, technical help) to myself/teammates","Assign roles (developer, designer, tester) to tasks ","Resolve conflict over feature priority list","Speak up when I don’t agree with an idea/approach","Give specific, honest, positive/critical feedback"];
//"Develop a prototype with hardware",

//SELECT ELEMENTS AND ASSIGN THEM TO VARS
var inComfortBtn = document.querySelector('#inComfort');
var outComfortBtn = document.querySelector('#outComfort');
var neutralBtn = document.querySelector('#neutral');

var promptUl = document.querySelector(".prompt-list ul");
var comfortUl = document.querySelector(".comfort-list ul");
var neutralUl = document.querySelector(".neutral-list ul");
var discomfortUl =  document.querySelector(".discomfort-list ul");

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
      inComfortBtn.style.visibility = "hidden";
      outComfortBtn.style.visibility = "hidden";
      neutralBtn.style.visibility = "hidden";
  }
  
};

//ADD THE PROMPT INTO COMFORT LIST
var assignComfort = function(){
    assignTo( comfortUl );
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
    assignTo( discomfortUl );
};


//ADD THE PROMPT INTO NEUTRAL LIST
var assignNeutral = function() {
    assignTo( neutralUl );
};

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
      inComfortBtn.style.visibility = "visible";
      outComfortBtn.style.visibility = "visible";
      neutralBtn.style.visibility = "visible";
      
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
inComfortBtn.addEventListener("click", assignComfort);
outComfortBtn.addEventListener("click", assignDisComfort);
neutralBtn.addEventListener("click", assignNeutral);
prompts = shuffle( prompts );
createNewPrompt();
