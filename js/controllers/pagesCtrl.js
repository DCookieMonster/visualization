/**
 * Created by dor on 28/07/2016.
 */

Mainapp.controller("songsCtrl", function($scope, $http, $window) {
    window.scrollTo(0, 0);
    $scope.COLOR = {}
    $scope.COLOR.CORRECT = '#2F4F4F'
    $scope.COLOR.INCORRECT = '#008080'
    $scope.COLOR.HOVER = '#3CB371'
    $scope.COLOR.LINE = "#90EE90"
    $scope.COLOR.BLACK = '#000'
    $scope.result = "";

    $scope.drawBarGrah = function(id, raw_data, label) {
        // console.log(raw_data);
        raw_data = raw_data.sort(sortByKey);

        function sortByKey(a, b) {
            if (parseInt(a.key) > parseInt(b.key)) {
                return 1
            }
            if (parseInt(a.key) < parseInt(b.key)) {
                return -1
            }
            return 0
        };
        $scope.min_age_ = raw_data[0].key
        $scope.max_age_ = raw_data[raw_data.length - 1].key
        var ctx = document.getElementById(id);
        var labels = [];
        var arr_data = [];

        for (i in raw_data) {
            labels.push(raw_data[i].key);
            arr_data.push(raw_data[i].values.length);
        }
        var age_info = []
        for (i in $scope.age_ratio) {
            age_info.push($scope.age_ratio[i]['raito'] * $scope.record_num)
        }
        // console.log(age_info);

        var bar_data = {
            labels: labels,
            datasets: [{
                label: "Population Distribution by Age",

                type: "line",
                borderColor: $scope.COLOR.BLACK,

                pointBorderColor: $scope.COLOR.BLACK,
                pointBackgroundColor: "#fff",

                pointHoverBackgroundColor: $scope.COLOR.BLACK,
                pointHoverBorderColor: $scope.COLOR.BLACK,

                data: age_info,
            }, {
                label: "Participant Distribution by Age",
                backgroundColor: $scope.COLOR.INCORRECT,
                borderColor: $scope.COLOR.CORRECT,
                borderWidth: 1,
                hoverBackgroundColor: $scope.COLOR.HOVER,
                hoverBorderColor: $scope.COLOR.CORRECT,
                data: arr_data,

            }]
        };

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: bar_data,
            options: {
                responsive: false,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

            }


        });
    }

    $scope.drawPieChart = function(id, raw_data, label, type) {
        var ctx = document.getElementById(id);
        var labels = [];
        var data = [];
        for (i in raw_data) {
            labels.push(raw_data[i].key);

            data.push(raw_data[i].values.length);
        }
        var data = {
            labels: labels,
            datasets: [{
                label: label,
                backgroundColor: [
                    $scope.COLOR.CORRECT,
                    $scope.COLOR.INCORRECT
                ],
                // borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: $scope.COLOR.HOVER,
                // hoverBorderColor: "rgba(255,99,132,1)",
                data: data,
            }]
        };

        var myChart = new Chart(ctx, {
            type: type,
            data: data,
            options: {

            }
        });

    }

    $scope.draw = function(result) {
        var gender_data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) {
                return d.gender;
            })
            .entries(result)
        $scope.drawPieChart('myChart', gender_data, "Gender", 'pie')


        var start_data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) {
                return d.voteA;
            })
            .entries(result)

        var middle_data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) {
                return d.voteB;
            })
            .entries(result)

        var end_data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) {
                return d.voteOwn;
            })
            .entries(result)

        var age_data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) {
                return d.age;
            })
            .entries(result)
        $scope.drawBarGrah("ageChart", age_data, "Age")

        var solver_data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) {
                if (d.choose == "d") {
                    return "true"
                } else {
                    return "false"
                }
            })
            .entries(result)
        solver_data[0].background = $scope.COLOR.CORRECT
        if (solver_data.length > 1) {
            solver_data[1].background = "rgba(255, 0, 0, 0)"
        }
        $scope.drawPieChart("solver", solver_data, "solve", 'pie')

        if (start_data[0].key == 'incorrect') {
            verify_data_A_t = start_data[0].values.length
            verify_data_A = start_data.length > 1 ? start_data[1].values.length : 0

        } else {
            verify_data_A_t = start_data.length > 1 ? start_data[1].values.length : 0
            verify_data_A = start_data[0].values.length
        }
        if (middle_data[0].key == 'correct') {
            verify_data_B_t = middle_data.length > 1 ? middle_data[1].values.length : 0
            verify_data_B = middle_data[0].values.length
        } else {
            verify_data_B = middle_data.length > 1 ? middle_data[1].values.length : 0
            verify_data_B_t = middle_data[0].values.length
        }
        if (end_data[0].key == 'correct') {
            verify_data_Own_t = end_data.length > 1 ? end_data[1].values.length : 0
            verify_data_Own = end_data[0].values.length
        } else {
            verify_data_Own = end_data.length > 1 ? end_data[1].values.length : 0
            verify_data_Own_t = end_data[0].values.length
        }

        verify_data = [
            [verify_data_A, verify_data_A_t],
            [verify_data_B, verify_data_B_t],
            [verify_data_Own, verify_data_Own_t]
        ]
        $scope.drawStackBar('chartContainer', verify_data, "Verify Solution", "Solution", "% of Verification")


        var dataset = [[],[]]
        var solver_verify_data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) {
                if(d.solve){
                  return "Solver"
                }
                else{
                  return "nonSolver"
                }
            }).sortKeys(d3.ascending)
            .rollup(function(leaves) {
              return {"length": leaves.length, "voteA": (d3.sum(leaves, function(d) {return d.voteA=="incorrect"})/leaves.length)*100
              ,"voteB": (d3.sum(leaves, function(d) {return d.voteB=="correct"})/leaves.length)*100,
              "voteOwn": (d3.sum(leaves, function(d) {return d.voteOwn=="correct"})/leaves.length)*100}
            })
            .entries(result)
        console.log(solver_verify_data);
        dataset[0]=[solver_verify_data[0].value.voteA,solver_verify_data[0].value.voteB,solver_verify_data[0].value.voteOwn]
        dataset[1]= solver_verify_data.length > 1 ?  [solver_verify_data[1].value.voteA,solver_verify_data[1].value.voteB,solver_verify_data[1].value.voteOwn]
        :[0,0,0]
        var key = solver_verify_data.length >1 ? [solver_verify_data[0].key,solver_verify_data[1].key]: [solver_verify_data[0].key,""]
        $scope.drawRadarGraph('radar_g',dataset,['Wrong Solution', 'Correct Solution', 'Own Solution'],key)

    }

    $scope.drawStackBar = function(id, data, title, axisx_text, axisy_text) {
        CanvasJS.addColorSet("greenShades", [ //colorSet Array
            $scope.COLOR.CORRECT,
            $scope.COLOR.INCORRECT,
            $scope.COLOR.BLACK,
            $scope.COLOR.HOVER,
            $scope.COLOR.LINE
        ]);
        var chart = new CanvasJS.Chart(id, {
            // title: {
            //     text: title
            // },
            colorSet: "greenShades",
            animationEnabled: true,
            axisX: {
                title: axisx_text
            },
            axisY: {
                title: axisy_text
            },
            data: [{
                    type: "stackedColumn100",
                    name: "Correct",
                    showInLegend: "false",
                    dataPoints: [{
                        y: data[0][0],
                        label: "Wrong Solution"
                    }, {
                        y: data[1][0],
                        label: "Correct Solution"
                    }, {
                        y: data[2][0],
                        label: "Own Solution"
                    }]
                }, {
                    type: "stackedColumn100",
                    name: "Incorrect",
                    showInLegend: "false",
                    dataPoints: [{
                        y: data[0][1],
                        label: "Wrong Solution"
                    }, {
                        y: data[1][1],
                        label: "Correct Solution"
                    }, {
                        y: data[2][1],
                        label: "Own Solution"
                    }]
                }, {
                    type: "line",
                    name: "Random",
                    showInLegend: "true",
                    dataPoints: [{
                        label: "Wrong Solution",
                        y: 50
                    }, {
                        label: "Correct Solution",
                        y: 50
                    }, {
                        label: "Own Solution",
                        y: 50
                    }]
                }

            ]
        });

        chart.render();
    }

    $scope.drawRadarGraph = function(id,dataset,labels,titles){

      var ctx = document.getElementById(id);

      var data = {
    labels: labels,
    datasets: [
        {
            label: titles[0],
            backgroundColor: "rgba(149, 165, 165, 0.6)",
            borderColor: $scope.COLOR.CORRECT,
            pointBackgroundColor: "rgba(149, 165, 165, 0.6)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: dataset[0]
        },
        {
            label: titles[1],
            backgroundColor: "rgba(47, 79, 79, 0.48)",
            borderColor: $scope.COLOR.INCORRECT,
            pointBackgroundColor: "rgba(47, 79, 79, 0.48)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(47, 79, 79, 0.48)",
            data: dataset[1]
        }
    ]
}
var myRadarChart = new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {}
});
    }

    $scope.init = function() {
        $scope.charts = []
        $scope.slider = new Slider('#ex2', {});
        $http.get("asset/age_ratio.json")
            .then(function(response) {
                // console.log(response.data);
                $scope.age_ratio = response.data;
                $scope.age_ratio_hash = []

            });
        $http.get("asset/people.json")
            .then(function(response) {
                // console.log(response.data);
                $scope.result = response.data;
                $scope.record_num = $scope.result.length
                // console.log($scope.result);
                for (i in $scope.result) {
                    $scope.result[i]['solve'] = $scope.result[i]['choose'] == 'd' ? true : false
                    $scope.result[i]['voteA'] = $scope.result[i]['voteA'] == 'incorrect' ? 'correct' : 'incorrect'
                    $scope.result[i]['timeSolution'] = parseInt($scope.result[i]['timeSolution'])
                    $scope.result[i]['age'] = parseInt($scope.result[i]['age'])
                }
                $scope.filterClick()

            });


    }

    $scope.init();

    $scope.tabClick = function(tab) {
        $('.tab').removeClass('active')
        $('.main_tab').addClass('hide')
        $('#' + tab).removeClass('hide')
        $('#li_' + tab).addClass('active')
          $scope.filterClick()

    }

    $scope.filterClick = function() {
        var min_age = $scope.slider.getValue()[0]
        var max_age = $scope.slider.getValue()[1]
        $scope.filter_data = jQuery.extend([], $scope.result);

        for (var i = $scope.filter_data.length - 1; i >= 0; i--) {
            var participant = $scope.filter_data[i]
            if (!is_solver() && participant['solve'] == true) {
                $scope.filter_data.splice(i, 1);
                continue
            }
            if (!is_nonsolver() && participant['solve'] == false) {
                $scope.filter_data.splice(i, 1);
                continue
            }
            if (!is_male() && participant['gender'] == 'male') {
                $scope.filter_data.splice(i, 1);
                continue
            }
            if (!is_female() && participant['gender'] == 'female') {
                $scope.filter_data.splice(i, 1);
                continue
            }
            if (parseInt(participant['age']) < min_age || parseInt(participant['age']) > max_age) {
                $scope.filter_data.splice(i, 1);
                continue
            }
        }
        $scope.clearCanvas()
        $scope.draw($scope.filter_data)
        $scope.list = $scope.filter_data
        $scope.filteredList = $scope.list
        $scope.config = {
            itemsPerPage: 10,
            fillLastPage: true
        }
        $scope.updateFilteredList();

    }

    function is_solver() {
        return $('#solver_check')[0].checked
    }

    function is_nonsolver() {
        return $('#nonsolver')[0].checked
    }

    function is_male() {
        return $('#male')[0].checked
    }

    function is_female() {
        return $('#female')[0].checked
    }

    $scope.clearCanvas = function() {
        $('#myChart').remove(); // this is my <canvas> element
        $('#top_canvas_gender').append('<canvas id="myChart" width="200" height="200"></canvas>');

        $('#ageChart').remove(); // this is my <canvas> element
        $('#top_canvas_age').append('<canvas id="ageChart" width="800" height="500"></canvas>');

        $('#chartContainer').remove(); // this is my <canvas> element
        $('#top_canvas_verify').append('<div id="chartContainer" style="height: 300px; width:100%"></div>');

        $('#solver').remove(); // this is my <canvas> element
        $('#top_canvas_solver').append('<canvas id="solver" width="200" height="200"></canvas>');

        $('#radar_g').remove(); // this is my <canvas> element
        $('#top_canvas_radar').append('<canvas id="radar_g" width="200" height="200"></canvas>');


    }


});
