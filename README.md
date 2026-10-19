# Zylara.co website

Static website for **zylara.co**. It is plain HTML, CSS and JavaScript, so there is nothing to install or build.

## Folder structure

```
zylara-website/
├── index.html                    Home page                 → zylara.co/
├── branding/index.html           Branding                  → zylara.co/branding/
├── social-media/index.html       Social media              → zylara.co/social-media/
├── photo-video/index.html        Photo and video           → zylara.co/photo-video/
├── meta-google-ads/index.html    Meta and Google ads       → zylara.co/meta-google-ads/
├── business-development/index.html  Business development  → zylara.co/business-development/
├── websites-apps/index.html      Websites and apps         → zylara.co/websites-apps/
├── crm-systems/index.html        CRM and systems           → zylara.co/crm-systems/
├── 404.html                      "Page not found" page
├── robots.txt                    Tells Google it can read the site
├── sitemap.xml                   List of pages for Google
├── assets/
│   ├── css/
│   │   ├── site.css              Shared rules (all pages)
│   │   ├── home.css              Home page styles
│   │   └── <page>.css            One stylesheet per service page
│   ├── js/
│   │   └── site.js               Menu, loader, animations, lightbox, contact form
│   ├── images/
│   │   ├── brand/                Logo, favicon, share image (og-image.jpg)
│   │   ├── posts/                Social media posts we designed
│   │   ├── brand-guidelines/     Emma Thinking brand guideline pages
│   │   ├── photo-video/          Event photos and video posters
│   │   ├── websites/             Emma Thinking website screens
│   │   └── crm/                  CRM screens (names and amounts blurred)
│   └── videos/                   Photo and video page clips (MP4)
└── .vscode/extensions.json       Suggests the Live Server extension
```

## 1. Open and preview in VS Code

1. Unzip the folder somewhere easy, for example `Documents/zylara-website`.
2. In VS Code: **File → Open Folder…** and pick `zylara-website`.
3. VS Code will suggest **Live Server**. Install it (or search "Live Server" by Ritwick Dey in Extensions).
4. Right-click `index.html` → **Open with Live Server**. The site opens in your browser and reloads when you save.

Use Live Server instead of double-clicking the file. The page links (like `branding/`) need a small web server to work, which Live Server gives you.

## 2. Put it on GitHub

**Easiest: inside VS Code**

1. Click the **Source Control** icon on the left (the branch symbol).
2. Click **Publish to GitHub** (sign in to GitHub when asked).
3. Choose **Private repository**, name it `zylara-website`, and select all files.

**Or with the terminal** (Terminal → New Terminal), after creating an empty repo on github.com:

```
git init
git add .
git commit -m "Zylara.co website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/zylara-website.git
git push -u origin main
```

## 3. Host it free on Cloudflare Pages

1. Log in at dash.cloudflare.com (the same account where you bought zylara.co).
2. Go to **Workers & Pages → Create application → Pages tab → Import an existing Git repository**.
3. Connect GitHub and pick `zylara-website` → **Begin setup**.
4. Settings:
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: `exit 0`
   - Build output directory: `/`
5. Deploy. You get a test link like `zylara-website.pages.dev`.
6. Open the project → **Custom domains → Set up a custom domain** → add `zylara.co`, then also `www.zylara.co`. Because the domain is in the same Cloudflare account, the DNS is set for you.

After this, every time you push to GitHub the site updates by itself in about a minute.

## 4. Before going live, fill these in

- **Social links.** The Facebook, Instagram, TikTok and LinkedIn buttons point to `#`. In VS Code press **Ctrl+Shift+H** (Mac: Cmd+Shift+H), search `href="#">Facebook` and so on, and paste your real page links.
- **Email.** The site shows `info@zylara.co`. Set it up in Zoho Mail so messages arrive.
- **WhatsApp number.** It's `94761552015` everywhere. If it changes, use **Find in Files** to replace it, including in `assets/js/site.js`.
- **Google Search Console.** After the site is live, add `zylara.co` in Search Console and submit `https://zylara.co/sitemap.xml`.

## How the contact form works

There is no server, so the "Request a free audit" form opens WhatsApp with the person's details already typed in. They press **Send** in WhatsApp and the message comes to you.

## Changing things

- **Text:** edit the page's `index.html`. Search for the sentence you want to change.
- **Colours and spacing:** the page's file in `assets/css/`. Main colours: `#0F0F12` (night), `#C8F25A` (volt green), `#F4F1EA` (paper).
- **Images:** replace a file in `assets/images/…` with a new one using the **same name**, or update the `src="…"` in the HTML.
- Keep images under about 300 KB (export as JPG, around 1600px wide max) so the site stays fast.

## Phone layout

Every page has its own phone design (screens up to 700px wide):

- Hero pictures sit in order. Nothing overlaps.
- Each page's top section has a light animation and a "live" card that changes its message every few seconds. These rules are after `/* ===== Phone hero (live) ===== */` in each page's CSS file.
- "What you get" and "How it works" become compact rows.
- Every page has a menu button with all services.
- The floating WhatsApp button appears after you scroll past the top section.

The phone rules are at the bottom of each page's CSS file, after the line `/* ===== Phone layout ===== */`. To preview a phone in Chrome, press F12 and click the phone icon (Toggle device toolbar).
