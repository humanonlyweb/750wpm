// Note: Claude (🤖) wrote this parseEpub function, since I didn't want to install a package just for this
// Yup, only this file.
import { unzipSync } from "fflate";

interface EpubResult {
  title: string;
  content: string;
}

export async function parseEpub(file: File): Promise<EpubResult> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const files = unzipSync(uint8Array);
  const containerXml = findFile(files, "META-INF/container.xml");

  if (!containerXml) {
    throw new Error("Invalid epub: missing container.xml");
  }

  const containerText = new TextDecoder().decode(containerXml);
  const rootfilePath = extractRootfilePath(containerText);

  if (!rootfilePath) {
    throw new Error("Invalid epub: cannot find rootfile path");
  }

  const baseDir = rootfilePath.includes("/")
    ? rootfilePath.substring(0, rootfilePath.lastIndexOf("/") + 1)
    : "";
  const contentOpf = findFile(files, rootfilePath);

  if (!contentOpf) {
    throw new Error("Invalid epub: missing content.opf");
  }

  const opfText = new TextDecoder().decode(contentOpf);
  const { title, spineItems } = parseOpf(opfText);

  // Extract text from each spine item (chapter)
  const chapters: string[] = [];

  for (const itemHref of spineItems) {
    const itemPath = baseDir + itemHref;
    const itemContent = findFile(files, itemPath);
    if (itemContent) {
      const html = new TextDecoder().decode(itemContent);
      const text = extractTextFromHtml(html);
      if (text.trim()) {
        chapters.push(text.trim());
      }
    }
  }

  const content = chapters.join("\n\n");

  return {
    title: title || file.name.replace(/\.epub$/i, ""),
    content,
  };
}

function findFile(files: Record<string, Uint8Array>, path: string): Uint8Array | undefined {
  if (files[path]) return files[path];

  const lowerPath = path.toLowerCase();

  for (const [key, value] of Object.entries(files)) {
    if (key.toLowerCase() === lowerPath) {
      return value;
    }
  }

  return undefined;
}

function extractRootfilePath(containerXml: string): string | null {
  const match = containerXml.match(/rootfile[^>]+full-path=["']([^"']+)["']/i);

  return match?.[1] ?? null;
}

function parseOpf(opfXml: string): { title: string; spineItems: string[] } {
  // Extract title from <dc:title> or <title>
  const titleMatch =
    opfXml.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i) ||
    opfXml.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch?.[1]?.trim() ?? "";

  const manifest: Record<string, string> = {};
  const manifestRegex = /<item\s+[^>]*id=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi;

  let match: RegExpExecArray | null;

  while ((match = manifestRegex.exec(opfXml)) !== null) {
    const id = match[1];
    const href = match[2];
    if (id && href) manifest[id] = href;
  }

  const manifestRegex2 = /<item\s+[^>]*href=["']([^"']+)["'][^>]*id=["']([^"']+)["'][^>]*\/?>/gi;

  while ((match = manifestRegex2.exec(opfXml)) !== null) {
    const href = match[1];
    const id = match[2];
    if (id && href) manifest[id] = href;
  }

  const spineItems: string[] = [];
  const spineRegex = /<itemref\s+[^>]*idref=["']([^"']+)["'][^>]*\/?>/gi;

  while ((match = spineRegex.exec(opfXml)) !== null) {
    const idref = match[1];
    if (!idref) continue;
    const href = manifest[idref];
    if (href && isContentFile(href)) {
      spineItems.push(href);
    }
  }

  return { title, spineItems };
}

function isContentFile(href: string): boolean {
  const lower = href.toLowerCase();
  return (
    lower.endsWith(".html") ||
    lower.endsWith(".xhtml") ||
    lower.endsWith(".htm") ||
    lower.endsWith(".xml")
  );
}

function extractTextFromHtml(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<\/?(p|div|br|h[1-6]|li|tr|blockquote)[^>]*>/gi, "\n");
  text = text.replace(/<[^>]+>/g, " ");

  text = decodeHtmlEntities(text);

  text = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n");

  return text;
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&mdash;": "\u2014",
    "&ndash;": "\u2013",
    "&hellip;": "\u2026",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&copy;": "\u00A9",
    "&reg;": "\u00AE",
    "&trade;": "\u2122",
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replaceAll(entity, char);
  }

  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCharCode(Number.parseInt(code, 16)),
  );

  return result;
}
