# Danny Ward — NFC digital business card

A lightweight, mobile-first contact page designed to open from an NFC tag. One static template supports multiple profiles with no framework, build step, backend, tracking, or third-party dependency.

## Add a profile

1. Add the person's photo to this folder.
2. Copy the `danny` entry in `profiles.js`, give it a unique key and matching `slug`, then replace its values.
3. Open `https://yourdomain.com/their-slug/`.

Optional fields can be empty or omitted. Missing organization, bio, phone, email, LinkedIn, and additional links are hidden automatically. The vCard is generated in the browser for the selected profile.

```js
jamie: {
  slug: "jamie",
  fullName: "Jamie Example",
  title: "Program Manager",
  organization: "Example Organization",
  bio: "A short professional biography.",
  photo: "jamie.jpg",
  phone: "+12125550123",
  email: "jamie@example.com",
  linkedin: "https://www.linkedin.com/in/example/",
  links: [],
},
```

The root URL loads the `defaultProfile` set near the top of `profiles.js`. The page intentionally uses `noindex` metadata because it is designed for direct NFC sharing; this reduces search-engine discovery but does not make publicly hosted contact details private.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/?profile=danny`. Python's basic server does not support clean-path rewrites, but the query fallback loads the identical profile. Test the contact download and available secondary actions on a phone before writing the final HTTPS URL to the NFC tag.

## Publish

The included `_redirects` file gives clean profile URLs on Cloudflare Pages, Netlify, and compatible static hosts by routing every path to the shared `index.html`. On another host, configure the equivalent fallback rewrite to `/index.html`.

GitHub Pages does not support fallback rewrites. While the site remains there, use `https://danward824-stack.github.io/nfc-card/?profile=slug`; the root URL continues to load Danny by default.
