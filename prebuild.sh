#!/bin/sh

SASS_COMMAND=node_modules/.bin/sass
WEBPACK_COMMAND=node_modules/.bin/webpack

crails templates build \
  -r html \
  -i views \
  -t Crails::HtmlTemplate \
  -z crails/html_template.hpp \
  -n OldSchoolHtmlRenderer \
  -p \.html$ \
  -v

mkdir -p build/javascripts
mkdir -p build/sass

npm install
$WEBPACK_COMMAND

$SASS_COMMAND -s compressed "stylesheets/layout.scss" > build/sass/layout.css
$SASS_COMMAND -s compressed "stylesheets/admin.scss"  > build/sass/admin.css

crails-builtin-assets \
  --inputs "build/javascripts" "build/sass" "stylesheets/fonts" \
  --output "lib/assets" \
  --classname "OldSchoolAssets" \
  --compression "gzip" \
  --uri-root "/cms/plugins/old-school/assets/"
