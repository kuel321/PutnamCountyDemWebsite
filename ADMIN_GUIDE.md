# Putnam County Democratic Party Website Admin Guide

This guide covers the things you'll use most often in the website's admin area: updating pages, adding photos, managing meetings and candidates, publishing changes, and working with the members-only section.

You don't need any technical experience to use it. If something feels unclear or looks broken, just reach out to Luke rather than worrying about messing anything up.

**Admin address:** `https://[your-site-domain]/admin`

## Table of contents

1. [Logging in](#1-logging-in)
2. [Finding your way around](#2-finding-your-way-around)
3. [Creating and editing pages](#3-creating-and-editing-pages)
4. [Building a page with blocks](#4-building-a-page-with-blocks)
5. [Photos and files](#5-photos-and-files)
6. [Drafts, publishing, and previewing](#6-drafts-publishing-and-previewing)
7. [Header and footer](#7-header-and-footer)
8. [Home page news and highlights](#8-home-page-news-and-highlights)
9. [Meetings and meeting minutes](#9-meetings-and-meeting-minutes)
10. [Candidates and districts](#10-candidates-and-districts)
11. [President's messages](#11-presidents-messages)
12. [Members-only area](#12-members-only-area)
13. [Activity log](#13-activity-log)
14. [Staff accounts](#14-staff-accounts)
15. [SEO settings](#15-seo-settings)
16. [Common questions](#16-common-questions)
17. [Getting help](#17-getting-help)

## 1. Logging in

1. Go to `/admin` on the website. For example: `https://yoursite.com/admin`.
2. Enter the email address and password for your staff account.
3. After logging in, you'll land on the Dashboard. The menu on the left contains the different parts of the site you can manage.

Your staff login is separate from the login club members use for the members-only area. If you need a staff account, someone who already has access can create one for you under **Admin → Users**.

## 2. Finding your way around

The menu on the left is divided into a few groups:

| Group | What you'll find there |
|---|---|
| **Content** | Pages, photos and files, News Reel & Highlights, and President's Messages |
| **Meetings** | Meetings and Meeting Minutes |
| **Candidates** | Candidates, Districts, and content shared across candidate pages |
| **Club Members** | Member accounts and submitted meeting minutes |
| **Site-wide** | Header and Footer settings |
| **Admin** | Staff user accounts and the activity log |

Select an item to see everything already saved in that section. From there, choose an existing item to edit it or select **Create New** in the upper-right corner.

## 3. Creating and editing pages

Pages are used for most of the site's general content, including About, History, Leadership, Get Involved, Events, News, and The Issues.

### Creating a page

1. Go to **Content → Pages**, then select **Create New**.
2. Enter a **Title**.
3. Open the **Content** tab and add the blocks you want to use. Blocks are covered in the next section.
4. Check the **Slug** in the sidebar. This becomes the page's URL, so a slug of `about` creates `yoursite.com/about`. It is filled in from the title automatically, but you can unlock the field and change it if needed.
5. Save the page as a draft or publish it when you're ready for it to go live.

### Editing a page

Go to **Content → Pages**, select the page, make your changes, and then choose **Save** or **Publish**.

Creating a page does not automatically add it to the website's menu. To do that, you'll also need to update the Header under **Site-wide**.

## 4. Building a page with blocks

Pages are built by stacking content blocks in whatever order you need. In the **Content** tab, select **Add Block** to add a section. You can drag blocks to reorder them or use the trash icon to remove them.

### Content

Use this for regular text: paragraphs, headings, links, lists, dividers, and bold or italic formatting.

### Media + Content (Side-by-Side)

This places a photo or ad next to a section of text. It's especially useful for announcements on the **News & Resources** page.

- **Media:** The image you want to show.
- **Link back to original post:** Optional. If the image came from Facebook, Instagram, or another website, paste the original post's URL here to make the image clickable.
- **Content:** The text that appears beside the image.

**Quick way to add an image:** Copy the image, click inside the Media field, and press **Ctrl+V** on Windows or **Cmd+V** on a Mac. The site will upload it for you. You can also drag in a file or choose one from the Media Library. If pasting doesn't work, save the image and drag the file into the field instead.

### Meeting Info

This automatically displays information from the **Meetings** section. There aren't any fields to fill out in the block itself. Add it to a page and it will stay updated as meetings are added or changed.

### Candidates

This pulls in the candidate roster and organizes it by candidate type and district. You can change the heading above the list, which defaults to “Meet Our Candidates.” Candidate information itself is managed under **Candidates → Candidates**.

### President's Message

This displays the currently active President's Message. Since messages can already be shown across the whole site, you'll generally only use this block when you want the message to appear inside a specific page.

## 5. Photos and files

Go to **Content → Media** to see the photos, PDFs, and other files uploaded to the site.

### Uploading from the Media Library

1. Select **Create New**.
2. Drag in a file or click to browse your computer.
3. Add **Alt Text**, which is a short description used by screen readers, such as “Candidate John Smith headshot.”
4. Add a caption if you want one displayed with the image.
5. Select **Save**.

Most of the time, you won't need to open the Media Library first. Image fields throughout the admin area allow you to upload or drag in a new file while you're editing the page, meeting, or candidate.

## 6. Drafts, publishing, and previewing

Pages and Meeting Minutes can be saved as drafts.

- **Save** keeps your changes as a draft without changing the public website.
- **Publish** makes the current version live.
- **Preview** opens the draft as it will appear on the website, without making it public.

It's fine to save unfinished work and come back to it later. The public version won't change until you publish.

## 7. Header and footer

The Header and Footer are under **Site-wide** because changes made there appear across the entire website.

### Header

Go to **Site-wide → Header** to manage:

- **Logo:** The logo in the upper-left corner.
- **Nav Items:** The links in the main menu.
- **Donate Button:** The label and destination for the button on the right side of the menu.

A navigation item can be either a **Direct Link**, which opens one page, or a **Dropdown**, which contains several links. For each link, you can select an existing page or enter a custom URL. Drag items to change their order, then save your changes.

### Footer

Go to **Site-wide → Footer** to update the contact email, social links, and the small “Site by…” credit. Add one social link for each platform you want displayed.

## 8. Home page news and highlights

Go to **Content → News Reel & Highlights** to manage the rotating messages near the top of the home page.

Each item has a title, an order number, and the message itself. Lower order numbers appear first. Add, remove, or reorder these items whenever you need to; the home page updates from this list automatically.

## 9. Meetings and meeting minutes

### Meetings

Go to **Meetings → Meetings**. Create one item for each club meeting and fill in its title, date, time, location, and any notes.

You can also add photos from the meeting. Check **Don't show on public page** if a photo should only be visible to logged-in members.

Meeting records feed the Meeting Info block and the Upcoming Meetings section on the home page. The home page only shows meetings happening today or later.

### Meeting Minutes

Go to **Meetings → Meeting Minutes** and select **Create New**.

1. Enter the title and date.
2. Link the minutes to the corresponding meeting if applicable.
3. Type the minutes into the Content field, upload the original PDF or Word document, or do both.
4. Save your work as a draft until it's ready, then publish it.

Only published minutes appear in the members-only area.

Members can also submit minutes for review. Those appear under **Club Members → Minutes Submissions**. Open a pending submission and mark it **Approved** to publish it or **Rejected** to decline it.

## 10. Candidates and districts

### Candidates

Go to **Candidates → Candidates** to create or update a candidate profile. Each record includes:

- Candidate name and type
- District, when applicable
- Office or race
- Headshot
- Bio
- Website and social links
- Event photos
- Campaign ads
- Slug, which controls the profile URL
- Additional Content Blocks for anything extra that belongs only on that candidate's page

Candidate pages work a little differently from regular pages. A regular page's layout is built from blocks stored in Payload and passed to `<RenderBlocks />`. Candidate pages use their own `[slug]/page.tsx` route with the main layout written in JSX. Payload supplies the candidate's information, but the React template controls where the headshot, bio, photos, ads, and other standard sections appear.

In other words, the candidate's content is editable in the CMS, but the main page layout is fixed in code. **Additional Content Blocks** gives you a way to add custom sections to the bottom of one candidate's page without changing that template.

### Content shared across every candidate page

Go to **Candidates → Candidate Pages (All Candidates)** to add content that should appear on every candidate profile. This is useful for shared sections such as the district finder.

The page order is:

1. The candidate's standard profile content
2. Blocks shared across all candidate pages
3. Additional blocks added to that individual candidate

### Districts

Go to **Candidates → Districts** to manage the districts used to group candidates. The **Number** field controls the order in which districts appear.

## 11. President's messages

Go to **Content → President's Messages** to create or update a message.

- **Title:** The internal label for the message.
- **Author:** The staff user credited with the message.
- **Message:** The text that will be displayed.
- **Display Date:** When the message should begin appearing.
- **Archive Date:** Optional. When the message should stop appearing.
- **Placement:** Show it as a site-wide banner or only on pages where the President's Message block has been added.

If more than one message falls within its display window, the most recent one is shown.

## 12. Members-only area

The members-only section uses a separate login from the website admin.

The **Members** menu contains two links: a public Members page and a protected Members Only page at `/members`. Visitors who aren't logged in are sent to the member login screen.

### Creating a member account

1. Go to **Club Members → Club Members** and select **Create New**.
2. Enter the member's name and email address, then set a password.
3. Leave **Access Enabled** checked.
4. Save the account and give the member the email address and password you set.

There isn't currently a self-service password reset for members. If someone forgets their password, open their record, set a new one, and send it to them.

To temporarily remove access without deleting the account, uncheck **Access Enabled**. You can turn it back on later.

After logging in, members can view all published Meeting Minutes and log out. Draft minutes are never shown there.

## 13. Activity log

Go to **Admin → Activity Log** to see a running record of who changed what, and when — for example, "Jane Smith updated Pages: About" or "Luke deleted Media: old-flyer.jpg."

This list is written automatically by the site itself every time something is created, changed, or deleted — there's nothing to fill in here, and entries can't be edited or removed. It's meant purely as a reference if you ever need to check who made a particular change.

## 14. Staff accounts

Go to **Admin → Users** to manage people who can log into the website admin. This is separate from the Club Members list.

To add someone, select **Create New**, then enter their name, email address, password, and an optional profile photo. The profile photo can appear anywhere they're credited, such as a President's Message. A welcome email is sent when the account is created.

Staff accounts have access to edit the site's pages, collections, and site-wide settings, so they should only be created for people who need that level of access.

## 15. SEO settings

Regular pages have an **SEO** tab with three optional fields:

- **Meta Title:** The title used in search results.
- **Meta Description:** The short description shown below it.
- **Meta Image:** The image used when the page is shared on social media.

These are worth filling out for important pages, but you don't have to complete them before publishing.

## 16. Common questions

### I published a change, but I don't see it yet

Most pages update right away, but some areas, including the home page, can take a short time to refresh. Give it a minute, then reload the page.

### An image is broken or missing

Check that the image still exists under **Content → Media** and that the image field isn't empty.

### A member can't log in

Open their record under **Club Members** and make sure **Access Enabled** is checked. If they forgot their password, set a new one and send it to them.

### A block I added is blank

Some blocks pull information from another part of the admin. For example, Meeting Info needs at least one meeting, Candidates needs candidate records, and President's Message needs an active message. If there isn't any content available to pull in, the block won't have anything to display.

### I couldn't paste an image into the Media + Content block

Make sure you copied the image itself rather than the page link, and click inside the Media field before pasting. If it still doesn't work, save the image to your computer and drag the file into the field.

## 17. Getting help

If something isn't covered here, or the site seems broken rather than unfamiliar, reach out to Luke. A quick question is usually easier to sort out than trying to untangle a setting you're unsure about.
