(() => {
  const data = window.PROFILE_DATA;
  const themes = window.TAPWARD_THEMES || {};
  const basePath = window.SITE_BASE_PATH;
  const actionTypes = new Set(["vcard", "url", "tel", "mailto", "sms", "internal", "toast"]);
  const themeProperties = { page: "--page", surface: "--surface", text: "--text", muted: "--muted", hairline: "--hairline", accent: "--accent", accentPressed: "--accent-pressed", secondary: "--secondary", onAccent: "--on-accent", accentSoft: "--accent-soft", focusRing: "--focus-ring" };
  const clean = (value) => typeof value === "string" ? value.trim() : value;
  const normalizeAction = (action = {}) => {
    const legacyType = action.type;
    const type = legacyType === "phone" ? "tel" : legacyType === "email" ? "mailto" : ["linkedin", "facebook", "instagram", "website"].includes(legacyType) ? "url" : legacyType;
    const socialType = action.socialType || (["linkedin", "facebook", "instagram"].includes(legacyType) ? legacyType : "");
    return { ...action, type, socialType };
  };
  const normalizeProfile = (raw, key) => {
    const display = raw.display || {};
    const contact = raw.contact || {};
    const legacyActions = [{ type: "phone", label: "Call" }, { type: "email", label: "Email" }, { type: "linkedin", label: "LinkedIn" }, ...(raw.links || [])];
    return {
      slug: clean(raw.slug || key),
      display: {
        name: clean(display.name || raw.fullName),
        subtitle: clean(display.subtitle ?? raw.subtitle ?? raw.title),
        descriptor: clean(display.descriptor ?? raw.descriptor ?? raw.organization),
        bio: clean(display.bio ?? raw.bio), photo: clean(display.photo ?? raw.photo),
        photoAlt: clean(display.photoAlt ?? raw.photoAlt), socialImage: clean(display.socialImage ?? raw.socialImage),
        socialImageWidth: display.socialImageWidth ?? raw.socialImageWidth, socialImageHeight: display.socialImageHeight ?? raw.socialImageHeight,
      },
      contact: {
        fullName: clean(contact.fullName || raw.contactName || raw.fullName), title: clean(contact.title ?? raw.title),
        organization: clean(contact.organization ?? raw.organization), phone: clean(contact.phone ?? raw.phone),
        email: clean(contact.email ?? raw.email), linkedin: clean(contact.linkedin ?? raw.linkedin),
      },
      primaryAction: normalizeAction(raw.primaryAction || { type: "vcard", label: "Add to Contacts" }),
      actions: (raw.actions || legacyActions).map(normalizeAction), sections: Array.isArray(raw.sections) ? raw.sections : [],
      theme: raw.theme || "default", themeOverrides: raw.themeOverrides || {},
    };
  };
  const validateProfile = (profile, key) => {
    const warnings = [];
    if (!profile.display.name) warnings.push("display.name is required");
    if (!profile.contact.fullName) warnings.push("contact.fullName is required");
    if (profile.slug !== key) warnings.push(`slug should match profile key "${key}"`);
    if (!themes[profile.theme]) warnings.push(`unknown theme "${profile.theme}"; using default`);
    [profile.primaryAction, ...profile.actions].forEach((action) => { if (!actionTypes.has(action.type)) warnings.push(`unsupported action type "${action.type}"`); if (!action.label) warnings.push("every action needs a label"); });
    profile.sections.forEach((section) => { if (!["text", "notice"].includes(section.type)) warnings.push(`unsupported section type "${section.type}"`); });
    Object.keys(profile.themeOverrides).forEach((name) => { if (!themeProperties[name]) warnings.push(`theme override "${name}" is not allowed`); });
    if (warnings.length) console.warn(`Profile "${key}": ${warnings.join("; ")}`);
    return warnings;
  };

  const siteUrl = new URL(basePath, window.location.protocol === "file:" ? window.location.href : window.location.origin).href;
  const setMeta = (selector, attribute, value) => {
    let element = document.querySelector(selector);
    if (!value) { element?.remove(); return; }
    if (!element) { element = document.createElement("meta"); const [name, content] = selector.match(/meta\[(.+?)="(.+?)"\]/).slice(1); element.setAttribute(name, content); document.head.append(element); }
    element.setAttribute(attribute, value);
  };
  const pathSlug = window.location.pathname.slice(basePath.length).split("/").filter(Boolean)[0];
  const requestedSlug = pathSlug || new URLSearchParams(window.location.search).get("profile");
  if (!requestedSlug) {
    document.title = "WardTap";
    setMeta('meta[name="description"]', "content", "Digital profiles built for a tap.");
    setMeta('meta[property="og:title"]', "content", "WardTap");
    setMeta('meta[property="og:description"]', "content", "Digital profiles built for a tap.");
    setMeta('meta[property="og:site_name"]', "content", "WardTap");
    setMeta('meta[property="og:url"]', "content", siteUrl);
    setMeta('meta[property="og:image"]', "content", "");
    setMeta('meta[property="og:image:width"]', "content", "");
    setMeta('meta[property="og:image:height"]', "content", "");
    setMeta('meta[property="og:image:alt"]', "content", "");
    setMeta('meta[name="twitter:card"]', "content", "summary");
    setMeta('meta[name="twitter:title"]', "content", "WardTap");
    setMeta('meta[name="twitter:description"]', "content", "Digital profiles built for a tap.");
    setMeta('meta[name="twitter:image"]', "content", "");
    setMeta('meta[name="twitter:image:alt"]', "content", "");
    document.querySelector('link[rel="canonical"]').href = siteUrl;
    document.getElementById("home-view").hidden = false;
    return;
  }
  if (!data.profiles[requestedSlug]) {
    window.location.replace(siteUrl);
    return;
  }
  const slug = requestedSlug;
  const profile = normalizeProfile(data.profiles[slug], slug);
  validateProfile(profile, slug);
  const elements = {
    card: document.querySelector(".card"), portrait: document.getElementById("portrait"), portraitFallback: document.getElementById("portrait-fallback"),
    name: document.getElementById("contact-name"), role: document.getElementById("contact-role"), title: document.getElementById("contact-title"),
    organization: document.getElementById("contact-organization"), bio: document.getElementById("contact-bio"), primary: document.getElementById("primary-action"),
    actions: document.getElementById("contact-actions"), sections: document.getElementById("profile-sections"), toast: document.getElementById("toast"), favicon: document.getElementById("site-icon"),
  };
  const absoluteUrl = (path) => new URL(path, siteUrl).href;
  elements.card.hidden = false;
  Object.entries({ ...(themes[profile.theme] || themes.default || {}), ...profile.themeOverrides }).forEach(([name, value]) => {
    if (themeProperties[name] && typeof value === "string") document.documentElement.style.setProperty(themeProperties[name], value);
  });
  const initials = profile.display.name.split(/\s+/).filter((part) => /[\p{L}\p{N}]/u.test(part)).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
  const setOptionalText = (element, value) => { element.textContent = value || ""; element.hidden = !value; };
  const profileUrl = `${siteUrl}${encodeURIComponent(slug)}/`;
  const description = profile.display.bio || [profile.display.subtitle, profile.display.descriptor].filter(Boolean).join(" — ");
  const pageTitle = [profile.display.name, profile.contact.title].filter(Boolean).join(" — ");
  const imageAlt = [profile.display.name, profile.contact.title].filter(Boolean).join(", ");
  document.title = pageTitle;
  setMeta('meta[name="description"]', "content", description); setMeta('meta[property="og:title"]', "content", pageTitle);
  setMeta('meta[property="og:description"]', "content", description); setMeta('meta[property="og:site_name"]', "content", profile.display.name);
  setMeta('meta[property="og:url"]', "content", profileUrl); setMeta('meta[property="og:image"]', "content", profile.display.socialImage ? absoluteUrl(profile.display.socialImage) : "");
  setMeta('meta[property="og:image:width"]', "content", profile.display.socialImage ? String(profile.display.socialImageWidth || "") : "");
  setMeta('meta[property="og:image:height"]', "content", profile.display.socialImage ? String(profile.display.socialImageHeight || "") : "");
  setMeta('meta[property="og:image:alt"]', "content", profile.display.socialImage ? imageAlt : ""); setMeta('meta[name="twitter:card"]', "content", profile.display.socialImage ? "summary_large_image" : "summary");
  setMeta('meta[name="twitter:title"]', "content", pageTitle); setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", profile.display.socialImage ? absoluteUrl(profile.display.socialImage) : ""); setMeta('meta[name="twitter:image:alt"]', "content", profile.display.socialImage ? imageAlt : "");
  document.querySelector('link[rel="canonical"]').href = profileUrl;
  elements.name.textContent = profile.display.name; setOptionalText(elements.title, profile.display.subtitle); setOptionalText(elements.organization, profile.display.descriptor);
  elements.role.hidden = !profile.display.subtitle && !profile.display.descriptor; setOptionalText(elements.bio, profile.display.bio); elements.card.setAttribute("aria-label", `${profile.display.name} contact card`);
  elements.portraitFallback.textContent = initials; elements.portrait.alt = profile.display.photoAlt || `${profile.display.name} headshot`;
  elements.portrait.addEventListener("load", () => { elements.portraitFallback.hidden = true; }); elements.portrait.addEventListener("error", () => { elements.portrait.hidden = true; }); elements.portrait.src = absoluteUrl(profile.display.photo);
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#1d1d1f"/><text x="32" y="40" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="white">${initials}</text></svg>`;
  elements.favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

  const escapeVCard = (value = "") => String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
  const buildVCard = () => {
    const nameParts = profile.contact.fullName.trim().split(/\s+/); const familyName = nameParts.length > 1 ? nameParts.pop() : ""; const givenName = nameParts.join(" ");
    const socialLinks = new Map(); if (profile.contact.linkedin) socialLinks.set("linkedin", profile.contact.linkedin);
    profile.actions.forEach((action) => { if (action.url && /^https?:\/\//i.test(action.url)) socialLinks.set(action.socialType || "website", action.url); });
    const socialLines = [...socialLinks].flatMap(([type, url]) => [`URL:${url}`, type !== "website" && `X-SOCIALPROFILE;TYPE=${type}:${url}`]).filter(Boolean);
    return ["BEGIN:VCARD", "VERSION:3.0", `N:${escapeVCard(familyName)};${escapeVCard(givenName)};;;`, `FN:${escapeVCard(profile.contact.fullName)}`,
      profile.contact.organization && `ORG:${escapeVCard(profile.contact.organization)}`, profile.contact.title && `TITLE:${escapeVCard(profile.contact.title)}`,
      profile.contact.phone && `TEL;TYPE=CELL,VOICE:${profile.contact.phone}`, profile.contact.email && `EMAIL;TYPE=INTERNET:${profile.contact.email}`,
      profile.display.photo && `PHOTO;VALUE=URI:${absoluteUrl(profile.display.photo)}`, profile.contact.linkedin && `item1.URL;TYPE=pref:${profile.contact.linkedin}`,
      profile.contact.linkedin && "item1.X-ABLabel:LinkedIn", ...socialLines, `REV:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, "END:VCARD"].filter(Boolean).join("\r\n");
  };
  let toastTimer;
  const showToast = (message) => { window.clearTimeout(toastTimer); elements.toast.hidden = false; elements.toast.textContent = ""; window.requestAnimationFrame(() => { elements.toast.textContent = message; }); toastTimer = window.setTimeout(() => { elements.toast.hidden = true; elements.toast.textContent = ""; }, 3500); };
  const resolveAction = (action) => {
    if (action.type === "vcard") return { href: URL.createObjectURL(new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" })), download: `${profile.slug}.vcf` };
    if (action.type === "tel") return { href: action.url || (profile.contact.phone ? `tel:${profile.contact.phone}` : "") };
    if (action.type === "mailto") return { href: action.url || (profile.contact.email ? `mailto:${profile.contact.email}` : "") };
    if (action.type === "sms") return { href: action.url || (profile.contact.phone ? `sms:${profile.contact.phone}` : "") };
    if (action.type === "internal") return { href: action.url || "" }; if (action.type === "toast") return { message: action.message || "" };
    if (action.type === "url") return { href: action.url || (action.socialType === "linkedin" ? profile.contact.linkedin : "") }; return {};
  };
  const plusIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>';
  const createAction = (action, primary = false) => {
    const resolved = resolveAction(action); if (!action.label || (!resolved.href && !resolved.message)) return null;
    const element = document.createElement(action.type === "toast" ? "button" : "a"); element.className = `button ${primary ? "primary" : "action"}`;
    if (primary && action.type === "vcard") element.innerHTML = `${plusIcon}<span></span>`; (element.querySelector("span") || element).textContent = action.label;
    element.setAttribute("aria-label", action.ariaLabel || (action.type === "vcard" ? `Add ${profile.contact.fullName} to contacts` : `${action.label} for ${profile.display.name}`));
    if (resolved.href) element.href = resolved.href; if (resolved.download) element.download = resolved.download; if (resolved.message) element.addEventListener("click", () => showToast(resolved.message));
    const newTab = action.newTab ?? action.type === "url"; if (newTab && resolved.href) { element.target = "_blank"; element.rel = "noopener noreferrer"; } return element;
  };
  const primaryElement = createAction(profile.primaryAction, true); if (primaryElement) elements.primary.append(primaryElement); else elements.primary.hidden = true;
  profile.actions.forEach((action) => { const element = createAction(action); if (element) elements.actions.append(element); }); elements.actions.dataset.count = String(elements.actions.children.length); elements.actions.hidden = elements.actions.children.length === 0;
  profile.sections.forEach((section) => {
    if (!["text", "notice"].includes(section.type) || !section.text) return; const wrapper = document.createElement("section"); wrapper.className = `profile-section profile-section--${section.type}`;
    if (section.id && /^[A-Za-z][A-Za-z0-9_-]*$/.test(section.id)) wrapper.id = section.id;
    if (section.title) { const heading = document.createElement("h2"); heading.textContent = section.title; wrapper.append(heading); } const text = document.createElement("p"); text.textContent = section.text; wrapper.append(text); elements.sections.append(wrapper);
  });
  elements.sections.hidden = elements.sections.children.length === 0;
  window.TAPWARD_APP = { normalizeProfile, validateProfile, buildVCard, profile };
})();
