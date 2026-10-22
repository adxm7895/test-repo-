'use strict';
const STORAGE_KEY = 'pocket-tasks.review.v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#tasks');
const status = document.querySelector('#status');
const error = document.querySelector('#storage-error');
let tasks = [];
let filter = 'all';
let storageReadable = true;

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  const saved = raw === null ? [] : JSON.parse(raw);
  if (!Array.isArray(saved) || saved.some(t => !t || typeof t.id !== 'string' || typeof t.text !== 'string' || !t.text.trim() || t.text.length > 160 || typeof t.done !== 'boolean') || new Set(saved.map(t => t.id)).size !== saved.length) throw new Error('Invalid saved tasks');
  tasks = saved;
} catch {
  storageReadable = false;
  error.hidden = false;
  error.textContent = 'Saved tasks could not be read. Existing storage has been left untouched. Reload to retry; new changes in this session will not be saved.';
}

function save(message) {
  if (!storageReadable) { status.textContent = `${message} Kept for this session only.`; return; }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    error.hidden = true;
    status.textContent = `${message} Saved on this device.`;
  } catch {
    error.hidden = false;
    error.textContent = 'Saving failed. Keep this tab open to retain your changes. A future edit will retry saving.';
    status.textContent = `${message} Not saved.`;
  }
}

function render() {
  list.replaceChildren();
  const visible = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  for (const task of visible) {
    const row = document.createElement('li'); row.className = `task${task.done ? ' done' : ''}`;
    const label = document.createElement('label');
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = task.done;
    const text = document.createElement('span'); text.textContent = task.text;
    check.addEventListener('change', () => { task.done = check.checked; save(task.done ? 'Task completed.' : 'Task reopened.'); render(); focusTask(task.id); });
    check.dataset.taskId = task.id;
    label.append(check, text);
    const remove = document.createElement('button'); remove.className = 'delete'; remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${task.text}`);
    remove.addEventListener('click', () => {
      const next = visible[visible.indexOf(task) + 1] ?? visible[visible.indexOf(task) - 1];
      tasks = tasks.filter(t => t.id !== task.id); save('Task removed.'); render(); focusTask(next?.id);
    });
    row.append(label, remove); list.append(row);
  }
  document.querySelector('#count').textContent = `${tasks.filter(t => !t.done).length} remaining`;
  const empty = document.querySelector('#empty'); empty.hidden = visible.length > 0;
  empty.querySelector('h2').textContent = tasks.length === 0 ? 'A clear starting point.' : filter === 'done' ? 'Your next win is waiting.' : 'All caught up.';
  empty.querySelector('p').textContent = tasks.length === 0 ? 'Add your first task above. Small steps count.' : filter === 'done' ? 'Completed tasks will appear here.' : 'Take a breath, or add your next small step.';
  for (const button of document.querySelectorAll('[data-filter]')) button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
}
function focusTask(id) {
  const target = [...list.querySelectorAll('input')].find(el => el.dataset.taskId === id);
  (target ?? input).focus();
}
form.addEventListener('submit', event => {
  event.preventDefault(); const text = input.value.trim();
  if (!text) { input.setCustomValidity('Enter a task before adding it.'); input.reportValidity(); return; }
  tasks.push({ id: crypto.randomUUID(), text, done: false }); input.value = ''; filter = 'all'; save('Task added.'); render(); input.focus();
});
input.addEventListener('input', () => input.setCustomValidity(''));
for (const button of document.querySelectorAll('[data-filter]')) button.addEventListener('click', () => { filter = button.dataset.filter; render(); });
render();
