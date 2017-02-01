function drawPattern(data) {
  pack = d3.layout.pattern();
  d3.select("#pattern").selectAll("svg").remove();

//  var svg = d3.select("svg").attr("width","100%").attr("height",500);

  var svg = d3.select("#pattern").append("svg")
      .attr("width", w)
      .attr("height", h);

  var unitTriDef = svg.append("g")
      .attr("id", "unitTriangle")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");


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

  svg.append("g")
		   .append("use")
       .attr("xlink:href","#unitTriangle")
       .attr("transform","rotate(180)")
}
