# hbcarlos.github.io

This repository contains the source code for my personal website, where I publish articles about my projects. The site serves as both a personal portfolio and a technical blog.

## Overview

The website is built using [Jekyll](https://jekyllrb.com/), a static site generator that transforms Markdown files and Liquid templates into a fully functional, server-free website. I chose Jekyll deliberately to keep my focus on content rather than web infrastructure. One of the key advantages of writing content in Markdown is the ability to compose articles in external tools — such as Notion — and export them directly without conversion friction. The site is hosted on [GitHub Pages](https://pages.github.com/), and the deployment pipeline is fully automated via GitHub Actions, meaning that every push to the `main` branch triggers a build-and-deploy cycle with no manual intervention required.

## Theme and Styling

The website uses the [Minima](https://github.com/jekyll/minima/tree/2.5-stable) theme (version 2.5-stable), configured with `skin: auto`. This setting makes the site automatically adapt its color scheme to the visitor's operating system preference — light mode or dark mode — without any additional JavaScript. The only styling customization lives in `assets/main.scss`, a Sass entry point that imports Minima's base styles, keeping the design clean and the maintenance burden minimal.

## Site Structure

The website has two main sections exposed to visitors. The home page (`pages/home.md`) serves as a brief introduction and landing page. The blog section (`pages/blog.md`) lists all published posts in reverse chronological order, with each entry showing the post title, publication date, and either a custom description or an automatically generated excerpt. Blog posts live in the `_posts/` directory and follow Jekyll's standard naming convention (`YYYY-MM-DD-title.md`). The navigation header only exposes the Blog page, as configured in `_config.yml` via the `header_pages` setting, keeping the interface uncluttered.

## Google Analytics Integration

The site integrates Google Analytics 4 (GA4) through a reusable include file at `_includes/analytics.html`. This file contains the standard Google Tag Manager snippet and is parameterized using the `google_analytics` property defined in `_config.yml`. The include is injected into the `<head>` section of every page through `_includes/head.html`, which means all page views across the entire site are tracked automatically. This provides standard web metrics such as page views, session duration, traffic sources, and geographic distribution of visitors.

## Link Tracking System

Beyond standard page-view analytics, the site includes a purpose-built link tracking system designed to simulate email marketing metrics — specifically click-through rate (CTR) — for a PDF document. The underlying problem this system solves is a well-known limitation of the PDF format: unlike web pages or email campaigns, there is no native, cross-platform, unobtrusive mechanism for tracking activity inside a PDF. PDF viewers may block external requests, and tracking pixels are unreliable across different applications and operating systems. Opening rates are therefore practically impossible to measure without invasive techniques that most PDF readers would either block or expose to the reader.

My approach sidesteps the open-rate problem entirely and focuses on what is measurable: whether the recipient clicked on a link. Rather than pointing PDF links directly to their final destinations — such as a GitHub repository or a video recording — all links are routed through intermediate tracker pages hosted on my site. When a visitor follows one of these links in the PDF, their browser loads one of the tracker pages, which fires a Google Analytics event and then redirects them to the actual destination. Because the redirect happens in a web browser, Google Analytics captures the visit reliably, exactly as it would for any other page on the site.

To distinguish traffic from any source of visitors, all links embedded in the PDF include UTM parameters: `?utm_source=VAR_CLIENTE&utm_medium=pdf&utm_campaign=cv`. The `utm_campaign=cv` value marks the traffic as belonging to the CV campaign. The `utm_medium=pdf` value identifies the distribution channel. The `utm_source` value is personalized per recipient and carries the name of the company or individual the PDF was sent to — for example, `utm_source=fake_corp`. This makes it possible to filter the Google Analytics dashboard not only to see how many clicks the PDF received overall, but also to attribute those clicks to specific recipients, effectively replicating the per-recipient tracking that email marketing platforms provide out of the box.

## Tracker Pages and the `tracker` Layout

The tracker pages live in `pages/analytics/` and each one corresponds to a specific resource. They are rendered using a custom Jekyll layout defined in `_layouts/tracker.html`. This layout is intentionally excluded from search engine indexing: it sets `<meta name="robots" content="noindex, nofollow">` in the HTML head, and the corresponding pages are also excluded from the sitemap via a rule in `_config.yml`. This prevents these intermediate routing pages from polluting search results or appearing in the site's public structure.

When a visitor lands on a tracker page, the layout displays a brief spinning animation alongside a "Redirecting to [resource]..." message and a fallback manual link in case the automatic redirect does not fire. The `analytics.html` include is embedded in the layout's `<head>`, so Google Analytics registers the page visit before any JavaScript redirect takes place. The redirect is intentionally delayed by one second — a deliberate wait to give the analytics library enough time to transmit the event to Google's servers before the browser navigates away to the final destination.

One tracker page works differently: `/a/project`. Rather than redirecting to a fixed URL, it constructs the destination dynamically at runtime using the `utm_content` query parameter. When the browser loads this page, a small JavaScript snippet reads the `utm_content` value from the URL and appends it to `https://github.com/`, forming the full path to a specific repository. For example, a CV link like `/a/project?utm_source=acme_corp&utm_medium=pdf&utm_campaign=cv&utm_content=org/my-project` would redirect the visitor to `https://github.com/org/my-project`. If the `utm_content` parameter is absent, the user is redirected to the home page instead. This design means that a single tracker page can cover any number of different GitHub repositories, with each link in the CV simply passing the relevant repository path as the content parameter.

## The PDF Generation Script

Maintaining more than fifteen links in a PDF — each containing a personalized `utm_source` parameter — is impractical to update by hand. Changing the recipient name before sending a CV to a new company would require opening a PDF editor, locating every hyperlink embedded in the document, and modifying its URL one by one. This is tedious, error-prone, and does not scale. The script at `scripts/generar_cv.py` automates this process entirely.

The script uses the `pikepdf` library, a Python binding to the QPDF PDF manipulation engine, to programmatically edit the PDF template. When run, it opens `data/template.pdf`, iterates through all pages, and inspects each page's annotation objects — the PDF internal structure that represents hyperlinks. For every annotation whose URI contains the placeholder string `VAR_CLIENTE`, the script replaces that placeholder with the recipient name provided as input. For example, if the template contains a link to `https://hbcarlos.com/a/linkedin?utm_source=VAR_CLIENTE&utm_medium=pdf&utm_campaign=cv` and the script is invoked with `fake_corp`, the link in the output file becomes `https://hbcarlos.com/a/linkedin?utm_source=fake_corp&utm_medium=pdf&utm_campaign=cv`. The modified PDF is saved as a new file — `data/Fake_corp.pdf` — leaving the original template completely unchanged and ready for the next use.

The script can be invoked in two ways: by passing the company name directly as a command-line argument (`python generar_cv.py fake_corp`) for quick automated use, or without arguments, in which case it enters an interactive prompt asking for the name. After processing, it prints a confirmation showing how many links were updated and lists each original URL that was modified, making it straightforward to verify that all expected links were found and replaced correctly.

## Environment and Dependencies

The project uses [pixi](https://pixi.sh/) to manage the development environment through a conda-based approach. The `pixi.toml` file declares all dependencies: Ruby (≥ 3.4.8) for running Jekyll, `compilers` and `make` for building native Ruby gems from source, and `pikepdf` (≥ 10.0.2) for the CV generation script. The local environment is created inside `.pixi/envs/default/` and is entirely self-contained. Jekyll and its Ruby gem dependencies are managed separately through Bundler, declared in the `Gemfile` and pinned in `Gemfile.lock`.

To set up and run the project locally, install pixi and initialize the environment with `pixi install`, then install Jekyll and its gems with `bundle install`. To preview the site, run `bundle exec jekyll serve`, which starts a local web server with live reload at `http://localhost:4000`.

## Deployment

Deployment is fully automated via the GitHub Actions workflow defined in `.github/workflows/jekyll.yml`. Every push to the `main` branch triggers the workflow, which checks out the repository, sets up Ruby 3.1 with Bundler caching enabled, builds the Jekyll site in production mode with `bundle exec jekyll build`, and deploys the resulting `_site/` directory to GitHub Pages using GitHub's official deployment actions. The workflow also supports manual triggering from the Actions tab via `workflow_dispatch`.

Comandos:
* Instalar Jekyll `gem install jekyll bundler`
* Crear un nuevo sitio `jekyll new --skip-bundle .`
* Construir el sitio `bundle install`
* Servidor local `bundle exec jekyll serve`