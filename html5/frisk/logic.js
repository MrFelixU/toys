var svgNS = "http://www.w3.org/2000/svg";
var attacker = null;
var attacked = null;


window.addEventListener("load", loadMap);

function loadMap() {

  var svgEl = document.getElementById("mapobj").contentDocument;
  var countries = svgEl.getElementsByClassName("country");
  for (i=0; i < countries.length; i++) {
    var c = countries[i];
    c.setAttribute("frisk:armies", 1);
    textEl = svgEl.getElementById(c.id + "-armies")
    textEl.textContent = 1;
  }
}


//window.addEventListener("load",grabMap);

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
