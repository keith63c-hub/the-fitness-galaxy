import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SITE_URL = "https://thefitnessgalaxy.com";
const IG_API = "https://graph.instagram.com";
const HASHTAGS = "#fitness #health #wellness #fitfam #homeworkout #gymlife #healthylifestyle";
const MAX_CAPTION = 2200;

/**
 * Publishes a new blog article or shop product as an Instagram Business post.
 * Instagram requires an image; uses the two-step container → publish flow.
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
    if (!image_url) return Response.json({ error: "Instagram posts require an image_url — skipped" }, { status: 400 });

    // Build link + caption (kept under Instagram's 2200-char limit)
    const link = entity_type === "blog"
      ? `${SITE_URL}/blog/${slug || ""}`
      : entity_type === "product"
        ? `${SITE_URL}/products/${product_id || ""}`
        : "";
    if (!link) return Response.json({ error: "entity_type must be 'blog' or 'product'" }, { status: 400 });

    const head = entity_type === "blog"
      ? `📚 New on The Fitness Galaxy: ${title}`
      : `🛒 New in our shop: ${title}`;
    const linkLine = `\n\nRead more: ${link}`;
    const tagsLine = `\n\n${HASHTAGS}`;
    const descRoom = MAX_CAPTION - (head.length + linkLine.length + tagsLine.length + 2);
    const desc = description && descRoom > 0 ? description.slice(0, descRoom) : "";
    const caption = `${head}${desc ? `\n\n${desc}` : ""}${linkLine}${tagsLine}`;

    // Instagram token + user id
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("instagram");
    const meRes = await fetch(`${IG_API}/me?fields=id,username&access_token=${encodeURIComponent(accessToken)}`);
    const me = await meRes.json();
    const igUserId = me.id;
    if (!igUserId) throw new Error("Could not resolve Instagram Business account ID");

    // Step 1: create media container
    const createParams = new URLSearchParams();
    createParams.set("image_url", image_url);
    createParams.set("caption", caption);
    createParams.set("access_token", accessToken);
    const createRes = await fetch(`${IG_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: createParams.toString(),
    });
    const created = await createRes.json();
    if (!createRes.ok) throw new Error(created.error?.message || "Instagram media creation failed");
    const creationId = created.id;

    // Wait for Instagram to finish processing the container before publishing.
    // The container is not publishable the instant it is created; publishing too
    // early returns "Media ID is not available". Poll status_code until FINISHED.
    let status = "IN_PROGRESS";
    const deadline = Date.now() + 30000;
    while (status === "IN_PROGRESS" && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 3000));
      const stRes = await fetch(`${IG_API}/${creationId}?fields=status_code&access_token=${encodeURIComponent(accessToken)}`);
      const st = await stRes.json();
      status = st.status_code || "IN_PROGRESS";
    }
    if (status === "ERROR") throw new Error("Instagram image processing failed (check aspect ratio 4:5–1.91:1 and that the image URL is public)");
    if (status !== "FINISHED") throw new Error("Instagram media processing timed out before ready");

    // Step 2: publish the container
    const publishParams = new URLSearchParams();
    publishParams.set("creation_id", creationId);
    publishParams.set("access_token", accessToken);
    const publishRes = await fetch(`${IG_API}/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: publishParams.toString(),
    });
    const published = await publishRes.json();
    if (!publishRes.ok) throw new Error(published.error?.message || "Instagram publish failed");

    return Response.json({ success: true, username: me.username, media_id: published.id, link });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}