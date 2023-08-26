# SciAssessGR
北京大学暑期课程数据可视化d3.js可视化项目
Here is the content converted to Markdown syntax:

---

# Greek Scientific Brain Drain Visualization Report

**Academic Year:** 2023 Summer School  
**Course:** Data Visualization  
**Team members:** Zheng Yongzhen, Liao Zijun, Lin Zhen, Guoguo  
**Instructor:** Bu Yi  

**Date:** 2023 August 24

## Table of Contents

1. [Choropleth World Distribution Map](#choropleth-world-distribution-map)
2. [Arc Diagram Visualization](#arc-diagram-visualization)
3. [Network Visualization](#network-visualization)
4. [Field Distribution Visualization](#field-distribution-visualization)
5. [Team Collaboration](#team-collaboration)

---

### 1 Choropleth World Distribution Map

**Student ID:** 2100093004  
**Team member:** Lin Zhen  
**Institute:** Peking University, Information Management Department, Class of 21

#### 1.1 Data Processing

In this project, we selected the 14th dataset in the small group assignment 1.pdf: National Scientific Brain Drain. We referred to the research literature and downloaded the relevant datasets.

In the early stage of the project, we confirmed and cleaned the downloaded datasets to ensure that they were consistent with the literature and not missing any data. Any data containing null values was also removed. After these steps, we generated a clean data file, cntry_count.csv, suitable for visualization. The final data count was reduced from 63,951 to 63,174 valid entries.

#### 1.2 Visualization Method

##### 1.2.1 Visualization Objective

The term "Greek-blooded scientists" refers to not only scientists born in Greece, but also scientists born elsewhere (second-generation or higher) whose families have Greek ancestry. The visualization aims to explore three objectives: 1) the outflow of local and immigrant (second-generation or later) talent in Greece, 2) the severity of the talent drain, 3) the emphasis on interactivity and aesthetics.

##### 1.2.2 Major Visualization Implementation

The map projection type is set to geoMercator to create a projection and map path, completing the initial map rendering.

Through the downloaded countries-110m.js map projection dataset, we get geographical data, contour, and tectonic outline for each country. In geo.js, we bind data with topojson. As data count differences are significant (with a maximum of 35,116 and a minimum of 1), we use logarithms as the equivalent interval division. In terms of color, we purposely chose low-saturation background colors to highlight the data-driven orange-brown filled map (color scheme - YlOrBr).

The interactive code for mouseon is shown above. This color-filled world map supports user interactions, including zooming in and out of the map, and dragging the map after zooming. In addition, when the cursor hovers over a country, the country's information is highlighted by dimming the background and thickening the map border. Simultaneously, a tooltip displays the country name and the number of scientists it contains. The country count of Greek scientists in the global distribution is also directly displayed in white text in the lower right corner legend.

#### 1.3 Result Analysis

The valid dataset contains 63,174 entries, covering 108 countries. According to the visualization results, a total of 35,116 Greek-blooded scientists have their affiliated institutions in Greece, the largest among all locations, accounting for 55.6% of the total number. There are also many scientists distributed in countries such as the United States (9,339, 14.8%), the United Kingdom (6,165, 9.8%), Germany (2,083, 3.3%), and Cyprus (1,688, 2.7%), among others. The number of scientists in Australia (n=1,155, 1.8%), France (n=1,141, 1.8%), Canada (n=1,110, 1.8%), and Switzerland is around 1000, accounting for 1.6~1.8%. Overall, Greek expatriates are spread all over the world, with 95 of the countries having a Greek scientist population share of less than 1% (0.01%~0.4%).

The data-driven chart shows that the scale and severity of talent drain faced by Greece are significant, with 44.4% of Greek immigrants located outside of Greece.

### 2 Arc Diagram Visualization

**Student ID:** 2000093014  
**Team member:** Guoguo  
**Institute:** Peking University, Information Management Department, Class of 20

Through the Choropleth world distribution map, users have discovered that Greek scientist outflow is mainly distributed in countries such as the United States and the United Kingdom. The goal of this visualization is to explore the connections between outstanding Greek scientists.

#### 2.1 Data Processing

We have demonstrated the relationships and connections between outstanding Greek scientists through the arc diagram.

First, during the data preparation process, we excluded data with missing values to maintain data accuracy, and we chose rank, cntry, np, and authfull as the visualization dataset.

To ensure that the visualization results represent "outstanding scientists", with a large difference in rank (with a maximum of 7791251 and a minimum of 33), we only show the data of the top 76 scientists with a rank of 11,000 or less.

#### 2.2 Visualization Method

Users can use the drop-down menu to view the visualization in the following three sorting methods:

1. Cluster: arrange by cluster degree
2. Frequency: arrange from the most frequent author names on the left
3. Name: alphabetical arrangement

This interactive design allows users to customize the presentation of data, enhancing user engagement.

The force-directed graph produced by the arcBuilder function demonstrates how to create an arc diagram. Additionally, we used innerRadius and outerRadius to set the arc's width.

#### 2.3 Result Analysis

The results show that the darker the color, the stronger the connection between the two scientists. The strength of the connections between scientists depends on whether they are from the same country (location of affiliated institutions).

### 3 Network Visualization

**Student ID:** 2300943588  
**Team member:** Liao Zijun  
**Institute:** Xi'an Jiaotong University, Software Engineering, Class of 21

#### 3.1 Data Processing

First, we preprocessed the data by removing entries with unknown fields of study, missing names, or target countries to ensure that the selected data met the requirements.

To keep the visualization results clear, we only showed the top 30% of the standardized scores of scientists. The filtering criterion is to normalize the comprehensive scores of scientists to fall between 0 and 1. Looking at the data distribution, we found that the overall trend is approximately normally distributed, with a slightly larger density in the low score area, and the high score area relatively wider but narrower. Considering the data trend and visualization effect, we chose 30% as the cut-off point and display more outstanding scientists.

To speed up the webpage loading, we used Python to format the data and created a CSV file that can be read on-demand, containing the following fields:

source	target	type	value
Field of study	Scientist name	Country of destination	Weight

#### 3.2 Visualization Introduction

##### 3.2.1 Partial Code Description

- Define mouse interaction events: display the scientist's name and country label and close the label when the cursor is moved away.
- Set node repulsion and initial state, and set boundary repulsion for the force-directed layout simulation.
- Draw the petal shape.
- Define the styles of nodes and edges. Distinguish between source and target nodes and use colors to differentiate countries.

##### 3.2.2 Visualization Process Display

In this data visualization, we used a force-directed layout to show the network relationships between outstanding scientists, fields of research, and host countries. We drew inspiration from the metaphor of dandelions and petals and combined network data visualization and hierarchical data visualization to render an interactive force-directed layout visualization.

Regarding the graphics rendering aspect, we designed the colors and lines for nodes and edges. The line colors reflect the scientists' destination countries, trying to match the colors with the country's characteristics (e.g., China is often represented by red), while also considering the differences in colors to improve recognition.

In this visualization, the thickness of the lines and the size of the petals represent the impact of the scientist in the field. When the user hovers the cursor on an entry, we will show the author's name label using the country color and using a white outline to enhance the visual effect, improving the interaction and fun of reading the chart. The label disappears when the cursor is moved away to avoid masking other information.

At the same time, users can drag nodes and edges to observe the results after the force-directed layout is regenerated. To prevent nodes from being repelled outside the canvas, we added a larger repulsion to the boundary to keep the graphics within the canvas. Even if it is manually dragged outside the canvas, it will be "bounced" back. This interaction mode is similar to the way Gephi, a widely known data visualization tool, operates.

#### 3.3 Results Display and Analysis

This chart shows the network relationships among authors, fields of research, and host countries. Readers can intuitively understand the names, numbers, and distribution of outstanding Greek scientists involved in different fields, such as the most prominent scientists' concentrated fields and main destination countries, and the differences in the fields of Greek scientists migrating to various countries.

### 4 Field Distribution Visualization

**Student ID:** 2100093009  
**Team leader:** Zheng Yongzhen  
**Institute:** Peking University, Information Management Department, Class of 21

#### 4.1 Data Processing

The original dataset was automatically counted for the non-null values in the sm-subfield-1 column using Python and pandas, and the resulting dataset was imported into the JavaScript file.

#### 4.2 Visualization Introduction

The Field distribution visualization utilizes Python and the pandas library to analyze the sm-subfield-1 column of the Greek talent drain dataset and presents the research fields of Greek scientists in a bar chart using HTML and d3.js. The bar chart can be sorted alphabetically, in ascending order, or in descending order. Additionally, the chart can be zoomed and dragged using the mouse wheel.

#### 4.3 Results Display and Analysis

This chart ranks the fields of study for Greek scientists involved in their papers. From the descending chart, it can be seen that the top ten fields with the most involvement are engineering and medical fields, including biology, with four in the medical field. The top ten engineering disciplines include computer science and physics. Since the data topic is the Greek brain drain, it is easy to deduce from this graph that a large proportion of Greek talents are in computer, physics, and medical-related fields, and that the acceptance of talents in engineering and medical fields in other countries is higher. Also, more management, literature, sociology, and history fields gradually appear at the bottom. And it is not that all engineering and medical fields receive a lot of attention. For example, nursing and physical chemistry branches are relatively behind.

---

### 5 Team Collaboration

The four sets of charts above were all drawn independently by respective team members. The following division of labor is for other contributions to group assignment 1:

No. | Task | Team Member
--- | ---- | -----------
1 | Final report integration and formatting, internal task division | Lin Zhen
2 | Group Presentation | Lin Zhen (Introduction, 2 sections) and Zheng Yongzhen (Conclusion, 2 sections)
3 | Webpage framework integration and deployment | Liao Zijun
4 | Homepage design | Guoguo

---
