import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SITE_URL = "https://thefitnessgalaxy.com";
const FB_API = "https://graph.facebook.com/v25.0";

/**
 * Posts a new blog article or shop product to the connected Facebook Page.
 * Called by entity-trigger workflows on BlogPost / Product creation.
 *
 * Body: { entity_type: "blog" | "product", title, description, image_url, slug, product_id }
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { entity_type, title, description, image_url, slug, product_id } = body;

    if (!title) return Response.json({ error: "title is required" }, { status: 400 });

    // Build the share message + link back to the site
    let link = "";
    let message = "";
    if (entity_type === "blog") {
      link = `${SITE_URL}/blog/${slug || ""}`;
      message = `📚 New on The Fitness Galaxy: ${title}${description ? `\n\n${description}` : ""}`;
    } else if (entity_type === "product") {
      link = `${SITE_URL}/products/${product_id || ""}`;
      message = `🛒 New in our shop: ${title}${description ? `\n\n${description}` : ""}`;
    } else {
      return Response.json({ error: "entity_type must be 'blog' or 'product'" }, { status: 400 });
    }

    // Get the builder's Facebook connection token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("facebook_pages");

    // List managed Pages and grab a Page access token
    const accountsRes = await fetch(
      `${FB_API}/me/accounts?fields=id,name,access_token&limit=100&access_token=${encodeURIComponent(accessToken)}`,
      { method: "GET" }
    );
    const accounts = await accountsRes.json();
    const pages = accounts.data || [];
    if (pages.length === 0) {
      return Response.json({ error: "No Facebook Pages found for the connected account" }, { status: 400 });
    }
    const page = pages[0];

    // If we have an image, publish a photo post (guarantees the image displays);
    // otherwise fall back to a link post.
    let postResult;
    if (image_url) {
      const params = new URLSearchParams();
      params.set("url", image_url);
      params.set("caption", `${message}\n\nRead more: ${link}`);
      params.set("published", "true");
      params.set("access_token", page.access_token);
      const res = await fetch(`${FB_API}/${page.id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      postResult = await res.json();
      if (!res.ok) throw new Error(postResult.error?.message || "Facebook photo post failed");
    } else {
      const params = new URLSearchParams();
      params.set("message", message);
      params.set("link", link);
      params.set("access_token", page.access_token);
      const res = await fetch(`${FB_API}/${page.id}/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      postResult = await res.json();
      if (!res.ok) throw new Error(postResult.error?.message || "Facebook feed post failed");
    }

    return Response.json({ success: true, page: page.name, post_id: postResult.id || postResult.post_id, link });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}