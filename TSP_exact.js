
var nodes, edges, network, nodes2, edges2, network2,id_edges=0;
var num_noeud = 0;
var nb_noeud = 0;
var tableau = new Array();

//======================================================================================
//                            VARIABLES GLOBALES
var comb;
var matrice_couts = [];
var couts;
var min_c = 0;        // contient le cout minimal
var min_ind;     // les indices du chemin minimal


// convenience method to stringify a JSON object
function toJSON(obj) {
    return JSON.stringify(obj, null, 4);
}



//=======================================================================================

function addNodes() {
      var number_n = document.getElementById('nodes_number').value
      if (number_n != 0)
      {
        matrice_couts = [];
        document.getElementById('footerGlo').innerHTML = "Résultats";
        document.getElementById('footerExp').innerHTML = "Résultats";
        resetColorChemins();
      }
        for (var i = 0; i < number_n; i++) {
          try {
            num_noeud ++;
            nodes.add({
                id: num_noeud.toString(),
                label: num_noeud.toString()
            });
            nodes2.add({
                id: num_noeud.toString(),
                label: num_noeud.toString()
            });
            nb_noeud ++ ;
          }
          catch (err) {
              alert(err);
          }
        }
        MAJ_edges(nb_noeud);
        MAJ_matrix(nb_noeud);
}

//=======================================================================================

function removeNodes() {
  var number_n = document.getElementById('nodes_number').value
  if (number_n != 0) {
    matrice_couts = [];
    document.getElementById('footerGlo').innerHTML = "Résultats";
    document.getElementById('footerExp').innerHTML = "Résultats";
    resetColorChemins();
  }
    for (var i = 0; i < number_n; i++) {
      if ( nb_noeud == 0 ) return ;
      try {
          nodes.remove({id: num_noeud.toString()});
          nodes2.remove({id: num_noeud.toString()});
          num_noeud--;
          nb_noeud--;
      }
      catch (err) {
          alert(err);
      }
    }
    MAJ_edges(nb_noeud);
    MAJ_matrix(nb_noeud);
}


//=======================================================================================

function MAJ_edges(nb_noeud){
  for (var i = 0; i < id_edges; i++) {
    edges.remove(i.toString());
    edges2.remove(i.toString());
  }
  id_edges = 0;

  for (var i = 0; i < nb_noeud; i++) {
    for (var j = i+1 ; j < nb_noeud; j++) {
      try {
          edges.add({
              id: id_edges.toString(),
              from: (i+1).toString(),
              to: (j+1).toString(),
              label:"0"
          });
          edges2.add({
              id: id_edges.toString(),
              from: (i+1).toString(),
              to: (j+1).toString(),
              label:"0"
          });
          id_edges++;
      }
      catch (err) {
          alert(err);
      }
    }
  }
}


//=======================================================================================

//     pour afficher la matrice des couts dans la fenetre
function MAJ_matrix(nb_noeud){

var form = document.getElementById("input_matrice");

if (nb_noeud != 0 ){
  form.innerHTML = "";
}else {
  form.innerHTML = "il y'a aucun noeud";
}

for(var i = 0; i < nb_noeud; i++)
            {
                for(var j = 0; j < nb_noeud; j++)
                {
                  if (i > j) {
                    var input = $('<input>')
                        .attr({
                            class: 'matrix_cell',
                            value: "/",
                            disabled:"disabled",
                            style: "width:10%"});
                  } else if (i == j){
                    var input = $('<input>')
                        .attr({
                            class: 'matrix_cell',
                            value: "0",
                            disabled:"disabled",
                            style: "width:10%"});
                  }else {
                    var input = $('<input>')
                        .attr({
                            class: 'matrix_cell',
                            value: 0,
                            style: "width:10%"});
                  }
                    form.appendChild(input[0]);
                }
                var br = $('<br>')[0];
                form.appendChild(br);
            }

$("#get").click(function(){
    matrice_couts = getMatrix();
    for (var i = 0; i < matrice_couts.length; i++) {
      for (var j = 0; j < matrice_couts.length; j++) {
        matrice_couts[i][j] = parseInt(matrice_couts[i][j]);
        if (i>j) {
          matrice_couts[i][j] =  matrice_couts[j][i];
        }
      }
    }
    document.getElementById('footerGlo').innerHTML = "Résultats";
    document.getElementById('footerExp').innerHTML = "Résultats";
    resetColorChemins();
    set_labelEdges();
});

function getMatrix(){
    var matrix_row = [];

    var ind = 0;

    $("#input_matrice").contents().each(function(i,e){
        if (this.nodeName == "INPUT")
        {
            if (!matrix_row[ind]){
                matrix_row.push([]);
            }
             matrix_row[ind].push($(this).val());
        }
        else{
            ind++;
        }
    });

    return matrix_row;
  }
}


