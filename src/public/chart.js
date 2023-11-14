google.charts.load('current', { 'packages': ['corechart'] });


google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'Sales', 'Expenses'],
    ['2013', 1000, 400],
    ['2014', 1170, 460],
    ['2015', 660, 1120],
    ['2016', 1030, 540]
  ]);

  var options = {
    title: 'Company Performance',
    hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 }
  };

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}




google.charts.setOnLoadCallback(draw3DPieChart);

function draw3DPieChart() {
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Shoes', 11],
    ['Accessory', 4],
    ['Others', 5],
    ['Clothing', 7]
  ]);

  var options = {
    title: 'My Daily Activities',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
  chart.draw(data, options);
}


google.charts.setOnLoadCallback(drawAccountChart);

      function drawAccountChart() {
        var data = google.visualization.arrayToDataTable([
          ['Month', 'Cloth', 'Sneaker'],
          ['1',  1000,      400],
          ['2',  1170,      460],
          ['3',  660,       1120],
          ['4',  430,      840],
          ['5',  530,      640],
          ['6',  230,      940],
          ['7',  930,      640],
          ['8',  1230,      1140],
          ['9',  1360,      740],
          ['10',  1530,      440],
          ['11',  1330,      340],
          ['12',  630,      240],
        ]);

        var options = {
          title: 'Company Performance',
          hAxis: {title: '2022',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          width:700,
          heigh:700,
        };

        var chart = new google.visualization.AreaChart(document.getElementById('user_chart'));
        chart.draw(data, options);
      }


google.charts.setOnLoadCallback(drawAxisTickColors);

function drawAxisTickColors() {
  var data = new google.visualization.DataTable();
  data.addColumn('timeofday', 'Time of Day');
  data.addColumn('number', 'Today');
  data.addColumn('number', 'Average');

  data.addRows([
    [{ v: [8, 0, 0], f: '8 am' }, 1, .25],
    [{ v: [9, 0, 0], f: '9 am' }, 2, .5],
    [{ v: [10, 0, 0], f: '10 am' }, 3, 1],
    [{ v: [11, 0, 0], f: '11 am' }, 4, 2.25],
    [{ v: [12, 0, 0], f: '12 pm' }, 5, 2.25],
    [{ v: [13, 0, 0], f: '1 pm' }, 6, 3],
    [{ v: [14, 0, 0], f: '2 pm' }, 7, 4],
    [{ v: [15, 0, 0], f: '3 pm' }, 8, 5.25],
    [{ v: [16, 0, 0], f: '4 pm' }, 9, 7.5],
    [{ v: [17, 0, 0], f: '5 pm' }, 10, 10],
  ]);

  var options = {
    title: 'Motivation and Energy Level Throughout the Day',
    focusTarget: 'category',
    hAxis: {
      title: 'Time of Day',
      format: 'h:mm a',
      viewWindow: {
        min: [7, 30, 0],
        max: [17, 30, 0]
      },
      textStyle: {
        fontSize: 14,
        color: '#053061',
        bold: true,
        italic: false
      },
      titleTextStyle: {
        fontSize: 18,
        color: '#053061',
        bold: true,
        italic: false
      }
    },
    vAxis: {
      title: 'Rating (scale of 1-10)',
      textStyle: {
        fontSize: 18,
        color: '#67001f',
        bold: false,
        italic: false
      },
      titleTextStyle: {
        fontSize: 18,
        color: '#67001f',
        bold: true,
        italic: false
      }
    }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('throughout_chart'));
  chart.draw(data, options);
}
