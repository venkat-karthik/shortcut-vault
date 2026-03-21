-- Populating Shortcut Vault with High-Quality Developer Data

-- 1. Insert Categories (if they don't exist)
INSERT INTO categories (name, icon) VALUES 
('VS Code', 'code'),
('Git', 'git-branch'),
('Chrome DevTools', 'chrome'),
('Terminal', 'terminal'),
('MacOS', 'apple'),
('Windows', 'monitor'),
('IntelliJ / WebStorm', 'brain'),
('Docker', 'container')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert VS Code Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'VS Code' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('Command Palette', 'Ctrl + Shift + P', 'Access all commands and settings', 185),
  ('Quick Open (File)', 'Ctrl + P', 'Search and open files by name', 142),
  ('Toggle Terminal', 'Ctrl + `', 'Show/hide the integrated terminal', 98),
  ('Multi-cursor select', 'Ctrl + D', 'Select next occurrence of current word', 156),
  ('Format Document', 'Shift + Alt + F', 'Automatically format code', 124),
  ('Global Search', 'Ctrl + Shift + F', 'Search across all files', 89),
  ('Go to Definition', 'F12', 'Jump to the source of a function or variable', 67),
  ('Peek Definition', 'Alt + F12', 'View definition without leaving current file', 45),
  ('Toggle Sidebar', 'Ctrl + B', 'Show or hide the primary sidebar', 78),
  ('Split Editor', 'Ctrl + \', 'Split the editor into two vertical panes', 62)
) AS t(action, keys, description, votes);

-- 3. Insert Git Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Git' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('Git Status', 'git status', 'View current state of working directory', 198),
  ('Git Log', 'git log --oneline', 'View short commit history', 112),
  ('Stage All', 'git add .', 'Prepare all changes for commit', 167),
  ('Commit Changes', 'git commit -m "..."', 'Record changes to repository', 154),
  ('Pull Latest', 'git pull origin main', 'Fetch and merge remote changes', 123),
  ('Switch Branch', 'git checkout <branch>', 'Switch to a different branch', 98),
  ('Create & Switch Branch', 'git checkout -b <name>', 'Create a new branch and switch to it', 145),
  ('Undo Last Commit', 'git reset --soft HEAD~1', 'Undo commit but keep changes staged', 88)
) AS t(action, keys, description, votes);

-- 4. Insert Chrome DevTools Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Chrome DevTools' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('Open DevTools', 'F12 / Ctrl+Shift+I', 'Launch browser inspector', 145),
  ('Toggle Console', 'Ctrl + `', 'Open console tab in DevTools', 98),
  ('Device Toolbar', 'Ctrl + Shift + M', 'Toggle mobile device simulation', 112),
  ('Hard Reload', 'Ctrl + Shift + R', 'Reload page clearing cache', 156),
  ('Inspect Element', 'Ctrl + Shift + C', 'Select an element to inspect', 134),
  ('Search in Files', 'Ctrl + Shift + F', 'Search through all loaded scripts', 76)
) AS t(action, keys, description, votes);

-- 5. Insert Terminal Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Terminal' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('Clear Terminal', 'Ctrl + L', 'Clear current view but keep history', 167),
  ('Interrupt Process', 'Ctrl + C', 'Stop a running command', 210),
  ('End Input / Exit', 'Ctrl + D', 'Exit terminal or end input stream', 142),
  ('Reverse Search', 'Ctrl + R', 'Search through command history', 189),
  ('Go to Start of Line', 'Ctrl + A', 'Quickly move cursor to line beginning', 112),
  ('Go to End of Line', 'Ctrl + E', 'Quickly move cursor to line end', 115)
) AS t(action, keys, description, votes);

-- 6. Insert MacOS Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'MacOS' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('Spotlight Search', 'Cmd + Space', 'Global search for apps and files', 198),
  ('Quit App', 'Cmd + Q', 'Forcefully quit active application', 154),
  ('Screenshot Area', 'Cmd + Shift + 4', 'Capture a portion of the screen', 167),
  ('Focus Next Window', 'Cmd + `', 'Cycle through windows of same app', 98),
  ('Emoji Picker', 'Cmd + Ctrl + Space', 'Open system emoji panel', 112)
) AS t(action, keys, description, votes);

-- 7. Insert Windows Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Windows' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('File Explorer', 'Win + E', 'Open File Explorer', 167),
  ('Snap Window Left', 'Win + Left Arrow', 'Snap window to left half', 142),
  ('Snap Window Right', 'Win + Right Arrow', 'Snap window to right half', 142),
  ('Virtual Desktop', 'Win + Ctrl + D', 'Create a new virtual desktop', 89),
  ('Switch Task', 'Alt + Tab', 'Switch between open apps', 198),
  ('Lock Workstation', 'Win + L', 'Instant lock for security', 156)
) AS t(action, keys, description, votes);

-- 8. Insert IntelliJ / WebStorm Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'IntelliJ / WebStorm' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('Search Everywhere', 'Shift + Shift', 'Find anything in project', 210),
  ('Find Action', 'Ctrl + Shift + A', 'Find any IDE command', 189),
  ('Extend Selection', 'Ctrl + W', 'Select increasing code blocks', 145),
  ('Generate Code', 'Alt + Insert', 'Create getters, setters, constructors', 134),
  ('Rename Refactor', 'Shift + F6', 'Rename symbol across project', 167),
  ('Fix with Intent', 'Alt + Enter', 'Show quick fixes and intentions', 178)
) AS t(action, keys, description, votes);

-- 9. Insert Docker Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Docker' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description, votes)
SELECT cat.id, action, keys, description, votes FROM cat, (VALUES
  ('List Containers', 'docker ps', 'View running containers', 156),
  ('Stop Container', 'docker stop <id>', 'Gracefully stop a container', 134),
  ('Build Image', 'docker build -t <name> .', 'Build image from Dockerfile', 167),
  ('Prune System', 'docker system prune', 'Clean up unused containers/images', 145),
  ('View Logs', 'docker logs -f <id>', 'Follow container logs in real-time', 112)
) AS t(action, keys, description, votes);
