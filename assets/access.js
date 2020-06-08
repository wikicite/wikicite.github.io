const Cite = require('citation-js')

let citeFormat = 'bibliography'
let citeFormatOptions = {
  format: 'html',
  template: 'apa',
  lang: 'en-US'
}

const citeExamples = [
  'Q163335',
  'Q3020388',
  'Q3290152'
]

var item = null
const formats = {
  apa: "American Psychological Association (APA)",
  harvard1: "Harvard"
}

function notFound() {
  $('#message').text("item not found")
}

function lookupWikidata(id) {
  let match = id.match(/(Q[1-9][0-9]+)/) 
  id = match ? match[1] : null

  $('form > input:first').val(id)

  $('#cited-item').hide()
  $('#citation').hide()
  $('#message').text('loading, please wait...')

  Cite.async(id)
  .then(function(data) {
    $('#message').text('')

    // FIXME: citation.js always returns an instance?
    if (!data || data.getIds()[0] !== id) {
      notFound()
      return
    } else {
      item = data
    }

    $('#wikidata-link').attr('href', 'http://www.wikidata.org/entity/'+id)
    $('#scholia-link').attr('href', 'https://scholia.toolforge.org/work/'+id)
    $('#wikidata-json-link').attr('href', 'http://www.wikidata.org/entity/'+id+'.json')
    $('#cited-item').show()
    showItem()
  }).catch(notFound)

  return false
}

function showItem() {
  if (!item) return

  let format = $('#formats').val()

  if (format === 'data' || format === 'bibtex') {
    citeFormat = format
  } else {
    if (!formats[format]) {
      format = 'apa'
      $('#formats').val('apa')
    }
    citeFormat = 'bibliography'
    citeFormatOptions.format = 'html'
    citeFormatOptions.template = format
  }
  
  $('#citation').show().html(item.format(citeFormat, citeFormatOptions))
}

$(function () {
  let examplesList = $("#examples")
  citeExamples.forEach( function(id) {
    examplesList.append(
      $('<li>').append(
        $('<a>').text(id).click(function() {
          lookupWikidata(id)
        })
      )
    )
  })

  let select = $("#formats")
  $.each(formats, function(value, text) {
    select.append(new Option(text, value))
  })
  select.append(new Option('BibTeX', 'bibtex'))
  select.append(new Option('CLS-JSON', 'data'))
  select.change(showItem)

  const urlParams = new URLSearchParams(window.location.search)
  const format = urlParams.get('format')
  if (format in formats) {
    $('#formats').val(format)
  }
  let id = urlParams.get('id')
  if (id) {
    lookupWikidata(id)
  }
})
