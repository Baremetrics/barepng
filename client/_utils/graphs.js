Graph = function() {
  this.svg = d3.select('svg');

  this.data = window.location.search && 
    window.location.search.split('=')[1] &&
    window.location.search.split('=')[1] != 'undefined' ? 
    JSON.parse(window.location.search.split('=')[1]) : 
    [[0,0],[1,1]];
  
  this.dates = null;
  this.amounts = null;

  this.width = 800;
  this.height = 400;

  this.xScale = null;
  this.yScale = null;
  this.xAxis = null;
  this.yAxis = null;
}

Graph.prototype.draw = function() {
  var self = this;

  this.dates = this.data.map(function(d) {
    return d[0];
  });

  this.amounts = this.data.map(function(d) {
    return d[1];
  });

  this.yScale = d3.scale.linear()
    .domain(d3.extent(this.amounts))
    .range([this.height - 72, 24]);

  this.xScale = d3.scale.linear()
    .domain(d3.extent(this.dates))
    .range([0, this.width]);

  this.yAxis = d3.svg.axis()
    .ticks(6)
    .tickPadding(24)
    .tickSize(0, 0)
    .scale(this.yScale)
    .orient('right');
    
  this.svg.append('g').attr('class', 'axis axis--y');

  this.svg.select('.axis--y')
    .call(this.yAxis);

  var y_items = document.querySelectorAll('.axis--y text');
  var offset = [];
  var i;

  for (i = 0; i < y_items.length; ++i) {
    offset.push(y_items[i].getBBox().width + 24);
  } offset = d3.max(offset);

  this.svg.select('.axis--y')
    .selectAll('line').attr({
      x2: this.width - 24,
      x1: offset + 12
    });

  this.xScale
    .range([offset + 12, this.width - 24]);

  this.xAxis = d3.svg.axis()
    .tickValues(this.dates)
    .tickFormat(function(d) {
      var date = new Date(d).toDateString().split(' ');
      return date[1] +' '+ date[2];
    })
    .tickPadding(0)
    .tickSize(0, 0)
    .scale(this.xScale)
    .orient('top');

  this.svg.append('g')
    .attr({
      'class': 'axis axis--x',
      transform: 'translate('+ [0, this.height - 24] +')'
    });

  this.svg.select('.axis--x')
    .call(this.xAxis);

  // If there are text elements outside the range, kill them
  var widths = [];
  var minWidth;
  var targetRight;

  var x_items = document.querySelectorAll('.axis--x text');
  var x_lines = document.querySelectorAll('.axis--x line');
  var ticks = document.querySelectorAll('.axis--x .tick');

  for (i = 0; i < x_items.length; ++i) {
    widths.push(x_items[i].getBBox().width);
  }

  var maxWidthHalf = d3.max(widths) / 2 + 12;

  for (i = 0; i < x_items.length; ++i) {
    x_items[i].style.opacity = 0;

    var center = x_lines[i].getBoundingClientRect().left;

    if (i == 0 || center - maxWidthHalf > targetRight) {
      if (x_items[i].getBoundingClientRect().left - 12 < targetRight) {
        
      } else if (x_items[i].getBoundingClientRect().left + x_items[i].getBBox().width > self.width) {
        
      } else {
        targetRight = center + maxWidthHalf;
        x_items[i].style.opacity = 1;
      }
    }
  }

  self.lineGraph(this.data);
}

Graph.prototype.lineGraph = function(data) {
  var self = this;

  var area = d3.svg.area()
    .x(function(d) {return self.xScale(d[0])})
    .y0(this.height - 48)
    .y1(function(d) {return self.yScale(d[1])});

  this.svg.append('path')
    .data([data])
    .attr({
      'class': 'area',
      d: area
    });

  var line = d3.svg.line()
    .x(function(d) {return self.xScale(d[0])})
    .y(function(d) {return self.yScale(d[1])});

  this.svg.append('path')
    .data([data])
    .attr({
      'class': 'line',
      d: line,
      fill: 'none',
      'stroke-width': 5,
      'stroke-linecap': 'round',
      "stroke-linejoin": 'round'
    });
}

var graph = new Graph();
graph.draw();