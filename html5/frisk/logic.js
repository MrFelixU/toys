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
  // get buttons ready to listen
  document.getElementById("btnattack").addEventListener("click", attackButtonClicked);
  document.getElementById("btnendturn").addEventListener("click", endTurnClicked);

  // can we play using this map?
  if (!checkMap()) alert("Something is wrong with the map svg file");

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
  document.getElementById("player00").classList.add("turn");
  phase = "DEPLOY";
  armiestodeploy = 3;
  logMessage("Player " + playernames[currentplayeridx]+" to deploy " + armiestodeploy + " armies","action");
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
  var el_country = e.target;
  var attackButton = document.getElementById("btnattack");
  if (phase == "DEPLOY") {
    if (el_country.getAttribute("data-ruler") == currentplayeridx) {
      el_country.setAttribute("data-armies", parseInt(el_country.getAttribute("data-armies")) + 1);
      armiestodeploy--;
    }
    if (armiestodeploy <=0) {
      phase = "ATTACK";
      document.getElementById("btnendturn").disabled = false;
      let pname = playernames[currentplayeridx];
      logMessage(`Player ${pname} ready to attack; click origin and target`, "action");

    }
  } else if (phase == "ATTACK") {
    // has player already chosen where to attack from?
    if (attackorigin && canAttack(attackorigin, el_country)) {
      attacktarget = el_country;
      let oname = getCountryName(attackorigin);
      let tname = getCountryName(attacktarget);
      attackButton.value = `Attack ${tname} FROM ${oname}`;
      attackButton.disabled = false;
    } else if ( !(attackorigin) && canMountAttack(el_country)) {
      // let's choose the attack origin, as long as
      // we're clicking on a country that belongs to us
      attackorigin = el_country;
      attackButton.value = "Attack FROM " + getCountryName(el_country);
    }
  }
  updateInfo();
}

function attackButtonClicked() {
  // work out how many dice are being used
  no_of_att_dice = 0;
  while (!no_of_att_dice) {
    max_att = Math.min(3, parseInt(attackorigin.getAttribute("data-armies")) - 1);
    var resp = parseInt(
      prompt(`Attack with how may dice?  (Choose 1..${max_att} )`));
    no_of_att_dice = ( resp > 0 && resp <= max_att ? resp : null );
  }
  no_of_def_dice = 0;
  while (!no_of_def_dice) {
    max_def = Math.min(2, parseInt(attacktarget.getAttribute("data-armies")));
    var resp = parseInt(
      prompt(`Defend with how may dice?  (Choose 1..${max_def} )`));
    no_of_def_dice = ( resp > 0 && resp <= max_def ? resp : null );
  }




  // turn off button until they have selected another origin and target
  document.getElementById("btnattack").disabled = true;
}

function endTurnClicked() {

}

function getCountryName(el) {
  return svgroot.getElementById(el.id +"-name").textContent;
}

function canMountAttack(el) {
  var currentPlayerOwnsIt = el.getAttribute("data-ruler") == currentplayeridx;
  var hasArmies = parseInt(el.getAttribute("data-armies")) > 1;
  return  (hasArmies && currentPlayerOwnsIt);
}

function canAttack(el_origin, el_target) {
  // players can't attack their own territory
  if (el_origin.getAttribute("data-ruler") == el_target.getAttribute("data-ruler")) return false;

  // must have at least 2 armies
  if (parseInt(el_origin.getAttribute("data-armies")) < 2) return false;

  return true;
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

function checkMap() {
  var maproot = document.getElementById("mapobj").contentDocument;
  var country_els = maproot.getElementsByClassName("country");

  // check we have enough countries to play with
  if (country_els.length < 2) {
    console.log("Not enough countries to play with");
    return false;
  }

  // go through each country and...
  for (i=0;i<country_els.length; i++) {
    var c = country_els[i];
    console.log("Checking " + c.id);
    // check it has an armies, a name and an owner element
    if (!(maproot.getElementById(c.id+"-armies") &&
         maproot.getElementById(c.id+"-ruler") &&
         maproot.getElementById(c.id+"-name")
       )) return false;
    console.log("Found the right subelements");


    // let's check that each declared neighbour has
    // also chosen us as their neighbour
    let neighbour_ids = c.getAttribute("data-neighbours");
    if (neighbour_ids) {
      neighbour_ids = neighbour_ids.split(",");
      for (nidx = 0; nidx < neighbour_ids.length; nidx++) {
        let n = maproot.getElementById(neighbour_ids[nidx].trim());
        if (! n) return false;
        if (n.getAttribute("data-neighbours").split(",").includes(c.id)) {
          console.log("Our neighbour "+n.id+" has us ("+c.id+") as a neighbour.");
        } else {
          console.log(`Neighbour relation not mutual for ${c.id} and ${n.id}`);
          return false;
        }
      }
    } else {
      return  false;
    }
  }
  console.log("The map svg seems to be [ OK ].");
  return true;
}

function logMessage(msg="", msgclass="") {
  var t = document.getElementById("logentrytemplate");
  var e = t.cloneNode();
  e.setAttribute("class", msgclass);
  e.innerHTML = msg;
  t.parentNode.prepend(e);
}
