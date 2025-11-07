# arquivo: tools/build.cjs
- cp.sync('blog/dist', 'pages_out/blog', { overwrite: true });
+ import fs from 'fs';
+ import path from 'path';
+ const from = 'blog/dist';
+ const to = 'pages_out/blog';
+ fs.mkdirSync(to, { recursive: true });
+ for (const entry of fs.readdirSync(from)) {
+   fs.cpSync(path.join(from, entry), path.join(to, entry), { recursive: true });
+ }

# arquivo: tools/build.js
- fs.cpSync('blog/dist', 'pages_out/blog', { recursive: true });
+ import path from 'path';
+ const from = 'blog/dist';
+ const to = 'pages_out/blog';
+ fs.mkdirSync(to, { recursive: true });
+ for (const entry of fs.readdirSync(from)) {
+   fs.cpSync(path.join(from, entry), path.join(to, entry), { recursive: true });
+ }
