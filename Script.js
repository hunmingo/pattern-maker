
var cos30 = 0.866,
    tan6030 = 1.1547,
    w = 800,
    h = 600,
    //layerIdx = 0,
    layerPanelWidth,
    initSize = 180,
    dSize = 20,
    node,

    colors = d3.scale.category20();


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var palette, layerPanel, sliderInput, pack, vis;

var shapeTemplate=[
  {
    "type": "triangle",
    "params":{"halfLength": 45},
    "height" : 65,
    "increment": 1
  },{
    "type": "chevron",
    "params":{
      "halfLength": 100,
      "halfWidth": 30
    },
    "height" : 75
  },{
    "type": "tripod",
    "params":{
      "halfLength": 75,
      "halfWidth": 15
    },
    "height" : 50
  },{
    "type": "ring",
    "params":{
      "outerR": 45,
      "innerR": 25,
    },
    "height": 50
  },{
    "type": "flower",
    "params":{
      "petals": 5,
      "rPetal": 15,
      "halfRadius" : 25,
      "angle": -18
    },
    "height" : 50
  }

];

var parsers = {
    triangle: equiTriPath,
    chevron: chevronPath,
    tripod: tripodPath,
    ring: ringPath,
    flower: petalPath
  };

function drawCanvas(data) {
  var nodes = pack.nodes(data);
  vis.selectAll("path").remove();

  vis.selectAll("path")
      .data(nodes)
      .enter().append("path")
         .attr("d", function(d){ return parsers[d.type](d.params).result;})
         .attr("stroke-width", 2)
         .attr("fill", function(d, i){ return d.params.color; })
         .attr('transform',function(d, i){
           var angle = 0;
           if(d.params.angle)
             angle = d.params.angle;
           return 'rotate('+ angle +')';});

}



function drawLayerPanel(data){

  // d3.select("#layerPanel").selectAll("div").remove();

  var nodes = pack.nodes(data);
   d3.select("#layerPanel").selectAll("div.layer").remove();

  var div = d3.select("#layerPanel").selectAll("div.layer")
    .data(nodes).enter().append("div").classed("layer", true);

  var svg = div.append("svg");

  var deleteLayer = div.append("a")
                  .attr("href", "javascript:void(0);")
                  .text("X")
                  .classed("deleteLayer",true)
                  .on("click", function(d){
                    deleteThisLayer(d.id);
                    drawCanvas($.extend(true, {}, node));//deep copy
                    drawLayerPanel($.extend(true, {}, node));
                  });

  var userInputs = div.selectAll("div")
                  .data(function(d){
                    var result = [];
                    for (var p in d.params){
                      var r = { keyName: p, value: d.params[p], id: d.id };
                      result.push(r);
                    }
                    return result;
                  })
                  .enter().append("div").classed("userInputs", true);

    userInputs.append("span")
      .text(function(d){return d.keyName})


    userInputs.append("input").attr("type", function(d){
        if(d.keyName === "color"){ return "color";}
        else { return "range";}})
      .attr("min", "1")
      .attr("max", "150")
      .attr("value", function (d){ return d.value; })
      .on("input", function(d){
        changeValue(d.id, d.keyName, d.keyName === "color" ? d3.select(this)[0][0].value : Number(d3.select(this)[0][0].value));
        drawCanvas($.extend(true, {}, node));
        drawLayerPanel($.extend(true, {}, node));
      });

      userInputs.append("input").attr("type", "form")
      .attr("size", 7)
      .attr("value", function (d){ return d.value; })
      .on("change", function(d){
        changeValue(d.id, d.keyName, d.keyName === "color" ? d3.select(this)[0][0].value : Number(d3.select(this)[0][0].value));
        drawCanvas($.extend(true, {}, node));
        drawLayerPanel($.extend(true, {}, node));
      });




  var g = svg.attr("width", 200).attr("height", 150).append("g");

  g.append("path")
   .attr("d", function(d){ return parsers[d.type](d.params).result;})
   .attr("stroke-width", 2)
   .attr("fill",function(d, i){  return d.params.color; })
   .attr('transform',function(d, i){
     var angle = 0;
     if(d.params.angle){
       angle = d.params.angle;
     }
     return 'translate('+80+','+100+') scale(0.4) rotate('+ angle +')';
   });

  d3.selectAll("#layerPanel").selectAll("div").selectAll("path")
    .data(function(d){ return [d]; })
    .attr("fill",function(d, i){
      return d.params.color ? d.params.color : colors(i);
    });

   $( "#layerPanel" ).sortable({
     revert: true,
     update: function(event, ui) {
       var layerIdxArray = [];
       var changedIdx = 0;
       var arrayObj;
       var id, depth, childrenIdx, parentId;
       $( ".layer").each( function(index, item){
         if(item.__data__.children){
           childrenIdx = item.__data__.children.length;
         }else {
           childrenIdx = null;
         };
         if(item.__data__.parent){
           parentId = item.__data__.parent.id;
         }else {
           parentId = null;
         };
         depth = item.__data__.depth;
         id = item.__data__.id;
         arrayObj = {changedIdx, id, depth, childrenIdx, parentId}

         layerIdxArray.push(arrayObj);
         changedIdx++;
       });
       layerIdxArray.shift();

       node = changeOrder(layerIdxArray, $.extend(true, {}, node));
       drawCanvas($.extend(true, {}, node));

     }
   });
}
function changeOrder(layerIdxArray, nodeP){
  function changeOrderRecurse(children, nodeID) {
    var newChildren = [];

    for( var i = 0; i < layerIdxArray.length ; i++){
      if(layerIdxArray[i].parentId === nodeID){
        for(var j = 0; j < children.length; j++){
          if(layerIdxArray[i].id === children[j].id){
            newChildren.push(children[j])
          }
        }
      }
    }

    children.length = 0;
    for (var l = 0; l < newChildren.length; l++) {
        children.push(newChildren[l]);
    }
  }
    // 부모 아이디를 찾는다 = nodeID
    // nodeID와 일치하는 layerIdxArray의 오브젝트들을 추출한다.
    // 그 layerIdxArray의 changedIdx 의 순서대로 children을 새로 만들어서 저장한다.



    // for (var j = 0; j < children.length; j++){
    //   var child = children[j];
    //   console.log(child);
    //
    //   if (child.children) {
    //     changeOrderRecurse(child.children, child.id);
    //   }
    // }

  changeOrderRecurse(nodeP.children, nodeP.id);
  return nodeP;
}

