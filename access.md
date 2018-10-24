---
title: Access
layout: page
---

Bibliographic data from Wikidata can be [accessed in multiple ways](https://www.wikidata.org/wiki/Wikidata:Data_access) such as [SPARQL](https://query.wikidata.org), and [database dumps](https://www.wikidata.org/wiki/Wikidata:Database_download). Several clients exist to simplify data access and to use the data. [Scholia](https://tools.wmflabs.org/scholia/) gives a good overview of possibilities.

The following form uses [citation.js](https://citation.js.org/) to read and process bibliographic items from Wikidata.


<p>
 <div>
  Examples: <ul id="examples" class="inline"></ul>
 </div>
</p>

<p>
 <form onSubmit="return lookupWikidata(this.id.value)">
  <input type="text" name="id" placeholder="Wikidata item, e.g. Q3290152">
  <select id="formats"></select>
  <button type="submit">Submit</button>
  <span><i id="message"></i></span>
 </form>
</p>
<p id="cited-item" style="display:none">
  <a href="" id="wikidata-link" class="wikidata-link">Wikidata item</a>,
  <a href="" id="scholia-link">Scholia profile</a>,
  <a href="" id="wikidata-json-link">Wikidata JSON</a>
</p>
<p id="citation" style="display:none"></p>

<script src="../assets/access.js"></script>
