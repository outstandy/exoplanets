document.addEventListener("DOMContentLoaded", function(){

  const body = document.querySelector("body");
  const exoplanets = d3.select(".exoplanets");
  const exoplanetDefs = exoplanets.append("defs");
  const exoplanetFilter = exoplanetDefs.append("filter").attr("id", "dropshadow")
  const exoplanetGaussianBlur = exoplanetFilter.append("feGaussianBlur") .attr("in","SourceGraphic").attr( "stdDeviation", 1 ).attr( "result", "blur");
  const exoplanetOffset = exoplanetFilter.append("feOffset") .attr("in","blur").attr("dx", 0 ).attr("dy", 0 ).attr( "result", "offsetBlur");
  const exoplanetMerge = exoplanetFilter.append("feMerge");
  const exoplanetMergeNode1= exoplanetMerge.append("feMergeNode").attr("in", "offsetBlur");
  const exoplanetMergeNode2= exoplanetMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const spaceWidth = body.scrollWidth/2;
  const spaceHeight = body.scrollHeight/2;

  const earth = function(){
    exoplanets
              .append("path")
              .attr("class", "exoplanets__earth")
              .attr("transform", "translate(" + spaceWidth + "," + spaceHeight + ")")
              .attr("d", d3.symbol())
              .attr("filter", "url(#dropshadow)")
  };

  const newGroup = data => exoplanets
                                    .selectAll("g")
                                    .data(data)
                                    .enter()
                                    .append("g")
                                    .attr("class", "exoplanets__group")
                                    .attr("transform", d => `translate( ${spaceWidth} , ${spaceHeight - d.planet_dist})rotate(${Math.random()*360} ${d.planet_dist} ${d.planet_dist})`)

  const newPlanet = () => exoplanets
                                    .selectAll("g")
                                    .append("path")
                                    // .style("filter", "drop-shadow(0px 0px 10px blue)")
                                    .attr("class", d => d.planet_mass == "" ? "exoplanets__planet--no-mass" : "exoplanets__planet")
                                    .attr("d", d3.symbol().size(d => d.planet_mass == "" ? 10 : 10 * d.planet_mass))
                                    .attr("transform", d => `translate(0,${d.orbit_length/2})`)
                                    .attr("filter", "url(#dropshadow)")

  const newOrbit = () => exoplanets
                                    .selectAll("g")
                                    .append("path")
                                    .attr("class", "exoplanets__orbit")
                                    .attr("d", d3.symbol().size(d => d.orbit_length * 1000));


  const render = d3.csv("./js/exoplanets.csv", function(data){
    newGroup(data);
    newOrbit();
    newPlanet();
    earth();
    const planets = [...document.getElementsByClassName("exoplanets__planet")]

    planets.forEach(planet => planet.addEventListener("mouseenter", () => planet.previousElementSibling.classList.add("exoplanets__orbit--show")));
    planets.forEach(planet => planet.addEventListener("mouseleave", () => planet.previousElementSibling.classList.remove("exoplanets__orbit--show")));

  });


});
