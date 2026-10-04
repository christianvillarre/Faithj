const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const srcDir = path.join(root, 'src');
const partialsDir = path.join(root, 'partials');

const navbar = fs.readFileSync(path.join(partialsDir, 'navbar.html'), 'utf8').trimEnd();
const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8').trimEnd();

const pageNames = {
  'index.html': 'Home',
  'exterior-painting.html': 'Exterior Painting',
  'exterior.html': 'Exterior Renovations',
  'interior-renovation.html': 'Interior Renovations',
  'facility-remodels.html': 'Facility Remodels',
  'project-management.html': 'Project Management',
  'due-diligence.html': 'Due Diligence',
  'gallery.html': 'Gallery',
  'projects.html': 'Projects',
  'services.html': 'Services',
  'about.html': 'About',
  'contact.html': 'Contact',
};

function expand(partial, values, name) {
  return partial.replace(/{{([A-Z_]+)}}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unknown ${key} token in ${name}`);
    return values[key];
  });
}

const files = fs.readdirSync(srcDir).filter((file) => file.endsWith('.html')).sort();
if (files.length === 0) throw new Error('No HTML pages found in src/');

for (const file of files) {
  const template = fs.readFileSync(path.join(srcDir, file), 'utf8')
    .replace(/<script data-source-preview>[\s\S]*?<\/script>\r?\n?/, '');
  for (const marker of ['<!--navbar-->', '<!--footer-->']) {
    if (template.split(marker).length !== 2) {
      throw new Error(`${file} must contain exactly one ${marker} marker`);
    }
  }

  const values = {
    ABOUT_HREF: '/about.html',
    SERVICES_HREF: '/services.html',
    CONTACT_HREF: '/contact.html',
    SOURCE_PAGE: pageNames[file] || path.basename(file, '.html').replace(/[-_]/g, ' '),
  };

  let renderedFooter = expand(footer, values, 'footer.html');
  if (file === 'contact.html') {
    renderedFooter = renderedFooter
      .replace(/<div class="footer-tab">[\s\S]*?<\/div>/, '')
      .replace(/<form class="contact-form footer-form"[\s\S]*?<\/form>/, '')
      .replace('class="site-footer"', 'class="site-footer site-footer--compact"');
  }

  const result = template
    .replace('<!--navbar-->', expand(navbar, values, 'navbar.html'))
    .replace('<!--footer-->', renderedFooter);

  if (/{{[A-Z_]+}}/.test(result)) throw new Error(`Unexpanded token in ${file}`);
  fs.writeFileSync(path.join(root, file), result, 'utf8');
  process.stdout.write(`Built ${file}\n`);
}
