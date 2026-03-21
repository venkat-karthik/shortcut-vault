const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA = [
  {
    category: 'VS Code',
    shortcuts: [
      { action: 'Command Palette', keys: 'Ctrl + Shift + P', description: 'Access all commands and settings' },
      { action: 'Quick Open (File)', keys: 'Ctrl + P', description: 'Search and open files by name' },
      { action: 'Toggle Terminal', keys: 'Ctrl + `', description: 'Show/hide the integrated terminal' },
      { action: 'Multi-cursor select', keys: 'Ctrl + D', description: 'Select next occurrence of current word' },
      { action: 'Format Document', keys: 'Shift + Alt + F', description: 'Automatically format code' },
      { action: 'Global Search', keys: 'Ctrl + Shift + F', description: 'Search across all files' },
      { action: 'Go to Definition', keys: 'F12', description: 'Jump to the source of a function or variable' },
      { action: 'Peek Definition', keys: 'Alt + F12', description: 'View definition without leaving current file' }
    ]
  },
  {
    category: 'Git',
    shortcuts: [
      { action: 'Git Status', keys: 'git status', description: 'View current state of working directory' },
      { action: 'Git Log', keys: 'git log --oneline', description: 'View short commit history' },
      { action: 'Stage All', keys: 'git add .', description: 'Prepare all changes for commit' },
      { action: 'Commit Changes', keys: 'git commit -m "..."', description: 'Record changes to repository' },
      { action: 'Pull Latest', keys: 'git pull origin main', description: 'Fetch and merge remote changes' },
      { action: 'Switch Branch', keys: 'git checkout <branch>', description: 'Switch to a different branch' }
    ]
  },
  {
    category: 'Chrome DevTools',
    shortcuts: [
      { action: 'Open DevTools', keys: 'F12 / Ctrl + Shift + I', description: 'Launch browser inspector' },
      { action: 'Toggle Console', keys: 'Ctrl + `', description: 'Open console tab in DevTools' },
      { action: 'Device Toolbar', keys: 'Ctrl + Shift + M', description: 'Toggle mobile device simulation' },
      { action: 'Hard Reload', keys: 'Ctrl + Shift + R', description: 'Reload page clearing cache' },
      { action: 'Inspect Element', keys: 'Ctrl + Shift + C', description: 'Select an element on the page to inspect' }
    ]
  },
  {
    category: 'Terminal',
    shortcuts: [
      { action: 'Clear Terminal', keys: 'Ctrl + L', description: 'Clear current view but keep history' },
      { action: 'Interrupt Process', keys: 'Ctrl + C', description: 'Stop a running command' },
      { action: 'End Input / Exit', keys: 'Ctrl + D', description: 'Exit terminal or end input stream' },
      { action: 'Reverse Search', keys: 'Ctrl + R', description: 'Search through command history' },
      { action: 'Go to Start of Line', keys: 'Ctrl + A', description: 'Quickly move cursor to line beginning' },
      { action: 'Go to End of Line', keys: 'Ctrl + E', description: 'Quickly move cursor to line end' }
    ]
  },
  {
    category: 'MacOS',
    shortcuts: [
      { action: 'Spotlight Search', keys: 'Cmd + Space', description: 'Global search for apps and files' },
      { action: 'Quit App', keys: 'Cmd + Q', description: 'Forcefully quit active application' },
      { action: 'Screenshot Area', keys: 'Cmd + Shift + 4', description: 'Capture a portion of the screen' },
      { action: 'Focus Next Window', keys: 'Cmd + `', description: 'Cycle through windows of same app' },
      { action: 'Emoji Picker', keys: 'Cmd + Ctrl + Space', description: 'Open system emoji panel' }
    ]
  }
];

async function populate() {
  console.log('Starting population...');
  
  for (const item of DATA) {
    console.log(`Processing category: ${item.category}`);
    
    // Check if category exists or create it
    let { data: catData, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', item.category)
      .maybeSingle();
    
    if (!catData) {
      const { data: newCat, error: createError } = await supabase
        .from('categories')
        .insert([{ name: item.category }])
        .select('id')
        .single();
      
      if (createError) {
        console.error(`Error creating category ${item.category}:`, createError);
        continue;
      }
      catData = newCat;
    }

    const categoryId = catData.id;

    // Insert shortcuts
    const shortcutsToInsert = item.shortcuts.map(s => ({
      ...s,
      category_id: categoryId,
      votes: Math.floor(Math.random() * 200) + 50
    }));

    const { error: insertError } = await supabase
      .from('shortcuts')
      .insert(shortcutsToInsert);

    if (insertError) {
      console.error(`Error inserting shortcuts for ${item.category}:`, insertError);
    } else {
      console.log(`Successfully added ${item.shortcuts.length} shortcuts for ${item.category}`);
    }
  }
  
  console.log('Population complete!');
}

populate();
