import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const BASE_URL = "https://thefitnessgalaxy.com";

function escapeXml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/\x26/g, "\x26amp;")
    .replace(/\x3c/g, "\x26lt;")
    .replace(/\x3e/g, "\x26gt;")
    .replace(/\x22/g, "\x26quot;")
    .replace(/\x27/g, "\x26apos;");
}

function url(loc, lastmod, changefreq = "weekly", priority = "0.7") {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : "",
    `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
    `    <priority>${escapeXml(priority)}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n");
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const [posts, products] = await Promise.all([
      base44.asServiceRole.entities.BlogPost.list("-created_date", 500),
      base44.asServiceRole.entities.Product.list("-created_date", 500),
    ]);

    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/shop", priority: "0.9", changefreq: "daily" },
      { path: "/blog", priority: "0.9", changefreq: "daily" },
      { path: "/forum", priority: "0.6", changefreq: "daily" },
      { path: "/about", priority: "0.5", changefreq: "monthly" },
      { path: "/contact", priority: "0.5", changefreq: "monthly" },
    ];

    const urls = [];
    staticPages.forEach((p) =>
      urls.push(url(`${BASE_URL}${p.path}`, null, p.changefreq, p.priority))
    );
    (posts || []).forEach((post) => {
      if (post.published === false) return;
      urls.push(
        url(
          `${BASE_URL}/blog/${post.slug}`,
          post.updated_date || post.created_date,
          "weekly",
          "0.7"
        )
      );
    });
    (products || []).forEach((product) => {
      urls.push(
        url(
          `${BASE_URL}/products/${product.id}`,
          product.updated_date || product.created_date,
          "weekly",
          "0.7"
        )
      );
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}