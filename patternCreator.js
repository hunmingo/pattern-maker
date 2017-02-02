
var halfLength;

function drawPattern(data) {
  pack = d3.layout.pattern();
  halfLength = data.params.halfLength*1.15;

  d3.select("#pattern").selectAll("svg").remove();

//  var svg = d3.select("svg").attr("width","100%").attr("height",500);

  var svg = d3.select("#pattern").append("svg")
      .attr("width", w)
      .attr("height", 800);

  var g = svg.append("g");

  var unitTriDef = g.append("g")
      .attr("id", "unitTriangle")
      .attr("transform", "translate(" + 0 + "," + halfLength + ")");
      //.attr("transform", "translate(" + initSize + "," + initSize + ")");


  var nodes = pack.nodes(data);
  svg.selectAll("path").remove();

  unitTriDef.selectAll("path")
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

    g.append("g")
       .append("use")
       .attr("xlink:href","#unitTriangle")
       .attr("transform","rotate(60)");
    g.append("g")
      .append("use")
      .attr("xlink:href","#unitTriangle")
      .attr("transform","rotate(120)");
    g.append("g")
       .append("use")
       .attr("xlink:href","#unitTriangle")
       .attr("transform","rotate(180)");
    g.append("g")
        .append("use")
        .attr("xlink:href","#unitTriangle")
        .attr("transform","rotate(240)");
    g.append("g")
       .append("use")
       .attr("xlink:href","#unitTriangle")
       .attr("transform","rotate(300)");

/*
 svg.append("g")
     .append("use")
      .attr("xlink:href","#unitTriangle")
      //.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
      .attr("transform","rotate(45)");

      //.attr("transform","rotate("+angle*2+")");
*/
g.attr("transform", "translate(" + w/2 + "," + h/2 + ")");

//

}
