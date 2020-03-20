class MarkdownRenderingPair {
  constructor(
    public pathMarkdown:string, // Path to the Markdown file
    public nameDestinationTemplate:string // Name of the destination template
  ) {
  }
}

class MarkdownRenderingData {
  constructor(
    public pathPrefixTemplate:string, // Prefix for the template and the rendered template
    public markdownRenderingPairs:MarkdownRenderingPair[] // Markdown files to be rendered into the template
  ) {
  }
}

export const RENDERING_DATA:MarkdownRenderingData[] = [
  new MarkdownRenderingData(
    'src/app/calendar/calendar.component',
    [
      new MarkdownRenderingPair(
        'src/app/calendar/calendar.component.content.md',
        'content'
      )
    ]
  ),
  new MarkdownRenderingData(
    'src/app/home/home.component',
    [
      new MarkdownRenderingPair(
        'src/app/home/home.component.content.md',
        'content'
      )
    ]
  ),
];
