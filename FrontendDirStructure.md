#Frontend Structure

## `/react`
This directory contains all the React components. Each page that runs on React is defined in this directory, as well as some shared utilities (constants, reusable components, etc…).
- `main.js`
  - Each React container must be defined in the main.js to work properly. Only the main (topmost) component needs to be defined in this file. Usually it is specified as a container to differentiate it from the other components.
  - In addition, as seen in main.js, most components will need dataset attributes defined in the pages corresponding HTML file (defined as data-*** ) .
  - This file identifies what part of the React code to render depending on the ID of the single <div> in the HTML page. It then passes this to the ReactDom render function and anchors it to this <div>

## `/server`
This directory contains all the Node.js code necessary to run the webserver as well as the HTML pages. It is the core of the system. Aside from /views, this directory usually does not need to be modified.
#### `/routes`
This directory defines the routes (/asa, /create-course, /about, etc…) for the website. This directory is handled by a gulp script that can be called through gulp create-route.
##### `/route-configs`
This directory contains the configuration files for each of the routes defined. These include viewing permissions, whether they should appear in the sidebar, and what their icon should be.
##### `/route-handlers`
This directory contains the handler files, which contain the JavaScript logic for pages that do not use React. If a page uses React, the React script must be declared in the render’s scripts array, as well as any other attributes the pages need. (These are specified by the HTML data-*** attributes and should match up. If an HTML page has a data attribute, this is where the data will be obtained from)
#### `/server-middleware`
This directory contains core utilities that the server needs to run.
- `api.js`
This file sets up the apiMethods object that provides methods to easily make API calls in pages that do not rely on React. (Note that if a page uses React, these methods cannot be used. Instead, the ‘request’ module is used to make the calls.)
- `language-service.js`
This file sets up the translation functions that allow page translation in the non-React pages (Supporting React pages still needs work). It handles getting translations stored in the Redis server as well as adding translations to the server. These functions are not called directly and are instead passed to the templates.js file or used in API calls.
- `session.js`
This file handles fetching and storing session cookies in the Redis server.
- `templates.js`
This file defines helper functions for the Handlebar pages. These functions include sidebar highlighting, date formatting, string translation, and hiding HTML sections based on a Boolean. (Note that in the Handlebar pages, these functions are called as {{<function_name> <arg>}} )
- `translation.js`
This file calls a helper function for translation. It relies on language-service.js and checks whether a string has a translation. If not, the English equivalent is returned.
#### `/utils`
- `constants.js`
This file contains constants that are used throughout the system. If they need to be modified, this is the file to change.
#### `/views`
This directory contains the HTML files for all webpages in the system. If a page uses the Handlebars template engine, the full code is found in these files. If a page uses React, a simple HTML file containing a single <div> is found to give the React script an element to render in. This directory is expected to be changed frequently.
#### `server.js`
This file sets up the server by setting up Express.js, creating API calls for the translation, assigning access permissions, setting up the Handlebar templates, setting up the sidebar, etc..

## `/static`
This folder contains all the static web files that are hosted. They are publicly accessible and include media files, small JS scripts, etc...

## `/styles`
This directory contains all of the SCSS stylesheets for the pages. Note that all SCSS files that are imported must begin with an underscore. This is required.

#### `/components`
This directory contains the styles that are used in multiple pages, including styles on `<input>, <textarea>, <button>,` and common classes like .section, .title, etc

#### `/external`
This directory contains the styles of components that are imported.
#### `/pages`
This directory contains the styles of parts of webpages that are specific to the format of a single page, so they are not included in the /components directory. The files are organized by the page name, although this is not required.
#### `/vendor`
This directory contains the styles of external components that require multiple files to work .This is separated from /external for neat organization rather than function
#### `_meyer_reset.scss`
This file contains a reset stylesheet to reduce browser inconsistencies.
#### `_variables.scss`
This file contains variables that are used in the SCSS files to avoid redundant code and make changes easier.
#### `main.js`
This file is the main SCSS file. All other SCSS files must be imported in this file for the styles to be included in the pages. (Note that when importing the files, their file name loses the underscore. This is an SCSS specification.)
