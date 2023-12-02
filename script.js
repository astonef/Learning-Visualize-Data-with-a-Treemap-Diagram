let url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
let movieData;
let canvas = d3.select('#canvas');
let tooltip = d3.select("#tooltip"); 

let drawTreeMap = () => {
    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node['children'];
    }).sum((node) => {
        return node['value'];
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']; 
    });

    let createTreeMap = d3.treemap()
        .size([1500, 600]);

    createTreeMap(hierarchy);

    let movieTiles = hierarchy.leaves();

    let piece = canvas.selectAll('g')
        .data(movieTiles)
        .enter()
        .append('g')
        .attr("transform", (movie) => { 
            return 'translate(' + movie['x0'] + ',' + movie['y0'] + ')';
        });

    piece.append('rect')
        .attr("class", "tile")
        .attr("fill", (movie) => { 
            let category = movie['data']['category'];
            if (category === "Action") {
                return "red";
            } else if (category === 'Drama') {
                return "purple";
            } else if (category === 'Adventure') {
                return "green";
            } else if (category === 'Comedy') {
                return "yellow";
            } else if (category === "Biography") {
                return 'grey';
            } else if (category === 'Animation') {
                return "Orange";
            } else {
                return "Steelblue";
            }
        }).attr("data-name", (movie) => { 
            return movie['data']["name"];
        }).attr("data-category", (movie) => { 
            return movie['data']["category"];
        }).attr("data-value", (movie) => { 
            return movie['data']["value"];
        }).attr("width", (movie) => { 
            return movie['x1'] - movie['x0'];
        }).attr("height", (movie) => { 
            return movie['y1'] - movie['y0'];
        });
    
    piece.append("text")
        .text((movie) => {
            return movie['data']['name'];
        }).attr('x', 5)
          .attr('y', 20)
          .on("mouseover", (movie) => { 
            tooltip.transition()
                   .style("visibility", "visible");
            tooltip.text(() => {
                return movie['data']['name'] + ' || ' + movie['data']['category'] + ' || ' + movie['data']['value'];
            });
            tooltip.attr("data-value", () => {
                return movie['data']['value'];
            });
          })
          .on("mouseout", () => {
            tooltip.transition()
                   .style("visibility", "hidden");
          });
};

d3.json(url).then(
    (data, error) => {
        if (error) {
            console.log(error);
        } else {
            movieData = data;
            drawTreeMap(); 
            console.log(movieData);
        }
    }
);