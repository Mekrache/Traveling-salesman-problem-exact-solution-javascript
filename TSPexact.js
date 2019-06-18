//======================================================================================
var comb;
var matrix_costs = [ [0,4,2,1,3],
                      [4,0,7,3,1],
                      [2,7,0,3,0],
                      [1,3,3,0,4],
                      [3,1,0,4,0]
                    ];
var nbNodes = 5;
var costs;
var minCost = 0;        
var indMinCost;    

//======================================================================================
function combinations(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur)); 
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }
  return permute(inputArr);
}

//=======================================================================================
function initialize(nbN){
  var t = new Array();
  comb = new Array();

  for (var i = 1; i < nbN; i++) {
    t[i-1] = i;
  }
 comb = combinations(t);
}

//=======================================================================================
function calculateCosts(nbN){
  costs = new Array();

  for (var i = 0; i < comb.length ; i++) {
    costs[i] = matrix_costs[0][comb[i][0]];

    for (var j = 1; j < nbN-1; j++) {
      costs[i] += matrix_costs[comb[i][j-1]][comb[i][j]];
    }
    costs[i] += matrix_costs[comb[i][nbN-2]][0];
  }
}

//=======================================================================================
function minCosts() {
  indMinCost = 0 ;
  minCost = costs[0];
  for (var i = 0; i < costs.length; i++) {
    if (costs[i] < minCost) {
      minCost = costs[i] ;
      indMinCost = i;
    }
  }
}

//=======================================================================================
function resolveExponential() {
  var t0 = performance.now();

  if (matrix_costs.length == 0 || nbNodes == 0) alert("number nodes = 0, or matrix_costs empty");
  else {
    initialize(nbNodes);
    calculateCosts(nbNodes);
    minCosts();
    console.log(minCost);
    console.log(indMinCost);
    console.log("exp"+(performance.now()-t0));
  }
}

resolveExponential();