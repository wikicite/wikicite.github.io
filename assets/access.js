const Cite = require('citation-js')
var item = null
const formats = {
  apa: "American Psychological Association (APA)",
  //bibtex: "BibTeX",
}

function lookupWikidata(id) {
  let match = id.match(/(Q[1-9][0-9]+)/) 
  id = match ? match[1] : null

  $('#link').hide()
  $('#reference').hide()
  $('#message').text('loading, please wait...')

  item = id ? new Cite(id) : null
  if (item) {
    $('#message').text('')
    $('#link').attr('href', 'http://www.wikidata.org/entity/'+id)
    $('#link').text(id)
    $('#link').show()
    showItem()
  } else {
    $('#message').text("item not found")
    return false
  }

  return false
}

function showItem() {
  if (!item) return

  let format = $('#formats').val()
  if (!formats[format]) {
    $('#formats').val('apa')
  }

  // FIXME: copy from https://larsgw.github.io/citation.js-form/demo/
  let output = item.format('bibliography', {
    format: 'html',
    template: format,
    lang: 'en-US'
  })
  
  $('#reference').html(output).show()
}

$(function () {
  let select = $("#formats")
  $.each(formats, function(value, text) {
    select.append(new Option(text, value));
  })
  select.change(showItem)

  const urlParams = new URLSearchParams(window.location.search)
  const format = urlParams.get('format')
  if (format in formats) {
    $('#formats').val(format)
  }
  let id = urlParams.get('id')
  if (id) {
    $('form > input:first').val(id)
    lookupWikidata(id)
  }
})
