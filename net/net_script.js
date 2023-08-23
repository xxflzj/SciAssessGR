async function main() {
  const data = await d3.csv("net.csv", d3.autoType);
  const width = window.innerWidth;
  const height = window.innerHeight-40;

  const svg = d3.select("#chart")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  initChartStyle(svg);
  const {nodes, links, types} = processData(data);
  renderGraph(svg, nodes, links, types, width, height);
}

function initChartStyle(svg) {
  svg.attr("width", "100%")
    .attr("height", "100%")
    .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");
}

function processData(data) {
  const types = Array.from(new Set(data.map(d => d.type)));
  const nodes = Array.from(
    new Set(data.flatMap(l => [l.source, l.target])),
    id => {
	  const nodeData = data.find(d => d.source === id) || data.find(d => d.target === id);
      const score = isSource(id) ? 15 : nodeData.value;
      return { id, score };
    }
  );
  const links = data.map(d => Object.create(d));
  console.log(nodes);
  return { nodes, links, types };
}

function renderGraph(svg, nodes, links, types, width, height) {
 
  const simulation = initSimulation(nodes, links, width, height);
  const link = renderLinks(svg, links, types);
  const node = renderNodes(svg, nodes, simulation);

  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr("transform", d => `translate(${d.x},${d.y})`);
  });
}

function initSimulation(nodes, links, width, height) {
  return d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(120).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-40))
    .force("x", d3.forceX().x(0))
    .force("y", d3.forceY().y(0))
    .force("boundary", boundaryForce(-width / 2 + 20, -height / 2 + 20, width / 2 - 20, height / 2 - 20, 10)); // 添加边界斥力
}

function boundaryForce(x1, y1, x2, y2, sourceBoundaryMargin) {
  function force(d) {
    let margin = isSource(d.id) ? sourceBoundaryMargin : 20; // 源节点边界间距
    d.x = Math.max(x1 + margin, Math.min(x2 - margin, d.x));
    d.y = Math.max(y1 + margin, Math.min(y2 - margin, d.y));
  }

  force.initialize = function (_) {
    return;
  };

  return force;
}

function renderLinks(svg, links, types) {
  const color = d3.scaleOrdinal(types, d3.schemeCategory10);

  return svg.append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", d => color(d.type))
    .attr("stroke-width", d => Math.sqrt(d.score));
}

function renderNodes(svg, nodes, simulation) {
  const node = svg.append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation));

  // Customize the shape and color of nodes
  node.append("path")
    .attr("d", d => (isSource(d.id) ? sourceNodeShape() : dandelionShape(d.score)))
    .attr("fill", d => (isSource(d.id) ? "currentColor" : "white"))
    .attr("stroke", d => (isSource(d.id) ? "white" : "black"));

  const textLabel = appendTextLabel(node);
  setNodeInteraction(node, textLabel);

  return node;
}

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

function linkArc(d) {
  const angle = getLinkAngle(d);
  const radius = Math.sqrt((d.source.x - d.target.x) ** 2 + (d.source.y - d.target.y) ** 2);
  const sourceX = d.source.x + Math.cos(angle) * (radius + 10);
  const sourceY = d.source.y + Math.sin(angle) * (radius + 10);
  const targetX = d.target.x - Math.cos(angle) * (radius + 10);
  const targetY = d.target.y - Math.sin(angle) * (radius + 10);
  return `M${sourceX},${sourceY}L${targetX},${targetY}`;
}

function dandelionShape(score) {
  const n = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
  const angle = Math.PI * 2 / n;
//  const radius = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
  const radius = Math.floor(score / 1.5) + 3;

  return "M0,0" + 
    Array.from({ length: n }).map((d, i) => {
      const x = Math.cos(i * angle) * radius;
      const y = Math.sin(i * angle) * radius;
      return `L${x},${y}`;
    }).join("") +
    "Z";
}

function appendTextLabel(node) {
  return node.append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .style("display", (d, i) => isSource(d.id) ? "block" : "none")
    .attr("stroke", "white")
    .attr("stroke-width", 0.02)
    .text(d => d.id)
    .clone(true).lower()
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 3);
}

function setNodeInteraction(node, textLabel) {
node.on("mouseover", function (d) {
const nodeId = d3.select(this).datum().id; // 获取数据对象id
// console.log(nodeId);
if (!isSource(nodeId)) {
const randomColor = getRandomColor();
const hoverLabel = d3.select(this)
.append("text")
.attr("class", "hover-label")
.attr("x", 8)
.attr("y", "0.31em")
.style("display", "block")
.attr("fill", "white")
.attr("font-size", "25px")
.attr("stroke", randomColor)
.attr("stroke-width", 0.8)
.text(d => d.id);
}
})
.on("mouseout", function (d) {
d3.select(this).selectAll(".hover-label").remove();
});
}



function isSource(id) {
  const source = [
    'Built Environment & Design', 'Clinical Medicine',
    'Information & Communication Technologies', 'Physics & Astronomy',
    'Enabling & Strategic Technologies', 'Economics & Business', 'Chemistry',
    'Biomedical Research', 'Engineering', 'Mathematics & Statistics',
    'Agriculture, Fisheries & Forestry', 'Social Sciences',
    'Historical Studies', 'Psychology & Cognitive Sciences',
    'Public Health & Health Services', 'Communication & Textual Studies',
    'Earth & Environmental Sciences', 'Biology', 'Philosophy & Theology',
    'Visual & Performing Arts'
  ];
  return source.includes(id);
}

function sourceNodeShape() {
  return "M0,0A4,4 0 1,0 0,-4A4,4 0 0,0 0,0";
}

function getLinkAngle(d) {
  const dx = d.target.x - d.source.x;
  const dy = d.target.y - d.source.y;
  return Math.atan2(dy, dx);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

main();
