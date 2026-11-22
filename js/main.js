/* ============================================================
   Miami Freshman Field Guide | Hands-on JavaScript demonstrations
   No framework needed beyond Materialize CSS component library.
   Each feature checks for its own page elements before running.
   ============================================================ */
'use strict';

// Initialize Materialize's interactive components once the HTML has loaded.
document.addEventListener('DOMContentLoaded', function () {
  if (window.M) {
    M.Sidenav.init(document.querySelectorAll('.sidenav'), { edge: 'right' });
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
      coverTrigger: false,
      constrainWidth: false,
      alignment: 'left'
    });
    M.Collapsible.init(document.querySelectorAll('.collapsible'), { accordion: true });
    M.Tabs.init(document.querySelectorAll('.tabs'));
    M.Modal.init(document.querySelectorAll('.modal'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.FormSelect.init(document.querySelectorAll('select'));
  }

  initializeCampusSlider();
  initializeChecklist();
  initializeDiningFilter();
  initializeCampusSearch();
  initializeRoommatePrompt();
  initializeClubFinder();
  initializeFAQForm();
  initializeHotelEstimator();
});

function showToast(message) {
  if (window.M && typeof M.toast === 'function') {
    M.toast({ html: message, classes: 'rounded', displayLength: 2400 });
  }
}

/* 0. HOMEPAGE: Responsive Materialize campus photo slideshow */
function initializeCampusSlider() {
  const sliderEl = document.getElementById('homeCampusSlider');
  if (!sliderEl || !window.M) return;

  function getSliderHeight() {
    if (window.innerWidth <= 480) return 320;
    if (window.innerWidth <= 720) return 380;
    return 520;
  }

  const sliderInstance = M.Slider.init(sliderEl, {
    indicators: true,
    height: getSliderHeight(),
    duration: 500,
    interval: 5500
  });

  if (!sliderInstance) return;

  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      sliderInstance.prev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      sliderInstance.next();
    });
  }

  // Pause auto-advance while the user hovers over the slideshow.
  const shell = sliderEl.closest('.campus-slider-shell');
  if (shell) {
    shell.addEventListener('mouseenter', function () { sliderInstance.pause(); });
    shell.addEventListener('mouseleave', function () { sliderInstance.start(); });
  }

  // Keep slider height responsive on viewport resize.
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const targetHeight = getSliderHeight();
      const slidesList = sliderEl.querySelector('.slides');
      sliderEl.style.height = (targetHeight + 40) + 'px';
      if (slidesList) slidesList.style.height = targetHeight + 'px';
    }, 150);
  });
}

/* 1. CHECKLIST: conditionals, arrays, localStorage, DOM updates */
function initializeChecklist() {
  const checklist = document.querySelector('[data-checklist]');
  if (!checklist) return; // Do nothing if this isn't checklist.html.

  const boxes = Array.from(checklist.querySelectorAll('input[type="checkbox"]'));
  const number = document.getElementById('completedNumber');
  const percent = document.getElementById('completedPercent');
  const progress = document.getElementById('checklistProgress');
  const donut = document.getElementById('progressDonut');
  const announcement = document.getElementById('checklistAnnouncement');
  const storageKey = 'miami-freshman-guide-checklist-v1';

  function readSaved() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch (error) { return {}; }
  }
  function saveCurrent() {
    const state = {};
    boxes.forEach(function (box) { state[box.id] = box.checked; });
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch (error) { /* The checklist still works during this visit. */ }
  }
  function updateProgress() {
    const complete = boxes.filter(function (box) { return box.checked; }).length;
    const value = Math.round((complete / boxes.length) * 100);
    number.textContent = complete + ' of ' + boxes.length + ' completed';
    percent.textContent = value + '%';
    progress.style.width = value + '%';
    donut.style.setProperty('--progress', value + '%');
    donut.setAttribute('aria-valuenow', String(value));
    announcement.textContent = value === 100
      ? 'You completed every practice checklist item. Great job!'
      : 'You have completed ' + complete + ' of ' + boxes.length + ' items.';
  }

  const saved = readSaved();
  boxes.forEach(function (box) {
    if (Object.prototype.hasOwnProperty.call(saved, box.id)) {
      box.checked = Boolean(saved[box.id]);
    }
    box.addEventListener('change', function () {
      saveCurrent();
      updateProgress();
    });
  });

  const resetBtn = document.getElementById('resetChecklist');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      boxes.forEach(function (box) { box.checked = false; });
      saveCurrent();
      updateProgress();
      showToast('Checklist reset');
    });
  }
  updateProgress();
}