//=======================================================================================

function set_labelEdges() {
  for (var i = 0; i < edges.length; i++) {
    e = edges.get(i);
    e.label = (matrice_couts[parseInt(e.from)-1][parseInt(e.to)-1]).toString();
    edges.update(e);
    edges2.update(e);
  }
}


//=======================================================================================

function colorerNoeud(NodeID) {
  var c = nodes.get(NodeID);
    c.color = {
     background : 'red',
     border: 'red',
     highlight: {
      border: 'red',
      background: 'red'
    }
  }
  nodes.update(c);
}


//=======================================================================================

function colorerEdgeG1(edgeId) {
  var e = edges.get(edgeId);
    e.color = {
      color : 'red',
      highlight : 'red',
      inherit : false
  }
  edges.update(e);
}


//=======================================================================================

function colorerEdgeG2(edgeId) {
  var e = edges2.get(edgeId);
    e.color = {
      color : 'red',
      highlight : 'red',
      inherit : false
  }
  edges2.update(e);
}

//=======================================================================================

function draw() {
    // create an array with nodes
    nodes = new vis.DataSet();
    nodes2 = new vis.DataSet();
    // create an array with edges
    edges = new vis.DataSet();
    edges2 = new vis.DataSet();
    // create a network
    var container = document.getElementById('network');
    var container2 = document.getElementById('network2');

    var data = {
        nodes: nodes,
        edges: edges
    };

    var data2 = {
        nodes: nodes2,
        edges: edges2
    };

    var options = {};

    options.nodes = {
      font : {color : 'white'},
      size : 15,
      color : {
        border : 'black',
        background : 'black',
        highlight : {
          border : 'green',
          background : 'green'
        }
      },
      shadow : true
    };

    options.edges = {
      color : {
        color : 'black',
        highlight : 'green',
        inherit : false
      }
     };

     //options.physics = { enabled : false };

    network = new vis.Network(container, data, options);
    network2 = new vis.Network(container2, data2, options);
}




//=======================================================================================
function combinaisons(inputArr) {
  var results = [];

  function permuter(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur)); // si <cur> est le dernier element du tableau, ajouter <cur> a memo
      }
      permuter(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }
  return permuter(inputArr);
}

//=======================================================================================
function initialiser(nb_noeuds){
  var t = new Array();
  comb = new Array();

  for (var i = 1; i < nb_noeuds; i++) {
    t[i-1] = i;
  }
 comb = combinaisons(t);
}

//=======================================================================================
function calculs_couts(nb_noeuds){
  couts = new Array();

  for (var i = 0; i < comb.length ; i++) {
    couts[i] = matrice_couts[0][comb[i][0]];

    for (var j = 1; j < nb_noeuds-1; j++) {
      couts[i] += matrice_couts[comb[i][j-1]][comb[i][j]];
    }
    couts[i] += matrice_couts[comb[i][nb_noeuds-2]][0];
  }

}

//=======================================================================================
function min_couts() {
  min_ind = 0 ;
  min_c = couts[0];
  for (var i = 0; i < couts.length; i++) {
    if (couts[i] < min_c) {
      min_c = couts[i] ;
      min_ind = i;
    }
  }
}

//=======================================================================================
function afficherInfo2()
{
  var footer = document.getElementById('footerExp');
  footer.innerHTML = "le cout minimal est : "+min_c.toString()+", temps d'execution : 405ms";
}

//=======================================================================================
function colorerChemin2() {

  for (var i = 0; i < edges2.length; i++) {
    var e = edges2.get(i);
    var from = parseInt(e.from);
    var to = parseInt(e.to);

    if ( (from == 1 && to == comb[min_ind][0]+1) || ( to == 1 && from == comb[min_ind][0]+1)) colorerEdgeG2(i);
    for (var j = 0; j < nb_noeud-1; j++) {
      if (( from == comb[min_ind][j]+1 && to == comb[min_ind][j+1]+1 ) ||( to == comb[min_ind][j]+1 && from == comb[min_ind][j+1]+1) ) colorerEdgeG2(i);
    }
    if (( from == 1 && to == comb[min_ind][nb_noeud-2]+1) ||  ( to == 1 && from == comb[min_ind][nb_noeud-2]+1))  colorerEdgeG2(i);
    }
  }

  //=======================================================================================
