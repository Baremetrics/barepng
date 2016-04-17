Graph = function() {
  var self = this;

  this.object = this.getQueryParameters(window.location.search);

  if (!this.object.data)
    this.object.data = '[0,100]';

  if (!this.object.start)
    this.object.start = Math.round(new Date().getTime() / 100000) - 25056;

  if (!this.object.step)
    this.object.step = 864;

  if (!this.object.goal)
    this.object.goal = null;

  if (!this.object.symbol)
    this.object.symbol = '';

  if (!this.object.style)
    this.object.style = 'default';

  if (!this.object.w)
    this.object.w = 800;

  if (!this.object.h)
    this.object.h = 400;

  for (key in this.object) {
    switch (key) {
      case 'data':
      case 'goal':
        this.object[key] = JSON.parse(this.object[key]);
        break;

      case 'start':
      case 'step':
      case 'w':
      case 'h':
        this.object[key] = Number(this.object[key]);
        break;

      case 'style':
        this.object[key] = this.object[key] == 'email' ? 'email' : 'default';
        break;

      case 'symbol':
        this.object[key] = decodeURIComponent(this.object[key]);
        break;

      default:
        delete this.object[key];
        break;
    }
  }
  
  var d_roll;
  this.dates = this.object.data.map(function(d, i) {
    if (i == 0) {
      d_roll = self.object.start;
    } else {
      d_roll = d_roll + self.object.step;
    }
    return d_roll * 100000;
  });

  var a_roll;
  this.amounts = this.object.data.map(function(d, i) {
    if (i == 0) {
      a_roll = d;
    } else {
      a_roll = a_roll + d;  
    } return a_roll;
  });

  this.data = this.object.data.map(function(d, i) {
    return [self.dates[i], self.amounts[i]];
  });

  if (this.object.goal && this.object.style == 'email')
    this.goal = this.clampGoal(this.object.goal);

  this.svg = d3.select('svg')
    .attr({
      'class': this.object.style,
      height: this.object.h,
      width: this.object.w
    });

  d3.select('.graph').attr('style', 'height:'+ this.object.h +'px; width:'+ this.object.w +'px;');

  this.xScale = null;
  this.yScale = null;
  this.xAxis = null;
  this.yAxis = null;
}

Graph.prototype.clampGoal = function(data) {
  var start = d3.min(this.dates);
  var end = d3.max(this.dates);
  
  var start_date = data[0] * 100000;
  var start_amount = data[1];
  var end_date = data[2] * 100000;
  var end_amount = data[3];

  if (end_date <= start || start_date >= end) {
    this.object.goal = null;
    return false;
  }

  var r = (end_amount - start_amount) / (end_date - start_date);

  if (start_date < start) {
    start_amount = start_amount + (start - start_date) * r;
    start_date = start;
  }

  if (end_date > end) {
    end_amount = end_amount + (end - end_date) * r;
    end_date = end;
  }

  this.dates.push(start_date, end_date);
  this.amounts.push(start_amount, end_amount);

  return [[start_date, start_amount], [end_date, end_amount]];
}

Graph.prototype.getQueryParameters = function(str) {
  return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n) {
    return n = n.split("="), this[n[0]] = n[1], this
  }.bind({}))[0];
}

Graph.prototype.parseValue = function(raw) {
  var formatter = d3.format(",");
  var symbol_arr = this.object.symbol.split('^');
  var symbol_first = Boolean(symbol_arr.indexOf('')) == false ? 0 : 1;
  var symbol = symbol_first ? symbol_arr[0] : symbol_arr[1] || this.object.symbol;
  var clean;

  if (symbol_first) {
    clean = symbol + formatter(raw);
  } else {
    clean = formatter(raw) + symbol;
  }

  return clean;
}

Graph.prototype.draw = function() {
  var self = this;

  if (this.object.style == 'email') {
    this.yScale = d3.scale.linear()
      .domain(d3.extent(this.amounts))
      .range([this.object.h - (this.object.goal ? 87 : 27), 3]);

    this.xScale = d3.scale.linear()
      .domain(d3.extent(this.dates))
      .range([0, this.object.w]);
  } else {
    this.yScale = d3.scale.linear()
      .domain(d3.extent(this.amounts))
      .range([this.object.h - (d3.min(this.amounts) == 0 ? 48 : 72), 24]);

    this.xScale = d3.scale.linear()
      .domain(d3.extent(this.dates))
      .range([0, this.object.w]);

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

    for (var i = 0; i < y_items.length; ++i) {
      offset.push(y_items[i].getBBox().width + 24);
    } offset = d3.max(offset);

    this.svg.select('.axis--y')
      .selectAll('line').attr({
        x2: this.object.w - 24,
        x1: offset + 12
      });

    this.xScale
      .range([offset + 12, this.object.w - 24]);

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
        transform: 'translate('+ [0, this.object.h - 24] +')'
      });

    this.svg.select('.axis--x')
      .call(this.xAxis);

    var widths = [];
    var minWidth;
    var targetRight;

    var x_items = document.querySelectorAll('.axis--x text');
    var x_lines = document.querySelectorAll('.axis--x line');
    var ticks = document.querySelectorAll('.axis--x .tick');

    for (var i = 0; i < x_items.length; ++i) {
      widths.push(x_items[i].getBBox().width);
    }

    var maxWidthHalf = d3.max(widths) / 2 + 12;

    for (var i = 0; i < x_items.length; ++i) {
      x_items[i].style.opacity = 0;

      var center = x_lines[i].getBoundingClientRect().left;

      if (i == 0 || center - maxWidthHalf > targetRight) {
        if (x_items[i].getBoundingClientRect().left - 12 < targetRight) {
          
        } else if (x_items[i].getBoundingClientRect().left + x_items[i].getBBox().width > self.object.w) {
          
        } else {
          targetRight = center + maxWidthHalf;
          x_items[i].style.opacity = 1;
        }
      }
    }
  }

  this.lineGraph();
}

Graph.prototype.lineGraph = function() {
  var self = this;

  var area = d3.svg.area()
    .x(function(d) {return self.xScale(d[0])})
    .y0(this.object.h - (self.object.style == 'email' ? 0 : 48))
    .y1(function(d) {return self.yScale(d[1])});

  this.svg.append('path')
    .data([this.data])
    .attr({
      'class': 'area',
      d: area
    });

  var line = d3.svg.line()
    .x(function(d) {return self.xScale(d[0])})
    .y(function(d) {return self.yScale(d[1])});

  this.svg.append('path')
    .data([this.data])
    .attr({
      'class': 'line',
      d: line,
      fill: 'none',
      'stroke-width': 5,
      'stroke-linecap': 'round',
      "stroke-linejoin": 'round'
    });

  if (this.object.goal && this.object.style == 'email') {
    var goal_line = d3.svg.line()
      .x(function(d) {return self.xScale(d[0])})
      .y(function(d) {return self.yScale(d[1])});

    this.svg.append('path')
      .data([this.goal])
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