let activeFighters = [];
const parseJSON = (xhr, content) => {
  if(xhr.response) {
    //const obj = JSON.parse(xhr.response);
    console.dir(obj);
  }
};

const handleResponse = (xhr) => {
  const content = document.querySelector('#responses');
  
  let jsonResponse = 'No Response';
  
  if(xhr.response) {
    jsonResponse = JSON.parse(xhr.response);
  }
  
  switch(xhr.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      //console.dir(jsonResponse);
      break;
    case 201:
      content.innerHTML = '<b>Created Fighter</b>';
      //console.dir(jsonResponse);
      break;
    case 204:
      content.innerHTML = '<b>Updated (No Content)</b>';
      //console.dir(jsonResponse);
      break;
    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      content.innerHTML = `${content.innerHTML}<br>Message: ${jsonResponse.message}`;
      //console.dir(jsonResponse);
      break;
    case 404:
      content.innerHTML = '<b>404 Not Found</b>';
      
      // no response if it is a HEAD request
      if(jsonResponse.message) {
        content.innerHTML = `${content.innerHTML}<br>Message: ${jsonResponse.message}`;
      }
      
      //console.dir(jsonResponse);
      break;
    default:
      content.innerHTML = '<b>Response Code Not implemented by Client</b>';
      break;
  }
};

const sendPost = (e, nameForm) => {
  // Fighter Name, Player Name, Health, Damage, Speed, Armor, Crit Chance
  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');

  const fighterNameField = nameForm.querySelector('#fighterNameField');
  const playerNameField = nameForm.querySelector('#playerNameField');
  const healthField = nameForm.querySelector('#healthField');
  const damageField = nameForm.querySelector('#damageField');
  const speedField = nameForm.querySelector('#speedField');
  const armorField = nameForm.querySelector('#armorField');
  const critField = nameForm.querySelector('#critField');
  
  const xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  
  xhr.onload = () => handleResponse(xhr);
  
  const formData = `fighterName=${fighterNameField.value}`;
  formData = `${formData}&playerName=${playerNameField.value}`;
  formData = `${formData}&health=${healthField.value}`;
  formData = `${formData}&damage=${damageField.value}`;
  formData = `${formData}&speed=${speedField.value}`;
  formData = `${formData}&armor=${armorField.value}`;
  formData = `${formData}&crit=${critField.value}`;
  
  xhr.send(formData);
  
  // update the display of the fighters again
  getFighters();
  
  e.preventDefault();
  return false;
};

const updateFighter = (fighter) => {
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/addFighter');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  
  xhr.onload = () => handleResponse(xhr);
  
  const formData = `fighterName=${fighter.fighterName}`;
  formData = `${formData}&playerName=${fighter.playerName}`;
  formData = `${formData}&health=${fighter.health}`;
  formData = `${formData}&damage=${fighter.damage}`;
  formData = `${formData}&speed=${fighter.speed}`;
  formData = `${formData}&armor=${fighter.armor}`;
  formData = `${formData}&crit=${fighter.crit}`;
  formData = `${formData}&battles=${fighter.battles}`;
  formData = `${formData}&wins=${fighter.wins}`;
  
  xhr.send(formData);
  
  // e.preventDefault();
  return false;
};

const removeFighter = (fighter) => {
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/removeFighter');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  const formData = `fighterName=${fighter.fighterName}`;
  formData = `${formData}&playerName=${fighter.playerName}`;
  formData = `${formData}&health=${fighter.health}`;
  formData = `${formData}&damage=${fighter.damage}`;
  formData = `${formData}&speed=${fighter.speed}`;
  formData = `${formData}&armor=${fighter.armor}`;
  formData = `${formData}&crit=${fighter.crit}`;
  formData = `${formData}&battles=${fighter.battles}`;
  formData = `${formData}&wins=${fighter.wins}`;
  
  xhr.send(formData);
  return false;
};

const xhrRequestFighters = () => {
  // for getting back the JSON object with the fighters and return it
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/getFighters');
  let fighters = {};
  
  xhr.onload = () => {
    switch(xhr.status) {
        case 200:
          if(xhr.response) {
            fighters = (JSON.parse(xhr.response)).fighters;
            return fighters;
          }
          break;
      }
  };
  xhr.send();
  
  // return fighters;
};

