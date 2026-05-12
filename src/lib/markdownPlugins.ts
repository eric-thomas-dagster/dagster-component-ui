import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/** GFM tables/task lists/etc. plus GitHub-compatible `id` on headings (TOC fragment links). */
export const docMarkdownRemarkPlugins = [remarkGfm];
export const docMarkdownRehypePlugins = [rehypeSlug];
