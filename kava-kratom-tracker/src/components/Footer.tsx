export function Footer() {
  const rookReaderUrl = import.meta.env.VITE_ROOKREADER_URL || 'https://rookreader.com'

  return (
    <footer className="mt-16 py-8 border-t border-emerald-800 text-center text-sm text-foreground/70">
      <p>
        For more information on other current bills in your area, please visit{' '}
        <a href={rookReaderUrl} target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">
          RookReader
        </a>
        .
      </p>
    </footer>
  )
}
