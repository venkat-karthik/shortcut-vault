-- Insert Initial Categories
INSERT INTO categories (name, icon) VALUES 
('Figma', 'figma'),
('Microsoft Word', 'file-text'),
('Microsoft Excel', 'table')
ON CONFLICT (name) DO NOTHING;

-- Figma Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Figma' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description)
SELECT cat.id, action, keys, description FROM cat, (VALUES
  ('New file', 'Ctrl + N', 'Create a new Figma file'),
  ('Open file', 'Ctrl + O', 'Open an existing Figma file'),
  ('Save (to cloud)', 'Ctrl + S', 'Manually save to cloud'),
  ('Duplicate', 'Ctrl + D', 'Duplicate selected element'),
  ('Undo', 'Ctrl + Z', 'Undo last action'),
  ('Redo', 'Ctrl + Shift + Z', 'Redo last action'),
  ('Copy', 'Ctrl + C', 'Copy element'),
  ('Paste', 'Ctrl + V', 'Paste element'),
  ('Copy as PNG', 'Ctrl + Shift + C', 'Copy selection as PNG'),
  ('Insert Frame', 'F', 'Add a new frame'),
  ('Insert Rectangle', 'R', 'Add a rectangle'),
  ('Insert Text', 'T', 'Add text'),
  ('Add Auto Layout', 'Shift + A', 'Literally a superpower'),
  ('Create Component', 'Ctrl + Alt + K', 'Turn selection into component')
) AS t(action, keys, description);

-- Word Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Microsoft Word' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description)
SELECT cat.id, action, keys, description FROM cat, (VALUES
  ('Bold', 'Ctrl + B', 'Apply bold formatting'),
  ('Italic', 'Ctrl + I', 'Apply italic formatting'),
  ('Underline', 'Ctrl + U', 'Underline text'),
  ('Center Align', 'Ctrl + E', 'Align text to center'),
  ('Find', 'Ctrl + F', 'Search in document'),
  ('Insert Page Break', 'Ctrl + Enter', 'Start a new page')
) AS t(action, keys, description);

-- Excel Formulas & Shortcuts
WITH cat AS (SELECT id FROM categories WHERE name = 'Microsoft Excel' LIMIT 1)
INSERT INTO shortcuts (category_id, action, keys, description)
SELECT cat.id, action, keys, description FROM cat, (VALUES
  ('SUM', '=SUM(range)', 'Adds all numbers in a range'),
  ('AVERAGE', '=AVERAGE(range)', 'Calculates the mean'),
  ('VLOOKUP', '=VLOOKUP(...)', 'Searches vertically for a value'),
  ('XLOOKUP', '=XLOOKUP(...)', 'Advanced lookup (Excel 365)'),
  ('AutoSum', 'Alt + =', 'Quickly insert SUM formula'),
  ('Edit Cell', 'F2', 'Edit the active cell')
) AS t(action, keys, description);
