$(document).ready(function() {
  $.get('/assets/works-about-wikicite.sparql', function(query) {
    sparqlToDataTable(query,"#works-about-wikicite");
  });
});
