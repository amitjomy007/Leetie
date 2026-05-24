import './globals.css'

export const metadata = {
  title: 'Leetie — Company-wise Interview Problems',
  description: 'Track company-specific LeetCode problems by frequency.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Persist theme before paint to avoid flash */}
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const t = localStorage.getItem('leetie_theme') || 'dark';
              if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
            } catch(e) {}
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
