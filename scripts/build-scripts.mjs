// Bundles and minifies the site scripts into src/assets/scripts, replacing the old Grunt uglify task.
import fs from 'node:fs';
import { minify } from 'terser';

const bundles = {
  'src/assets/scripts/main.min.js': ['src/scripts/jquery-1.9.1.min.js', 'src/scripts/rainbow.custom.min.js', 'src/scripts/main.js'],
  'src/assets/scripts/gallery.min.js': ['src/scripts/jquery.isotope.min.js', 'src/scripts/gallery.js'],
};

for (const [out, files] of Object.entries(bundles)) {
  const code = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n;\n');
  const result = await minify(code);
  fs.mkdirSync('src/assets/scripts', { recursive: true });
  fs.writeFileSync(out, result.code);
  console.log(`${out} (${result.code.length} bytes)`);
}
