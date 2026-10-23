export default function SampleBallotAdminHint() {
  return (
    <p style={{ margin: '0 0 1rem', color: 'var(--theme-elevation-600)' }}>
      The races and candidates themselves aren&apos;t edited here — they live under{' '}
      <a href="/admin/collections/ballot-races">Sample Ballot → Ballot Races</a> (and the precinct
      groups under{' '}
      <a href="/admin/collections/ballot-styles">Sample Ballot → Ballot Styles</a>). This block just
      places the ballot on the page.
    </p>
  )
}
