publicationsSparql = `
SELECT ?date ?work ?workLabel ?topics
WITH {
  SELECT DISTINCT ?work WHERE {
    ?work wdt:P921 / (wdt:P361+ | wdt:P1269+ | (wdt:P31* / wdt:P279*) ) wd:Q30035267 .
  }
  LIMIT 500
} AS %works
WITH {
  SELECT (MAX(?dates) as ?datetime) ?work (GROUP_CONCAT(?topic_label; separator=" // ") AS ?topics) WHERE {
    INCLUDE %works
    ?work wdt:P921 ?topic . 
    OPTIONAL { ?work wdt:P577 ?dates . }
    ?topic rdfs:label ?topic_label .  FILTER (lang(?topic_label) = 'en')
  }
  GROUP BY ?work
} AS %result
WHERE {
  INCLUDE %result
  BIND(xsd:date(?datetime) AS ?date)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }
}
ORDER BY DESC(?date)
`

$(document).ready(function() {
  sparqlToDataTable(publicationsSparql,"#publications");
});
