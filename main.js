const margin = {top: 45, right: 30, bottom: 50, left: 80};
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const padding = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';

// Load data here
d3.csv('../data/pay_by_gender_tennis.csv').then(data => {
  console.log('data', data);
  
  // Format and isolate earnings
  const earnings = [];
  data.forEach(datum => {
    // Earnings: Remove commas and convert to integer
 const earning = +datum.earnings_USD_2019.replaceAll(',' , '') ;
    earnings.push(earning);
  });

  createHistogram(earnings);
});


// Create Visualization
const createHistogram = (earnings) => {

  // Generate Bins
  const bins = d3.bin().thresholds(17)(earnings);
  console.log('bins', bins);


  // Append svg
  const svg = d3.select('#viz')  
    .append('svg')
      .attr('viewbox',[0,0,width, height])
      .attr('width', width)
      .attr('height', height);

 
  // Create Scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(bins, d =>d.length) ])
    .range([0, width - margin.left - margin.right ])
    .nice();
  const yScale = d3.scaleLinear()
    .domain([0, bins[bins.length - 1].x1])
    .range([height - margin.bottom, margin.top]); // Vertical position is calculated Top to Bottom in the svg world
  

  // Append x-axis
  const xAxis = d3.axisBottom(xScale)
    .ticks(10);
  const xAxisGroup = svg
    .append('g')
      .attr('class', 'x-axis-group')
      .attr('transform', `translate(${margin.left} , ${height - margin.bottom} )`)
      .style('font-size', '13px')
    .call(xAxis);

  // Append y-axis
  const yAxis = d3.axisLeft(yScale)
    .ticks(15)
    .tickSizeOuter(0);
  const yAxisGroup = svg
    .append('g')
      .attr('class', 'y-axis-group')
      .attr('transform', `translate(${margin.left}, 0 )`)
      .style('font-size', '13px')
    .call(yAxis);
  yAxisGroup
    .append('text')
      .attr('text-anchor', 'start')
      .attr('x', 0 - margin.left ) // Need to take into account the horizontal translation that was already applied to xAxisGroup
      .attr('y', 20 )
      .text('Earnings of the top tennis players in 2019 (USD)')
      .attr('fill', '#3B3B39')
      .style('font-size', '16px')
      .style('font-weight', 700);


  // Append rects
  svg
    .append('g')
      .attr('class', 'bars-group')
      .attr('fill', barsColor)
    .selectAll('rect')
    .data(bins)
    .join('rect')
      .attr('x', margin.left )
      .attr('y', d => yScale(d.x1) + padding)
      .attr('width', d => xScale(d.length) ) // The svg width is the horizontal length of each rectangle, which is relative to the number of datapoints in each bin
      .attr('height', d =>  yScale(d.x0) - yScale(d.x1) - padding);


  // Append curve on histogram

  // Add one point at the beginning and at the end of the curve that meets the y-axis
  // Each point added below consist in an array of the coordinates [x, y] of the added point
  //  bins.unshift([0, 0]); // x = 0, y = 0 (numbers based on the histogram axes)
  // bins.push([0, 17000000]); // x = 0, y = 17,000,000 (numbers based on the histogram axes)
  // console.log('bins expanded', bins);

  const curveGenerator = d3.line()
    .x((d, i) => {
     // Otherwise, the x position is relative to the length of the bin (the tip of the histogram bar)
        console.log('i  = ' + i + 'lenth = ' + d.length);
        console.log('xSccacle = + ' + xScale(d.length));
        return  xScale(d.length) + margin.right ;
   })
    .y((d, i) => {
    
        // Otherwise, the y position is relative to the half-height of the histogram bar
        console.log('yScale = + ' + (yScale(d.x0) - (yScale(d.x0) - yScale(d.x1))/2));
        return yScale(d.x0) - (yScale(d.x0 - d.x1)/2)  ;
    })
    .curve(d3.curveCatmullRom);

   
  svg
    .append('path')
      .attr('d', curveGenerator(bins) )
      .attr('fill', 'none')
      .attr('stroke', 'magenta')
      .attr('stroke-width', 2);

/*
  // Append area on histogram (density plot)

  const areaGenerator = d3.area()
    .x0(margin.left)
    .x1((d, i) => {
      if (i === 0 || i === (bins.length - 1)) {
        return ... ;
      } else {
        return ... ;
      }
    })
    .y((d, i) => {
      if (i === 0 || i === (bins.length - 1)) {
        return ... ;
      } else {
        return ... ;
      }
    })
    .curve( ... );
    
  svg
    .append('path')
      .attr('d', ... )
      .attr('fill', 'yellow')
      .attr('fill-opacity', 0.4)
      .attr('stroke', 'none');
 */
};


// Create Split Violin Plot
const createViolin = () => {
  
};

