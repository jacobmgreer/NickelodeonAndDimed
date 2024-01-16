//original script lovingly created by https://justvalerian.com/mouseovermap.html

//initialize variables
let width = 900,
    height = 600;
let outline = ({type: "Sphere"});
let graticule = d3.geoGraticule10();
let projection, path, countries;
let importPath = 'https://jacobmgreer.github.io/NickelodeonAndDimed/Geographies/submission.stats.geojson';

function mapInit(data) {
    projection = d3.geoPolyhedralCollignon()
        .fitExtent([[0, 0], [width, height]], outline);
    path = d3.geoPath(projection);
    let svg = d3.select('div[id=d3map]')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    //tooltip parameters and mouseover behaviour
    let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")

    let mouseover = function(event, d) {
        // d3.select(this).style('fill', '#0FF2B2');
        tooltip
            .style("opacity", 1)
            .text(d.properties['NAME_LONG'] + ": " + d.properties['Total'] + " submissions");
    }
    let mousemove = function(event) {
        tooltip
            .style("left", (event.pageX + 20) + 'px')
            .style("top", (event.pageY - 20) + 'px');
    }
    let mouseout = function() {
        // d3.select(this).style('fill', '#8C8C8C');
        tooltip
            .style("opacity", 0);
    }

    //definitions for reusable parts
    const defs = svg.append("defs");
    defs.append("path")
        .attr("id", "outline")
        .attr("d", path(outline));
    defs.append("clipPath")
        .attr("id", "clip")
        .append("use")
        .attr("href", "#outline");
    const g = svg.append("g")
        .attr("clip-path", `url("#clip")`);

    //colors background of map (ocean)
    g.append("use")
        .attr("href", "#outline")
        .attr("fill", "#F2F2F2");

    //draws graticule (lines)
    g.append("path")
        .attr("d", path(graticule))
        .attr("stroke", "#BFBFBF")
        .attr("fill", "none");

    //draws clickable countries
    g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr("stroke-width", "0.2")
        .style('stroke', '#403E3F')
        .style("fill", function(d) {
            if(parseInt(d.properties['Total']) >= 60) {
                return "#D95323"; }
            else if (parseInt(d.properties['Total']) >= 45) {
                return "#F2CC0C"; }
            else if (parseInt(d.properties['Total']) >= 30) {
                return "#8BBF1B"; }
            else if (parseInt(d.properties['Total']) >= 15) {
                return "#3DADF2"; }
            else if (parseInt(d.properties['Total']) >= 1) {
                return "#417CF2"; }
            else { return "#F2F2F2"; }
        })

    //tooltip mouseOver handling
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)
    //draws outline around map
    svg.append("use")
        .attr("href", "#outline")
        .attr("stroke-width", "3")
        .attr("stroke", "#0D0D0D")
        .attr("fill", "none");

    return svg.node();
}

async function mapExecution(imp) {
    let countries = await d3.json(imp);
    mapInit(countries);
}

let map = mapExecution(importPath);
