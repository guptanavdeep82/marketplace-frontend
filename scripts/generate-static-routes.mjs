import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html not found. Run the Vite build first.");
}

const routes = [
  "about",
  "contact",
  "blog",
  "blog-details",
  "product-details",
  "products",
  "cart",
  "checkout",
  "login",
  "register",
  "profile",
  "terms-conditions",
  "privacy-policy",
  "refund-policy",
  "vendor-shop",
];

const html = fs.readFileSync(indexPath, "utf8");

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, "index.html"), html);
}

console.log(`Generated static fallback pages for ${routes.length} routes.`);
