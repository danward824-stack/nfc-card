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
    .filter((part) => /[\p{L}\p{N}]/u.test(part))
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
  const displaySubtitle = profile.subtitle || profile.title;
  const displayDescriptor = profile.descriptor || profile.organization;
  const contactName = profile.contactName || profile.fullName;
  const description = profile.bio || [displaySubtitle, displayDescriptor].filter(Boolean).join(" — ");
  const pageTitle = [profile.fullName, profile.title].filter(Boolean).join(" — ");
  const imageAlt = [profile.fullName, profile.title].filter(Boolean).join(", ");

  document.title = pageTitle;
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", pageTitle);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:site_name"]', "content", profile.fullName);
  setMeta('meta[property="og:url"]', "content", profileUrl);
  setMeta('meta[property="og:image"]', "content", profile.socialImage ? absoluteUrl(profile.socialImage) : "");
  setMeta('meta[property="og:image:width"]', "content", profile.socialImage ? String(profile.socialImageWidth || "") : "");
  setMeta('meta[property="og:image:height"]', "content", profile.socialImage ? String(profile.socialImageHeight || "") : "");
  setMeta('meta[property="og:image:alt"]', "content", profile.socialImage ? imageAlt : "");
  setMeta('meta[name="twitter:card"]', "content", profile.socialImage ? "summary_large_image" : "summary");
  setMeta('meta[name="twitter:title"]', "content", pageTitle);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", profile.socialImage ? absoluteUrl(profile.socialImage) : "");
  setMeta('meta[name="twitter:image:alt"]', "content", profile.socialImage ? imageAlt : "");
  document.querySelector('link[rel="canonical"]').href = profileUrl;

  elements.name.textContent = profile.fullName;
  setOptionalText(elements.title, displaySubtitle);
  setOptionalText(elements.organization, displayDescriptor);
  elements.role.hidden = !displaySubtitle && !displayDescriptor;
  setOptionalText(elements.bio, profile.bio);
  elements.card.setAttribute("aria-label", `${profile.fullName} contact card`);

  elements.portraitFallback.textContent = initials;
  elements.portrait.alt = profile.photoAlt || `${profile.fullName} headshot`;
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

  const defaultActions = [
    { type: "phone", label: "Call" },
    { type: "email", label: "Email" },
    { type: "linkedin", label: "LinkedIn" },
    ...(profile.links || []),
  ];
  const actions = profile.actions || defaultActions;

  const resolveActionUrl = (action) => {
    if (action.type === "phone") return profile.phone ? `tel:${profile.phone}` : "";
    if (action.type === "email") return profile.email ? `mailto:${profile.email}` : "";
    if (action.type === "linkedin") return profile.linkedin || action.url || "";
    return action.url || "";
  };

  actions.forEach((action) => {
    const href = resolveActionUrl(action);
    if (href && action.label) {
      const opensNewTab = action.newTab ?? !["phone", "email"].includes(action.type);
      createAction({
        label: action.label,
        href,
        ariaLabel: action.ariaLabel || `${action.label} for ${profile.fullName}`,
        newTab: opensNewTab,
      });
    }
  });
  elements.actions.dataset.count = String(elements.actions.children.length);
  elements.actions.hidden = elements.actions.children.length === 0;

  const escapeVCard = (value = "") => String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

  const nameParts = contactName.trim().split(/\s+/);
  const familyName = nameParts.length > 1 ? nameParts.pop() : "";
  const givenName = nameParts.join(" ");
  const socialLinks = new Map();
  if (profile.linkedin) socialLinks.set("linkedin", profile.linkedin);
  actions.forEach((action) => {
    if (action.url && /^https?:\/\//i.test(action.url)) {
      socialLinks.set(action.type || "website", action.url);
    }
  });
  (profile.links || []).forEach((link) => {
    if (link.url && /^https?:\/\//i.test(link.url)) {
      socialLinks.set(link.type || "website", link.url);
    }
  });
  const socialVCardLines = [...socialLinks].flatMap(([type, url]) => [
    `URL:${url}`,
    type !== "website" && `X-SOCIALPROFILE;TYPE=${type}:${url}`,
  ]).filter(Boolean);
  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(familyName)};${escapeVCard(givenName)};;;`,
    `FN:${escapeVCard(contactName)}`,
    profile.organization && `ORG:${escapeVCard(profile.organization)}`,
    profile.title && `TITLE:${escapeVCard(profile.title)}`,
    profile.phone && `TEL;TYPE=CELL,VOICE:${profile.phone}`,
    profile.email && `EMAIL;TYPE=INTERNET:${profile.email}`,
    profile.photo && `PHOTO;VALUE=URI:${absoluteUrl(profile.photo)}`,
    profile.linkedin && `item1.URL;TYPE=pref:${profile.linkedin}`,
    profile.linkedin && "item1.X-ABLabel:LinkedIn",
    ...socialVCardLines,
    `REV:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    "END:VCARD",
  ].filter(Boolean).join("\r\n");

  const vCardUrl = URL.createObjectURL(new Blob([vCard], { type: "text/vcard;charset=utf-8" }));
  elements.addContact.href = vCardUrl;
  elements.addContact.download = `${profile.slug}.vcf`;
  elements.addContact.setAttribute("aria-label", `Add ${contactName} to contacts`);
})();
