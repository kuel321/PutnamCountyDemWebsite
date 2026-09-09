import * as migration_20260826_131212_baseline from './20260826_131212_baseline';
import * as migration_20260907_215302_candidates_districts from './20260907_215302_candidates_districts';
import * as migration_20260907_220845_highlights_club_members from './20260907_220845_highlights_club_members';
import * as migration_20260907_222600_minutes_submissions from './20260907_222600_minutes_submissions';
import * as migration_20260907_223000_minutes_file_upload from './20260907_223000_minutes_file_upload';
import * as migration_20260907_232900_footer_credit_link from './20260907_232900_footer_credit_link';
import * as migration_20260909_143000_meeting_minutes_drafts from './20260909_143000_meeting_minutes_drafts';

export const migrations = [
  {
    up: migration_20260826_131212_baseline.up,
    down: migration_20260826_131212_baseline.down,
    name: '20260826_131212_baseline',
  },
  {
    up: migration_20260907_215302_candidates_districts.up,
    down: migration_20260907_215302_candidates_districts.down,
    name: '20260907_215302_candidates_districts',
  },
  {
    up: migration_20260907_220845_highlights_club_members.up,
    down: migration_20260907_220845_highlights_club_members.down,
    name: '20260907_220845_highlights_club_members',
  },
  {
    up: migration_20260907_222600_minutes_submissions.up,
    down: migration_20260907_222600_minutes_submissions.down,
    name: '20260907_222600_minutes_submissions'
  },
  {
    up: migration_20260907_223000_minutes_file_upload.up,
    down: migration_20260907_223000_minutes_file_upload.down,
    name: '20260907_223000_minutes_file_upload'
  },
  {
    up: migration_20260907_232900_footer_credit_link.up,
    down: migration_20260907_232900_footer_credit_link.down,
    name: '20260907_232900_footer_credit_link'
  },
  {
    up: migration_20260909_143000_meeting_minutes_drafts.up,
    down: migration_20260909_143000_meeting_minutes_drafts.down,
    name: '20260909_143000_meeting_minutes_drafts'
  },
];
