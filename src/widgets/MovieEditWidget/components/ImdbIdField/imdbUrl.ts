const IMDB_TITLE_ID = /^tt\d+$/i;

export function getImdbTitleUrl(imdbId?: string): string | undefined {
  const id = imdbId?.trim();
  if (!id || !IMDB_TITLE_ID.test(id)) {
    return undefined;
  }
  return `https://www.imdb.com/title/${id.toLowerCase()}/`;
}
