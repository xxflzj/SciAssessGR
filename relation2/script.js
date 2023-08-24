function linkColor(d, selectedColorMode) {
  switch (selectedColorMode) {
    case "static":
      return "#aaa";
    case "source-target":
      const sourceColor = d.source.color;
      const targetColor = d.target.color;
      return d3.interpolateRgb(sourceColor, targetColor)(0.5);
    case "source":
      return d.source.color;
    case "target":
      return d.target.color;
    default:
      return "#aaa";
  }
}

async function createSankeyChart() {
  const data = await getData();
  const linkColorSelect = document.getElementById("linkColor");
  
  // Specify the dimensions of the chart.
  const width = 928;
  const height = 2400;
  const format = d3.format(",.0f");

  // Create an SVG container.
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Constructs and configures a Sankey generator.
  const sankey = d3.sankey()
    .nodeId(d => d.name)
    .nodeAlign(d3.sankeyLeft)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 5], [width - 1, height - 5]]);

  // Applies it to the data. We make a copy of the nodes and links objects
  // so as to avoid mutating the original.
  const {nodes, links} = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // Defines a color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes.
  const rect = svg.append("g")
    .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.category));

  // Adds a title on the nodes.
  rect.append("title")
    .text(d => `${d.name}\n${format(d.value)} TWh`);

  // Creates the paths that represent the links.
  const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
      .style("mix-blend-mode", "multiply");

  link.append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", "black")
    .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)} TWh`);

  // Adds labels on the nodes.
  svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

  linkColorSelect.addEventListener("change", function () {
    const selectedColorMode = this.value;
    link.selectAll("path").attr("stroke", d => linkColor(d, selectedColorMode));
  });
  
  link.append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => linkColor(d, linkColorSelect.value))
    .attr("stroke-width", d => Math.max(1, d.width));
  document.getElementById('chart').appendChild(svg.node());
}

async function getData() {
  const links = await d3.csv("field_relation.csv");
  const nodes = Array.from(
    new Set(links.flatMap((l) => [l.source, l.target])),
    (name) => ({ name, category: name.replace(/ .*/, "") })
  );
  return { nodes, links };
}

createSankeyChart();
