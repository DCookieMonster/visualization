GroupApp.controller('groupCtrl', ['$scope','$http', function($scope,$http) {
    window.scrollTo(0, 0);

    var itemSize = 22,
        cellSize = itemSize - 1,
        margin = {top: 50, right: 5, bottom: 5, left: 100};

    var width = 1500,
        height = 200;

    $scope.selected = 'geo';

    $scope.clearDiv = function() {
        $('#one').remove(); // this is my <div> element
        $('#heatmap_one').append('  <div id="one" class="heatmap"></div>');

        $('#two').remove(); // this is my <div> element
        $('#heatmap_two').append('  <div id="two" class="heatmap2"></div>');

    };

    $scope.build_geo = function(response){
        $scope.geo_data=[]
        response.forEach(function(d) {
            $scope.geo_data.push(d)
        });
        $scope.geo_full_data = []
        $scope.geo_user_indexer = {}
        $scope.geo_data.forEach(function(item,index){
            user_id = item.users
            if (!(user_id in   $scope.geo_user_indexer)){
                $scope.geo_user_indexer[user_id] = $scope.geo_full_data.length
                $scope.geo_full_data.push({'user_id':user_id})
            }
            $scope.geo_full_data[$scope.geo_user_indexer[user_id]][item.y]=item.value

        });
        $scope.geo_full_data.sort(dynamicSortMultiple());

        console.log("GEO");
        console.log(  $scope.geo_full_data);


        if (!$scope.geo_user_order ||  $scope.geo_user_order == {}) {

            $scope.geo_user_order = {}
            $scope.geo_full_data.forEach(function (item, index) {
                $scope.geo_user_order[item.user_id] = index + 1
            })
        }
        console.log(  $scope.geo_user_order);
        $scope.build_heatmap(  $scope.geo_data,'.heatmap',$scope.geo_user_order )
    }


    // new data
    $scope.build_tsp = function(response){
        $scope.tsp_data=[]
        response.forEach(function(d) {
            $scope.tsp_data.push(d)
        });
        $scope.tsp_full_data = []
        $scope.tsp_user_indexer = {}
        $scope.tsp_data.forEach(function(item,index){
            user_id = item.users
            if (!(user_id in   $scope.tsp_user_indexer)){
                $scope.tsp_user_indexer[user_id] = $scope.tsp_full_data.length
                $scope.tsp_full_data.push({'user_id':user_id})
            }

            $scope.tsp_full_data[$scope.tsp_user_indexer[user_id]][item.y]=item.value

        });
        console.log("hhh")
        console.log($scope.tsp_full_data)

        $scope.tsp_full_data.sort(dynamicSortMultiple());
        console.log($scope.tsp_full_data)
        if (!$scope.geo_user_order || $scope.geo_user_order == {}) {
            $scope.geo_user_order = {}
            $scope.tsp_full_data.forEach(function (item, index) {
                $scope.geo_user_order[item.user_id] = index + 1
            })
        }
        console.log("TSP");
        console.log($scope.tsp_data);
        $scope.build_heatmap(  $scope.tsp_data,'.heatmap2',$scope.geo_user_order );
    }



    $scope.filterClick = function() {
      $scope.sort_order = {}
      $scope.sort_order_names =   group.sortable("serialize").get()[0].split(',')
      $scope.sort_order_names.forEach(function(item,index){
          $scope.sort_order[item] = index+1
      });

      $scope.clearDiv()
      $scope.geo_users = {}
      $scope.geo_solver = {}
      $scope.geo_user_order = null;

        if ( $scope.selected == 'geo'){
            d3.csv('asset/GEO_data.csv',function(data){
                $scope.raw_geo = data;
                $scope.build_geo($scope.raw_geo)

            });
            d3.csv('asset/TSP_data.csv',function(data){
                $scope.raw_tsp = data;
                $scope.build_tsp($scope.raw_tsp)

            });
        }
        else{
            d3.csv('asset/TSP_data.csv',function(data){
                $scope.raw_tsp = data;
                $scope.build_tsp($scope.raw_tsp)

            });
            d3.csv('asset/GEO_data.csv',function(data){
                $scope.raw_geo = data;
                $scope.build_geo($scope.raw_geo)

            });
        }



    }

    var group = $("ol.limited_drop_targets").sortable({
        group: 'limited_drop_targets',
        isValidTarget: function  ($item, container) {
            if($item.is(".highlight"))
                return true;
            else
                return $item.parent("ol")[0] == container.el[0];
        },
        onDrop: function ($item, container, _super) {
            console.log("change")
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

    $scope.filterClick()

    $scope.build_heatmap = function(response, id, sort_order ) {
      console.log("function start")
      var data2 = response.map(function( item ) {
          var newItem = {};
          newItem.y = item.y;
          newItem.users = item.users;
          newItem.value = item.value;
          return newItem;
      })
      //
      data2.sort(function(a, b) {
           return d3.ascending(sort_order[a.users],sort_order[b.users]);
      });

      var x_elements = d3.set(data2.map(function( item ) { return item.users; } )).values(),
          y_elements = d3.set(data2.map(function( item ) { return item.y } )).values();

      y_elements.sort(function(a, b) {
               return d3.ascending($scope.sort_order[a], $scope.sort_order[b]);

          });
      var xScale = d3.scale.ordinal()
          .domain(x_elements)
          .rangeBands([0, x_elements.length * itemSize]);

      var xAxis = d3.svg.axis()
          .scale(xScale)
          .tickFormat(function (d) {
              return d;
          })
          .orient("top");

      var yScale = d3.scale.ordinal()
          .domain(y_elements)
          .rangeBands([0, y_elements.length * itemSize]);

      var yAxis = d3.svg.axis()
          .scale(yScale)
          .tickFormat(function (d) {
              return d;
          })
          .orient("left");

      var colorScale = d3.scale.linear()
      	.domain([0, 0.5,1])
      	.range(["#FFF", "#99d8c9", "#00441b"])

      var svg = d3.select(id)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // Define the div for the tooltip
          var div = d3.select("body").append("div")
              .attr("class", "tooltip","d3-tip")
              .style("opacity", 0);

      var cells = svg.selectAll('rect')
          .data(data2)
          .enter().append('g').append('rect')
          .attr('class', 'cell')
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('y', function(d) { return yScale(d.y); })
          .attr('x', function(d) { return xScale(d.users); })
          .attr('fill', function(d) { return colorScale(d.value); })
          .on("mouseover", function(d) {
            div.transition()
                // .duration(200)
                .style("opacity", .9)
                .style('background','rgba(0, 0, 0, 0.8)')
                // .style('line-height','1')
                .style('font-weight','bold')
                .style('padding','12px')
                // .style('color','#fff')
                .style('border-radius','2px');

            div	.html(d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style('color','#fff');
            })
        .on("mouseout", function(d) {
            div.transition()
                // .duration(500)
                .style("opacity", 0);
        });

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .selectAll('text')
          .attr('font-weight', 'normal');

      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis)
          .selectAll('text')
          .attr('font-weight', 'normal')
          .style("text-anchor", "start")
          .attr("dx", ".8em")
          .attr("dy", ".5em")
          .attr("transform", function (d) {
              return "rotate(-65)";
          });
    }

    function dynamicSortMultiple() {
        /*
         * save the arguments object as it will be overwritten
         * note that arguments object is an array-like object
         * consisting of the names of the properties to sort by
         */
        var props = $scope.sort_order_names;
        return function (obj1, obj2) {
            var i = 0, result = 0, numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
             * as long as we have extra properties to compare
             */
            while(result === 0 && i < numberOfProperties) {
                result = dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        }
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
            return result * sortOrder;
        }
    }

}]);
