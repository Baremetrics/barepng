Graph = function() {
  this.element = $('svg');
  this.svg = d3.select(this.element[0]);

  this.data = this.element.data('array');
  
  this.dates = null;
  this.amounts = null;

  this.width = null;
  this.height = null;

  this.xScale = null;
  this.yScale = null;
  this.xAxis = null;
  this.yAxis = null;
}

Graph.prototype.draw = function() {
  var self = this;

  this.dates = _.map(this.data, function(d) {
    return d[0];
  });

  this.amounts = _.map(this.data, function(d) {
    return d[1];
  });

  this.width = this.element.width();
  this.height = this.element.height();

  this.yScale = d3.scale.linear()
    .domain(d3.extent(this.amounts))
    .range([this.height - 72, 24]);

  this.xScale = d3.scale.linear()
    .domain(d3.extent(this.dates))
    .range([0, this.width]);

  this.yAxis = d3.svg.axis()
    // .tickFormat(function(d) {
    //   return $$(d);
    // })
    .ticks(6)
    .tickPadding(24)
    .tickSize(0, 0)
    .scale(this.yScale)
    .orient('right');
    
  this.svg.append('g').attr('class', 'axis axis--y');

  this.svg.select('.axis--y')
    .call(this.yAxis);

  var offset = d3.max($('.axis--y text').map(function(i, d) {
    return d.getBBox().width + 24;
  }));

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
      return moment(d).format('MMM D');
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

  $('svg .axis--x .tick text').css('opacity', 0);

  $('svg .axis--x .tick').each(function() {
    widths.push(this.getBBox().width);
  });

  var maxWidthHalf = d3.max(widths) / 2 + 12;

  $('svg .axis--x .tick text').each(function(i) {
    var center = $(this).prev().position().left;

    if (i == 0 || center - maxWidthHalf > targetRight) {
      if ($(this).position().left - 12 < targetRight)
        return true;

      if ($(this).position().left + $(this)[0].getBBox().width > self.element.width())
        return true;

      targetRight = center + maxWidthHalf;
      return $(this).css('opacity', 1);
    }
  });

  $('.domain').remove();

  self.lineGraph(this.data);

  if (window.callPhantom)
    window.callPhantom('takeShot');
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