var svgNS = "http://www.w3.org/2000/svg";
var currentplayeridx = null;
var phase = null;
var svgroot = null;
var playernames = null;
var countries = null;
var armiestodeploy = null;
var attackorigin = null;
var attacktarget = null;

window.addEventListener("load", initGame);

function initGame() {
  // grab the "country" elements from the svg
  loadCountries();

  // read in the player names, set up interface
  initPlayers();

  // randomly assign countries to players
  initCountries();

  // get ready to play, set first player, phase=deploy
  setupFirstPhase();

  // update all the relevant info on screen
  updateInfo();
}


function loadCountries() {
  svgroot = document.getElementById("mapobj").contentDocument;
  countries = svgroot.getElementsByClassName("country");
  for (i=0;i<countries.length;i++) {
    countries[i].addEventListener("click",countryClicked);
    c = countries[i];
    var neibs = getNeighboursOf(c);
  }
}

function initPlayers() {

  // let's set up the players
  var numplayers = 0;
  while (numplayers < 2 ){
    //var str_players = prompt("Please enter at least two player names, separated by commas");
    var str_players = "Tom,Dick,Harriet";
    playernames = str_players.split(",");
    for (i=0; i<playernames.length; i++) playernames[i] = playernames[i].trim();
    numplayers = playernames.length;
  }

  var el_players = document.getElementById("players");
  var playertemplate = document.getElementById("playertemplate");
  for (i=0; i<playernames.length; i++){
    var newplayerli = playertemplate.cloneNode(true);
    newplayerli.id = "player" + (i+"").padStart(2,"0");
    newplayerli.getElementsByClassName("playername")[0].innerHTML = playernames[i];
    el_players.appendChild(newplayerli);
  }
  el_players.removeChild(playertemplate);
  logMessage("Initialised " + playernames.length + " players.");
}

function initCountries() {
  var shuffled = [];
  for (i=0;i<countries.length;i++) shuffled.push(countries[i]);
  shuffled = shuffle(shuffled);
  for (i=0; i<shuffled.length; i++) {
    p_idx = i % playernames.length; // rotate through the players
    shuffled[i].setAttribute("data-ruler", p_idx);
    shuffled[i].setAttribute("data-armies", 1);
  }
}

function setupFirstPhase() {
  currentplayeridx = 0;
  phase = "DEPLOY";
  armiestodeploy = 3;
  logMessage(
    "Player " + playernames[currentplayeridx] +
    " to deploy " + armiestodeploy + " armies",
    "action");
}

function updateInfo() {
  // display each country's ruler and number of armies
  for (i=0; i < countries.length; i++) {
    var c = countries[i];
    textEl = svgroot.getElementById(c.id + "-armies");
    textEl.textContent = c.getAttribute("data-armies");
    textEl = svgroot.getElementById(c.id + "-ruler");
    textEl.textContent = playernames[parseInt(c.getAttribute("data-ruler"))];
  }

  // show players' stats

  playernames.forEach(
    function (pname,pidx,pnames){
      playerstats = countPlayerArmiesAndCountries(pidx);

      p_el_id = "player" + (pidx+"").padStart(2,"0");
      p_el = document.getElementById(p_el_id);
      if (pcountries <= 0) p_el.setAttribute("class", "inactive"); // player is out
      p_el.getElementsByClassName("playerphase")[0].innerHTML =
        (pidx==currentplayeridx ? phase : "idle");
      p_el.getElementsByClassName("playerarmies")[0].innerHTML = "Armies: " + playerstats.armies;
      p_el.getElementsByClassName("playercountries")[0].innerHTML = "Countries: " + playerstats.countries;
    }
  );

}

function countryClicked(e){
  console.log("CLICKED!  We're in the "+phase+" phase with a target of "+e.target.id);
  el_country = e.target;
  if (phase == "DEPLOY") {
    if (el_country.getAttribute("data-ruler") == currentplayeridx) {
      el_country.setAttribute("data-armies", parseInt(el_country.getAttribute("data-armies")) + 1);
      armiestodeploy--;
    }
    if (armiestodeploy <=0) {
      phase = "ATTACK";
      let pname = playernames[currentplayeridx];
      logMessage(`Player ${pname} ready to attack; click origin and target`, "action");
    }
  }
  if (phase == "ATTACK") {
    // has player already chosen where to attack from?
    if (attackorigin && canAttack(attackorigin, e)) {
      attacktarget = e;
      let oname = attackorigin
      document.getElementById("btnattack").value = "Attack "
    }
  }
  updateInfo();
}

function attackButtonClicked() {

}
/* ****************************************************************************

   UTILITY FUNCTIONS

**************************************************************************** */

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function countPlayerArmiesAndCountries(pidx) {
  parmies = 0;
  pcountries = 0;
  for (c=0;c<countries.length;c++){
    if (countries[c].getAttribute("data-ruler") == pidx) {
      parmies += parseInt(countries[c].getAttribute("data-armies"));
      pcountries++;
    }
  }
  return {"armies": parmies, "countries" : pcountries};
}

function calculateDeployableArmies(pidx) {
  pcountries = countPlayerArmiesAndCountries(pidx).countries;
  return Math.min(3, Math.floor(pcountries / 3));
}

// get an array of country objects which neighbour c
function getNeighboursOf(c) {
  var str_neibs = c.getAttribute("data-neighbours").split(",");
  var neighbours = [];

  for (let j=0; j < str_neibs.length; j++) {
    var n = str_neibs[j].trim();
    if (n) {
      neighbours.push(svgroot.getElementById(n));
    }
  }
  return neighbours;
}

function logMessage(msg="", msgclass="") {
  var t = document.getElementById("logentrytemplate");
  var e = t.cloneNode();
  e.setAttribute("class", msgclass);
  e.innerHTML = msg;
  t.parentNode.prepend(e);
}
