# Md. Rohanur Rahman Portfolio

Classic responsive portfolio with a Three.js hero scene, built as a static GitHub Pages site.

## Files

- `index.html` - site structure
- `styles.css` - responsive visual design
- `scripts/main.js` - navigation and reveal interactions
- `scripts/scene.js` - Three.js hero scene
- `vendor/three.module.js` - pinned local Three.js module for reliable GitHub Pages hosting
- `assets/profile.jpeg` - profile image
- `assets/documents/` - downloadable CV and certificate PDFs for reviewers
- `.nojekyll` - keeps GitHub Pages from processing the site with Jekyll

## Run Locally

From this folder:

```powershell
py -3.14 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Deploy To GitHub Pages

1. Create a new GitHub repository, for example `Rohanur-Portfolio`.
2. Upload all files from this folder to the repository root.
3. Go to repository `Settings` -> `Pages`.
4. Set `Source` to `Deploy from a branch`.
5. Select the `main` branch and `/root`.
6. Save. GitHub will publish the site after the first deployment finishes.

For a personal root site, name the repository:

```text
MdRohanurRahman.github.io
```

The public URL will be:

```text
https://MdRohanurRahman.github.io
```

## Privacy Note

The site intentionally avoids publishing the full home address, phone number, and certificate scans from the source documents. Add those only if you explicitly want them public.
