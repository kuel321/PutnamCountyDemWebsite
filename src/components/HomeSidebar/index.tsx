import { CandidateAdsSpotlight } from './CandidateAdsSpotlight'
import { NewsReel } from './NewsReel'
import { UpcomingMeetings } from './UpcomingMeetings'

export function HomeSidebar() {
  return (
    <aside className="space-y-6">
      <NewsReel />
      <CandidateAdsSpotlight />
      <UpcomingMeetings />
    </aside>
  )
}
