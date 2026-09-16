# Danny Ward — NFC digital business card

A lightweight, mobile-first contact page designed to open from an NFC tag. One static template supports multiple profiles with no framework, build step, backend, tracking, or third-party dependency.

## Add a profile

1. Add the person's photo to `public/`.
2. Add a profile entry in `public/profiles.js`, give it a unique key and matching `slug`, then replace its values.
3. Open `https://yourdomain.com/their-slug/`.
4. Run `npm run generate-previews` to refresh every social preview image and the Worker metadata manifest.

Optional fields can be empty or omitted. Missing organization, bio, phone, email, LinkedIn, and additional links are hidden automatically. The vCard is generated in the browser for the selected profile.

New profiles may use the structured schema below. Existing flat profiles remain supported by the compatibility layer. `actions` controls button order; supported types are `vcard`, `url`, `tel`, `mailto`, `sms`, `internal`, and `toast`. Optional sections support `text` and `notice`. Themes are defined in `public/themes.js`; `themeOverrides` accepts only the named color tokens used there.

```js
jamie: {
  slug: "jamie",
  display: {
    name: "Jamie Example",
    subtitle: "Program Manager",
    descriptor: "Example Organization",
    bio: "A short professional biography.",
    photo: "jamie.jpg",
  },
  contact: {
    fullName: "Jamie Example",
    title: "Program Manager",
    organization: "Example Organization",
    phone: "+12125550123",
    email: "jamie@example.com",
    linkedin: "https://www.linkedin.com/in/example/",
  },
  primaryAction: { type: "vcard", label: "Add to Contacts" },
  actions: [
    { type: "tel", label: "Call" },
    { type: "mailto", label: "Email" },
    { type: "url", label: "LinkedIn", url: "https://www.linkedin.com/in/example/", socialType: "linkedin" },
  ],
  sections: [{ type: "text", title: "About", text: "Optional plain-text content." }],
  theme: "default",
  themeOverrides: {},
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

This uses Cloudflare Workers Static Assets plus a small Worker that injects profile-specific social metadata into the initial HTML response. Deploy it with:

```sh
npx wrangler deploy
```

`wrangler.jsonc` publishes only the files in `public/` and uses `not_found_handling: "single-page-application"`, so clean paths such as `/danny/` and `/jamie/` serve the shared template.

In Cloudflare Workers Git integration, leave the build command empty and use `npx wrangler deploy` as the deploy command. No output directory or environment variables are required. The Worker entrypoint and asset binding are configured in `wrangler.jsonc`.

Before deploying a new or updated profile, run:

```sh
npm install
npm run generate-previews
```

Commit the generated files under `public/assets/previews/` and `src/profile-metadata.js` with the profile change.
