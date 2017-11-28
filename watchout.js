// start slingin' some d3 here.
//Hello

///////Initializes the state of the board////////
let gameOptions = {
  'height': 700,
  'width': 1000,
  'numEnemies': 20,
  'padding': 40
};

let gameStats = {
  'score': 0,
  'bestScore': 0,
  'collisions': 0
};

///////Create the board for game////////////////
let axes = {
  'x': d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  'y': d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

let svg = d3.select('.board').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

let rect = svg.append('rect')
  .attr('class', 'newboard')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .style('stroke', '#999999')
  .style('fill', '#252323');


///////Update the score and the bestscore///////
let updateScore = function() {
  if (gameStats.score > gameStats.bestScore) {
    gameStats.bestScore = gameStats.score;
  }
  d3.select('.collisions').select('span').text(gameStats.collisions.toString());
  d3.select('.highscore').select('span').text(gameStats.bestScore.toString());
  d3.select('.current').select('span').text(gameStats.score.toString());

  gameStats.score++;
};


////////Added drag to Player///////////////////
let dragMove = function() {
  let x = d3.event.x;
  let y = d3.event.y;
  // Setting the min and max limits for player to stay inside the board
  let minX = gameOptions.padding;
  let maxX = gameOptions.width - gameOptions.padding;
  let minY = gameOptions.padding;
  let maxY = gameOptions.height - gameOptions.padding;

  if (x > maxX) {
    x = maxX;
  } else if (x < minX) {
    x = minX;
  }
  if (y > maxY) {
    y = maxY;
  } else if (y < minY) {
    y = minY;
  }

  player.attr('cx', x).attr('cy', y);
};

let drag = d3.behavior.drag()
    .on('drag', dragMove);


///////Create player circle////////////////////
let player = svg.append('circle')
  .attr('class', 'player')
  .attr('cx', axes.x(50))
  .attr('cy', axes.y(50))
  .attr('r', 15)
  .style('fill', function() {
    return 'hsl(' + Math.random() * 360 + ',100%,50%)';
  })
  .call(drag);


////////Data for all badGuys//////////////////

let createDataArray = function(n) {
  return d3.range(n).map(function(ele) {
    let results = {
      'x': axes.x(Math.random() * 100),
      'y': axes.y(Math.random() * 100)
    };
    return results;
  });
};

let badGuyArray = createDataArray(gameOptions.numEnemies);

let allEnemies = svg.selectAll('circle.enemies')
    .data(badGuyArray)
  .enter().append('circle')
    .attr('class', 'enemies')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 20)
    .style('fill', 'red');

let moveEnemies = function(element) {
  element
    .transition()
    .ease('linear')
    .duration(2000)
    .attr('cx', function(d) { return axes.x(Math.random() * 100); })
    .attr('cy', function(d) { return axes.y(Math.random() * 100); })
    .each('end', function() {
      moveEnemies(d3.select(this));
    });
};

let blinkyArray = createDataArray(1);

let blinky = svg.selectAll('circle.blinky')
  .data(blinkyArray)
  .enter().append('circle')
  .attr('class', 'blinky')
  .attr('cx', function(d) { return axes.x(Math.random() * 90); })
  .attr('cy', function(d) { return axes.y(Math.random() * 90); })
  .attr('r', 10)
  .style('fill', 'white');

let blinkDot = function() {
  blinky
    .transition()
    .duration(300)
    .style('fill-opacity', '0')
    .transition()
    .duration(300)
    .style('fill-opacity', '1');

  setTimeout(blinkDot, 600);
};

// Implements collision detections between player and enemies
let prevEnemyCollision = false;

// Enemy Collision
let detectCollision = function(arrayNodes, callback) {
  let collision = false;
  let playerCoords = {x: parseFloat(player.attr('cx')), y: parseFloat(player.attr('cy')), r: parseFloat(player.attr('r'))};

  arrayNodes.each(function() {
    let currentObj = d3.select(this);

    let diffX = Math.abs(parseFloat(currentObj.attr('cx')) - playerCoords.x);
    let diffY = Math.abs(parseFloat(currentObj.attr('cy')) - playerCoords.y);
    let distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    let sumRadius = parseFloat(currentObj.attr('r')) + playerCoords.r;

    if (distance < sumRadius) {
      // callback();
      collision = true;
      console.log('COLLISIOOONNN!!!');
    }
  });

  if (collision) {
    callback();
    rect.style('fill', '#DF3B1D');

    if (prevCollision !== collision) {
      gameStats.collisions = gameStats.collisions + 1;
    }
  } else {
    rect.style('fill', '#252323');
  }

  prevCollision = collision;
};

// blinky Collision
let detectBlinkyCollision = function(arrayNodes, callback) {
  let collision = false;
  let playerCoords = {x: parseFloat(player.attr('cx')), y: parseFloat(player.attr('cy')), r: parseFloat(player.attr('r'))};

  arrayNodes.each(function() {
    let currentObj = d3.select(this);

    let diffX = Math.abs(parseFloat(currentObj.attr('cx')) - playerCoords.x);
    let diffY = Math.abs(parseFloat(currentObj.attr('cy')) - playerCoords.y);
    let distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    let sumRadius = parseFloat(currentObj.attr('r')) + playerCoords.r;

    if (distance < sumRadius) {
      // callback();
      collision = true;
      console.log('COLLISIOOONNN!!!');
    }
  });

  if (collision) {
    callback();
  }
};


let enemyCollision = function() {
  gameStats.score = 0;
};

let blinkyCollision = function() {
  let x = axes.x(Math.random() * 100);
  let y = axes.y(Math.random() * 100);

  let minX = gameOptions.padding;
  let maxX = gameOptions.width - gameOptions.padding;
  let minY = gameOptions.padding;
  let maxY = gameOptions.height - gameOptions.padding;

  if (x > maxX) {
    x = maxX;
  } else if (x < minX) {
    x = minX;
  }
  if (y > maxY) {
    y = maxY;
  } else if (y < minY) {
    y = minY;
  }

  gameStats.score += 10;
  blinky.attr('cx', x)
        .attr('cy', y);
};

moveEnemies(allEnemies);
blinkDot();

d3.timer(() => detectCollision(allEnemies, enemyCollision));
d3.timer(() => detectBlinkyCollision(blinky, blinkyCollision));
setInterval(updateScore, 500);
//useful methods
//d3.behavior.drag
//d3.mouse
//d3.range
