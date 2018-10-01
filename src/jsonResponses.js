const fighters = {};

// default characters
fighters.Jayceon = {
  fighterName: 'Jayceon',
  playerName: 'My B',
  battles: 0,
  wins: 0,
  health: 6,
  damage: 8,
  speed: 11,
  armor: 10,
  crit: 1,
};

const headers = {
  'Content-Type': 'application/json',
};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, headers);
  response.end();
};

const getFighters = (request, response) => {
  const responseJSON = {
    fighters,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getFightersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const addFighter = (request, response, body) => {
  // Fighter Name, Player Name, Health, Damage, Speed, Armor, Crit Chance
  const responseJSON = {
    message: 'Name and age required',
  };

  // validate
  if (
    !body.playerName
    || !body.fighterName
    || !body.health
    || !body.damage
    || !body.speed
    || !body.armor
    || !body.crit
  ) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  // validate the values are between 1 and 15
  if (body.health < 1
      || body.health > 15
      || body.damage < 1
      || body.damage > 15
      || body.speed < 1
      || body.speed > 15
      || body.armor < 1
      || body.armor > 15
      || body.crit < 1
      || body.crit > 15
  ) {
    responseJSON.id = 'incorrectValues';
    responseJSON.message = 'Values should be between 1 and 15';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201; // created

  // secure will only exist if the post was sent by the program, not the add fighter button
  if (fighters[body.fighterName] && body.secure) {
    responseCode = 204; // updated
  } else if (fighters[body.fighterName]) {
    // fighter already exists, and the user is trying to create another one
    responseCode = 204; // updated
  } else {
    fighters[body.fighterName] = {};
  }

  // key it based on name
  fighters[body.fighterName].fighterName = body.fighterName;
  fighters[body.fighterName].playerName = body.playerName;
  fighters[body.fighterName].health = body.health;
  fighters[body.fighterName].damage = body.damage;
  fighters[body.fighterName].speed = body.speed;
  fighters[body.fighterName].armor = body.armor;
  fighters[body.fighterName].crit = body.crit;
  fighters[body.fighterName].wins = body.wins || 0;
  fighters[body.fighterName].battles = body.battles || 0;

  if (responseCode === 201) {
    responseJSON.message = 'Created successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // can't send back data in a 204
  return respondJSONMeta(request, response, responseCode);
};

const removeFighter = (request, response, body) => {
  let responseCode = 204; // updated
  const responseJSON = {
    message: 'User does not exist',
  };

  if (fighters[body.fighterName]) {
    // delete it
    delete fighters[body.fighterName];
    return respondJSONMeta(request, response, responseCode);
  }
  responseJSON.id = 'noUser';
  responseCode = 400;
  return respondJSON(request, response, responseCode, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getFighters,
  getFightersMeta,
  addFighter,
  removeFighter,
  notFound,
  notFoundMeta,
};
