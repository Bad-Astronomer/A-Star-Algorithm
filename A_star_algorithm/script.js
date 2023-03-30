//grid setup
var cols = 50;
var rows = 50;
var grid = new Array(cols);
var w, h;

//misc global vars
var openSet = [];
var closedSet = [];
var path;
var run = true;


function Cell(i, j){
  //cords in grid
  this.i = i;
  this.j = j;

  this.f = 0; //total cost
  this.g = 0; //path cost
  this.h = 0; //hurestic cost

  this.adj = []; //adjacent cells
  this.prev; //prev cell in the path
  this.wall = false; //wall or not

  if(random(1) < 0.3){
    this.wall = true;
  }


  this.show = function(color){
    //display walls
    if(this.wall){
      color = 0;
    }
    //if not wall
    fill(color);
    stroke(0);
    rect(this.i * w, this.j * h, w, h);
  }

  this.calcAdj = function(){
    //Calculate Adjacent cells
    if( i < cols-1){
      this.adj.push(grid[this.i+1][this.j]);
    }
    if(i > 0){
      this.adj.push(grid[this.i-1][this.j]);
    }
    if(j < rows-1){
      this.adj.push(grid[this.i][this.j+1]);
    }
    if(j > 0){
      this.adj.push(grid[this.i][this.j-1]);
    }
  }
}

function popElement(arr, element){
  for(var i = arr.length-1; i>=0; i--){
    if (arr[i] == element){
      arr.splice(i,1);
      break;
    }
  }
}

//euclidean distance
function heuristic(a, b){
  //taxi-cab distance (absolute difference in x and y)
  var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}


function setup (){
  createCanvas (500, 500);
  w = width/ cols;
  h = height/ rows;

  //init grid
  for(var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }

  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = new Cell(i, j);
    }
  }

  //!temp add adjcent cells
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].calcAdj();
    }
  }

  //! Start and End cells
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;

  //init openSet
  openSet.push(start);
}

//animation loop
function draw(){
  background(0);

  //A* inner loop (while openSet is not empty)
  if(openSet.length > 0){

    var curr_index = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[curr_index].f){
        curr_index = i;
      }
    }

    var current = openSet[curr_index];

    if(current === end){
      //algorithm finishes successfully
      console.log("Done");
      document.getElementById("result").innerHTML = "PATH FOUND";
      document.getElementById("retry").style.opacity = 1;
      noLoop();
    }

    popElement(openSet, current);
    closedSet.push(current);

    // calculating f score
    var adj = current.adj;
    for(var i = 0; i < adj.length; i++){
      //update g if g not in closedSet
      if(!closedSet.includes(adj[i]) && !adj[i].wall){

        var newPath = false;
        //if adj[i] is already explored (g from prev iter exists)
        if(openSet.includes(adj[i])){
          //update g if g from prev iter is larger
          if((current.g + 1) < adj[i].g){
            adj.g = current.g + 1;
            newPath = true;
          }
        }

        //if g from prev iter does not exist (unexplored cell)
        else{
          adj[i].g = current.g + 1;
          openSet.push(adj[i]);
          newPath = true;
        }

        if(newPath){
          //calc heuristic
          adj[i].h = heuristic(adj[i], end);

          //calc f score (true dist g from start + heuristic dist h from end)
          adj[i].f = adj[i].g + adj[i].h;

          //trace path
          adj[i].prev = current;
        }

      }
    }
  }
  else{
    console.log("No Solution");
    run = false;
    document.getElementById("result").innerHTML = "NO SOLUTION";
    document.getElementById("retry").style.opacity = 1;
    noLoop();
    //no solution
  }

  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].show(color(32, 32, 32));
    }
  }

  for(var i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(14, 131, 136));
  }
  for(var i = 0; i < openSet.length; i++){
    openSet[i].show(color(134, 93, 255));
  }
  
  //no solution case
  if(!run){
    return;
  }

  //recursively path find
  var temp = current; //current == end
  path = [];
  path.push(temp);

  while(temp.prev){
    path.push(temp);
    temp = temp.prev;
  }

  for(var i = 0; i < path.length; i++){
    path[i].show(color(203, 228, 222));
  }

  end.show(color(0, 0, 255));
  start.show(color(0, 0, 255));
}

