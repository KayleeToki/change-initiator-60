export const normalizeExternalUrl = (url: string) => {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const openExternalLink = (url: string) => {
  const destination = normalizeExternalUrl(url);
  const opened = window.open(destination, '_blank', 'noopener,noreferrer');

  if (opened) {
    opened.opener = null;
  }
};
