var svgNS = "http://www.w3.org/2000/svg";
var friskNS = "https://github.com/MrFelixU/toys";
var currentplayer = null;
var phase = null;
var svgroot = null;
var playernames = null;

window.addEventListener("load", initGame);

function initGame() {

  // let's set up the players
  var numplayers = 0;
  while (numplayers < 2 ){
    //var str_players = prompt("Please enter at least two player names, separated by commas");
    var str_players = "Tom,Dick,Harriet";
    playernames = str_players.split(",");
    for (i=0; i<playernames.length; i++) playernames[i] = playernames[i].trim();
    numplayers = playernames.length;
  }

  initPlayers();

  svgroot = document.getElementById("mapobj").contentDocument;
  var countries = svgroot.getElementsByClassName("country");
  for (i=0; i < countries.length; i++) {
    var c = countries[i];
    c.setAttribute("frisk:armies", 1);
    textEl = svgroot.getElementById(c.id + "-armies");
    textEl.textContent = 1;
  }

  updateInfo();
}

function initPlayers() {
  var el_players = document.getElementById("players");
  var playertemplate = document.getElementById("playertemplate");
  for (i=0; i<playernames.length; i++){
    var newplayerli = playertemplate.cloneNode(true);
    newplayerli.id = "player" + (i+"").padStart(2,"0");
    newplayerli.getElementsByClassName("playername")[0].innerHTML = playernames[i];
    el_players.appendChild(newplayerli);
  }
  el_players.removeChild(playertemplate);
}

function updateInfo() {
  var countries = svgroot.getElementsByClassName("country");
  for (i=0; i < countries.length; i++) {
    var c = countries[i];
    textEl = svgroot.getElementById(c.id + "-armies");
    textEl.textContent = c.getAttribute("frisk:armies");
  }
}




/*  The old stuff, here just for reference, REMOVE SOON!

*/

function isAttackPossible() {
    if ( attacker && attacked && parseInt(attacker.getAttribute("frisk:armies")) > 1) {
	return true;
    } else {
	return false;
    }
}


function displayInfo() {
    if (attacker) {
	attackerName = attacker.getAttribute("frisk:name");
    } else {
	attackerName = "";
    }

    document.getElementById("origin").value = attackerName;

    if (attacked) {
	attackedName = attacked.getAttribute("frisk:name");
    } else {
	attackedName = "";
    }

    document.getElementById("target").value = attackedName;

    if (isAttackPossible()) {
	document.getElementById("attackbutton").disabled = false;
    }

}


function clickedCountry(el) {
    var attackerName = null;
    var attackedName = null;

    if ((attacker) && (el == attacker)) {
	attacker = null;
	attacked = null;
    } else if ( ! attacker) {
	attacker = el;
    } else if (attacker) {
	attacked = el;
    }

    displayInfo();
}

function prepareMap(svg) {

    var map = document.getElementById("themap");

    var countries = map.getElementsByTagName("rect");

    for (i = 0; i < countries.length; i++) {
	var c = countries[i];

	var newText = document.createElementNS(svgNS,"text");
	newText.setAttributeNS(null, "id", c.id + "label");
	newText.setAttributeNS(null, "x", parseInt(c.getAttribute("x")) + 10);
	newText.setAttributeNS(null, "y", parseInt(c.getAttribute("y")) + 20);
	newText.setAttributeNS(null, "font-size", "12");
	newText.setAttributeNS(null, "style", "fill: #fff; stroke: #000; stroke-width: 1px;");

	var textNode = document.createTextNode(c.getAttribute("frisk:name"));
	newText.appendChild(textNode);
	map.appendChild(newText);

    }

}
