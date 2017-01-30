function drawPattern(data) {
  pack = d3.layout.pattern();
  d3.select("#pattern").selectAll("svg").remove();

  patternVis = d3.select("#pattern").append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");


  var nodes = pack.nodes(data);
  patternVis.selectAll("path").remove();

  patternVis.selectAll("path")
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
