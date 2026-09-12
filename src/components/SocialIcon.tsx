function getPlatform(url: string): 'facebook' | 'instagram' | 'x' | 'youtube' | 'website' {
  let hostname = ''
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'website'
  }

  if (hostname.includes('facebook.com')) return 'facebook'
  if (hostname.includes('instagram.com')) return 'instagram'
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'x'
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube'
  return 'website'
}

const platformLabels = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X (Twitter)',
  youtube: 'YouTube',
  website: 'Website',
}

export function socialLinkLabel(url: string): string {
  return platformLabels[getPlatform(url)]
}

export function SocialIcon({ url, className }: { url: string; className?: string }) {
  const platform = getPlatform(url)

  switch (platform) {
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76c-.5.5-1.1.9-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.76-1.15 4.9 4.9 0 01-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76a4.9 4.9 0 011.76-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.4a1.17 1.17 0 100-2.34 1.17 1.17 0 000 2.34z" />
        </svg>
      )
    case 'x':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2.4h3.3l-7.2 8.2 8.5 11.2h-6.6l-5.2-6.8-5.9 6.8H2.4l7.7-8.8L1.9 2.4h6.8l4.7 6.3 5.5-6.3zm-1.1 17.4h1.8L7.3 4.2H5.4L17.8 19.8z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.6 7.2s-.21-1.5-.87-2.16c-.83-.87-1.76-.87-2.19-.92C15.44 4 12 4 12 4h-.01s-3.44 0-6.55.12c-.42.05-1.35.05-2.19.92-.66.66-.86 2.16-.86 2.16S2.18 8.95 2.18 10.7v1.6c0 1.75.21 3.5.21 3.5s.2 1.5.86 2.16c.84.87 1.94.84 2.43.93 1.76.17 7.32.22 7.32.22s3.44 0 6.55-.12c.43-.05 1.36-.05 2.19-.92.66-.66.87-2.16.87-2.16s.21-1.75.21-3.5v-1.6c0-1.76-.21-3.5-.21-3.5zM9.96 14.5v-5.4l5.2 2.7-5.2 2.7z" />
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12h18M12 3c2.2 2.4 3.4 5.4 3.4 9s-1.2 6.6-3.4 9c-2.2-2.4-3.4-5.4-3.4-9s1.2-6.6 3.4-9z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      )
  }
}
