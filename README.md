# Faith J Construction pages

Edit pages in `src/`. The shared menu is in `partials/navbar.html`; the shared footer and inquiry form are in `partials/footer.html`.

From this folder, run `npm run build` to generate the website's root HTML files. No package installation is needed. Upload or publish the generated root HTML files together with the `images/` folder.

Add `<!--navbar-->` and `<!--footer-->` once in any new page template. The build fills those markers and sets the inquiry form's `source-page` value from the page name. Edit the partials to change the menu or footer across every page.

To view the site while editing, run `npm run preview` and open http://127.0.0.1:4173/. The preview rebuilds when files in `src/` or `partials/` change; refresh the browser to see edits. Open the generated root pages, not the template files in `src/`.

Opening an HTML file in `src/` now forwards to its generated page in the site root. Keep `npm run preview` running while you edit so changes in `src/` and `partials/` rebuild automatically.
