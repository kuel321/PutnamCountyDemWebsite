import * as migration_20260826_131212_baseline from './20260826_131212_baseline';
import * as migration_20260907_215302_candidates_districts from './20260907_215302_candidates_districts';
import * as migration_20260907_220845_highlights_club_members from './20260907_220845_highlights_club_members';
import * as migration_20260907_222600_minutes_submissions from './20260907_222600_minutes_submissions';
import * as migration_20260907_223000_minutes_file_upload from './20260907_223000_minutes_file_upload';
import * as migration_20260907_232900_footer_credit_link from './20260907_232900_footer_credit_link';
import * as migration_20260909_143000_meeting_minutes_drafts from './20260909_143000_meeting_minutes_drafts';
import * as migration_20260912_152314_candidate_slug_meeting_photos from './20260912_152314_candidate_slug_meeting_photos';
import * as migration_20260912_193409_candidate_office_and_candidates_block from './20260912_193409_candidate_office_and_candidates_block';
import * as migration_20260912_195232_president_messages from './20260912_195232_president_messages';
import * as migration_20260912_195900_president_message_author from './20260912_195900_president_message_author';
import * as migration_20260912_201355_candidate_photos from './20260912_201355_candidate_photos';
import * as migration_20260912_203452_locked_docs_president_messages from './20260912_203452_locked_docs_president_messages';
import * as migration_20260915_150000_media_content_block from './20260915_150000_media_content_block';
import * as migration_20260916_133500_find_district_block from './20260916_133500_find_district_block';
import * as migration_20260917_143700_media_grid_block from './20260917_143700_media_grid_block';
import * as migration_20260917_152500_candidates_layout_blocks from './20260917_152500_candidates_layout_blocks';
import * as migration_20260917_162000_candidate_pages_global from './20260917_162000_candidate_pages_global';
import * as migration_20260917_170500_activity_log from './20260917_170500_activity_log';
import * as migration_20260917_180000_locked_docs_activity_log from './20260917_180000_locked_docs_activity_log';
import * as migration_20260917_183000_fix_media_grid_items_version_ids from './20260917_183000_fix_media_grid_items_version_ids';

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
  {
    up: migration_20260912_152314_candidate_slug_meeting_photos.up,
    down: migration_20260912_152314_candidate_slug_meeting_photos.down,
    name: '20260912_152314_candidate_slug_meeting_photos'
  },
  {
    up: migration_20260912_193409_candidate_office_and_candidates_block.up,
    down: migration_20260912_193409_candidate_office_and_candidates_block.down,
    name: '20260912_193409_candidate_office_and_candidates_block'
  },
  {
    up: migration_20260912_195232_president_messages.up,
    down: migration_20260912_195232_president_messages.down,
    name: '20260912_195232_president_messages'
  },
  {
    up: migration_20260912_195900_president_message_author.up,
    down: migration_20260912_195900_president_message_author.down,
    name: '20260912_195900_president_message_author'
  },
  {
    up: migration_20260912_201355_candidate_photos.up,
    down: migration_20260912_201355_candidate_photos.down,
    name: '20260912_201355_candidate_photos'
  },
  {
    up: migration_20260912_203452_locked_docs_president_messages.up,
    down: migration_20260912_203452_locked_docs_president_messages.down,
    name: '20260912_203452_locked_docs_president_messages'
  },
  {
    up: migration_20260915_150000_media_content_block.up,
    down: migration_20260915_150000_media_content_block.down,
    name: '20260915_150000_media_content_block'
  },
  {
    up: migration_20260916_133500_find_district_block.up,
    down: migration_20260916_133500_find_district_block.down,
    name: '20260916_133500_find_district_block'
  },
  {
    up: migration_20260917_143700_media_grid_block.up,
    down: migration_20260917_143700_media_grid_block.down,
    name: '20260917_143700_media_grid_block'
  },
  {
    up: migration_20260917_152500_candidates_layout_blocks.up,
    down: migration_20260917_152500_candidates_layout_blocks.down,
    name: '20260917_152500_candidates_layout_blocks'
  },
  {
    up: migration_20260917_162000_candidate_pages_global.up,
    down: migration_20260917_162000_candidate_pages_global.down,
    name: '20260917_162000_candidate_pages_global'
  },
  {
    up: migration_20260917_170500_activity_log.up,
    down: migration_20260917_170500_activity_log.down,
    name: '20260917_170500_activity_log'
  },
  {
    up: migration_20260917_180000_locked_docs_activity_log.up,
    down: migration_20260917_180000_locked_docs_activity_log.down,
    name: '20260917_180000_locked_docs_activity_log'
  },
  {
    up: migration_20260917_183000_fix_media_grid_items_version_ids.up,
    down: migration_20260917_183000_fix_media_grid_items_version_ids.down,
    name: '20260917_183000_fix_media_grid_items_version_ids'
  },
];
