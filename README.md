# Danny Ward — NFC digital business card

A lightweight, mobile-first contact page designed to open from an NFC tag. It uses plain HTML and CSS with no build step, framework, tracking, or third-party dependency.

## Before publishing

1. The provided headshot is included as `portrait.jpg`. Replace that file with another square portrait later if desired; the page also has a `DW` fallback if the image cannot load.
2. Contact details appear in both `index.html` and `danny-ward.vcf`. Keep both files in sync when they change.
3. If publishing details change, update the title, description, and Open Graph fields in the `<head>` of `index.html`.

The page intentionally uses `noindex` metadata because it is designed for direct NFC sharing. This reduces search-engine discovery but does not make the publicly hosted contact details private.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Test the contact download and all three secondary actions on a phone before writing the final HTTPS URL to the NFC tag.

## Publish

The project can be uploaded as-is to GitHub Pages, Cloudflare Pages, or another static host. All asset links are relative, so it also works from a repository subpath such as `https://example.github.io/nfc-card/`.

For the most reliable contact import, serve `danny-ward.vcf` with the MIME type `text/vcard` or `text/x-vcard`. Most static hosts recognize `.vcf` automatically.
