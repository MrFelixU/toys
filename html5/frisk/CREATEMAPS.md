You need to create a plain svg file.

The root `<svg>` element needs to have attributes of `id="extmap"` and `class="map"`.

Each shape element which represents a country needs to have the following:

- an `id` attribute with a sensible identifier for that country, e.g. `southafrica` and a `class="country"`

- an attribute `data-neighbours` whose value is a comma-separated list of ids of neighbouring (reachable) countries, e.g. `frisk:neighbours="norway,sweden,russia"`

- a text element somewhere sensible with the same id plus a suffix of `-name`,  e.g. `id="southafrica-name"` and also an attribute of `class="countrynamelabel"`

- a text element somewhere sensible with the same id plus a suffix of `-armies`,  e.g. `id="southafrica-armies"` and also an attribute of `class="countryarmieslabel"`

- a text element somewhere sensible with the same id plus a suffix of `-ruler`,  e.g. `id="southafrica-ruler"` and also an attribute of `class="countryrulerlabel"`
