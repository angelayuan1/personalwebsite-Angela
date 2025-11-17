import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js';
import { getFirestore, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

function initializeFirebase() {
  if (!firebaseConfig || !firebaseConfig.apiKey || String(firebaseConfig.apiKey).startsWith('YOUR_')) {
    const statusEl = document.getElementById('pandasStatus');
    if (statusEl) {
      statusEl.textContent = 'Firebase config not set. Open public/firebase-config.js and add your project config.';
    }
    return null;
  }
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

function collectAllKeys(documents) {
  const keySet = new Set();
  for (const doc of documents) {
    keySet.add('id');
    Object.keys(doc).forEach((k) => keySet.add(k));
  }
  return Array.from(keySet);
}

function renderTable(documents) {
  const statusEl = document.getElementById('pandasStatus');
  const thead = document.getElementById('pandasThead');
  const tbody = document.getElementById('pandasTbody');
  if (!thead || !tbody) return;

  if (documents.length === 0) {
    if (statusEl) statusEl.textContent = 'No documents found.';
    thead.innerHTML = '';
    tbody.innerHTML = '';
    return;
  }

  if (statusEl) statusEl.textContent = '';
  const keys = collectAllKeys(documents.map((d) => d.data));

  // Build header
  thead.innerHTML = '';
  const headerRow = document.createElement('tr');
  for (const key of keys) {
    const th = document.createElement('th');
    th.textContent = key;
    th.style.borderBottom = '1px solid rgba(148,163,184,0.3)';
    th.style.padding = '8px 10px';
    th.style.color = 'var(--text)';
    th.style.fontWeight = '600';
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);

  // Build body
  tbody.innerHTML = '';
  for (const row of documents) {
    const tr = document.createElement('tr');
    for (const key of keys) {
      const td = document.createElement('td');
      const value = key === 'id' ? row.id : row.data[key];
      td.textContent = formatCell(value);
      td.style.borderTop = '1px solid rgba(148,163,184,0.15)';
      td.style.padding = '8px 10px';
      td.style.color = 'rgba(226,232,240,0.9)';
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function formatCell(value) {
  if (value == null) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (_e) {
      return String(value);
    }
  }
  return String(value);
}

function startPandasListener(db) {
  const colRef = collection(db, 'pandas');
  const statusEl = document.getElementById('pandasStatus');
  if (statusEl) statusEl.textContent = 'Loading...';
  return onSnapshot(
    colRef,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, data: d.data() }));
      renderTable(docs);
    },
    (error) => {
      if (statusEl) statusEl.textContent = `Error loading data: ${error.message}`;
      console.error(error);
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const pandasSection = document.getElementById('pandas');
  if (!pandasSection) return;
  const db = initializeFirebase();
  if (!db) return;
  // Start listening immediately; lightweight for typical collections.
  startPandasListener(db);
});


