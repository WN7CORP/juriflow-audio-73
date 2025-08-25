
-- Create table for lesson progress tracking by IP
CREATE TABLE public.lesson_progress_by_ip (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_ip TEXT NOT NULL,
  lesson_id BIGINT NOT NULL,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_position NUMERIC(10,2) NOT NULL DEFAULT 0,
  watch_time NUMERIC(10,2) NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_ip, lesson_id)
);

-- Add Row Level Security
ALTER TABLE public.lesson_progress_by_ip ENABLE ROW LEVEL SECURITY;

-- Allow all operations for everyone (since we're tracking by IP, not auth)
CREATE POLICY "Allow all operations on lesson progress by IP" 
  ON public.lesson_progress_by_ip 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_lesson_progress_ip_lesson ON public.lesson_progress_by_ip(user_ip, lesson_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lesson_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lesson_progress_by_ip_updated_at
  BEFORE UPDATE ON public.lesson_progress_by_ip
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_progress_updated_at();
