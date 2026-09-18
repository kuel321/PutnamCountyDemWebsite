'use client'

import React, { useRef } from 'react'
import { Banner, Button, Gutter, SetStepNav } from '@payloadcms/ui'

// The admin theme's CSS custom properties (var(--theme-text), etc.) only
// exist inside Payload's own stylesheet, which isn't loaded in the blank
// print window below — redefine them with plain, print-friendly values so
// this page's inline styles (which reference those variables directly)
// still resolve correctly there.
const PRINT_THEME_VARS = `
  :root {
    --theme-text: #1a1a1a;
    --theme-elevation-25: #fafafa;
    --theme-elevation-50: #f5f5f5;
    --theme-elevation-100: #e5e5e5;
    --theme-elevation-150: #d0d0d0;
    --theme-elevation-600: #666666;
    --theme-success-500: #1a6b3c;
  }
`

const sectionStyle: React.CSSProperties = {
  marginTop: '48px',
  paddingTop: '8px',
  borderTop: '1px solid var(--theme-elevation-100)',
}

const h2Style: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 600,
  color: 'var(--theme-text)',
  marginBottom: '12px',
}

const h3Style: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--theme-text)',
  marginTop: '24px',
  marginBottom: '8px',
}

const pStyle: React.CSSProperties = {
  color: 'var(--theme-text)',
  lineHeight: 1.6,
  marginBottom: '12px',
}

const codeStyle: React.CSSProperties = {
  background: 'var(--theme-elevation-100)',
  borderRadius: '3px',
  padding: '2px 5px',
  fontSize: '13px',
  fontFamily: 'monospace',
}

const tableWrapStyle: React.CSSProperties = {
  overflowX: 'auto',
  marginBottom: '16px',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  background: 'var(--theme-elevation-50)',
  borderBottom: '1px solid var(--theme-elevation-150)',
  fontWeight: 600,
}

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--theme-elevation-100)',
  verticalAlign: 'top',
}

const ulStyle: React.CSSProperties = {
  paddingLeft: '20px',
  color: 'var(--theme-text)',
  lineHeight: 1.6,
  marginBottom: '12px',
}

const detailsStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '4px',
  padding: '10px 14px',
  marginBottom: '10px',
  background: 'var(--theme-elevation-25, var(--theme-elevation-50))',
}

const summaryStyle: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 600,
  color: 'var(--theme-text)',
}

const toc = [
  ['logging-in', 'Logging In'],
  ['at-a-glance', 'The Admin Panel at a Glance'],
  ['pages', 'Creating and Editing Pages'],
  ['blocks', 'Building a Page with Blocks'],
  ['media', 'The Media Library (Photos & Files)'],
  ['drafts', 'Drafts, Publishing & Preview'],
  ['header-footer', 'Site-Wide Settings: Header & Footer'],
  ['highlights', 'Home Page Content: News Reel & Highlights'],
  ['meetings', 'Meetings & Meeting Minutes'],
  ['candidates', 'Candidates & Districts'],
  ['president', "President's Messages"],
  ['members', 'The Members-Only Area'],
  ['activity-log', 'Activity Log'],
  ['users', 'Staff Accounts (Users)'],
  ['seo', 'SEO Settings'],
  ['faq', 'Troubleshooting / FAQ'],
  ['help', 'Getting Help'],
] as const

