const helpModal = document.getElementById('helpModal');
var polygonText = document.getElementById('polygonData');
  
function openHelpModal() {
    console.log("you clicked me!");
    helpModal.classList.remove('hide-modal');
    helpModal.classList.add('show-modal');
}

function closeHelpModal() {
    console.log("hide me");
    helpModal.classList.remove('show-modal');
    helpModal.classList.add('hide-modal');
}

function selectBuilding(indx)
{ 
    setPolygon(indx);
    guards = [];
    guard_vis = [];
    redraw();
}
function updatePolygonText()
{
    if ( polygon == null || polygonText == null ) return;
     var polygonString = "[[" + polygon[0][0] + "," + polygon[0][1] + "]";
    for ( var i = 1; i < polygon.length; i++ )
        polygonString += ",[" + polygon[i][0] + "," + polygon[i][1] + "]";
    polygonString += "]";
    polygonText.value = polygonString;
}
function updatePolygon()
{
    polygon = JSON.parse(polygonText.value);
    redraw();
}

function triangulateAndGuard(){
    t_g = generate_triangulation_and_guard_pos(polygon);
    triangulation = t_g[0];
    guards = t_g[1];
    update();
}

redraw();

var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}