// main.js
const svg = d3.select('#mainsvg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = {top:20, right:0, bottom:170, left:100};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
let chartData;


const xScale = d3.scaleBand()
    .range([0, innerWidth])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

const g = svg.append('g').attr('id', 'maingroup')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('0')); // 添加 .tickFormat() 方法
const yAxisG = g.append('g');

const xAxis = d3.axisBottom(xScale);
const xAxisG = g.append('g').attr('transform', `translate(0, ${innerHeight})`);

function drawChart() {
    xScale.domain(chartData.map(d => d.name));
    yScale.domain([0, d3.max(chartData, d => d.value)]);

    yAxisG.call(yAxis);
    xAxisG.call(xAxis);
    d3.selectAll('.tick text').attr('font-size', '0.7em');
    xAxisG.selectAll('.tick text')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dy', '.32em')
		.attr('x', '-12')
        .attr('y', '0');

    const bars = g.selectAll('rect')
        .data(chartData, d => d.name);

	bars.enter().append('rect')
		.merge(bars)
		.attr('height', d => innerHeight - yScale(d.value))
		.attr('width', xScale.bandwidth())
		.attr('opacity', 0.7)
		.attr('fill', '#1a406e') // 修改了此处的颜色
		.attr('x', d => xScale(d.name))
		.attr('y', d => yScale(d.value));

    bars.exit().remove();

    const texts = g.selectAll('.barValueText')
        .data(chartData, d => d.name);

    texts.enter().append('text')
        .classed('barValueText', true)
        .merge(texts)
        .text(d => d.value)
        .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.value) - 10)
        .attr('font-size', '0.5em')
        .attr('transform', (d) => `rotate(-90, ${xScale(d.name) + xScale.bandwidth() / 2}, ${yScale(d.value) - 12})`)
        .attr('text-anchor', 'middle');

    texts.exit().remove();
}

function prepareData(order) {
    if (order === 'alphabet') {
        chartData = data.slice().sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'ascending') {
        chartData = data.slice().sort((a, b) => a.value - b.value);
    } else {
        chartData = data.slice().sort((a, b) => b.value - a.value);
    }
    drawChart();
}

const zoom = d3.zoom()
    .scaleExtent([1, 10]) 
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed ({transform}) {
    svg.attr("transform", transform);
    }

// 添加下拉选择框的事件监听器：
const selectSort = document.getElementById('selectSort');
selectSort.addEventListener('change', () => {
  // 获取选择框的当前值
  const sortType = selectSort.value;

  // 根据当前值更新图表
  prepareData(sortType)
});

// 初始化时，立即执行一次更新操作
prepareData(selectSort.value);
