$(document).ready(function() {
  
  $.get('/assets/works-about-wikicite.sparql', function(query) {
    sparqlToDataTable(query,"#works-about-wikicite")
  })

  var table = $('#wikicite-data-stats');
  if (table.length) {
    $.getJSON('https://cors.io/?https://github.com/wikicite/wikicite-data/raw/master/stats.json', function(stats) {

      var rows = []
      var publicationChart = []
      var pubtypesChart = []

      for (let date in stats) {        
        stats[date].date = date
        if (!stats[date].publications) {
          stats[date].publications = {}
        }        
        rows.push(stats[date])

        var p = stats[date].publications
        if (p.items) {
          publicationChart.push({
            x: new Date(date),
            y: p.items
          })
        }
        if (stats[date].pubtypes) {
          pubtypesChart.push({
            x: new Date(date),
            y: stats[date].pubtypes
          })
        }
      }
    
      function fileSize(size) {
        if (!size) return '';
        var e = (Math.log(size) / Math.log(1e3)) | 0;
        return +(size / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
      }

      const numberFormat = $.fn.dataTable.render.number('&thinsp;','.',0)

      table = table.DataTable({ 
        data: rows,
        paging: false,
        searching: false,
        info: false,
        columns: [
          { 
            title: 'Date', 
            data: 'date', 
            className: 'dt-right', 
          }, { 
            title: 'Entities', 
            data: 'entities', 
            className: 'dt-right',
            render: numberFormat,
            defaultContent: '',
          }, {
            title: 'Publications', 
            data: 'publications.items', 
            className: 'dt-right',
            render: function (data, type, row) {
              if (!data) return ''
              var cell = numberFormat.display(data, type, row);
              if (row.entities) {
                cell += ' = ' + numberFormat.display(100*data/row.entities) + "%"
              }
              return cell
            },
          }, {
            title: 'Compressed Size', 
            data: function (row) {
              if (!row.size && !row.publications.size) return ''
              return fileSize(row.publications.size) + ' / ' + fileSize(row.size) 
            },
            className: 'dt-right',
          }, {
            title: 'Types', 
            data: 'pubtypes', 
            className: 'dt-right',
            render: numberFormat,
            defaultContent: '',
          },
        ]
      })

      var chart = $('#stats-chart')
      if (chart.length) {

        chart = new Chart(chart, {
          type: 'line',
          data: {
            datasets: [{
              label: 'publication items',
              data: publicationChart,
              type: 'line',
              fill: false,
              yAxisID: 'left-axis',
              borderColor: '#33CCCC',
              backgroundColor: '#33CCCC',
            },{
              label: 'publication types',
              data: pubtypesChart,
              type: 'line',
              fill: false,
              yAxisID: 'right-axis',
              borderColor: '#AAAAAA',
              backgroundColor: '#AAAAAA',
              pointRadius: 1,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              xAxes: [{
                type: 'time',
                distribution: 'series',
                ticks: { source: 'labels' }
              }],
              yAxes: [{
                position: 'left',
                id: 'left-axis'
              },{
                position: 'right',
                id: 'right-axis',
                gridLines: { drawOnChartArea: false },
              }]
            }
          }
        })
      }

    })
  }
})
