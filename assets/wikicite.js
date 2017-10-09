$(document).ready(function() {
  
  $.get('/assets/works-about-wikicite.sparql', function(query) {
    sparqlToDataTable(query,"#works-about-wikicite")
  })

  var table = $('#wikicite-data-stats');
  if (table.length) {
    $.getJSON('https://cors.io/?https://github.com/gbv/wikicite-data/raw/master/stats.json', function(stats) {

      var rows = [];
      for (let date in stats) {        
        stats[date].date = date
        if (!stats[date].publications) {
          stats[date].publications = {}
        }
        rows.push(stats[date])
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
    })
  }
})
