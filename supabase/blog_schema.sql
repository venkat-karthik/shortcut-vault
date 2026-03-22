-- Blog Feature Schema

-- 1. Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID DEFAULT auth.uid(), -- Optional for now
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create blog_contents table
CREATE TABLE IF NOT EXISTS blog_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'document')),
  content TEXT NOT NULL, -- Text content or File URL
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_contents ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Allow public read
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Content" ON blog_contents FOR SELECT USING (true);

-- Allow public insert (for now, until Auth is fully set up)
CREATE POLICY "Public Insert Blogs" ON blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Content" ON blog_contents FOR INSERT WITH CHECK (true);
