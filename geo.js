/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-08-14 23:55:22
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-08-19 11:25:31
 * @FilePath: \d3\geo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */



const width = 1420;
const height = 750;

// 交互 - zoom
const zoom = d3.zoom()
    .scaleExtent([0.4, 100]) // 设置缩放范围
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", zoomed);

// const tip = d3.tip()
//     .attr("class","tip")
//     .html(function(d) {
//         return d.properties.name;
//     })

// 创建SVG 
const svg = d3.select("body").append("svg").attr("width",width).attr("height",height);

const greek_sci = new Map()

// 画cartogram


// Projection 地图投影
const projection = d3.geoMercator().center([20,-5]).scale(150).translate([width/1.9, height/1.4]);

// Map Path 地图路径生成器
const path = d3.geoPath(projection);

const x = d3.scaleLinear().domain([1,6]).rangeRound([25,370])

const color = d3.scaleThreshold()
    .domain(d3.range(2,8))
    .range(d3.schemeYlOrBr[6])


const g = svg.append("g").attr("transform","translate(0,40)");

    // 绘制legend box
    g.selectAll("rect")
        .data(
            color.range().map(function(d) {
                d = color.invertExtent(d)
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            })
        )
        .enter()
        .append("rect")
        .attr("height", 17)
        .attr("x", function(d) {
            return x(d[0]);
        })
        .attr("width", function(d) {
            return x(d[1]) - x(d[0]);
        })
        .attr("fill", function(d) {
            return color(d[0]);
        })
         // move the rect down to left bottom corner
        .attr("transform","translate(0,615)")
        .attr("class","legendbox")

        // 依据数据对应的颜色区间，添加legend box 颜色标识text
        //  append legend box text based on data's corresponding color range
        g.selectAll("text")
            .data(color.range().map(function(d) {
                d = color.invertExtent(d)
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            }))
            .enter()
            .append("text")
            .attr("class","legend_text")
            .text(function(d,i) {
                if (i == 0) {
                    return "0"
                } else if (i == 1) {
                    return "1-10"
                } else if (i == 2) {
                    return "10-100"
                } else if (i == 3) {
                    return "100-1k"
                } else if (i == 4) {
                    return "1k-10k"
                } else if (i == 5) {
                    return "10k-100k"
                } else if (i == 6) {
                    return "100000-1000000"
                } else {
                    return ">1000000"
                }
            })
            .attr("transform","translate(0,655)")
            .attr("font-size","15px")
            .attr("fill","#354741")
            .attr("x", function(d) {
                return x(d[0]);
            })
    
    // 加legend box的text和标识
    g.append("text")
        .attr("class","legend_title")
        .text("希腊科学家所在地人数 (人)")
        .attr("font-weight","bold")
        .attr("font-size","19px")
        .style("fill","#354741")
        .attr("x",x.range()[0])
        .attr("y",-15)
        .attr("transform","translate(0,615)")

svg.call(zoom);

function zoomed(event) {
    g.selectAll("path")
    .attr("transform", event.transform);
}


// load world map 和 CSV 数据集
d3.csv("cntry_count.csv").then((data) => {
    console.log(data)
    data.forEach(d => { greek_sci.set(d.id, +d.count); });
    console.log(greek_sci)

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", function(d) {
        console.log(d)
    }).then(ready);
})

    
// 画地图
function ready(grk) {

    g.selectAll("path")

        .data(topojson.feature(grk, grk.objects.countries).features)
        .enter()
        .append("path")
        .attr("stroke","#728a7a")

        // map填充上色
        .attr("fill", function(d) {
            var countries_id = d.id
            // 若两者id相同，get count + 填充相应区间的颜色
            // 取Log对数
            if (greek_sci.has(countries_id)) {
                // console.log(greek_sci.get(countries_id))
                // console.log(color(greek_sci.get(countries_id)))
                var temp = Math.log(greek_sci.get(countries_id)) / Math.log(10)
                return color(temp + 2)
                
            } else {
                return color(0)
            }
        })
        .attr("class","country")
        .attr("d",path)


        // 交互 - mouseover
        .on("mouseover", function(e) {
            d3.selectAll(".country")
                .attr("opacity",0.5)
            d3.select(this)
                .attr("opacity",1)
                .attr("stroke","#354741")
                .attr("stroke-width", 5)

            var tooltip = d3.select("#tooltip");
            // 加入交互提示框
            var text = ""
            if (greek_sci.has(e.toElement.__data__.id)) { 
                text = "在\n" + e.toElement.__data__.properties.name + "\n" + "的希腊科学家有: " + greek_sci.get(e.toElement.__data__.id) + "人"  
            } else {
                text = "在\n" + e.toElement.__data__.properties.name + "\n" + "没有希腊科学家"
            }
            tooltip.text(text)
                .style("left", (e.pageX+10) + "px")
                .style("top", (e.pageY-10) +  "px")
                .style("visibility", "visible"); 
            d3.selectAll(".legend_text")
                .attr("stroke","white")
        
    
        })

        .on("mouseout",function() {
            d3.selectAll(".country")
                .transition()
                .duration(160)
                .attr("opacity",1)
            d3.selectAll(".legend_text")
                .attr("stroke","none")
            d3.select("#tooltip").style("visibility", "hidden")
            d3.select(this)
                // .transition()
                // .duration(100)
                .attr("opacity",1)
                .attr("stroke","#728a7a")
                .attr("stroke-width", 1)
            
        })

    svg.append("path")
        .data(topojson.mesh(grk, grk.objects.land, function(a, b) {
            return a !== b;
            })
        )
        .attr("class","land")
        .attr("d", path)
}
