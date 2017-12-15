    function intro_section() {
        var width = 250,
            height = 250;

        var projection = d3.geo.albers()
            .rotate([4.4, 0])
            .center([78.491684, 17.387140])
            .scale(80000)
            .translate([-31010.457214668248, 127317.7578012199]);

        var path = d3.geo.path()
            .projection(projection);

        var svg = d3.select("#city-map").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("data-map/hyderabad.json", function(error, data) {
            projection
                .scale(1)
                .translate([0, 0]);

            var b = path.bounds(data),
                s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

            
            projection
                .scale(s)
                .translate(t);



            svg.append("path")
                .datum(data)
                .attr("class", "outline")
                .attr("d", path)
                .attr("fill", "white");
        });
    }

    function summary_section(data) {

        var total_deficit = data.find(function(d) {
            return d.name == "Total Surplus/Deficit"
        })
        var chart_config_1 = {
            "height": "400",
            "width": "700"
        }
        var first_row = d3.select("#vis-summary").append("div")
            .attr("class", "row total-deficit")
            .append("div")
            .attr("class", "col-lg-8 col-lg-offset-2")
            .style("text-align", "center")


        first_row.append("h3")
            .attr("class", "row sec-vis-title")
            .text(total_deficit.name)

        first_row.append("div")
            .attr("class", "row sec-vis-descrpt")
            .text(total_deficit.def)

        first_row.append("div")
            .attr("class", "row sec-vis")
            .attr("id", "sec-vis-sum-deficit")
            .each(function(d) {
                draw_groupbarchart(total_deficit, "#sec-vis-sum-deficit")
            })

        d3.select("#vis-summary").append("hr").attr("class", "title-hr")

        var expenditure = data.filter(function(d) {
            return (d.name == "Capital Expenditure (C2)" || d.name == "Revenue Expenditure (B2)")
        })

        var chart_config_2 = {
            "height": "300",
            "width": "550"
        }

        
        var second_row = d3.select("#vis-summary").append("div")
            .attr("class", "row sum-expenditure")
            .selectAll("div")
            .data(expenditure)
            .enter()
            .append("div")
            .attr("class", "col-lg-6")
            .style("padding", "20px")



        second_row.append("div")
            .attr("class", "sec-vis-title")
            .append("h3")
            .attr("class", "")
            .text(function(d) {
                return d.name
            })

        second_row.append("div")
            .attr("class", " ")
            .append("div")
            .attr("class", "sec-vis-descrpt")
            .text(function(d) {
                return d.def
            })

        second_row.append("div")
            .attr("class", "row sec-vis")
            .attr("id", function(d) {
                return d.name.replace(/()\s/, '').toLowerCase().substring(0, 10)
            })
            .each(function(d) {
                draw_groupbarchart(d, "#" + d.name.replace(/()\s/, '').toLowerCase().substring(0, 10), chart_config_2)
            })


        d3.select("#vis-summary").append("hr").attr("class", "title-hr")

        var receipts = data.filter(function(d) {
            return (d.name == "Capital Receipts (C1)" || d.name == "Revenue Receipts (B1)")
        })

        var chart_config_2 = {
            "height": "300",
            "width": "550"
        }

        var third_row = d3.select("#vis-summary").append("div")
            .attr("class", "row sum-receipts")
            .selectAll("div")
            .data(receipts)
            .enter()
            .append("div")
            .attr("class", "col-lg-6")
            .style("padding", "20px")



        third_row.append("div")
            .attr("class", "sec-vis-title")
            .append("h3")
            .attr("class", "")
            .text(function(d) {
                return d.name
            })

        third_row.append("div")
            .attr("class", " ")
            .append("div")
            .attr("class", "sec-vis-descrpt")
            .text(function(d) {
                return d.def
            })

        third_row.append("div")
            .attr("class", "row sec-vis")
            .attr("id", function(d) {
                return d.name.replace(/()\s/, '').toLowerCase().substring(0, 10)
            })
            .each(function(d) {
                draw_groupbarchart(d, "#" + d.name.replace(/()\s/, '').toLowerCase().substring(0, 10), chart_config_2)
            })
    }


    function money_outflow(capital_exp, revenue_exp) {
        

        function tabulate(data, columns, parent_id) {
            
            var table = d3.select("#" + parent_id).append('table')
                .attr("class", "table")
            var thead = table.append('thead')
            var tbody = table.append('tbody');

            // append the header row
            thead.append('tr')
                .selectAll('th')
                .data(columns).enter()
                .append('th')
                .text(function(column) { return column; });

            // create a row for each object in the data
            var rows = tbody.selectAll('tr')
                .data(data)
                .enter()
                .append('tr')
                .style("background-color", function(d, i, j){
                    
                    if (i<(data.length/3)){
                        return "#88A61B"
                    }
                    else if (i<(data.length*2/3)){
                        return "#F29F05"
                    }
                    else{
                        return "#FF893B"
                    }
                });

            // create a cell in each row for each column
            var cells = rows.selectAll('td')
                .data(function(row, i) {

                    if (i != 0) {
                        return columns.map(function(column) {
                            return { column: column, value: row[column] };
                        });
                    } else {

                        return columns.map(function(column, index) {
                            
                            return index == 0 ? { column: column, value: row["Detailed Account Code Description"] } : { column: column, value: row[column] }
                        })
                    }
                })
                .enter()
                .append('td')
                .text(function(d, i, j) {
                    if (i == 0 && j != 0) {
                        temp = d.value.split("(")[0]
                        return temp.slice(10, temp.length)
                    } else {
                        return d.value;
                    }
                })
                ;

            return table;
        }


        var selected_year = "2016-17  Budget Estimates"

        dept_capital = capital_exp.filter(function(d) {
            return (d.record_type == "total")
        })
        dept_capital = dept_capital.sort(function(a, b) {
            return b[selected_year] - a[selected_year]
        })

        for (var i in dept_capital) {
            dept_capital[i][selected_year] = (dept_capital[i][selected_year] * 1).toFixed(2)
            dept_capital[i]["Percentage"] = (dept_capital[i][selected_year] / dept_capital[0][selected_year] * 100).toFixed(2)
        }

        tabulate(dept_capital, ['Function', selected_year, "Percentage"], "capital-exp");
        


        dept_revenue = revenue_exp.filter(function(d) {
            //
            return (d.record_type == "total")
        })
        
        dept_revenue = dept_revenue.sort(function(a, b) {
            return b[selected_year] - a[selected_year]
        })
        
        for (var i in dept_revenue) {
            dept_revenue[i][selected_year] = (dept_revenue[i][selected_year] * 1).toFixed(2)
            dept_revenue[i]["Percentage"] = (dept_revenue[i][selected_year] / dept_revenue[0][selected_year] * 100).toFixed(2)
        }
        
        tabulate(dept_revenue, ['Function', selected_year, "Percentage"], "revenue-exp");

        d3.select("#expenditure-fig").text(function(d) {
            return (parseFloat(dept_capital[0][selected_year]) + parseFloat(dept_revenue[0][selected_year]))
        })
        .style("font-weight", "bold")

        var capital_summary = d3.select("#capital-exp-sum")
        
        capital_summary.append("h4")
        .html("<b> Capital Expenditure : " + dept_capital[0][selected_year] + " Lakh Rs.<b>" )

        capital_summary.append("div")
        .html(function(d){
            return ((parseFloat(dept_capital[0][selected_year]) / (parseFloat(dept_capital[0][selected_year]) + parseFloat(dept_revenue[0][selected_year])) *100 ).toFixed(2) + "% of Total Expenditure" );
        })
        .style("margin-left", "160px")

        var revenue_summary = d3.select("#revenue-exp-sum")
        
        revenue_summary.append("h4")
        .html("<b> Revenue Expenditure : " + dept_revenue[0][selected_year] + " Lakh Rs.<b>" )

        revenue_summary.append("div")
        .html(function(d){
            return ((parseFloat(dept_revenue[0][selected_year]) / (parseFloat(dept_capital[0][selected_year]) + parseFloat(dept_revenue[0][selected_year])) *100 ).toFixed(2) + "% of Total Expenditure" );
        })
        .style("margin-left", "160px")

    }

    function prepare_datatable(capital_exp, revenue_exp) {
        
        $('#data-table-expenditure').DataTable({
            data: capital_exp,
            "order": [[ 10, "desc" ]]
        });
        /*table_plot.on('highlight', function(data, on_off) {
            if (on_off) { //if the data is highlighted
                d3.select('#highlighted').text(
                    'Oops, I just stepped over gene ' + data.symb
                );
            }
        });
        table_plot.on('select', function(data, on_off) {
            if (on_off) { //if the data is highlighted
                d3.select('#selected').text(
                    'And it was the chosen one ' + data.GeneID
                );
            }
        });
        */
    }

    function prepare_views(data_table) {
        intro_section()
        summary_section(data_table["summary"])
        money_outflow(data_table["capital_exp"], data_table["revenue_exp"])
        prepare_datatable(data_table["capital_exp"], data_table["revenue_exp"])
    }

    function draw_groupbarchart(data, parent_id, config = {}) {
        
        var formatNumber = d3.format(".1f"),
            formatCrore = function(x) {
                return formatNumber(x / 1e7) + "Cr";
            },
            formatLakh = function(x) {
                return formatNumber(x / 1e5) + "L";
            },
            formatThousand = function(x) {
                return formatNumber(x / 1e3) + "k";
            },
            formatLowerDenom = function(x) {
                return x;
            };

        function formatAbbr(x) {
            var v = Math.abs(x);
            return (v >= .9995e7 ? formatCrore : v >= .9995e5 ? formatLakh : v >= .999e3 ? formatThousand : formatLowerDenom)(x);
        }

        
        nv.addGraph(function() {
            var chartdata;

            var maxValue = d3.max(data.series, function(d) {
                return d3.max(d.values, function(d) {
                    return parseFloat(d.value);
                })
            });
            var minValue = d3.min(data.series, function(d) {
                return d3.min(d.values, function(d) {
                    return parseFloat(d.value);
                })
            });

            var chart = nv.models.multiBarChart()
                .color(["#002A4A", "#FF9311", "#D64700", "#17607D"])
                .x(function(d) {
                    return d.label
                })
                .y(function(d) {
                    return parseFloat(d.value);
                })
                .reduceXTicks(false) //If 'false', every single x-axis tick label will be rendered.
                .rotateLabels(0) //Angle to rotate x-axis labels.
                .showControls(false) //Allow user to switch between 'Grouped' and 'Stacked' mode.
                .groupSpacing(0.2) //Distance between each group of bars.
                .fillOpacity(1);

            if (config.width && config.height) {
                chart.height(config.height)
                    .width(config.width)
            }


            chart.yAxis.ticks(10)
                .tickFormat(function(d) {
                    return formatAbbr(d)
                })
                .axisLabel(data.name)
                .axisLabelDistance(5)
                .ticks(6);

            chart.y(function(d) {
                return parseFloat(d.value)
            })

            chart.tooltip.valueFormatter(function(d) {
                return d3.format(",.f")(d);
            })

            if (maxValue < 0) {
                maxValue = 0;
            }
            if (minValue > 0) {
                minValue = 0;
            }
            chart.yAxis.scale().domain([minValue, maxValue]);

            chart.margin({ "top": 0, "right": 50, "bottom": 50, "left": 120 })
                //.margin({ "left": 120, "right": 120, "top": 00, "bottom": 70 })
                .noData("The record has no values in the budget document.")

            chart.xAxis.axisLabel("Year")
                .axisLabelDistance(5);

            chartdata = d3.select(parent_id)
                .append("svg")
                .datum(data.series)
                .call(chart);

            chartdata.transition().duration(500).call(chart);
            nv.utils.windowResize(chart.update);

            return chart;
        });
    }


    function populate_data() {
        /*d3.json("datasets/greater-hyderabad-municipal-corporation-budget-summary-statement.json", function(d){
            
            data_table ={}
            data_table["summary"] = d
            prepare_views(data_table)
        })*/
        var p = d3.queue()
            .defer(d3.json, "datasets/greater-hyderabad-municipal-corporation-budget-summary-statement.json")
            .defer(d3.csv, "datasets/greater-hyderabad-municipal-corporation-capital-expenditure.csv")
            .defer(d3.csv, "datasets/greater-hyderabad-municipal-corporation-revenue-expenditure.csv")
            .await(prepare_data_table);

        function prepare_data_table(error, summary, capital_exp, revenue_exp) {
            
            data_table = {}
            data_table["summary"] = summary
            data_table["capital_exp"] = capital_exp
            data_table["revenue_exp"] = revenue_exp
            prepare_views(data_table)
        }
    }

    populate_data()