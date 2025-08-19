# RERUM Informational Website

RERUM (reconditorium eximium rerum universalium mutabiliumque) is a static AngularJS 1.4.7 informational website for the RERUM digital humanities platform, hosted on GitHub Pages at https://rerum.io.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Run the Application
- Clone the repository: `git clone https://github.com/CenterForDigitalHumanities/rerum.git`
- No build process required - this is a pure static site
- No dependencies to install - all external libraries loaded via CDN
- Start local development server: `python3 -m http.server 8080` (starts instantly, < 1 second)
- Application accessible at `http://localhost:8080`
- NEVER CANCEL: Server starts immediately, no timeout needed

### Technology Stack
- Frontend: AngularJS 1.4.7, HTML5, CSS3, JavaScript
- External CDNs: AngularJS, Bootstrap, FontAwesome, jQuery
- Hosting: GitHub Pages with Jekyll configuration
- Repository size: 8.4MB (26 HTML files, 15 JS files, 6 CSS files)
- Application code size: 600KB in /app directory

### Build and Test Process
- No build step required - static files served directly
- No package.json, no npm scripts, no bundling
- No test framework present
- No linting configuration
- Application loads in ~7ms per page after server start
- Server performance: 10 consecutive requests complete in 64ms total

## Validation

### Manual Testing Scenarios
After making changes, ALWAYS validate by:
1. Start local server: `python3 -m http.server 8080`
2. Open browser to `http://localhost:8080`
3. Test navigation to all major sections:
   - Home (#welcome) - Contains "Free for All" section
   - The Annotation Story (#annotation) 
   - Research Computing Group (#about)
   - Use Rerum API (#api) - API documentation
   - The Future (#future)
4. Test key tools and pages:
   - Manifest tools: `/app/tools/editManifest.html`
   - Validation tools: `/app/tools/validate.html`
   - Tools overview: `/app/tools/tools.html`
5. Verify static content serves correctly via direct HTTP requests
6. Check that AngularJS routing works (hash-based navigation)

### Known Limitations
- External CDN dependencies may fail in restricted network environments
- AngularJS functionality requires JavaScript enabled
- Application relies on external services (fonts.googleapis.com, ajax.googleapis.com, etc.)
- No automated testing infrastructure present

### Deploy and Production
- Deployment: Automatic via GitHub Pages on push to main branch
- Live site: https://rerum.io (configured via CNAME file)
- Jekyll configuration in `_config.yml` with baseurl: /rerum

## Common Tasks

### Key File Locations
- Main entry point: `index.html`
- AngularJS app: `app/app.js`
- Application routes and controllers: `app/` subdirectories
- Tools and utilities: `app/tools/`
- Static assets: `app/lib/` for local libraries

### Repository Structure
```
.
├── index.html              # Main entry point
├── app/                    # AngularJS application
│   ├── app.js             # Main app configuration  
│   ├── tools/             # Manifest and annotation tools
│   ├── api/               # API documentation
│   ├── about/             # About page content
│   └── lib/               # Local JavaScript libraries
├── _config.yml            # Jekyll/GitHub Pages config
├── CNAME                  # Domain configuration (rerum.io)
├── CONTRIBUTING.md        # Contributor guidelines
└── readme.md              # Project documentation
```

### Making Changes
1. Edit HTML templates in appropriate `app/` subdirectories
2. Modify AngularJS controllers and services in respective `.js` files
3. Update routing in relevant module configuration files
4. Test locally with Python HTTP server
5. Commit and push - GitHub Pages deploys automatically

### Content Management
- Static content in HTML template files under `app/`
- Tools configuration in `app/tools/tools.js`
- Application data and mock objects in `app/app.js`
- Styling in `app/app.css` and component-specific CSS files

## Application Architecture

### Core Components
- **Manifest Tools**: Create, edit, and validate IIIF manifests
- **Annotation Tools**: Web annotation creation and management
- **API Documentation**: RERUM API reference and examples
- **Community Tools**: Integration with external IIIF and annotation tools

### Key AngularJS Modules
- Main app module: `rerum` (defined in app/app.js)
- Routing: AngularJS ngRoute with hash-based navigation
- Controllers: Distributed across feature directories
- Services: Validation, API integration, utility functions

### External Dependencies (CDN)
- AngularJS 1.4.7 and modules (ngRoute, ngAnimate, ngSanitize)
- UI Bootstrap 0.14.3
- FontAwesome 4.5.0
- jQuery 3.2.1
- Skeleton CSS framework