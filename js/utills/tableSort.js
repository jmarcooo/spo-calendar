// js/utils/tableSort.js — Unified Table Sorting
export function initUnifiedTableSort(root = document) {
  const tables = root.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('thead th');
    headers.forEach((th, index) => {
      if (th.dataset.sortBound) return;
      th.dataset.sortBound = 'true';
      th.style.cursor = 'pointer';

      th.addEventListener('click', () => {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const dir = th.dataset.sortDir === 'asc' ? 'desc' : 'asc';
        headers.forEach(h => delete h.dataset.sortDir);
        th.dataset.sortDir = dir;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort((a, b) => {
          const aVal = (a.children[index]?.dataset.sortValue ?? a.children[index]?.textContent ?? '').trim();
          const bVal = (b.children[index]?.dataset.sortValue ?? b.children[index]?.textContent ?? '').trim();

          const aNum = parseFloat(aVal.replace(/[^0-9.-]+/g, ''));
          const bNum = parseFloat(bVal.replace(/[^0-9.-]+/g, ''));
          if (!isNaN(aNum) && !isNaN(bNum) && /^[0-9$,.%\s+-]+$/.test(aVal)) {
            return dir === 'asc' ? aNum - bNum : bNum - aNum;
          }

          return dir === 'asc'
            ? aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' })
            : bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
        });

        rows.forEach(r => tbody.appendChild(r));
      });
    });
  });
}