const getFighters = (e) => {
  const responseForm = document.querySelector('#responses');
  const urlForm = document.querySelector('#urlField');
  const xhr = new XMLHttpRequest();
  const url = urlForm.value;
  
  xhr.open('get', '/getFighters');
  
  xhr.onload = () => {
    handleResponse(xhr);
    switch(xhr.status) {
      case 200:
        responseForm.innerHTML = '<b>Success<br>';
        if(xhr.response) {
          // responseForm.innerHTML = `${responseForm.innerHTML}${xhr.response}`;
          const fighters = (JSON.parse(xhr.response)).fighters;
          // display the fighters
          displayFighters(fighters);
        }
        break;
    }
  };
  xhr.send();
  if(e) // check if e exists, so that we can call getFighters from within the code and not just the button
    e.preventDefault();
  return false;
};

const displayFighters = (fighters) => {
  // get all the info back
  const content = document.querySelector('#content');
  // clear content
  content.innerHTML = '';
  
  // since our array of fighters is indexed by string, we gotta loop through it like this
  Object.keys(fighters).forEach(function(key, index) {
    // display the fighter
    displayFighter(this[key]);
  }, fighters);
};

const displayFighter = (fighter) => {
  // Fighter Name, Player Name, Health, Damage, Speed, Armor, Crit Chance
  const content = document.querySelector('#content');
  const div = document.createElement('div');
  const h1 = document.createElement('h1');
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');
  const selectButton = document.createElement('button');

  // set the classname of div to cardBox so that it can display in a box
  div.className = 'cardBox';

  let active = false;
  for(let i = 0; i < activeFighters.length; i++) {
    if(activeFighters[i] == fighter.fighterName) {
      active = true;
    }
  }
  if(active === true) {
    div.className = `${div.className} active`;
  }

  h1.textContent = `${fighter.fighterName}`;
  h2.textContent = `Created by: ${fighter.playerName}`;

  // Create list items for each attribute
  const battles = document.createElement('li');
  const wins = document.createElement('li');
  const health = document.createElement('li');
  const damage = document.createElement('li');
  const speed = document.createElement('li');
  const armor = document.createElement('li');
  const crit = document.createElement('li');
  
  
  // Fill the text content of each
  battles.textContent = `Battles: ${fighter.battles}`;
  wins.textContent = `Wins: ${fighter.wins}`;
  health.textContent = `Health: ${fighter.health}`;
  damage.textContent = `Damage: ${fighter.damage}`;
  speed.textContent = `Speed: ${fighter.speed}`;
  armor.textContent = `Armor: ${fighter.armor}`;
  crit.textContent = `Crit: ${fighter.crit}`;

  // Append it to the unordered list
  ul.appendChild(battles);
  ul.appendChild(wins);
  ul.appendChild(health);
  ul.appendChild(damage);
  ul.appendChild(speed);
  ul.appendChild(armor);
  ul.appendChild(crit);

  // append everything to the div
  div.appendChild(h1);
  div.appendChild(h2);
  div.appendChild(ul);

  // add it to the content
  content.appendChild(div);

  // make a function to set the fighter as active if they click the div
  const setActive = () => {
    // add the clicked user's name to the activeFighters object
    // check if its already there
    let currentlyActive = false;
    for(let i = 0; i < activeFighters.length; i++) {
      if(activeFighters[i] == fighter.fighterName) {
        currentlyActive = true;
        // since it exists, we want to remove it
        activeFighters.splice(i, 1);
      }
    }
    
    if(currentlyActive == false)
      activeFighters.push(fighter.fighterName);
    
    // check to see if active fighters is greater than 2. If it is, remove the first index (so the newer clicked object stays instead of the older one)
    if(activeFighters.length > 2)
      activeFighters.splice(0, 1);
    
    // redraw the fighters html section
    getFighters();
  };

  // make an onclick for the div to flip the value of active
  div.onclick = setActive;
  div.style.cursor = 'pointer';
};

