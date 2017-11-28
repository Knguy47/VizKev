// start slingin' some d3 here.
//Hello

///////Initializes the state of the board////////
var gameOptions = {
  'height': 700,
  'width': 1000,
  'numEnemies': 20,
  'padding': 40
};

var gameStats = {
  'score': 0,
  'bestScore': 0,
  'collisions': 0
};

///////Create the board for game////////////////
var axes = {
  'x': d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  'y': d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var svg = d3.select('.board').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

var rect = svg.append('rect')
  .attr('class', 'newboard')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .style('stroke', '#999999')
  .style('fill', '#252323');


///////Update the score and the bestscore///////
var updateScore = function() {
  if (gameStats.score > gameStats.bestScore) {
    gameStats.bestScore = gameStats.score;
  }
  d3.select('.collisions').select('span').text(gameStats.collisions.toString());
  d3.select('.highscore').select('span').text(gameStats.bestScore.toString());
  d3.select('.current').select('span').text(gameStats.score.toString());

  gameStats.score++;
};


////////Added drag to Player///////////////////
var dragMove = function() {
  var x = d3.event.x;
  var y = d3.event.y;
  // Setting the min and max limits for player to stay inside the board
  var minX = gameOptions.padding;
  var maxX = gameOptions.width - gameOptions.padding;
  var minY = gameOptions.padding;
  var maxY = gameOptions.height - gameOptions.padding;

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

var drag = d3.behavior.drag()
    .on('drag', dragMove);


///////Create player circle////////////////////
var player = svg.append('circle')
  .attr('class', 'player')
  .attr('cx', axes.x(50))
  .attr('cy', axes.y(50))
  .attr('r', 15)
  .style('fill', function() {
    return 'hsl(' + Math.random() * 360 + ',100%,50%)';
  })
  .call(drag);


////////Data for all badGuys//////////////////

var createDataArray = function(n) {
  return d3.range(n).map(function(ele) {
    var results = {
      'x': axes.x(Math.random() * 100),
      'y': axes.y(Math.random() * 100)
    };
    return results;
  });
};

var badGuyArray = createDataArray(gameOptions.numEnemies);

var allEnemies = svg.selectAll('circle.enemies')
    .data(badGuyArray)
  .enter().append('circle')
    .attr('class', 'enemies')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 20)
    .style('fill', 'red');

var moveEnemies = function(element) {
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

var blinkyArray = createDataArray(1);

var blinky = svg.selectAll('circle.blinky')
  .data(blinkyArray)
  .enter().append('circle')
  .attr('class', 'blinky')
  .attr('cx', function(d) { return axes.x(Math.random() * 90); })
  .attr('cy', function(d) { return axes.y(Math.random() * 90); })
  .attr('r', 10)
  .style('fill', 'white');

var blinkDot = function() {
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
var prevEnemyCollision = false;

// Enemy Collision
var detectCollision = function(arrayNodes, callback) {
  var collision = false;
  var playerCoords = {x: parseFloat(player.attr('cx')), y: parseFloat(player.attr('cy')), r: parseFloat(player.attr('r'))};

  arrayNodes.each(function() {
    var currentObj = d3.select(this);

    var diffX = Math.abs(parseFloat(currentObj.attr('cx')) - playerCoords.x);
    var diffY = Math.abs(parseFloat(currentObj.attr('cy')) - playerCoords.y);
    var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    var sumRadius = parseFloat(currentObj.attr('r')) + playerCoords.r;

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
var detectBlinkyCollision = function(arrayNodes, callback) {
  var collision = false;
  var playerCoords = {x: parseFloat(player.attr('cx')), y: parseFloat(player.attr('cy')), r: parseFloat(player.attr('r'))};

  arrayNodes.each(function() {
    var currentObj = d3.select(this);

    var diffX = Math.abs(parseFloat(currentObj.attr('cx')) - playerCoords.x);
    var diffY = Math.abs(parseFloat(currentObj.attr('cy')) - playerCoords.y);
    var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    var sumRadius = parseFloat(currentObj.attr('r')) + playerCoords.r;

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


var enemyCollision = function() {
  gameStats.score = 0;
};

var blinkyCollision = function() {
  var x = axes.x(Math.random() * 100);
  var y = axes.y(Math.random() * 100);

  var minX = gameOptions.padding;
  var maxX = gameOptions.width - gameOptions.padding;
  var minY = gameOptions.padding;
  var maxY = gameOptions.height - gameOptions.padding;

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
