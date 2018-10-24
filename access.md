---
title: Access
layout: page
---

Bibliographic data from Wikidata can be [accessed in multiple ways](https://www.wikidata.org/wiki/Wikidata:Data_access) such as [SPARQL](https://query.wikidata.org), and [database dumps](https://www.wikidata.org/wiki/Wikidata:Database_download). Several clients exist to simplify data access. [Scholia](https://tools.wmflabs.org/scholia/) gives a good overview of possibilities.

The following form uses [citation.js](https://citation.js.org/) to read and process bibliographic items from Wikidata.

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

<script src="../assets/access.js"></script>