/*
function childrenRecurse(array){
  for(el in array){
    debugger;
    if(el.children){
      console.log("yes");
      childrenRecurse(el.children)
    }
    else {
      console.log(el.depth);
      return el.depth;
    }
  }
}*/

function deleteThisLayer(id){
  function deleteLayerRecurse(children) {
    var found = false;
    for (var j = 0; j < children.length; j++){
      if (children[j].id == id) {
        children.splice(j,1);
        found = true;
      }
    }
    if (!found) {
      for (var j = 0; j < children.length; j++){
        deleteLayerRecurse(children[j]);
      }
    }
  }

  if (id !== node.id) {
    deleteLayerRecurse(node.children);
  }
}

function changeValue(id, key, value){
  function changeValueRecurse(children) {
    var found = false;
    for (var j = 0; j < children.length; j++){
      if (children[j].id == id) {
        children[j].params[key] = value;
        found = true;
      }
    }
    if (!found) {
      for (var j = 0; j < children.length; j++){
        changeValueRecurse(children[j]);
      }
    }
  }

  if (id == node.id) {
    node.params[key] = value;
  } else {
    changeValueRecurse(node.children);
  }
}


function drawPalette(data) {
  palette.selectAll("prim")
      .data(data)
      .enter().append("path")
        .attr("class", function(d){ return "prim"})
        .attr("type", function(d,i){ return d.type})
        .attr("id", function(d,i){ return i})
        .attr("d", function(d){
          return parsers[d.type](d.params).result;})
        .attr("stroke-width", 2)
        .attr("fill", "white")
        .attr('transform',function(d, i){
          var angle = 0;
          if(d.params.angle)
            angle = d.params.angle;
          return 'translate('+(75+150*i)+','+d.height+') rotate('+ angle +')';})
        .on("mouseover", function(d){
          var p = d3.select(this);
          p.attr("fill", "red")
        })
        .on("mouseout", function(d){
          var p = d3.select(this);
          p.attr("fill", "white")
        })
        .on("click", function(d){
          var objType = $(this).attr('type');
          var child = returnShapeParam(objType, initSize);
          child.id = guid();
          node.children.push(child);
          initSize -= dSize;
          drawCanvas($.extend(true, {}, node));
          drawLayerPanel($.extend(true, {}, node));

        });
};

$(document).ready(function(main) {
  //
  // layerPanelStyle = window.getComputedStyle(document.getElementById('layerPanel')),
  // layerPanelWidth = layerPanelStyle.getPropertyValue('width'),

  layerPanelWidth = $(".layer").width();
  layerPanelHeight = $(".layer").height();


  palette =
    d3.select("#palette").append("svg")
      .attr("width", w)
      .attr("height", 100)
      .append("g")

  layerPanel =
    d3.select(".layer").append("svg")
      .attr("width", layerPanelWidth)
      .attr("height", h)
      .append("g")


  pack = d3.layout.pattern();

  vis = d3.select("#chart").append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  d3.json("pattern.json", loadComplete);
  drawPalette(shapeTemplate);

});

function loadComplete(patternData){
  node = patternData;
  node.id = guid();
  drawCanvas($.extend(true, {}, patternData));
  drawLayerPanel($.extend(true, {}, patternData));
}

var uniqueIdx = 1;

function returnShapeParam(type, size){

  switch (type) {
    case "triangle":
      uniqueIdx++;
      return {
                "type": "triangle",
                "params":{
                  "color": colors(uniqueIdx),
                  "halfLength": size
                }
              }
      break;

    case "chevron":
      uniqueIdx++;
      return {
                "type": "chevron",
                "params":{
                  "color": colors(uniqueIdx),
                  "halfLength": size,
                  "halfWidth": 30
                }
              }

      break;

    case "tripod":
      uniqueIdx++;
      return {
                "type": "tripod",
                "params":{
                  "color": colors(uniqueIdx),
                  "halfLength": size,
                  "halfWidth": 15
                }
              }
      break;

    case "ring":
      uniqueIdx++;
      return {
                "type": "ring",
                "params":{
                  "color": colors(uniqueIdx),
                  "outerR": size/2,
                  "innerR": size/2-20
                }
              }
      break;

    case "flower":
      uniqueIdx++;
      return {
                "type": "flower",
                "params":{
                  "color": colors(uniqueIdx),
                  "petals": 5,
                  "rPetal": size/10,
                  "halfRadius" : size/4,
                  "angle": -18
                }
              }
      break;
    default:

  }

}
