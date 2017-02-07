

// d3.csv('asset/GEO_data.csv', function ( response ) {
//
//   var data = response.map(function( item ) {
//       var newItem = {};
//       newItem.country = item.y;
//       newItem.product = item.users;
//       newItem.value = item.value;
//       newItem.uid = item.x
//       return newItem;
//   })
//   users = {}
//   data.forEach(function(item){
//     user_id = item.product
//     if (!(user_id in users)){
//       users[user_id] = 0
//     }
//     users[user_id] += parseInt(item.value)
//   })
//
//   solver = {}
//   data.forEach(function(item){
//     user_id = item.product
//     if (!(user_id in solver)){
//       solver[user_id] = 0
//     }
//     if (item.country.toLowerCase() == 'solve')
//     {
//       solver[user_id] += parseInt(item.value)
//     }
//   })
//   console.log(solver)
//   // data.sort(function(a, b) {
//   //      return d3.ascending(parseInt(a.country.split(/_/)[1]), parseInt(b.country.split(/_/)[1]));
//   // });
//   //
//   data.sort(function(a, b) {
//        return d3.ascending(-users[a.product], -users[b.product]);
//   });
//
//   data.sort(function(a, b) {
//        return d3.ascending(-solver[a.product], -solver[b.product]);
//   });
//   var x_elements = d3.set(data.map(function( item ) { return item.product; } )).values(),
//       y_elements = d3.set(data.map(function( item ) { return item.country } )).values();
// console.log(y_elements);
// y_elements.sort(function(a, b) {
//      return d3.ascending(a, b);
// });
// console.log(y_elements);
//
//   var xScale = d3.scale.ordinal()
//       .domain(x_elements)
//       .rangeBands([0, x_elements.length * itemSize]);
//
//   var xAxis = d3.svg.axis()
//       .scale(xScale)
//       .tickFormat(function (d) {
//           return d;
//       })
//       .orient("top");
//
//   var yScale = d3.scale.ordinal()
//       .domain(y_elements)
//       .rangeBands([0, y_elements.length * itemSize]);
//
//   var yAxis = d3.svg.axis()
//       .scale(yScale)
//       .tickFormat(function (d) {
//           return d;
//       })
//       .orient("left");
//
//   var colorScale = d3.scale.threshold()
//   .domain([0.2, 0.3, 0.4, 0.5, 0.6,0.7, 0.8,0.9, 1])
//   .range(['#fff','#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b']);
//
//   var svg = d3.select('.heatmap')
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//   var cells = svg.selectAll('rect')
//       .data(data)
//       .enter().append('g').append('rect')
//       .attr('class', 'cell')
//       .attr('width', cellSize)
//       .attr('height', cellSize)
//       .attr('y', function(d) { return yScale(d.country); })
//       .attr('x', function(d) { return xScale(d.product); })
//       .attr('fill', function(d) { return colorScale(d.value); });
//
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .selectAll('text')
//       .attr('font-weight', 'normal');
//
//   svg.append("g")
//       .attr("class", "x axis")
//       .call(xAxis)
//       .selectAll('text')
//       .attr('font-weight', 'normal')
//       .style("text-anchor", "start")
//       .attr("dx", ".8em")
//       .attr("dy", ".5em")
//       .attr("transform", function (d) {
//           return "rotate(-65)";
//       });
// });




$(document).ready(function () {
    $(".btn-select").each(function (e) {
        var value = $(this).find("ul li.selected").html();
        if (value != undefined) {
            $(this).find(".btn-select-input").val(value);
            $(this).find(".btn-select-value").html(value);
        }
    });
});

$(document).on('click', '.btn-select', function (e) {
    e.preventDefault();
    var ul = $(this).find("ul");
    if ($(this).hasClass("active")) {
        if (ul.find("li").is(e.target)) {
            var target = $(e.target);
            target.addClass("selected").siblings().removeClass("selected");
            var value = target.html();
            $(this).find(".btn-select-input").val(value);
            $(this).find(".btn-select-value").html(value);
        }
        ul.hide();
        $(this).removeClass("active");
    }
    else {
        $('.btn-select').not(this).each(function () {
            $(this).removeClass("active").find("ul").hide();
        });
        ul.slideDown(300);
        $(this).addClass("active");
    }
});

