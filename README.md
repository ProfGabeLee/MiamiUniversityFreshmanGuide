# Miami University Freshman Field Guide

A polished **10-page, responsive, static website** made with HTML, custom CSS, vanilla JavaScript, and **Materialize CSS v1.0.0**. Designed as a teaching and learning example for students building a multi-page website.

> **Educational example.** This project is not affiliated with, endorsed by, or an official website of Miami University. The information is introductory and may change. Refer to Miami University's official website for current requirements, deadlines, dining hours, and university policy.

## Start here

1. Download and extract the project ZIP. **Keep the entire folder together.**
2. Open `index.html` in Chrome (or use the **Live Server** extension in VS Code / Phoenix Code).
3. Click the links in the navigation menu to move among the ten pages.
4. Edit the HTML, `css/styles.css`, or `js/main.js`, then refresh the browser.

**Internet is required** for the Materialize CSS/JavaScript files, Google Fonts, Material Icons, and the optional official Miami University photo on the homepage. The original illustrated campus artwork is bundled locally in `assets/miami-quad.svg`.

## Files

```text
miami-freshman-guide/
  index.html           Home / welcome page
  checklist.html       Interactive first-year checklist
  orientation.html     Orientation & welcome
  housing.html         Residence life and roommate icebreaker
  dining.html          Dining filter and live search
  academics.html       Course registration & study advice
  campus.html          Searchable campus directory
  activities.html      Clubs / interest recommender
  support.html         Student wellness and support
  faq.html             Accordion FAQ and demo form validation
  css/
    styles.css         Shared visual styles and responsive layout
  js/
    main.js            Materialize initialization and interactive functions
  assets/
    miami-quad.svg     Original red-brick campus illustration
    favicon.svg        Original M shield favicon
  README.md            These instructions
```

## Materialize CSS components used

- Container and grid-related responsive layout patterns
- Navigation bar, mobile Sidenav, and Dropdown menus
- Buttons with waves effects, Progress bar, Checkboxes
- Collapsible accordions, Tabs, Select, and Tooltips initialization
- Material Icons and form fields

**Framework setup in every HTML page:**

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<link rel="stylesheet" href="css/styles.css">

<!-- Put scripts just before the closing body tag. Order matters! -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
<script src="js/main.js"></script>
```

Materialize documentation: https://materializecss.com/getting-started.html

## Interactive JavaScript functions

| Page | JavaScript function | Main concepts |
|---|---|---|
| Checklist | `initializeChecklist()` | Arrays, checkbox events, `.filter()`, `localStorage`, percentages, DOM updates |
| Dining | `initializeDiningFilter()` | Conditional logic, `.forEach()`, user input, combined search/filter |
| Campus | `initializeCampusSearch()` | String matching, DOM queries, showing/hiding cards |
| Housing | `initializeRoommatePrompt()` | Arrays, `Math.random()`, click events |
| Activities | `initializeClubFinder()` | Objects, conditionals, select change events |
| FAQ | `initializeFAQForm()` | Input validation, regular expressions, `preventDefault()` |

### Important implementation notes

- The checkbox state is saved **locally in the same browser/device**, not to any university service.
- The campus directory and dining cards are **sample content**, not live data, directions, availability, schedules, or food-safety advice.
- The FAQ page's practice form **validates locally and does not send or store a message**.
- No backend server, API key, database, or build tool is needed.
- Some browsers limit `localStorage` when opening an HTML file directly. If that happens, use a local HTTP server (e.g., Live Server) instead.

## Suggested hands-on student extensions

1. Add another checklist item and verify the progress indicator updates automatically.
2. Add a dining location with a valid `data-dining-category` and test filter/search.
3. Add two campus buildings and use the `data-keywords` attribute to improve searches.
4. Add a new FAQ question and its answer using the Materialize `collapsible` classes.
5. Create a new page with the shared navigation and footer, then link it from the menu.
6. Make the form check an additional field or display a specific inline error.
7. Adjust spacing/colors in `css/styles.css` and test at phone width.

## Source references / attribution

Content has been written in original words for teaching use, informed by official Miami University resources:

- New Student Guidebook: https://miamioh.edu/life-at-miami/new-students-orientation/orientation/guidebook/
- New Student Checklist: https://miamioh.edu/life-at-miami/new-students-orientation/transition/new-student-checklist/
- First-Year Orientation: https://miamioh.edu/life-at-miami/new-students-orientation/orientation/first-year-orientation/
- Residence Halls: https://miamioh.edu/life-at-miami/living-on-campus/housing/residence-halls/
- Places to Eat: https://miamioh.edu/life-at-miami/living-on-campus/dining/places-to-eat/
- Campus Maps, Parking, and Transit: https://miamioh.edu/visit-miami/oxford-campus/maps-parking-and-transit.html
- Clubs and Organizations: https://miamioh.edu/life-at-miami/student-involvement/clubs-organizations.html
- Student Support: the official Miami University sites linked from `support.html`.

The homepage optionally displays a **remotely hosted Miami University campus photo**, with credit. No third-party photograph is redistributed in this project ZIP. For publication beyond a classroom demonstration, review the image owner's usage terms or replace it with an image you have rights to use. Original SVG artwork and the custom code are included in the project.