/* 2. DINING: filter cards by category AND typed search */
function initializeDiningFilter() {
  const root = document.querySelector('[data-dining-root]');
  if (!root) return;

  const filterButtons = Array.from(root.querySelectorAll('[data-filter]'));
  const cards = Array.from(root.querySelectorAll('[data-dining-category]'));
  const searchInput = document.getElementById('diningSearch');
  const count = document.getElementById('diningResultCount');
  const empty = document.getElementById('diningNoResults');
  let selectedCategory = 'all';

  function filterDining() {
    const term = searchInput.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(function (card) {
      const categoryMatches = selectedCategory === 'all' || card.dataset.diningCategory === selectedCategory;
      const wordsMatch = (card.textContent + ' ' + (card.dataset.keywords || '')).toLowerCase().includes(term);
      card.hidden = !(categoryMatches && wordsMatch);
      if (!card.hidden) visible += 1;
    });
    count.textContent = 'Showing ' + visible + ' of ' + cards.length + ' places';
    empty.hidden = visible !== 0;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedCategory = button.dataset.filter;
      filterButtons.forEach(function (item) {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      filterDining();
    });
  });
  searchInput.addEventListener('input', filterDining);
  filterDining();
}

/* 3. CAMPUS: instant directory search using DOM elements */
function initializeCampusSearch() {
  const input = document.getElementById('campusSearch');
  if (!input) return;
  const cards = Array.from(document.querySelectorAll('[data-campus-place]'));
  const count = document.getElementById('campusResultCount');
  const empty = document.getElementById('campusNoResults');

  function searchCampus() {
    const term = input.value.trim().toLowerCase();
    let matches = 0;
    cards.forEach(function (card) {
      const text = (card.textContent + ' ' + (card.dataset.keywords || '')).toLowerCase();
      card.hidden = !text.includes(term);
      if (!card.hidden) matches += 1;
    });
    count.textContent = matches + ' of ' + cards.length + ' places displayed';
    empty.hidden = matches !== 0;
  }
  input.addEventListener('input', searchCampus);
  searchCampus();
}

/* 4. HOUSING: random roommate icebreaker prompt */
function initializeRoommatePrompt() {
  const button = document.getElementById('roommatePromptButton');
  if (!button) return;
  const output = document.getElementById('roommatePromptOutput');
  const questions = [
    'What helps you focus when you are studying?',
    'What time do you usually like to go to sleep?',
    'How should we handle guests and quiet hours?',
    'What is one thing that makes a room feel like home?',
    'Would you rather plan cleaning together or split up chores?'
  ];

  let lastIndex = -1;
  button.addEventListener('click', function () {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * questions.length);
    } while (nextIndex === lastIndex && questions.length > 1);
    lastIndex = nextIndex;
    if (output) output.textContent = questions[nextIndex];
  });
}

/* 5. PLACEHOLDERS: Add your page-specific logic here if needed */
function initializeClubFinder() {
  // Runs on activities.html
}

function initializeFAQForm() {
  // Runs on faq.html
}

/* 7. OXFORD: interactive hotel stay cost estimator */
function initializeHotelEstimator() {
  const form = document.getElementById('hotelCostForm');
  if (!form) return; // Do nothing if this isn't oxford.html.

  const hotelSelect = document.getElementById('hotelSelect');
  const nightsInput = document.getElementById('hotelNights');
  const output = document.getElementById('hotelEstimateOutput');
  const TAX_RATE = 0.155; // 15.5% estimated taxes and fees

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nightlyRate = parseFloat(hotelSelect.value);
    const selectedOption = hotelSelect.options[hotelSelect.selectedIndex];
    const hotelName = selectedOption ? (selectedOption.dataset.hotelName || selectedOption.textContent) : '';
    const nights = parseInt(nightsInput.value, 10);

    if (!nightlyRate || isNaN(nightlyRate)) {
      output.innerHTML = '<strong>Please select a hotel</strong> from the dropdown first.';
      showToast('Please select a hotel');
      return;
    }

    if (isNaN(nights) || nights < 1 || nights > 30) {
      output.innerHTML = '<strong>Please enter a valid number of nights</strong> (between 1 and 30).';
      showToast('Enter 1 to 30 nights');
      return;
    }

    const subtotal = nightlyRate * nights;
    const taxesAndFees = subtotal * TAX_RATE;
    const total = subtotal + taxesAndFees;
    const nightLabel = nights === 1 ? 'night' : 'nights';

    output.innerHTML =
      '<div style="margin-bottom:8px;"><strong>' + hotelName + '</strong></div>' +
      '<div>Room subtotal (' + nights + ' ' + nightLabel + ' × ' + formatCurrency(nightlyRate) + '): <strong>' + formatCurrency(subtotal) + '</strong></div>' +
      '<div>Estimated taxes &amp; fees (15.5%): <strong>' + formatCurrency(taxesAndFees) + '</strong></div>' +
      '<hr style="margin:10px 0; border:none; border-top:1px solid rgba(0,0,0,0.12);" />' +
      '<div style="font-size:1.15em;">Estimated Total: <strong>' + formatCurrency(total) + '</strong></div>';
  });
}