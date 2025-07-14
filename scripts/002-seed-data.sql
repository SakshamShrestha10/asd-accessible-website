-- Insert demo admin user
INSERT INTO users (email, password_hash, name, is_admin, is_active, created_at, updated_at) VALUES
('admin@supportspace.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8DGm', 'Admin User', true, true, NOW(), NOW()),
('user@supportspace.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8DGm', 'Demo User', false, true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, description, color, icon, sort_order, slug) VALUES
('Fundamentals', 'Basic understanding of autism spectrum disorder', '#3B82F6', 'BookOpen', 1, 'fundamentals'),
('Communication', 'Communication skills and strategies', '#10B981', 'MessageCircle', 2, 'communication'),
('Sensory', 'Sensory processing and management', '#F59E0B', 'Zap', 3, 'sensory'),
('Life Skills', 'Daily living and independence skills', '#8B5CF6', 'Home', 4, 'life-skills'),
('Career', 'Professional development and workplace skills', '#EF4444', 'Briefcase', 5, 'career'),
('Wellness', 'Mental health and wellbeing', '#06B6D4', 'Heart', 6, 'wellness')
ON CONFLICT DO NOTHING;

-- Insert sample learning paths
INSERT INTO learning_paths (title, description, difficulty, estimated_duration, category_id, content_type, is_published, rating, total_ratings, created_by) VALUES
('Understanding Autism Spectrum Disorder', 'A comprehensive introduction to ASD, covering the basics of diagnosis, characteristics, and common experiences.', 'Beginner', 120, 1, 'video', true, 4.8, 156, 1),
('Communication Strategies', 'Learn effective communication techniques and tools to improve social interactions and express needs clearly.', 'Intermediate', 180, 2, 'interactive', true, 4.9, 203, 1),
('Sensory Processing and Management', 'Understand sensory processing differences and learn practical strategies for managing sensory challenges.', 'Beginner', 90, 3, 'article', true, 4.7, 134, 1),
('Building Daily Routines', 'Create structured, flexible routines that support independence and reduce anxiety in daily life.', 'Beginner', 150, 4, 'video', true, 4.6, 98, 1),
('Workplace Success for Autistic Adults', 'Navigate workplace challenges, develop professional skills, and advocate for accommodations.', 'Advanced', 240, 5, 'interactive', true, 4.8, 87, 1),
('Mindfulness and Emotional Regulation', 'Learn mindfulness techniques and emotional regulation strategies tailored for autistic individuals.', 'Intermediate', 120, 6, 'audio', true, 4.9, 176, 1)
ON CONFLICT DO NOTHING;

-- Insert sample lessons for the first learning path
INSERT INTO lessons (path_id, title, description, content, lesson_type, duration, order_index, is_published) VALUES
(1, 'What is Autism Spectrum Disorder?', 'Introduction to ASD and its characteristics', 'Comprehensive overview of autism spectrum disorder...', 'video', 15, 1, true),
(1, 'The Autism Spectrum', 'Understanding the diversity within autism', 'Exploring the wide range of experiences...', 'video', 12, 2, true),
(1, 'Common Strengths and Challenges', 'Recognizing both strengths and areas of difficulty', 'Balanced perspective on autism...', 'article', 10, 3, true),
(1, 'Diagnosis and Assessment', 'How autism is diagnosed', 'The diagnostic process explained...', 'video', 18, 4, true),
(1, 'Myths and Misconceptions', 'Debunking common myths about autism', 'Addressing stereotypes and misinformation...', 'interactive', 20, 5, true),
(1, 'Supporting Autistic Individuals', 'How to provide effective support', 'Best practices for support...', 'article', 15, 6, true),
(1, 'Self-Advocacy Skills', 'Learning to advocate for yourself', 'Building confidence in self-advocacy...', 'video', 16, 7, true),
(1, 'Resources and Next Steps', 'Where to find additional support', 'Comprehensive resource guide...', 'article', 14, 8, true)
ON CONFLICT DO NOTHING;

-- Insert sample healthcare providers
INSERT INTO healthcare_providers (name, specialty, email, phone, address, bio, experience, education, languages, insurance_accepted, certifications, is_accepting_patients) VALUES
('Dr. Sarah Johnson', 'Autism Specialist', 'sarah.johnson@example.com', '(555) 123-4567', '123 Main St, City, State 12345', 'Specialized in autism diagnosis and support for over 15 years.', '15+ years', 'PhD in Clinical Psychology', ARRAY['English', 'Spanish'], ARRAY['Blue Cross', 'Aetna', 'Cigna'], ARRAY['Licensed Clinical Psychologist', 'ADOS-2 Certified'], true),
('Dr. Michael Chen', 'Developmental Pediatrician', 'michael.chen@example.com', '(555) 234-5678', '456 Oak Ave, City, State 12345', 'Pediatrician specializing in developmental disorders and autism.', '12+ years', 'MD, Pediatrics Residency', ARRAY['English', 'Mandarin'], ARRAY['Blue Cross', 'United Healthcare'], ARRAY['Board Certified Pediatrician', 'Developmental Pediatrics'], true),
('Dr. Emily Rodriguez', 'Speech-Language Pathologist', 'emily.rodriguez@example.com', '(555) 345-6789', '789 Pine St, City, State 12345', 'SLP with expertise in communication disorders and autism.', '10+ years', 'MS in Speech-Language Pathology', ARRAY['English', 'Spanish'], ARRAY['Medicaid', 'Blue Cross'], ARRAY['CCC-SLP', 'PROMPT Certified'], true)
ON CONFLICT DO NOTHING;

-- Insert sample community posts
INSERT INTO community_posts (user_id, title, content, category, tags, is_anonymous) VALUES
(2, 'Tips for Managing Sensory Overload', 'I wanted to share some strategies that have helped me manage sensory overload in public spaces...', 'Sensory', ARRAY['sensory', 'coping', 'tips'], false),
(2, 'Workplace Accommodations That Work', 'After years of trial and error, here are the accommodations that have made the biggest difference...', 'Career', ARRAY['workplace', 'accommodations', 'career'], false),
(2, 'Finding the Right Therapist', 'Some advice on what to look for when searching for a therapist who understands autism...', 'Support', ARRAY['therapy', 'mental health', 'support'], true)
ON CONFLICT DO NOTHING;

-- Insert sample user settings
INSERT INTO user_settings (user_id, theme, font_size, high_contrast, reduced_motion) VALUES
(1, 'light', 16, false, false),
(2, 'light', 18, false, true)
ON CONFLICT (user_id) DO NOTHING;
