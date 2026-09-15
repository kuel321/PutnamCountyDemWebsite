# Putnam County Democratic Party Website — Admin Guide

This guide walks through everyday tasks in the site's admin panel: creating and editing pages, building pages out of content blocks, managing photos, running the Members-Only area, and publishing changes. It assumes no prior experience with the system.

**Admin panel address:** `https://[your-site-domain]/admin`

---

## Table of Contents

1. [Logging In](#1-logging-in)
2. [The Admin Panel at a Glance](#2-the-admin-panel-at-a-glance)
3. [Creating and Editing Pages](#3-creating-and-editing-pages)
4. [Building a Page with Blocks](#4-building-a-page-with-blocks)
5. [The Media Library (Photos & Files)](#5-the-media-library-photos--files)
6. [Drafts, Publishing & Preview](#6-drafts-publishing--preview)
7. [Site-Wide Settings: Header & Footer](#7-site-wide-settings-header--footer)
8. [Home Page Content: News Reel & Highlights](#8-home-page-content-news-reel--highlights)
9. [Meetings & Meeting Minutes](#9-meetings--meeting-minutes)
10. [Candidates & Districts](#10-candidates--districts)
11. [President's Messages](#11-presidents-messages)
12. [The Members-Only Area](#12-the-members-only-area)
13. [Staff Accounts (Users)](#13-staff-accounts-users)
14. [SEO Settings](#14-seo-settings)
15. [Troubleshooting / FAQ](#15-troubleshooting--faq)
16. [Getting Help](#16-getting-help)

---

## 1. Logging In

1. Go to `/admin` on the website (e.g. `https://yoursite.com/admin`).
2. Enter the email and password for your staff account.
3. You'll land on the **Dashboard**, which lists every content type ("collection") down the left sidebar, grouped into sections.

> **Note:** This staff login is completely separate from the **Members-Only** login that club members use on the public site. See [Section 12](#12-the-members-only-area) for that.

If you don't have a staff account yet, someone who already has one needs to create it for you — see [Section 13](#13-staff-accounts-users).

---

## 2. The Admin Panel at a Glance

The left sidebar is organized into groups:

| Group | What's in it |
|---|---|
| **Content** | Pages, Media (photo/file library), News Reel & Highlights, President's Messages |
| **Meetings** | Meetings, Meeting Minutes |
| **Candidates** | Candidates, Districts |
| **Club Members** | Club Members (member accounts), Minutes Submissions |
| **Site-wide** | Header, Footer |
| **Admin** | Users (staff accounts) |

Clicking any item in the sidebar shows a list of that content type; click **Create New** (top right of a list view) to add a new one, or click an existing row to edit it.

---

## 3. Creating and Editing Pages

Pages are the general-purpose building block for everything that isn't a specialized list (like Meetings or Candidates) — About, History, Leadership, Get Involved, Events, News, The Issues, etc.

### To create a new page

1. Sidebar → **Content → Pages** → **Create New**.
2. Fill in the **Title** — this is what shows in the browser tab and at the top of the page.
3. Go to the **Content** tab and add [blocks](#4-building-a-page-with-blocks) to build out the page (see next section).
4. Check the **Slug** field (in the sidebar) — this is the page's URL (e.g. `about` makes the page live at `yoursite.com/about`). It fills in automatically from the title; there's a small icon next to it to unlock it and edit it manually if you need a different URL.
5. Click **Save** (draft) or **Publish** at the top right when ready — see [Section 6](#6-drafts-publishing--preview) for the difference.

### To edit an existing page

Sidebar → **Content → Pages** → click the page in the list → make your changes → **Save** or **Publish**.

### Adding the page to the site's navigation menu

Creating a page does **not** automatically add a link to it in the header menu — that's a separate step. See [Section 7](#7-site-wide-settings-header--footer).

---

## 4. Building a Page with Blocks

Every page is built by stacking **blocks** on top of each other in the **Content** tab. Click **+ Add Block** to insert one, drag the handle on the left of a block to reorder it, and use the trash icon to remove one.

Here's what each available block does:

### Content

A plain rich-text block — paragraphs, headings, bold/italic, links, bullet lists, horizontal dividers. Use this for ordinary body text. There's a formatting toolbar at the top of the text area (bold, italic, headings, etc.).

### Media + Content (Side-by-Side)

Use this when you want a **photo or ad next to a paragraph of text** — for example, a Facebook announcement with its image on one side and the write-up beside it. This is the main block for the **News & Resources** page.

Fields:
- **Media** — the photo. See the callout below — you can paste an image directly here.
- **Link back to original post** *(optional)* — if the photo came from Facebook, Instagram, etc., paste that post's URL here and the photo becomes clickable, opening the original post in a new tab.
- **Content** — the write-up/announcement text, using the same rich-text toolbar as the Content block.

> **📋 Pasting a photo directly (no separate upload step)**
> Click into the **Media** field, then press **Ctrl+V** (or **Cmd+V** on a Mac) to paste an image you've copied — for example, right-click a photo on Facebook and choose **Copy Image**, then paste it straight into this field. It uploads automatically; you don't need to save it to your computer or visit the Media Library first.
> You can still drag a file in, or click to browse and pick an existing photo from the Media Library, the normal way — pasting is just an extra shortcut.
> If a paste doesn't take (you'll see "Could not upload the pasted image"), drag-and-drop the file instead as a fallback.

### Meeting Info

Automatically shows the club's meeting schedule/location info pulled from the **Meetings** collection ([Section 9](#9-meetings--meeting-minutes)). No fields to fill in here — just drop the block on a page (e.g. "Meeting Dates & Location") and it stays current on its own.

### Candidates

Shows the full candidate roster, automatically pulled from the **Candidates** collection ([Section 10](#10-candidates--districts)), with filter buttons (All / Federal-State / Putnam Co.) and grouping by district. The only field is a **Heading** above the list (defaults to "Meet Our Candidates") — change it if you want different wording.

### President's Message

Displays whichever President's Message is currently active ([Section 11](#11-presidents-messages)). No fields — just add it to a page if you want the message to also appear inline on that page (most of the time it already shows as a banner site-wide, so you usually won't need this block).

---

## 5. The Media Library (Photos & Files)

Sidebar → **Content → Media**. This is every photo, PDF, and file uploaded anywhere on the site.

### Uploading directly

1. **Create New** → drag a file in, or click to browse.
2. **Alt Text** — a short description for accessibility/screen readers (e.g. "Candidate John Smith headshot"). Good practice to fill in, especially for photos.
3. **Caption** *(optional)* — text shown under the image in places that display captions.
4. **Save**.

### Uploading while editing a page (the easier way)

Most of the time you don't need to visit the Media Library at all — any field that takes a photo (a block's Media field, a candidate's headshot, etc.) lets you drag a file in or browse-and-upload right from that field. And for the **Media + Content** block specifically, you can paste a copied image directly — see the callout in [Section 4](#4-building-a-page-with-blocks).

---

## 6. Drafts, Publishing & Preview

Pages (and Meeting Minutes) support **drafts**:

- **Save** — stores your changes as a draft. The public page is *not* updated. Only logged-in staff can see the draft version.
- **Publish** — makes the current version live on the public site immediately.
- You can keep editing and re-saving a draft indefinitely before publishing, so it's safe to leave work half-finished.

### Preview

While editing a page, the **Preview** button (top right) opens the page in a new tab exactly as it will look when published — including any unpublished draft changes — without anyone else being able to see those changes. Some editors also show a **live preview** panel that updates as you type.

---

## 7. Site-Wide Settings: Header & Footer

These two live under the **Site-wide** group and control elements that appear on *every* page.

### Header

Sidebar → **Site-wide → Header**.

- **Logo** — the logo shown top-left of every page.
- **Nav Items** — the menu links across the top of the site. Each item has:
  - **Label** — the text shown in the menu.
  - **Type** — either:
    - **Direct Link** — clicking it goes straight to a page (or a custom URL).
    - **Dropdown** — clicking/hovering shows a list of **Sub Links** underneath it (used for the "Members" menu item, which drops down to "Members" and "Members Only" — see [Section 12](#12-the-members-only-area)).
  - For a Direct Link (or each Sub Link), you choose **Internal link** (pick an existing Page/Post from a dropdown) or **Custom URL** (type any address, e.g. `/members` or an external site).
- **Donate Button** — the button text and link shown at the far right of the menu.

Drag items up/down to reorder the menu. **Save** when done — changes apply site-wide immediately.

### Footer

Sidebar → **Site-wide → Footer**.

- **Contact Email**
- **Chasing a Chance Link** — where the small "Site by..." credit in the footer corner points to.
- **Social Links** — add one entry per platform (Facebook, Instagram, X/Twitter) with its URL. These show as icons in the footer.

---

## 8. Home Page Content: News Reel & Highlights

Sidebar → **Content → News Reel & Highlights** (collection name: *Highlights*). This feeds the rotating banner near the top of the home page.

- **Title** — short headline.
- **Order** — lower numbers show first in the rotation.
- **Content** — the message body (rich text).

Add, remove, or reorder these any time — the home page always shows whatever currently exists, in **Order** sequence.

---

## 9. Meetings & Meeting Minutes

### Meetings

Sidebar → **Meetings → Meetings**. One entry per club meeting.

- **Title**, **Date**, **Time** *(free text, e.g. "6:30pm" or "TBD")*, **Location**, **Notes**.
- **Photos** — add photos from that meeting. Each photo has a **"Don't show on public page"** checkbox — check it to keep a photo visible only to logged-in members (Members-Only area) instead of the public Meeting Dates & Location page.

These automatically feed both the **Meeting Info** block ([Section 4](#4-building-a-page-with-blocks)) and the "Upcoming Meetings" list on the home page (which only shows meetings dated today or later).

### Meeting Minutes

Sidebar → **Meetings → Meeting Minutes**. This is what members see in the [Members-Only area](#12-the-members-only-area).

1. **Create New**.
2. **Title**, **Date**, optionally link it to the corresponding **Meeting**.
3. **Content** — type up the minutes directly (rich text), and/or
4. **File** — upload the original PDF/Word document if one exists.
5. **Save** as a draft while you're still working on it, then **Publish** when it's ready for members to see — only **published** minutes appear in the Members-Only list.

> There's also a **Minutes Submissions** list under **Club Members** in the sidebar — that's a review queue for minutes members can submit themselves; if any submitted item shows up "Pending Review" there, review it and change its status to **Approved** (that publishes it automatically) or **Rejected**.

---

## 10. Candidates & Districts

### Candidates

Sidebar → **Candidates → Candidates**.

- **Candidate Name**, **Type** (*Federal/State* or *Putnam Co.*).
- **District** *(only for Putnam Co. candidates)* — which voting district they're running in.
- **Office/Race** — e.g. "US Senate Candidate."
- **Headshot** — profile photo.
- **Content** — bio text (rich text).
- **Links** — website / Facebook page links.
- **Photos** — general event photos shown on their profile page.
- **Gallery** — ad images used in the home page's rotating ad spotlight and on their profile page.
- **Slug** — controls their profile page URL (`yoursite.com/candidate/their-slug`).

### Districts

Sidebar → **Candidates → Districts**. Just a **Title** (e.g. "District 3") and **Number** (controls sort order) — used to group candidates by district wherever the Candidates block is shown.

---

## 11. President's Messages

Sidebar → **Content → President's Messages**.

- **Title** — internal label; the public banner heading is generic unless you change this.
- **Author** — pick a staff user (their name/photo comes from their [Users](#13-staff-accounts-users) profile).
- **Message** — the text.
- **Display Date** — when the message starts showing.
- **Archive Date** *(optional)* — when it stops showing. Leave blank to let it keep showing until you add a newer one.
- **Placement**:
  - *Site-wide banner* — shows automatically on every page.
  - *Only where added as a block* — only shows on pages where you've manually added the President's Message block.

Only one message is ever active at a time — whichever one's display window (Display Date reached, Archive Date not yet passed) is most recent.

---

## 12. The Members-Only Area

This is a separate password-protected area for club members — distinct from staff logins.

### How a visitor gets there

The header menu's **Members** item is a dropdown:
- **Members** — a normal, public page anyone can view.
- **Members Only** — goes to `/members`, which requires a member login. If not logged in, it redirects to a login form first.

### Creating a member account

1. Sidebar → **Club Members → Club Members** → **Create New**.
2. Fill in their **Name**, **Email**, and set a **Password**.
3. **Access Enabled** is checked by default — leave it checked to allow them to log in.
4. **Save**.

Give the member their email and the password you set (there's currently no self-service "forgot password" flow for this login, so if they lose it, reset it here and tell them the new one).

### Disabling a member without deleting them

Uncheck **Access Enabled** on their record and **Save**. They'll no longer be able to log in, but their account and history stay intact — check the box again any time to restore access.

### What a member sees after logging in

A simple dashboard listing all **published** Meeting Minutes ([Section 9](#9-meetings--meeting-minutes)) as an expandable accordion, plus a **Log Out** button. That's it today — draft minutes never show here, only published ones.

---

## 13. Staff Accounts (Users)

Sidebar → **Admin → Users**. This is for people who need to log into `/admin` and manage content — a different system from Club Members above.

1. **Create New** → fill in **Name**, **Email**, **Password**, and optionally a profile **Image** (shown wherever they're credited, e.g. as a President's Message author).
2. **Save**.

The new person gets a welcome/notification email automatically when their account is created.

> Be thoughtful about who gets a staff account — anyone with one can edit every page, every collection, and site-wide settings.

---

## 14. SEO Settings

Every page has an **SEO** tab (next to **Content**) with:
- **Meta Title** / **Meta Description** — what shows up in Google search results and when the page link is shared.
- **Meta Image** — the preview image used when the page is shared on social media.

Fill these in for any page you want to show up well in search results or look good when shared — it's optional but recommended for the more important pages.

---

## 15. Troubleshooting / FAQ

**"I published a page but the change isn't showing on the live site yet."**
Most pages update immediately. A few things (like the home page) refresh on a short delay rather than instantly — give it a minute and refresh.

**"An image shows as broken/missing."**
Make sure the Media item still exists in the Media Library and hasn't been deleted, and that the field is actually pointing at an uploaded image (not left empty).

**"I can't log into the Members-Only area."**
Check the **Club Members** record for that email — is **Access Enabled** checked? If they've forgotten their password, set a new one on their record and give it to them.

**"A block I added isn't showing anything."**
Some blocks (Meeting Info, Candidates, President's Message) pull their content automatically from other collections — if the underlying collection is empty (no meetings, no candidates, no active message), the block has nothing to show and stays blank. Add the underlying content first.

**"The pasted image in the Media + Content block didn't work."**
Make sure you copied an actual image (not just a link/text) before pasting, and that you clicked directly into the Media field first. If it still doesn't work, drag the image file in instead, or download it and upload it normally.

---

## 16. Getting Help

For anything not covered here, or if something looks broken rather than just unfamiliar, reach out to Luke (site developer) rather than guessing — some things (site-wide settings, navigation, user accounts) are easy to get into a confusing state if edited by more than one person at once.
