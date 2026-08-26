import type { CollectionAfterChangeHook } from 'payload'

import { getServerSideURL } from '../../../utilities/getURL'

const ADMIN_NOTIFICATION_EMAIL = 'chasingachancellc@gmail.com'

const COLORS = {
  cream: '#f0e0c7',
  green: '#00260f',
  greenDark: '#002202',
  orange: '#f15a24',
}

function buildEmailShell({ eyebrow, tag, title, bodyHtml }: {
  eyebrow: string
  tag: string
  title: string
  bodyHtml: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" />
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; background: ${COLORS.cream}; margin: 0; padding: 0; }
    .wrap { max-width: 600px; margin: 40px auto; background: ${COLORS.cream}; border: 1px solid #ddc7a0; }
    .header { background: ${COLORS.greenDark}; padding: 32px 40px; }
    .header h1 { font-family: 'Playfair Display', Georgia, serif; color: ${COLORS.cream}; font-size: 22px; font-weight: 700; margin: 0; }
    .header p { color: rgba(240,224,199,0.55); font-size: 11px; margin: 6px 0 0; letter-spacing: 0.2em; text-transform: uppercase; font-family: Arial, sans-serif; }
    .body { padding: 40px; }
    .tag { display: inline-block; background: ${COLORS.orange}; color: #fff; font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; margin-bottom: 20px; }
    .body h2 { font-family: 'Playfair Display', Georgia, serif; color: ${COLORS.green}; font-size: 20px; margin: 0 0 16px; }
    .body p { font-size: 16px; color: ${COLORS.green}; line-height: 1.6; margin: 0 0 16px; }
    .body a { color: ${COLORS.orange}; }
    .footer { border-top: 1px solid #ddc7a0; padding: 20px 40px; }
    .footer p { font-family: Arial, sans-serif; font-size: 11px; color: #9c8a68; margin: 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Putnam County Democratic Party</h1>
      <p>CMS Account Notice</p>
    </div>
    <div class="body">
      <span class="tag">${tag}</span>
      <h2>${title}</h2>
      ${bodyHtml}
    </div>
    <div class="footer">
      <p>Sent by the Putnam County Democratic Party CMS, managed by Chasing a Chance, LLC.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export const sendNewUserEmails: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') {
    return doc
  }

  const adminURL = `${getServerSideURL()}/admin`

  await req.payload.sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `New CMS user created: ${doc.name || doc.email}`,
    html: buildEmailShell({
      eyebrow: 'CMS Account Notice',
      tag: 'New Account',
      title: 'A new user was added',
      bodyHtml: `
        <p><strong>Name:</strong> ${doc.name || '(not set)'}<br/>
        <strong>Email:</strong> ${doc.email}</p>
      `,
    }),
  })

  await req.payload.sendEmail({
    to: doc.email,
    subject: 'Your Putnam County Democratic Party CMS account',
    html: buildEmailShell({
      eyebrow: 'CMS Account Notice',
      tag: 'Welcome',
      title: `Hi ${doc.name || 'there'}, your account is ready`,
      bodyHtml: `
        <p>An account was created for you on the Putnam County Democratic Party CMS.</p>
        <p>You can log in here: <a href="${adminURL}">${adminURL}</a></p>
        <p>If you don't know your password yet, use the "forgot password" link on the login page to set one.</p>
      `,
    }),
  })

  return doc
}
