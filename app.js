(() => {
  const data = window.PROFILE_DATA;
  const basePath = window.SITE_BASE_PATH;
  const siteUrl = new URL(
    basePath,
    window.location.protocol === "file:" ? window.location.href : window.location.origin,
  ).href;
  const relativePath = window.location.pathname.slice(basePath.length);
  const pathSlug = relativePath.split("/").filter(Boolean)[0];
  const requestedSlug = pathSlug || new URLSearchParams(window.location.search).get("profile");
  const slug = requestedSlug && data.profiles[requestedSlug] ? requestedSlug : data.defaultProfile;
  const profile = data.profiles[slug];

  const elements = {
    card: document.querySelector(".card"),
    portrait: document.getElementById("portrait"),
    portraitFallback: document.getElementById("portrait-fallback"),
    name: document.getElementById("contact-name"),
    role: document.getElementById("contact-role"),
    title: document.getElementById("contact-title"),
    organization: document.getElementById("contact-organization"),
    bio: document.getElementById("contact-bio"),
    addContact: document.getElementById("add-contact"),
    actions: document.getElementById("contact-actions"),
    favicon: document.getElementById("site-icon"),
  };

  const initials = profile.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const setOptionalText = (element, value) => {
    element.textContent = value || "";
    element.hidden = !value;
  };

  const setMeta = (selector, attribute, value) => {
    let element = document.querySelector(selector);
    if (!value) {
      element?.remove();
      return;
    }

    if (!element) {
      element = document.createElement("meta");
      const [name, content] = selector.match(/meta\[(.+?)="(.+?)"\]/).slice(1);
      element.setAttribute(name, content);
      document.head.append(element);
    }
    element.setAttribute(attribute, value);
  };

  const absoluteUrl = (path) => new URL(path, siteUrl).href;
  const profileUrl = slug === data.defaultProfile
    ? siteUrl
    : `${siteUrl}${encodeURIComponent(slug)}/`;
  const description = profile.bio || [profile.title, profile.organization].filter(Boolean).join(" at ");
  const pageTitle = [profile.fullName, profile.title].filter(Boolean).join(" — ");
  const imageAlt = [profile.fullName, profile.title].filter(Boolean).join(", ");

  document.title = pageTitle;
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", pageTitle);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:site_name"]', "content", profile.fullName);
  setMeta('meta[property="og:url"]', "content", profileUrl);
  setMeta('meta[property="og:image"]', "content", profile.socialImage ? absoluteUrl(profile.socialImage) : "");
  setMeta('meta[property="og:image:alt"]', "content", profile.socialImage ? imageAlt : "");
  setMeta('meta[name="twitter:card"]', "content", profile.socialImage ? "summary_large_image" : "summary");
  setMeta('meta[name="twitter:title"]', "content", pageTitle);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", profile.socialImage ? absoluteUrl(profile.socialImage) : "");
  setMeta('meta[name="twitter:image:alt"]', "content", profile.socialImage ? imageAlt : "");
  document.querySelector('link[rel="canonical"]').href = profileUrl;

  elements.name.textContent = profile.fullName;
  setOptionalText(elements.title, profile.title);
  setOptionalText(elements.organization, profile.organization);
  elements.role.hidden = !profile.title && !profile.organization;
  setOptionalText(elements.bio, profile.bio);
  elements.card.setAttribute("aria-label", `${profile.fullName} contact card`);

  elements.portraitFallback.textContent = initials;
  elements.portrait.alt = `${profile.fullName} headshot`;
  elements.portrait.addEventListener("load", () => {
    elements.portraitFallback.hidden = true;
  });
  elements.portrait.addEventListener("error", () => {
    elements.portrait.hidden = true;
  });
  elements.portrait.src = absoluteUrl(profile.photo);

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#1d1d1f"/><text x="32" y="40" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="white">${initials}</text></svg>`;
  elements.favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

  const createAction = ({ label, href, ariaLabel, newTab = false }) => {
    const link = document.createElement("a");
    link.className = "button action";
    link.textContent = label;
    link.href = href;
    link.setAttribute("aria-label", ariaLabel || label);
    if (newTab) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    elements.actions.append(link);
  };

  if (profile.phone) {
    createAction({ label: "Call", href: `tel:${profile.phone}`, ariaLabel: `Call ${profile.fullName}` });
  }
  if (profile.email) {
    createAction({ label: "Email", href: `mailto:${profile.email}`, ariaLabel: `Email ${profile.fullName}` });
  }
  if (profile.linkedin) {
    createAction({
      label: "LinkedIn",
      href: profile.linkedin,
      ariaLabel: `View ${profile.fullName} on LinkedIn`,
      newTab: true,
    });
  }
  (profile.links || []).forEach((link) => {
    if (link.url && link.label) {
      createAction({
        label: link.label,
        href: link.url,
        ariaLabel: link.ariaLabel || `${link.label} for ${profile.fullName}`,
        newTab: link.newTab !== false,
      });
    }
  });
  elements.actions.hidden = elements.actions.children.length === 0;

  const escapeVCard = (value = "") => String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

  const nameParts = profile.fullName.trim().split(/\s+/);
  const familyName = nameParts.length > 1 ? nameParts.pop() : "";
  const givenName = nameParts.join(" ");
  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(familyName)};${escapeVCard(givenName)};;;`,
    `FN:${escapeVCard(profile.fullName)}`,
    profile.organization && `ORG:${escapeVCard(profile.organization)}`,
    profile.title && `TITLE:${escapeVCard(profile.title)}`,
    profile.phone && `TEL;TYPE=CELL,VOICE:${profile.phone}`,
    profile.email && `EMAIL;TYPE=INTERNET:${profile.email}`,
    profile.photo && `PHOTO;VALUE=URI:${absoluteUrl(profile.photo)}`,
    profile.linkedin && `URL:${profile.linkedin}`,
    profile.linkedin && `item1.URL;TYPE=pref:${profile.linkedin}`,
    profile.linkedin && "item1.X-ABLabel:LinkedIn",
    profile.linkedin && `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}`,
    ...(profile.links || []).filter((link) => link.url).map((link) => `URL:${link.url}`),
    `REV:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    "END:VCARD",
  ].filter(Boolean).join("\r\n");

  const vCardUrl = URL.createObjectURL(new Blob([vCard], { type: "text/vcard;charset=utf-8" }));
  elements.addContact.href = vCardUrl;
  elements.addContact.download = `${profile.slug}.vcf`;
  elements.addContact.setAttribute("aria-label", `Add ${profile.fullName} to contacts`);
})();
