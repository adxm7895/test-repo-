# Pocket Tasks — local import review fixture

A dependency-free task list for testing Adrian's repository import and Testing hub.
No account, API, analytics, network requests, build step or package installation.

Open `index.html` in a browser, or serve this folder with a local static server.
Task storage belongs to that browser and origin; different ports/hosts/file URLs
do not share it. Clearing browser storage removes tasks. This is not cloud sync.

## Review checklist

- Add a task with Enter; the input clears and stays focused.
- Add a second task, complete the first, then filter To do and Done.
- Reload at the same address: task text and completion state persist.
- Remove one task, reload and confirm only the other remains.
- Whitespace-only tasks are refused; task text is rendered as plain text.
- At 360px width, controls and long task text fit without horizontal scrolling.
- Use the keyboard to add, complete, filter and remove tasks.
- With browser storage blocked/corrupt, the app explains that saving failed;
  it never replaces unreadable stored data or claims those changes were saved.

The initial list is empty. No sample task is represented as user data.
This is a disposable GitHub import fixture reviewed locally before publication.

## Verified on 2026-10-22

Actual browser: Enter submission, add, complete, Done filter, reload persistence,
remove/reload persistence and whitespace rejection. Visually inspected desktop
and a 360px viewport; document width matched scroll width (345px after scrollbar).
The open review browser contains two synthetic tasks created during verification.

Controlled DOM checks: unreadable stored data is preserved, a failed storage write
keeps the task visible and reports Not saved, and HTML-looking input remains plain
text. These simulate storage failures; they are not an OS storage-failure test.

Not yet verified: authenticated GitHub import, import of these files through
Adrian, multiple-tab conflict handling, exhaustive accessibility or browser coverage.
