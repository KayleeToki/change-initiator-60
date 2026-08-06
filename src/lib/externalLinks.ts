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

export const copyExternalLink = async (url: string) => {
  const destination = normalizeExternalUrl(url);

  try {
    await navigator.clipboard.writeText(destination);
    return true;
  } catch {
    const input = document.createElement('textarea');
    input.value = destination;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    return copied;
  }
};
