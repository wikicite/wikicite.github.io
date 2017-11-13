const growthChartOptions = {
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        displayFormats: {
          quarter: 'YYYY-MM'
        }
      }
    }],
    yAxes: [{
      //type: 'logarithmic',
      position: 'left',
      id: 'left-axis'
    },{
      //type: 'logarithmic',
      position: 'right',
      id: 'right-axis',
      gridLines: { drawOnChartArea: false },
    }]
  }
}

$(document).ready(function() {
  
  var elem = $('#works-about-wikicite')
  if (elem.length) {
    $.get('/assets/works-about-wikicite.sparql', function(query) {
      sparqlToDataTable(query,elem) //"#works-about-wikicite")
    })
  }

  var table = $('#wikicite-data-stats');
  if (table.length) {
    $.getJSON('wikicite-data/stats.json', function(stats) {

      var rows = []
      var publicationChart = []
      var citationsChart = []

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
        if (p.citations) {
          citationsChart.push({
            x: new Date(date),
            y: p.citations
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
            /*function (value) {
                return numberFormat(value)+"x"
            },*/
            defaultContent: '',
          },{
            title: 'Citations', 
            data: 'publications.citations', 
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
              label: 'citations',
              data: citationsChart,
              type: 'line',
              fill: false,
              yAxisID: 'right-axis',
              borderColor: '#33CC33',
              backgroundColor: '#33CC33',
            }]
          },
          options: growthChartOptions
        })
      }
    })
  }
})
