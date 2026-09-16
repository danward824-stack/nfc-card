import { PROFILE_METADATA, FALLBACK_METADATA } from "./profile-metadata.js";

const SITE_ORIGIN = "https://wardtap.com";

class ContentHandler {
  constructor(attribute, value) {
    this.attribute = attribute;
    this.value = value;
  }

  element(element) {
    if (this.attribute) element.setAttribute(this.attribute, this.value);
    else element.setInnerContent(this.value);
  }
}

const rewriteMetadata = (response, metadata) => {
  const fields = [
    ["title", null, metadata.documentTitle],
    ['meta[name="description"]', "content", metadata.description],
    ['link[rel="canonical"]', "href", metadata.url],
    ['meta[property="og:title"]', "content", metadata.title],
    ['meta[property="og:description"]', "content", metadata.description],
    ['meta[property="og:site_name"]', "content", "WardTap"],
    ['meta[property="og:image"]', "content", metadata.image],
    ['meta[property="og:url"]', "content", metadata.url],
    ['meta[property="og:type"]', "content", "website"],
    ['meta[name="twitter:card"]', "content", "summary_large_image"],
    ['meta[name="twitter:title"]', "content", metadata.title],
    ['meta[name="twitter:description"]', "content", metadata.description],
    ['meta[name="twitter:image"]', "content", metadata.image],
  ];

  return fields.reduce(
    (rewriter, [selector, attribute, value]) => rewriter.on(selector, new ContentHandler(attribute, value)),
    new HTMLRewriter(),
  ).transform(response);
};

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (request.method !== "GET" || !contentType.includes("text/html")) return response;

    const url = new URL(request.url);
    const slug = url.pathname.split("/").filter(Boolean)[0] || "";
    const profile = PROFILE_METADATA[slug];
    const metadata = profile || {
      ...FALLBACK_METADATA,
      url: `${SITE_ORIGIN}/`,
    };
    return rewriteMetadata(response, metadata);
  },
};