$(document).on('click', function (e) {
    var target = $(e.target).closest(".btn-select");
    if (!target.length) {
        $(".btn-select").removeClass("active").find("ul").hide();
    }
});

var accidents = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]

var days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	times = d3.range(24);

var margin = {
	top: 10,
	right: 50,
	bottom: 10,
	left: 50
};

var width =Math.min(window.innerWidth,1300),
	gridSize = Math.floor(0 / times.length),
	height = 60;

  console.log(width);
  console.log(gridSize);
  console.log(height);

  var colorScale = d3.scale.linear()
  	.domain([0, d3.max(accidents, function(d) {return d; })/2, d3.max(accidents, function(d) {return d; })])
  	.range(["#FFF", "#99d8c9", "#00441b"])
  	//.interpolate(d3.interpolateHcl);

//SVG container
var svg = d3.select('#trafficAccidents')
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

///////////////////////////////////////////////////////////////////////////
//////////////// Create the gradient for the legend ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Extra scale since the color scale is interpolated
var countScale = d3.scale.linear()
	.domain([0, d3.max(accidents, function(d) {return d; })])
	.range([0, width])

//Calculate the variables for the temp gradient
var numStops = 10;
countRange = countScale.domain();
countRange[2] = countRange[1] - countRange[0];
countPoint = [];
for(var i = 0; i < numStops; i++) {
	countPoint.push(i * countRange[2]/(numStops-1) + countRange[0]);
}//for i

//Create the gradient
svg.append("defs")
	.append("linearGradient")
	.attr("id", "legend-traffic")
	.attr("x1", "0%").attr("y1", "0%")
	.attr("x2", "100%").attr("y2", "0%")
	.selectAll("stop")
	.data(d3.range(numStops))
	.enter().append("stop")
	.attr("offset", function(d,i) {
		return countScale( countPoint[i] )/width;
	})
	.attr("stop-color", function(d,i) {
		return colorScale( countPoint[i] );
	});

///////////////////////////////////////////////////////////////////////////
////////////////////////// Draw the legend ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var legendWidth = Math.min(width*0.8, 400);
//Color Legend container
var legendsvg = svg.append("g")
	.attr("class", "legendWrapper")
	.attr("transform", "translate(" + (width/2) + "," + (gridSize * days.length + 40) + ")");

//Draw the Rectangle
legendsvg.append("rect")
	.attr("class", "legendRect")
	.attr("x", -legendWidth/2)
	.attr("y", 0)
	//.attr("rx", hexRadius*1.25/2)
	.attr("width", legendWidth)
	.attr("height", 10)
	.style("fill", "url(#legend-traffic)");

//Append title
legendsvg.append("text")
	.attr("class", "legendTitle")
	.attr("x", 0)
	.attr("y", -10)
	.style("text-anchor", "middle")
	.text("Color Scale");

//Set scale for x-axis
var xScale = d3.scale.linear()
	 .range([-legendWidth/2, legendWidth/2])
	 .domain([ 0, d3.max(accidents, function(d) { return d; })] );

//Define x-axis
var xAxis = d3.svg.axis()
	  .orient("bottom")
	  .ticks(5)
	  //.tickFormat(formatPercent)
	  .scale(xScale);

//Set up X axis
legendsvg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (10) + ")")
	.call(xAxis);


  var group = $("ol.limited_drop_targets").sortable({
    group: 'limited_drop_targets',
    isValidTarget: function  ($item, container) {
      if($item.is(".highlight"))
        return true;
      else
        return $item.parent("ol")[0] == container.el[0];
    },
    onDrop: function ($item, container, _super) {
      $('#serialize_output').text(
        group.sortable("serialize").get().join("\n"));

      _super($item, container);
    },
    serialize: function (parent, children, isContainer) {
      return isContainer ? children.join() : parent.text();
    },
    tolerance: 6,
    distance: 10
  });
  $('#serialize_output').text(
    group.sortable("serialize").get().join("\n"));
