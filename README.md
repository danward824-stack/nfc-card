# Danny Ward — NFC digital business card

A lightweight, mobile-first contact page designed to open from an NFC tag. One static template supports multiple profiles with no framework, build step, backend, tracking, or third-party dependency.

## Add a profile

1. Add the person's photo to `public/`.
2. Copy the `danny` entry in `public/profiles.js`, give it a unique key and matching `slug`, then replace its values.
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

The root URL loads the `defaultProfile` set near the top of `public/profiles.js`. The page intentionally uses `noindex` metadata because it is designed for direct NFC sharing; this reduces search-engine discovery but does not make publicly hosted contact details private.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/?profile=danny`. Python's basic server does not support clean-path rewrites, but the query fallback loads the identical profile. Test the contact download and available secondary actions on a phone before writing the final HTTPS URL to the NFC tag.

## Deploy with Cloudflare Workers

This is an assets-only Cloudflare Worker with no backend script or build step. Deploy it with:

```sh
npx wrangler deploy
```

`wrangler.jsonc` publishes only the files in `public/` and uses `not_found_handling: "single-page-application"`, so clean paths such as `/danny/` and `/jamie/` serve the shared template.

In Cloudflare Workers Git integration, leave the build command empty and use `npx wrangler deploy` as the deploy command. No output directory, Worker entrypoint, or environment variables are required.
