---
title: Access
layout: page
---

Bibliographic data in Wikidata can be [accessed in multiple ways](https://www.wikidata.org/wiki/Wikidata:Data_access) such as [SPARQL](https://query.wikidata.org), and [database dumps](https://www.wikidata.org/wiki/Wikidata:Database_download). Several clients exist to simplify data access. The following form uses [citation.js](https://citation.js.org/) to read and process bibliographic items from Wikidata.

<script type="text/javascript">
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
</script>

<div style="border: 1px solid #ddd; padding: 0em 0.5em">
<p>
 <form onSubmit="return lookupWikidata(this.id.value)">
  <input type="text" name="id" placeholder="Wikidata item, e.g. Q3290152">
  <select id="formats"></select>
  <button type="submit">Submit</button>
  <span><i id="message"></i></span>
  <a href="" id="link"></a>
 </form>
</p>
<p id="reference"></p>
</div>