export function AdminGuideContent() {
  const printAreaRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const source = printAreaRef.current
    if (!source) return

    // Clone rather than print in place — this page lives inside Payload's
    // own nested admin layout (sidebar, header, etc.), and trying to hide
    // everything else via CSS fought that layout and printed blank pages.
    // A separate window with just this content sidesteps that entirely.
    const clone = source.cloneNode(true) as HTMLElement
    clone.querySelectorAll('.admin-guide-no-print').forEach((el) => el.remove())
    // <details> print collapsed otherwise — there's no way to "click" on paper.
    clone.querySelectorAll('details').forEach((el) => el.setAttribute('open', ''))

    const printWindow = window.open('', '_blank', 'width=900,height=1200')
    if (!printWindow) {
      window.alert('Please allow pop-ups for this site to print the guide.')
      return
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>Site Admin Guide</title>
    <style>
      ${PRINT_THEME_VARS}
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px; }
      a { color: var(--theme-success-500); }
    </style>
  </head>
  <body>${clone.innerHTML}</body>
</html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => printWindow.print()
  }

  return (
    <React.Fragment>
      <SetStepNav nav={[{ label: 'Admin Guide' }]} />
      <Gutter>
        <div ref={printAreaRef} style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '80px' }}>
          <div
            style={{
              marginTop: '24px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--theme-text)', marginBottom: '4px' }}>
                Site Admin Guide
              </h1>
              <p style={{ color: 'var(--theme-elevation-600)', fontSize: '14px' }}>
                Powered by <strong>ChanceCMS</strong> by Chasing a Chance, LLC
              </p>
            </div>
            <div className="admin-guide-no-print">
              <Button buttonStyle="secondary" size="small" onClick={handlePrint}>
                Print This Guide
              </Button>
            </div>
          </div>

          <p style={pStyle}>
            Everyday tasks in this admin panel: creating and editing pages, building pages out of
            content blocks, managing photos, running the Members-Only area, and publishing
            changes. No prior CMS experience assumed.
          </p>

          <nav
            aria-label="Table of contents"
            style={{
              background: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-100)',
              borderRadius: '4px',
              padding: '16px 20px',
              marginTop: '20px',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--theme-text)' }}>
              Contents
            </div>
            <ol style={{ ...ulStyle, marginBottom: 0, columns: '2', columnGap: '24px' }}>
              {toc.map(([id, label]) => (
                <li key={id} style={{ marginBottom: '4px' }}>
                  <a href={`#${id}`} style={{ color: 'var(--theme-success-500)' }}>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 1. Logging In */}
          <section id="logging-in" style={sectionStyle}>
            <h2 style={h2Style}>1. Logging In</h2>
            <ol style={ulStyle}>
              <li>Go to <code style={codeStyle}>/admin</code> on the website.</li>
              <li>Enter the email and password for your staff account.</li>
              <li>
                You&apos;ll land on the Dashboard, which lists every content type down the left
                sidebar, grouped into sections.
              </li>
            </ol>
            <Banner type="info">
              This staff login is completely separate from the <strong>Members-Only</strong> login
              that club members use on the public site. See{' '}
              <a href="#members" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Section 12
              </a>
              .
            </Banner>
            <p style={{ ...pStyle, marginTop: '12px' }}>
              If you don&apos;t have a staff account yet, someone who already has one needs to
              create it for you — see{' '}
              <a href="#users" style={{ color: 'var(--theme-success-500)' }}>
                Section 14
              </a>
              .
            </p>
          </section>

          {/* 2. At a glance */}
          <section id="at-a-glance" style={sectionStyle}>
            <h2 style={h2Style}>2. The Admin Panel at a Glance</h2>
            <p style={pStyle}>The left sidebar is organized into groups:</p>
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Group</th>
                    <th style={thStyle}>What&apos;s in it</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}><strong>Content</strong></td>
                    <td style={tdStyle}>
                      Pages, Media (photo/file library), News Reel &amp; Highlights, President&apos;s
                      Messages
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Meetings</strong></td>
                    <td style={tdStyle}>Meetings, Meeting Minutes</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Candidates</strong></td>
                    <td style={tdStyle}>Candidates, Districts</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Club Members</strong></td>
                    <td style={tdStyle}>Club Members (member accounts), Minutes Submissions</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Site-wide</strong></td>
                    <td style={tdStyle}>Header, Footer</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Forms</strong></td>
                    <td style={tdStyle}>Forms you&apos;ve built and the submissions people have sent in</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Admin</strong></td>
                    <td style={tdStyle}>Users (staff accounts) and the Activity Log</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={pStyle}>
              Clicking any item in the sidebar shows a list of that content type; click{' '}
              <strong>Create New</strong> (top right of a list view) to add a new one, or click an
              existing row to edit it.
            </p>
          </section>

          {/* 3. Pages */}
          <section id="pages" style={sectionStyle}>
            <h2 style={h2Style}>3. Creating and Editing Pages</h2>
            <p style={pStyle}>
              Pages are the general-purpose building block for everything that isn&apos;t a
              specialized list (like Meetings or Candidates) — About, History, Leadership, Get
              Involved, Events, News, The Issues, etc.
            </p>

            <h3 style={h3Style}>To create a new page</h3>
            <ol style={ulStyle}>
              <li>
                Sidebar → <strong>Content → Pages</strong> → <strong>Create New</strong>.
              </li>
              <li>
                Fill in the <strong>Title</strong> — this is what shows in the browser tab and at
                the top of the page.
              </li>
              <li>
                Go to the <strong>Content</strong> tab and add{' '}
                <a href="#blocks" style={{ color: 'var(--theme-success-500)' }}>
                  blocks
                </a>{' '}
                to build out the page.
              </li>
              <li>
                Check the <strong>Slug</strong> field (in the sidebar) — this is the page&apos;s
                URL (e.g. <code style={codeStyle}>about</code> makes the page live at{' '}
                <code style={codeStyle}>yoursite.com/about</code>). It fills in automatically from
                the title; there&apos;s a small icon next to it to unlock it and edit it manually
                if you need a different URL.
              </li>
              <li>
                Click <strong>Save</strong> (draft) or <strong>Publish</strong> at the top right
                when ready — see{' '}
                <a href="#drafts" style={{ color: 'var(--theme-success-500)' }}>
                  Section 6
                </a>
                .
              </li>
            </ol>

            <h3 style={h3Style}>To edit an existing page</h3>
            <p style={pStyle}>
              Sidebar → <strong>Content → Pages</strong> → click the page in the list → make your
              changes → <strong>Save</strong> or <strong>Publish</strong>.
            </p>

            <h3 style={h3Style}>Adding the page to the site&apos;s navigation menu</h3>
            <p style={pStyle}>
              Creating a page does <strong>not</strong> automatically add a link to it in the
              header menu — that&apos;s a separate step. See{' '}
              <a href="#header-footer" style={{ color: 'var(--theme-success-500)' }}>
                Section 7
              </a>
              .
            </p>
          </section>

          {/* 4. Blocks */}
          <section id="blocks" style={sectionStyle}>
            <h2 style={h2Style}>4. Building a Page with Blocks</h2>
            <p style={pStyle}>
              Every page is built by stacking <strong>blocks</strong> on top of each other in the{' '}
              <strong>Content</strong> tab. Click <strong>+ Add Block</strong> to insert one, drag
              the handle on the left of a block to reorder it, and use the trash icon to remove
              one.
            </p>

            <h3 style={h3Style}>Content</h3>
            <p style={pStyle}>
              A plain rich-text block — paragraphs, headings, bold/italic, links, bullet lists,
              horizontal dividers. Use this for ordinary body text. There&apos;s a formatting
              toolbar at the top of the text area.
            </p>

            <h3 style={h3Style}>Media + Content (Side-by-Side)</h3>
            <p style={pStyle}>
              Use this when you want a <strong>photo or ad next to a paragraph of text</strong> —
              for example, a Facebook announcement with its image on one side and the write-up
              beside it. This is the main block for the <strong>News &amp; Resources</strong>{' '}
              page.
            </p>
            <p style={pStyle}>Fields:</p>
            <ul style={ulStyle}>
              <li>
                <strong>Media</strong> — the photo. See the callout below — you can paste an image
                directly here.
              </li>
              <li>
                <strong>Link back to original post</strong> <em>(optional)</em> — if the photo
                came from Facebook, Instagram, etc., paste that post&apos;s URL here and the photo
                becomes clickable, opening the original post in a new tab.
              </li>
              <li>
                <strong>Content</strong> — the write-up/announcement text, using the same
                rich-text toolbar as the Content block.
              </li>
            </ul>
            <Banner type="success">
              <strong>📋 Pasting a photo directly (no separate upload step)</strong>
              <p style={{ margin: '8px 0 0' }}>
                Click into the <strong>Media</strong> field, then press <strong>Ctrl+V</strong>{' '}
                (or <strong>Cmd+V</strong> on a Mac) to paste an image you&apos;ve copied — for
                example, right-click a photo on Facebook and choose <strong>Copy Image</strong>,
                then paste it straight into this field. It uploads automatically; you don&apos;t
                need to save it to your computer or visit the Media Library first.
              </p>
              <p style={{ margin: '8px 0 0' }}>
                You can still drag a file in, or click to browse and pick an existing photo from
                the Media Library, the normal way — pasting is just an extra shortcut. If a paste
                doesn&apos;t take, drag-and-drop the file instead as a fallback.
              </p>
            </Banner>

            <h3 style={h3Style}>Meeting Info</h3>
            <p style={pStyle}>
              Automatically shows the club&apos;s meeting schedule/location info pulled from the{' '}
              <strong>Meetings</strong> collection. No fields to fill in — just drop the block on
              a page (e.g. &ldquo;Meeting Dates &amp; Location&rdquo;) and it stays current on its
              own.
            </p>

            <h3 style={h3Style}>Candidates</h3>
            <p style={pStyle}>
              Shows the full candidate roster, automatically pulled from the{' '}
              <strong>Candidates</strong> collection, with filter buttons (All / Federal-State /
              Putnam Co.) and grouping by district. The only field is a{' '}
              <strong>Heading</strong> above the list (defaults to &ldquo;Meet Our
              Candidates&rdquo;) — change it if you want different wording.
            </p>

            <h3 style={h3Style}>President&apos;s Message</h3>
            <p style={pStyle}>
              Displays whichever President&apos;s Message is currently active. No fields — just
              add it to a page if you want the message to also appear inline there (most of the
              time it already shows as a banner site-wide, so you usually won&apos;t need this
              block).
            </p>

            <h3 style={h3Style}>Find Your District (Map)</h3>
            <p style={pStyle}>
              Lets a visitor type in their home address and see their Magisterial, WV House, WV
              Senate, and US Congressional districts on a map. You can change the heading and
              intro text; the lookup itself works automatically once the block is on a page —
              nothing else to configure.
            </p>

            <h3 style={h3Style}>Photo Grid (3-Wide)</h3>
            <p style={pStyle}>
              Shows a set of photos in a three-across grid. You can change the heading, and for
              each photo:
            </p>
            <ul style={ulStyle}>
              <li>
                <strong>Media</strong> — the photo itself.
              </li>
              <li>
                <strong>Caption</strong> <em>(optional)</em> — text shown below the photo.
              </li>
              <li>
                <strong>Courtesy of</strong> <em>(optional)</em> — a photo credit, shown as a
                small label over the bottom-right corner of the image itself (e.g. entering
                &ldquo;Jane Doe&rdquo; shows &ldquo;Courtesy of Jane Doe&rdquo; on the photo).
              </li>
            </ul>

            <h3 style={h3Style}>Form</h3>
            <p style={pStyle}>
              Displays a form for visitors to fill out and submit — a contact form, volunteer
              signup, and so on.
            </p>
            <ol style={ulStyle}>
              <li>
                Build the form itself first under{' '}
                <strong>Forms → Forms</strong> in the sidebar (not inside the page). Add whatever
                fields you need, set the submit button text, and choose what happens after
                someone submits: an on-page confirmation message, or a redirect to another page.
              </li>
              <li>
                Open that form&apos;s <strong>Emails</strong> tab to control who gets notified
                when someone submits it, and what the email says. You can send to a fixed
                address, or pull in whatever the visitor typed by wrapping a field&apos;s name in
                double curly brackets, e.g. <code style={codeStyle}>{'{{email}}'}</code>.
              </li>
              <li>
                Then add this <strong>Form</strong> block to a page and select the form you built.
              </li>
            </ol>
            <Banner type="info">
              Every submission is also saved under <strong>Forms → Form Submissions</strong>, so
              nothing is lost even if an email fails to send. Any staff account can see every
              submission — there&apos;s no way currently to restrict this to only some admins, so
              treat everything submitted through a form as visible to the whole team.
            </Banner>
          </section>

          {/* 5. Media */}
          <section id="media" style={sectionStyle}>
            <h2 style={h2Style}>5. The Media Library (Photos &amp; Files)</h2>
            <p style={pStyle}>
              Sidebar → <strong>Content → Media</strong>. This is every photo, PDF, and file
              uploaded anywhere on the site.
            </p>
            <h3 style={h3Style}>Uploading directly</h3>
            <ol style={ulStyle}>
              <li>
                <strong>Create New</strong> → drag a file in, or click to browse.
              </li>
              <li>
                <strong>Alt Text</strong> — a short description for accessibility/screen readers
                (e.g. &ldquo;Candidate John Smith headshot&rdquo;). Good practice to fill in,
                especially for photos.
              </li>
              <li>
                <strong>Caption</strong> <em>(optional)</em> — text shown under the image in
                places that display captions.
              </li>
              <li>
                <strong>Save</strong>.
              </li>
            </ol>
            <h3 style={h3Style}>Uploading while editing a page (the easier way)</h3>
            <p style={pStyle}>
              Most of the time you don&apos;t need to visit the Media Library at all — any field
              that takes a photo (a block&apos;s Media field, a candidate&apos;s headshot, etc.)
              lets you drag a file in or browse-and-upload right from that field. And for the{' '}
              <strong>Media + Content</strong> block specifically, you can paste a copied image
              directly.
            </p>
          </section>

          {/* 6. Drafts */}
          <section id="drafts" style={sectionStyle}>
            <h2 style={h2Style}>6. Drafts, Publishing &amp; Preview</h2>
            <p style={pStyle}>Pages (and Meeting Minutes) support drafts:</p>
            <ul style={ulStyle}>
              <li>
                <strong>Save</strong> — stores your changes as a draft. The public page is{' '}
                <em>not</em> updated. Only logged-in staff can see the draft version.
              </li>
              <li>
                <strong>Publish</strong> — makes the current version live on the public site
                immediately.
              </li>
              <li>
                You can keep editing and re-saving a draft indefinitely before publishing, so
                it&apos;s safe to leave work half-finished.
              </li>
            </ul>
            <h3 style={h3Style}>Preview</h3>
            <p style={pStyle}>
              While editing a page, the <strong>Preview</strong> button (top right) opens the page
              in a new tab exactly as it will look when published — including any unpublished
              draft changes — without anyone else being able to see those changes. Some editors
              also show a live preview panel that updates as you type.
            </p>
          </section>

          {/* 7. Header/Footer */}
          <section id="header-footer" style={sectionStyle}>
            <h2 style={h2Style}>7. Site-Wide Settings: Header &amp; Footer</h2>
            <p style={pStyle}>
              These two live under the <strong>Site-wide</strong> group and control elements that
              appear on <em>every</em> page.
            </p>
            <h3 style={h3Style}>Header</h3>
            <p style={pStyle}>
              Sidebar → <strong>Site-wide → Header</strong>.
            </p>
            <ul style={ulStyle}>
              <li>
                <strong>Logo</strong> — the logo shown top-left of every page.
              </li>
              <li>
                <strong>Nav Items</strong> — the menu links across the top of the site. Each item
                has:
                <ul style={ulStyle}>
                  <li>
                    <strong>Label</strong> — the text shown in the menu.
                  </li>
                  <li>
                    <strong>Type</strong> — either <strong>Direct Link</strong> (clicking it goes
                    straight to a page/URL) or <strong>Dropdown</strong> (shows a list of{' '}
                    <strong>Sub Links</strong> underneath it — used for the &ldquo;Members&rdquo;
                    menu item, which drops down to &ldquo;Members&rdquo; and &ldquo;Members
                    Only&rdquo;).
                  </li>
                  <li>
                    For a Direct Link (or each Sub Link), choose <strong>Internal link</strong>{' '}
                    (pick an existing Page/Post) or <strong>Custom URL</strong> (type any address,
                    e.g. <code style={codeStyle}>/members</code>).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Donate Button</strong> — the button text and link at the far right of the
                menu.
              </li>
            </ul>
            <p style={pStyle}>
              Drag items up/down to reorder the menu. <strong>Save</strong> when done — changes
              apply site-wide immediately.
            </p>
            <h3 style={h3Style}>Footer</h3>
            <p style={pStyle}>
              Sidebar → <strong>Site-wide → Footer</strong>.
            </p>
            <ul style={ulStyle}>
              <li>Contact Email</li>
              <li>
                Chasing a Chance Link — where the small &ldquo;Site by...&rdquo; credit in the
                footer corner points to.
              </li>
              <li>
                Social Links — one entry per platform (Facebook, Instagram, X/Twitter) with its
                URL, shown as icons in the footer.
              </li>
            </ul>
          </section>

          {/* 8. Highlights */}
          <section id="highlights" style={sectionStyle}>
            <h2 style={h2Style}>8. Home Page Content: News Reel &amp; Highlights</h2>
            <p style={pStyle}>
              Sidebar → <strong>Content → News Reel &amp; Highlights</strong>. This feeds the
              rotating banner near the top of the home page.
            </p>
            <ul style={ulStyle}>
              <li>
                <strong>Title</strong> — short headline.
              </li>
              <li>
                <strong>Order</strong> — lower numbers show first in the rotation.
              </li>
              <li>
                <strong>Content</strong> — the message body (rich text).
              </li>
            </ul>
            <p style={pStyle}>
              Add, remove, or reorder these any time — the home page always shows whatever
              currently exists, in Order sequence.
            </p>
          </section>

          {/* 9. Meetings */}
          <section id="meetings" style={sectionStyle}>
            <h2 style={h2Style}>9. Meetings &amp; Meeting Minutes</h2>
            <h3 style={h3Style}>Meetings</h3>
            <p style={pStyle}>
              Sidebar → <strong>Meetings → Meetings</strong>. One entry per club meeting.
            </p>
            <ul style={ulStyle}>
              <li>
                <strong>Title</strong>, <strong>Date</strong>, <strong>Time</strong> (free text,
                e.g. &ldquo;6:30pm&rdquo; or &ldquo;TBD&rdquo;), <strong>Location</strong>,{' '}
                <strong>Notes</strong>.
              </li>
              <li>
                <strong>Photos</strong> — add photos from that meeting. Each photo has a
                &ldquo;Don&apos;t show on public page&rdquo; checkbox — check it to keep a photo
                visible only to logged-in members instead of the public Meeting Dates &amp;
                Location page.
              </li>
            </ul>
            <p style={pStyle}>
              These automatically feed both the Meeting Info block and the &ldquo;Upcoming
              Meetings&rdquo; list on the home page (which only shows meetings dated today or
              later).
            </p>

            <h3 style={h3Style}>Meeting Minutes</h3>
            <p style={pStyle}>
              Sidebar → <strong>Meetings → Meeting Minutes</strong>. This is what members see in
              the{' '}
              <a href="#members" style={{ color: 'var(--theme-success-500)' }}>
                Members-Only area
              </a>
              .
            </p>
            <ol style={ulStyle}>
              <li>Create New.</li>
              <li>
                Title, Date, optionally link it to the corresponding Meeting.
              </li>
              <li>Content — type up the minutes directly (rich text), and/or</li>
              <li>File — upload the original PDF/Word document if one exists.</li>
              <li>
                Save as a draft while still working on it, then Publish when it&apos;s ready for
                members to see — only <strong>published</strong> minutes appear in the
                Members-Only list.
              </li>
            </ol>
            <Banner type="info">
              There&apos;s also a <strong>Minutes Submissions</strong> list under{' '}
              <strong>Club Members</strong> in the sidebar — a review queue for minutes members
              can submit themselves. If anything shows up &ldquo;Pending Review&rdquo; there,
              change its status to <strong>Approved</strong> (publishes it automatically) or{' '}
              <strong>Rejected</strong>.
            </Banner>
          </section>

          {/* 10. Candidates */}
          <section id="candidates" style={sectionStyle}>
            <h2 style={h2Style}>10. Candidates &amp; Districts</h2>
            <h3 style={h3Style}>Candidates</h3>
            <p style={pStyle}>
              Sidebar → <strong>Candidates → Candidates</strong>.
            </p>
            <ul style={ulStyle}>
              <li>
                <strong>Candidate Name</strong>, <strong>Type</strong> (Federal/State or Putnam
                Co.).
              </li>
              <li>
                <strong>District</strong> (only for Putnam Co. candidates) — which voting district
                they&apos;re running in.
              </li>
              <li>
                <strong>Office/Race</strong> — e.g. &ldquo;US Senate Candidate.&rdquo;
              </li>
              <li>
                <strong>Headshot</strong> — profile photo.
              </li>
              <li>
                <strong>Content</strong> — bio text (rich text).
              </li>
              <li>
                <strong>Links</strong> — website / Facebook page links.
              </li>
              <li>
                <strong>Photos</strong> — general event photos shown on their profile page.
              </li>
              <li>
                <strong>Gallery</strong> — ad images used in the home page&apos;s rotating ad
                spotlight and on their profile page.
              </li>
              <li>
                <strong>Slug</strong> — controls their profile page URL (
                <code style={codeStyle}>yoursite.com/candidate/their-slug</code>).
              </li>
              <li>
                <strong>Additional Content Blocks</strong> — extra blocks (Content, Media +
                Content, Photo Grid) shown at the very bottom of <em>this candidate&apos;s</em>{' '}
                profile page, below their bio, photos, and ads. Use this for anything specific to
                that one candidate.
              </li>
            </ul>
            <Banner type="info">
              Candidate profile pages aren&apos;t built page-by-page the way regular Pages are —
              a candidate&apos;s page (headshot, name, bio, photos, ads) is generated
              automatically the moment you fill in their info, so there&apos;s nothing to
              &ldquo;build.&rdquo; The Additional Content Blocks field above is just a way to tack
              extra content onto the bottom of that auto-generated page.
            </Banner>

            <h3 style={h3Style}>Blocks Shown on Every Candidate&apos;s Page</h3>
            <p style={pStyle}>
              Sidebar → <strong>Candidates → Candidate Pages (All Candidates)</strong>. This is
              different from the Additional Content Blocks on an individual candidate above —
              anything added here (Find Your District, Content, Media + Content, Photo Grid)
              shows up on <strong>every</strong> candidate&apos;s profile page automatically,
              without editing each candidate one by one. Use this for things every candidate&apos;s
              page should have, like the district finder tool.
            </p>
            <p style={pStyle}>
              Order on the page, top to bottom: the candidate&apos;s photo/bio/photos/ads (always
              there) → blocks from this shared setting → that candidate&apos;s own Additional
              Content Blocks.
            </p>

            <h3 style={h3Style}>Districts</h3>
            <p style={pStyle}>
              Sidebar → <strong>Candidates → Districts</strong>. Just a Title (e.g.
              &ldquo;District 3&rdquo;) and Number (controls sort order) — used to group
              candidates by district wherever the Candidates block is shown.
            </p>
          </section>

          {/* 11. President */}
          <section id="president" style={sectionStyle}>
            <h2 style={h2Style}>11. President&apos;s Messages</h2>
            <p style={pStyle}>
              Sidebar → <strong>Content → President&apos;s Messages</strong>.
            </p>
            <ul style={ulStyle}>
              <li>
                <strong>Title</strong> — internal label; the public banner heading is generic
                unless changed.
              </li>
              <li>
                <strong>Author</strong> — pick a staff user (their name/photo comes from their
                Users profile).
              </li>
              <li>
                <strong>Message</strong> — the text.
              </li>
              <li>
                <strong>Display Date</strong> — when the message starts showing.
              </li>
              <li>
                <strong>Archive Date</strong> (optional) — when it stops showing. Leave blank to
                let it keep showing until a newer one is added.
              </li>
              <li>
                <strong>Placement</strong> — Site-wide banner (shows on every page) or Only where
                added as a block (only on pages with the President&apos;s Message block).
              </li>
            </ul>
            <p style={pStyle}>
              Only one message is ever active at a time — whichever one&apos;s display window
              (Display Date reached, Archive Date not yet passed) is most recent.
            </p>
          </section>

          {/* 12. Members */}
          <section id="members" style={sectionStyle}>
            <h2 style={h2Style}>12. The Members-Only Area</h2>
            <p style={pStyle}>
              A separate password-protected area for club members — distinct from staff logins.
            </p>
            <h3 style={h3Style}>How a visitor gets there</h3>
            <p style={pStyle}>
              The header menu&apos;s <strong>Members</strong> item is a dropdown:{' '}
              <strong>Members</strong> (a normal, public page anyone can view) and{' '}
              <strong>Members Only</strong> (goes to <code style={codeStyle}>/members</code>,
              which requires a member login — it redirects to a login form first if not logged
              in).
            </p>
            <h3 style={h3Style}>Creating a member account</h3>
            <ol style={ulStyle}>
              <li>
                Sidebar → <strong>Club Members → Club Members</strong> → Create New.
              </li>
              <li>Fill in their Name, Email, and set a Password.</li>
              <li>
                <strong>Access Enabled</strong> is checked by default — leave it checked to allow
                them to log in.
              </li>
              <li>Save.</li>
            </ol>
            <p style={pStyle}>
              Give the member their email and the password you set — there&apos;s currently no
              self-service &ldquo;forgot password&rdquo; flow for this login, so if they lose it,
              reset it here and tell them the new one.
            </p>
            <h3 style={h3Style}>Disabling a member without deleting them</h3>
            <p style={pStyle}>
              Uncheck <strong>Access Enabled</strong> on their record and Save. They can no longer
              log in, but their account and history stay intact — recheck it any time to restore
              access.
            </p>
            <h3 style={h3Style}>What a member sees after logging in</h3>
            <p style={pStyle}>
              A simple dashboard listing all <strong>published</strong> Meeting Minutes as an
              expandable accordion, plus a Log Out button. Draft minutes never show here, only
              published ones.
            </p>
          </section>

          {/* 13. Activity Log */}
          <section id="activity-log" style={sectionStyle}>
            <h2 style={h2Style}>13. Activity Log</h2>
            <p style={pStyle}>
              Sidebar → <strong>Admin → Activity Log</strong>. A running record of who changed
              what, and when — for example &ldquo;Jane Smith updated Pages: About&rdquo; or
              &ldquo;Luke deleted Media: old-flyer.jpg.&rdquo;
            </p>
            <p style={pStyle}>
              This is written automatically by the site itself every time something is created,
              changed, or deleted — there&apos;s nothing to fill in here, and entries can&apos;t
              be edited or removed. It&apos;s purely a reference for checking who made a
              particular change.
            </p>
          </section>

          {/* 14. Users */}
          <section id="users" style={sectionStyle}>
            <h2 style={h2Style}>14. Staff Accounts (Users)</h2>
            <p style={pStyle}>
              Sidebar → <strong>Admin → Users</strong>. For people who need to log into{' '}
              <code style={codeStyle}>/admin</code> and manage content — a different system from
              Club Members above.
            </p>
            <ol style={ulStyle}>
              <li>
                Create New → fill in Name, Email, Password, and optionally a profile Image (shown
                wherever they&apos;re credited, e.g. as a President&apos;s Message author).
              </li>
              <li>Save.</li>
            </ol>
            <p style={pStyle}>
              The new person gets a welcome/notification email automatically when their account is
              created.
            </p>
            <Banner type="error">
              Be thoughtful about who gets a staff account — anyone with one can edit every page,
              every collection, and site-wide settings.
            </Banner>
          </section>

          {/* 15. SEO */}
          <section id="seo" style={sectionStyle}>
            <h2 style={h2Style}>15. SEO Settings</h2>
            <p style={pStyle}>
              Every page has an <strong>SEO</strong> tab (next to Content) with Meta Title / Meta
              Description (what shows up in Google search results and when shared) and a Meta
              Image (the preview image used when the page is shared on social media).
            </p>
            <p style={pStyle}>
              Fill these in for any page you want to show up well in search results or look good
              when shared — optional but recommended for the more important pages.
            </p>
          </section>

          {/* 16. FAQ */}
          <section id="faq" style={sectionStyle}>
            <h2 style={h2Style}>16. Troubleshooting / FAQ</h2>

            <details style={detailsStyle}>
              <summary style={summaryStyle}>
                I published a page but the change isn&apos;t showing on the live site yet.
              </summary>
              <p style={{ ...pStyle, marginTop: '8px', marginBottom: 0 }}>
                Most pages update immediately. A few things (like the home page) refresh on a
                short delay rather than instantly — give it a minute and refresh.
              </p>
            </details>

            <details style={detailsStyle}>
              <summary style={summaryStyle}>An image shows as broken/missing.</summary>
              <p style={{ ...pStyle, marginTop: '8px', marginBottom: 0 }}>
                Make sure the Media item still exists in the Media Library and hasn&apos;t been
                deleted, and that the field is actually pointing at an uploaded image (not left
                empty).
              </p>
            </details>

            <details style={detailsStyle}>
              <summary style={summaryStyle}>I can&apos;t log into the Members-Only area.</summary>
              <p style={{ ...pStyle, marginTop: '8px', marginBottom: 0 }}>
                Check the Club Members record for that email — is Access Enabled checked? If
                they&apos;ve forgotten their password, set a new one on their record and give it
                to them.
              </p>
            </details>

            <details style={detailsStyle}>
              <summary style={summaryStyle}>A block I added isn&apos;t showing anything.</summary>
              <p style={{ ...pStyle, marginTop: '8px', marginBottom: 0 }}>
                Some blocks (Meeting Info, Candidates, President&apos;s Message) pull their
                content automatically from other collections — if the underlying collection is
                empty, the block has nothing to show and stays blank. Add the underlying content
                first.
              </p>
            </details>

            <details style={detailsStyle}>
              <summary style={summaryStyle}>
                The pasted image in the Media + Content block didn&apos;t work.
              </summary>
              <p style={{ ...pStyle, marginTop: '8px', marginBottom: 0 }}>
                Make sure you copied an actual image (not just a link/text) before pasting, and
                that you clicked directly into the Media field first. If it still doesn&apos;t
                work, drag the image file in instead, or download it and upload it normally.
              </p>
            </details>

            <details style={detailsStyle}>
              <summary style={summaryStyle}>
                A form was submitted but I never got an email.
              </summary>
              <p style={{ ...pStyle, marginTop: '8px', marginBottom: 0 }}>
                Check <strong>Forms → Form Submissions</strong> first — if it&apos;s there, the
                form worked and the information isn&apos;t lost. Then open the form under{' '}
                <strong>Forms → Forms</strong> and check its <strong>Emails</strong> tab to
                confirm a recipient address is actually set — a form with no email configured
                will accept submissions but never send anything.
              </p>
            </details>
          </section>

          {/* 17. Help */}
          <section id="help" style={sectionStyle}>
            <h2 style={h2Style}>17. Getting Help</h2>
            <p style={pStyle}>
              For anything not covered here, or if something looks broken rather than just
              unfamiliar, reach out to Luke (site developer) rather than guessing — some things
              (site-wide settings, navigation, user accounts) are easy to get into a confusing
              state if edited by more than one person at once.
            </p>
          </section>
        </div>
      </Gutter>
    </React.Fragment>
  )
}
