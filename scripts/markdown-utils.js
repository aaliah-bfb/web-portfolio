const LIST_FIELDS = ['tags', 'techStack'];

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: raw };
  }

  const [, frontMatterBlock, content] = match;
  const data = {};

  frontMatterBlock.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    data[key] = LIST_FIELDS.includes(key)
      ? value.split(',').map((item) => item.trim()).filter(Boolean)
      : value;
  });

  return { data, content: content.trim() };
}

/**
 * Fetches and parses a single markdown post.
 * mdPath is relative to whichever HTML page is calling this.
 */
async function loadPost(mdPath) {
  const response = await fetch(mdPath);
  if (!response.ok) {
    throw new Error(`Could not load ${mdPath} (${response.status})`);
  }
  const raw = await response.text();
  return parseFrontMatter(raw);
}