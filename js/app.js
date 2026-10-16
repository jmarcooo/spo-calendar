// js/app.js — Modular Static SPA Router
import { initUnifiedTableSort } from './utils/tableSort.js';
import './core.js'; // Shared Firebase & global state from original index.html

const ROUTES = {
  dashboard:          { title: 'Dashboard',          html: 'views/dashboard.html',          js: './views/dashboard.js' },
  campaign:           { title: 'Campaign',           html: 'views/campaign.html',           js: './views/campaign.js' },
  daily_task:         { title: 'Daily Task',         html: 'views/daily_task.html',         js: './views/daily_task.js' },
  pin_request:        { title: 'Pin Request',        html: 'views/pin_request.html',        js: './views/pin_request.js' },
  content_writer:     { title: 'Content Writer',     html: 'views/content_writer.html',     js: './views/content_writer.js' },
  prize_distribution: { title: 'Prize Distribution', html: 'views/prize_distribution.html', js: './views/prize_distribution.js' },
  budget:             { title: 'Budget',             html: 'views/budget.html',             js: './views/budget.js' },
  sms:                { title: 'SMS',                html: 'views/sms.html',                js: './views/sms.js' },
  tasks:              { title: 'Tasks',              html: 'views/tasks.html',              js: './views/tasks.js' },
  notifications:      { title: 'Notifications',      html: 'views/notifications.html',      js: './views/notifications.js' },
  settings:           { title: 'Settings',           html: 'views/settings.html',           js: './views/settings.js' }
};

let currentCleanup = null;
const templateCache = new Map();

export async function navigateTo(viewName) {
  const routeKey = ROUTES[viewName] ? viewName : 'dashboard';
  const route = ROUTES[routeKey];
  const container = document.getElementById('app-view') || document.getElementById('main-content');

  if (!container) {
    console.warn('SPA mount container (#app-view or #main-content) not found.');
    return;
  }

  if (typeof currentCleanup === 'function') {
    try { currentCleanup(); } catch (e) { console.error(e); }
    currentCleanup = null;
  }

  try {
    if (!templateCache.has(route.html)) {
      const res = await fetch(route.html);
      if (res.ok) {
        templateCache.set(route.html, await res.text());
      }
    }
    if (templateCache.has(route.html)) {
      container.innerHTML = templateCache.get(route.html);
    }

    const viewModule = await import(route.js);
    if (viewModule && typeof viewModule.init === 'function') {
      currentCleanup = await viewModule.init(container);
    }

    initUnifiedTableSort(container);
  } catch (err) {
    console.error('Error loading view:', routeKey, err);
  }
}

window.navigateTo = navigateTo;

window.addEventListener('hashchange', () => {
  const view = window.location.hash.replace('#', '');
  if (view) navigateTo(view);
});