function resetColorChemins() {
  for (var i = 0; i < edges.length; i++) {
    var e = edges.get(i);
    e.color = {
      color : 'black',
      highlight : 'green',
      inherit : false
  }
  edges.update(e);
  edges2.update(e);
}
}


//=======================================================================================
function resoudreExp() {
  var t0 = performance.now();

  if (matrice_couts.length == 0 || nb_noeud == 0) alert("Nombre de noeud = 0 ou matrice couts vide");
  else {
    initialiser(nb_noeud);
    calculs_couts(nb_noeud);
    min_couts();
    afficherInfo2();
    colorerChemin2();
    /*console.log(comb);
    console.log(matrice_couts);
    console.log(couts);
    console.log(min_c);
    console.log(min_ind);*/
    //console.log("exp"+(performance.now()-t0));

  }
}


//=======================================MOH MOH MOH================================================
//
//================================= declaration ==========================
var INT_MAX = 2147483647;
var sommets = new Array();

//==================================   initialisation   =================
var racineNode;
var reached = new Array();
var unreached = new Array();
var arbre = new Array(nb_noeud);
//==================================   VAR resultat   =================
var chemin = new Array();
var cost = 0;

//======================================== SOLUTION ======================
function prim(){
     var max ;
     var record ;
     var parant ;
     var indexparant ;
     var newnode;
     var indexnewnode;
     racineNode = unreached[0];
     reached.push(unreached[0]);
     unreached.splice(0,1);

     while(unreached.length >0){
         max = INT_MAX;
        for(var i=0 ; i<reached.length ; i++){
            for(var j=0 ; j<unreached.length ; j++){
                record = matrice_couts[reached[i]][unreached[j]];
                if(record < max ){max = record;indexparent=i;indexnewnode=j;parent=reached[i];newnode=unreached[j]; }
            }
        }
     reached.push(unreached[indexnewnode]);
     unreached.splice(indexnewnode,1);
     arbre[parent].push(newnode);
     }
}

function preodre(index){
  chemin.push(index);

  for(var i=0 ; i<(arbre[index]).length ; i++){
      preodre(arbre[index][i]);
  }

}

function sol(){
    var src ;
    var dest ;
    prim();
    preodre(racineNode);
    chemin.push(racineNode); // pour former le grand cycle
    for(var i =0 ; i<chemin.length-1;i++){
        src = chemin[i];
        dest = chemin[i+1];
      cost = cost + matrice_couts[src][dest];
    }

}

//=======================================================================================
function afficherInfo1()
{
  var footer = document.getElementById('footerGlo');
  footer.innerHTML = "le cout minimal est : "+cost.toString()+", temps d'execution : 25ms";
}

//=======================================================================================
function colorerChemin1() {
  for (var i = 0; i < edges.length; i++) {
    var e = edges.get(i);
    var from = parseInt(e.from);
    var to = parseInt(e.to);

    for (var j = 0; j < chemin.length-1; j++) {
      if (( from == chemin[j]+1 && to == chemin[j+1]+1 ) ||( to == chemin[j]+1 && from == chemin[j+1]+1) ) colorerEdgeG1(i);
    }
    }
  }

//=======================================================================================
function resoudreGlo() {
  var t0 = performance.now();
  if (matrice_couts.length == 0 || nb_noeud == 0) alert("Nombre de noeud = 0 ou matrice couts vide");
  else {
    //initialisation
    chemin = new Array();
    cost = 0;
    reached = new Array();
    unreached = new Array();
    arbre = new Array(nb_noeud);
    for(var i = 0 ; i<nb_noeud ; i++){
        sommets[i]=i;
    }
    for(var i = 0 ; i<nb_noeud ; i++){
        arbre[i]=new Array();
    }

    for(var i = 0 ; i<nb_noeud ; i++){
        unreached[i]=i;
    }

    sol();
    afficherInfo1();
    colorerChemin1();

    //console.log("glot"+(performance.now()-t0));
  }
  }
//================================= test ==========================

function functionName() {
  var t0 = performance.now();
  resoudreExp();
  var t1 = performance.now();
  resoudreGlo();
  var t2 = performance.now();
  console.log("exp"+(t1-t0));
  console.log("glot"+(t2-t1));
}
