Graph = function() {
  this.object = this.getQueryParameters(window.location.search);

  if (!this.object.data) {
    var date = new Date().getTime();
    this.object.data = JSON.stringify([[date - 2505600000, 0], [date, 100]]);
    this.object.symbol = '%25';
    this.object.symbol_first = 'false';
  }

  if (!this.object.goal || !this.object.email)
    this.object.goal = false;

  if (!this.object.email)
    this.object.email = false;

  if (!this.object.symbol)
    this.object.symbol = '';

  if (!this.object.symbol_first)
    this.object.symbol_first = 'true';

  if (!this.object.w)
    this.object.w = 800;

  if (!this.object.h)
    this.object.h = 400;

  for (key in this.object) {
    switch (key) {
      case 'symbol_first':
      case 'email':
        this.object[key] = this.object[key] === 'true';
        break;
      case 'data':
      case 'goal':
        this.object[key] = JSON.parse(this.object[key]);
        break;
      case 'symbol':
        this.object[key] = decodeURIComponent(this.object[key]);
        break;
      case 'w':
      case 'h':
        this.object[key] = Number(this.object[key]);
        break;
      default:
        delete this.object[key];
        break;
    }
  }
  
  this.dates = this.object.data.map(function(d) {
    return d[0];
  });
  this.amounts = this.object.data.map(function(d) {
    return d[1];
  });

  if (this.object.goal && this.object.email) {
    this.goal_dates = this.object.goal.map(function(d) {
      return d[0];
    });
    this.goal_amounts = this.object.goal.map(function(d) {
      return d[1];
    });

    this.dates = this.dates.concat(this.goal_dates);
    this.amounts = this.amounts.concat(this.goal_amounts);
  }

  this.width = this.object.w;
  this.height = this.object.h;

  this.svg = d3.select('svg')
    .attr({
      'class': this.object.email ? 'email' : '',
      height: this.height,
      width: this.width
    });

  d3.select('.graph').attr('style', 'height:'+ this.height +'px; width:'+ this.width +'px;');

  this.xScale = null;
  this.yScale = null;
  this.xAxis = null;
  this.yAxis = null;
}

Graph.prototype.getQueryParameters = function(str) {
  return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n) {
    return n = n.split("="), this[n[0]] = n[1], this
  }.bind({}))[0];
}

Graph.prototype.parseValue = function(raw) {
  var formatter = d3.format(",");
  var symbol = this.object.symbol;
  var symbol_first = this.object.symbol_first;
  var clean;

  if (raw >= 0) { // Positive value
    if (symbol_first) {
      clean = symbol + formatter(raw);
    } else {
      clean = formatter(raw) + symbol;
    }
  } else { // Negative value
    if (symbol_first) {
      clean = "-" + symbol + formatter(raw).substr(1);
    } else {
      clean = "-" + formatter(raw).substr(1) + symbol;
    }
  }

  return clean;
}

Graph.prototype.draw = function() {
  var self = this;

  if (this.object.email) {
    this.yScale = d3.scale.linear()
      .domain(d3.extent(this.amounts))
      .range([this.height - (this.object.goal ? 75 : 27), 3]);

    this.xScale = d3.scale.linear()
      .domain(d3.extent(this.dates))
      .range([0, this.width]);
  } else {
    this.yScale = d3.scale.linear()
      .domain(d3.extent(this.amounts))
      .range([this.height - (d3.min(this.amounts) == 0 ? 48 : 72), 24]);

    this.xScale = d3.scale.linear()
      .domain(d3.extent(this.dates))
      .range([0, this.width]);

    this.yAxis = d3.svg.axis()
      .ticks(6)
      .tickFormat(function(d) {
        return self.parseValue(d);
      })
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
  }

  self.lineGraph();
}

Graph.prototype.lineGraph = function() {
  var self = this;

  var area = d3.svg.area()
    .x(function(d) {return self.xScale(d[0])})
    .y0(this.height - (this.object.email ? 0 : 48))
    .y1(function(d) {return self.yScale(d[1])});

  this.svg.append('path')
    .data([this.object.data])
    .attr({
      'class': 'area',
      d: area
    });

  var line = d3.svg.line()
    .x(function(d) {return self.xScale(d[0])})
    .y(function(d) {return self.yScale(d[1])});

  this.svg.append('path')
    .data([this.object.data])
    .attr({
      'class': 'line',
      d: line,
      fill: 'none',
      'stroke-width': 5,
      'stroke-linecap': 'round',
      "stroke-linejoin": 'round'
    });

  if (this.object.goal && this.object.email) {
    var goal_line = d3.svg.line()
      .x(function(d) {return self.xScale(d[0])})
      .y(function(d) {return self.yScale(d[1])});

    this.svg.append('path')
      .data([this.object.goal])
      .attr({
        'class': 'goal-line',
        d: goal_line,
        fill: 'none',
        'stroke-width': 5,
        'stroke-linecap': 'round',
        "stroke-linejoin": 'round'
      });

    d3.select('.legend').attr('style', 'display: inherit;');
  }
}