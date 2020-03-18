// Basic file manipulation
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Configuration of Markdown-It
import * as MarkdownIt from "markdown-it";
import * as MarkdownItAnchor from "markdown-it-anchor";

// Paths we will process
import { RENDERING_DATA } from "./markdown.paths";

// Our primary Markdown renderer
let markdownIt = MarkdownIt("commonmark")
  .use(MarkdownItAnchor, {
    slugify: function (input: string) {
      // Default slug was encoding colons that are common in our titles, encode hyphen for any special characters
      let slug = input;
      slug = slug.trim();
      slug = slug.toLowerCase();
      slug = slug.replace(/[^a-z|0-9]/g, '-');
      slug = slug.replace(/\-+/g, '-');

      // Don't end with trailing hyphens
      slug = slug.replace(/[-+]$/, '');

      // ID cannot start with a number
      slug = slug.replace(/^([0-9])/, 'id-$1')

      return slug;
    }
  });

function renderMarkdown(markdown: string) {
  // Preprocess to match link, because the library requires they have a protocol,
  // which our links that are Angular interpolations will be lacking (e.g., [{{ linktext }}]({{ linkhref }})).
  //
  // Need lazy matching to handle multiple links in a line, parentheses around a link (i.e., "([text](href))")
  let regexLink = /\[(.+?)\]\((.+?)\)/g;
  markdown = markdown.replace(regexLink, function (match: string, tokenLinkText: string, tokenLinkHREF: string) {
    // Trim the link HREF
    if (tokenLinkHREF) {
      tokenLinkHREF = tokenLinkHREF.trim();
    }

    // Encode quotes in the link text
    tokenLinkText = tokenLinkText.replace(/\"/g, '&quot;');

    // Replace it with an Angular component that will render the link according to its properties
    let generated = `<html><app-generated-link linkHREF="${tokenLinkHREF}">${tokenLinkText}</app-generated-link></html>`;

    return generated;
  });

  // Use the library for primary Markdown rendering
  let renderedMarkdown = markdownIt.render(markdown);

  // We use <html> tags in Markdown so that it will render the HTML, rather than encoding it as a code example.
  // But those are block tags that can then interfere with the desired page.
  // So remove them after the Markdown rendering process.
  let regexHTMLTags = /\<html\>|\<\/html\>/g;
  renderedMarkdown = renderedMarkdown.replace(regexHTMLTags, function (match: string) {
    return '';
  });

  return renderedMarkdown;
}

for (let renderingDataCurrent of RENDERING_DATA) {
  let pathAngularTemplate = `${renderingDataCurrent.pathPrefixTemplate}.template.html`;
  let angularTemplate = readFileSync(pathAngularTemplate, {encoding:"utf-8"});

  // Each piece of content is added as a named ng-template
  let combinedTemplate = "";
  for (let renderingPairCurrent of renderingDataCurrent.markdownRenderingPairs) {
    let markdownCurrent = readFileSync(renderingPairCurrent.pathMarkdown, {encoding:"utf-8"});

    // Render the Markdown
    let renderedCurrent = renderMarkdown(markdownCurrent);

    combinedTemplate += `<ng-template #${renderingPairCurrent.nameDestinationTemplate}>\n`;
    combinedTemplate += `${renderedCurrent.trim()}\n`;
    combinedTemplate += `</ng-template>\n`;
    combinedTemplate += `\n`;
  }

  // The angular template can then use the rendered templates
  combinedTemplate += angularTemplate;

  // Store it at the rendered location to be used by Angular compilation
  let pathRenderedTemplate = `${renderingDataCurrent.pathPrefixTemplate}.rendered.html`;
  writeFileSync(pathRenderedTemplate, combinedTemplate);

  console.log(`Rendered ${pathRenderedTemplate}`);
}