const fight = (death) => {
  // for getting back the JSON object with the fighters and return it
  if(activeFighters.length != 2) {
    return;
  }
  
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/getFighters');
  let fighters = {};
  
  xhr.onload = () => {
    switch(xhr.status) {
        case 200:
          if(xhr.response) {
            fighters = (JSON.parse(xhr.response)).fighters;
            runBattle(fighters, death);
          }
          break;
      }
  };
  xhr.send();
};

const runBattle = (fighters, death) => {
  // pull the fighters that were selected
  if(!(fighters[activeFighters[0]] && fighters[activeFighters[1]])) {
    // for some reason, the active fighters do not exist in the array. Tell the user to try again
    console.dir('invalid fighters');
  }
  let fighter1 = fighters[activeFighters[0]];
  let fighter2 = fighters[activeFighters[1]];
  
  // console.dir('fighter1s = ' + fighter1.fighterName);
  // console.dir('fighter2 = ' + fighter2.fighterName);

  let result = {};
  
  /*
  Maybe do like 
  1: speed + d6 vs speed + d6 winner goes first in round
  2: check crit on a percentile
  3: damage + d6
  4: if(crit) damage = parseint(damage*=1.5);
  5: target.health -= Math.max(0,(damage - armor));
  6: repeat 1-5 for lower speed roll
  7: loop 1-6 until a character has less than 1 health
  */

  // determine the winner
  if(fighter1.health + fighter1.damage > fighter2.health + fighter2.damage) {
    // fighter 1 wins
    result.winner = fighter1;
    result.loser = fighter2;
    result.draw = false;
  } else  if (fighter1.health + fighter1.damage == fighter2.health + fighter2.damage) {
    // tie
    result.draw = true;
  } else {
    // fighter 2 wins
    result.winner = fighter2;
    result.loser = fighter1;
    result.draw = false;
  }
  
  if(result.draw) {
    updateFighter(fighter1);
    updateFighter(fighter2);
    return;
  }
  
  // increase battles and wins of the fighters
  // parseInt(result.winner.battles) += 1;
  // parseInt(result.winner.wins) += 1;
  // 
  // parseInt(result.loser.battles) += 1;
  result.winner.battles = parseInt(result.winner.battles);
  result.winner.wins = parseInt(result.winner.wins);
  result.loser.battles = parseInt(result.loser.battles);
  result.winner.battles += 1;
  result.winner.wins += 1;
  result.loser.battles += 1;
  
  // increase stats of fighters
  // fighter1 = increaseStats(result.winner);
  // fighter2 = increaseStats(result.loser);
  
  // remove the loser if its a deathmatch
  if(death === true) {
    removeFighter(result.loser);
  } else {
    updateFighter(result.loser);
  }
  
  updateFighter(result.winner);
};

const increaseStats = (fighter) => {
  const randomStat = Math.floor((Math.random() * 5) + 1); // random number between 1 and 5
  
  // upgrade a random stat by one
  switch(randomStat) {
    case 1:
      fighter.health += 1;
      break;
    case 2:
      fighter.damage += 1;
      break;
    case 3:
      fighter.speed += 1;
      break;
    case 4:
      fighter.armor += 1;
      break;
    case 5:
      fighter.crit += 1;
      break;
    default:
      break;
  }
  
  // return the fighter back
  return fighter;
};


const init = () => {
  const nameForm = document.querySelector('#nameForm');
  const fighterForm = document.querySelector('#fighterForm');
  const methodSelect = document.querySelector('#methodSelect');
  
  const addFighter = (e) => sendPost(e, nameForm);
  const findFighters = (e) => getFighters(e);
  
  nameForm.addEventListener('submit', addFighter);
  fighterForm.addEventListener('submit', findFighters);

  // set up the fight buttons
  const fightButton = document.querySelector('#fightButton');
  const deathMatchButton = document.querySelector('#deathMatchButton');
  const startFight = () => fight(false); // (is death active) = false
  const startDeathMatch = () => fight(true); // (is death active) = true

  fightButton.addEventListener('click', startFight);
  deathMatchButton.addEventListener('click', startDeathMatch);
  
  // set the initial fighter
  getFighters();
  
  // set the page to reload fighters every 2 seconds
  window.setInterval(function(){
    getFighters();
  }, 2000);
};
window.onload = init;
