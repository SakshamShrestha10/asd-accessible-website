-- Seed data for static content tables
-- This populates the tables with the current static content

-- Community Support Groups
INSERT INTO community_support_groups (name, description, location, address, schedule, contact, website, type, capacity, facilitator, cost, sort_order) VALUES
('Adults with Autism Support Group', 'A safe space for adults on the autism spectrum to share experiences and support each other', 'Downtown Community Center', '123 Main St, Downtown', 'Every Tuesday, 7:00 PM - 8:30 PM', '(555) 123-4567', 'www.adultsautismsupport.org', 'Support Group', '12-15 people', 'Licensed Social Worker', 'Free', 1),
('Families & Caregivers Circle', 'Support and resources for families and caregivers of individuals with autism', 'Westside Family Center', '456 Oak Ave, Westside', 'First Saturday of each month, 10:00 AM - 12:00 PM', '(555) 234-5678', 'www.familycaregivers.org', 'Family Support', '20-25 people', 'Parent Advocate', 'Free', 2),
('Young Adults Transition Group', 'For young adults (18-25) navigating independence, work, and relationships', 'Youth Services Building', '789 Pine St, Midtown', 'Every Thursday, 6:00 PM - 7:30 PM', '(555) 345-6789', 'www.youngadultstransition.org', 'Transition Support', '8-10 people', 'Transition Specialist', 'Free', 3);

-- Community Activities
INSERT INTO community_activities (name, description, location, schedule, icon, color, cost, age_group, sort_order) VALUES
('Creative Art Therapy', 'Express yourself through various art mediums in a supportive environment', 'Arts & Wellness Center', 'Wednesdays, 2:00 PM - 4:00 PM', 'Palette', 'purple', '$15 per session', 'All ages', 1),
('Social Skills Practice Group', 'Practice conversation and social interaction in a comfortable setting', 'Community Learning Center', 'Saturdays, 11:00 AM - 12:30 PM', 'Users', 'blue', 'Free', 'Adults', 2),
('Board Game Night', 'Enjoy board games and card games with others who share your interests', 'Public Library - Community Room', 'Every other Friday, 7:00 PM - 9:00 PM', 'Gamepad2', 'green', 'Free', 'Teens & Adults', 3),
('Music Appreciation Circle', 'Listen to and discuss music, share favorite songs, and explore different genres', 'Music Therapy Center', 'Mondays, 4:00 PM - 5:30 PM', 'Music', 'orange', '$10 per session', 'All ages', 4),
('Neurodivergent Book Club', 'Read and discuss books with themes relevant to the autism community', 'Central Library', 'Last Sunday of each month, 2:00 PM - 4:00 PM', 'BookOpen', 'indigo', 'Free', 'Adults', 5),
('Coffee & Conversation', 'Casual meetup for coffee and friendly conversation in a quiet environment', 'Quiet Corner Café', 'Sundays, 10:00 AM - 12:00 PM', 'Coffee', 'teal', 'Cost of your order', 'Adults', 6);

-- Community Services
INSERT INTO community_services (name, description, contact, website, type, eligibility, sort_order) VALUES
('Vocational Rehabilitation Services', 'Job training, placement assistance, and workplace accommodations support', '(555) 111-2222', 'www.vocrehab.gov', 'Employment', 'Adults with disabilities', 1),
('Accessible Transportation Program', 'Reduced-fare public transit and specialized transportation services', '(555) 333-4444', 'www.accessibletransit.org', 'Transportation', 'Individuals with disabilities', 2),
('Independent Living Support', 'Housing assistance, life skills training, and independent living resources', '(555) 555-6666', 'www.independentliving.org', 'Housing', 'Adults seeking independence', 3),
('Disability Rights Legal Aid', 'Free legal assistance for disability-related issues and advocacy', '(555) 777-8888', 'www.disabilitylegal.org', 'Legal', 'Individuals with disabilities', 4),
('Autism Healthcare Network', 'Directory of autism-informed healthcare providers and specialists', '(555) 999-0000', 'www.autismhealthcare.org', 'Healthcare', 'All ages', 5);

-- Coping Strategies
INSERT INTO coping_strategies (title, description, duration, difficulty, icon, color, category, steps, benefits, sort_order) VALUES
('4-7-8 Breathing', 'A simple breathing technique to calm your nervous system quickly', '2-3 minutes', 'Easy', 'Waves', 'blue', 'immediate', '["Breathe in through your nose for 4 counts", "Hold your breath for 7 counts", "Breathe out through your mouth for 8 counts", "Repeat 3-4 times"]', '[]', 1),
('5-4-3-2-1 Grounding', 'Use your senses to feel more present and calm', '3-5 minutes', 'Easy', 'Brain', 'green', 'immediate', '["Name 5 things you can see", "Name 4 things you can touch", "Name 3 things you can hear", "Name 2 things you can smell", "Name 1 thing you can taste"]', '[]', 2),
('Progressive Muscle Relaxation', 'Tense and relax different muscle groups to release physical stress', '10-15 minutes', 'Medium', 'Heart', 'purple', 'immediate', '["Start with your toes - tense for 5 seconds, then relax", "Move up to your calves, thighs, and so on", "Work through each muscle group", "End with your face and head muscles"]', '[]', 3),
('Morning Routine Builder', 'Create a calming start to your day with predictable steps', '15-30 minutes', 'Easy', 'Timer', 'orange', 'daily', '[]', '["Reduces morning anxiety", "Creates predictability", "Builds positive momentum"]', 4),
('Sensory Break Kit', 'Tools and techniques for when you feel overwhelmed', '5-10 minutes', 'Easy', 'Palette', 'teal', 'daily', '[]', '["Prevents sensory overload", "Quick reset", "Portable solutions"]', 5),
('Energy Management', 'Learn to recognize and respect your energy limits', 'Ongoing', 'Medium', 'Moon', 'indigo', 'daily', '[]', '["Prevents burnout", "Improves self-awareness", "Better planning"]', 6);

-- Audio Coping Strategies
INSERT INTO coping_strategies (title, description, duration, difficulty, icon, color, category, audio_type, sort_order) VALUES
('Forest Sounds', 'Gentle rain and bird sounds for relaxation', '30 minutes', 'Easy', 'Volume2', 'green', 'audio', 'Nature', 7),
('White Noise', 'Consistent sound to mask distracting noises', '60 minutes', 'Easy', 'Volume2', 'blue', 'audio', 'Focus', 8),
('Guided Body Scan', 'Gentle voice guiding you through relaxation', '15 minutes', 'Easy', 'Volume2', 'purple', 'audio', 'Meditation', 9);

-- Help FAQs
INSERT INTO help_faqs (question, answer, sort_order) VALUES
('How do I change the text size?', 'Go to Settings and look for ''Text Size'' under Visual Settings. You can use the slider to make text bigger or smaller. The changes will save automatically.', 1),
('What if I feel overwhelmed while using the website?', 'Take a break anytime you need to. You can also go to Settings and turn on ''Reduce Motion'' to make the website calmer. The Calming Sounds tool can also help you relax.', 2),
('How do I book an appointment?', 'Click on ''Schedule Appointments'' from the main menu. You''ll see available times and can choose what works best for you. You''ll get a confirmation email after booking.', 3),
('Can I use this website on my phone?', 'Yes! The website works on phones, tablets, and computers. All the features work the same way on every device.', 4),
('What if I need help right away?', 'For urgent help, call the crisis helpline at 988. For website help, use the chat button below or send us an email. We usually respond within 24 hours.', 5),
('How do I save my favorite tools?', 'When you use a tool you like, click the heart icon to save it. You can find all your saved tools in your personal dashboard.', 6),
('Is my information private?', 'Yes, your information is completely private. We never share your personal details with anyone. You can read our full privacy policy for more details.', 7),
('What if I can''t find what I''m looking for?', 'Try using the search bar at the top of any page. You can also contact us using the form below, and we''ll help you find what you need.', 8);

-- Assessment Types
INSERT INTO assessment_types (title, description, duration, questions_count, sort_order) VALUES
('Sensory Processing Assessment', 'Understand how you process different sensory experiences', '5-7 minutes', 8, 1),
('Social Communication Assessment', 'Explore your communication preferences and challenges', '6-8 minutes', 10, 2),
('Daily Routine Assessment', 'Identify what helps you feel organized and calm', '4-6 minutes', 6, 3),
('Stress and Coping Assessment', 'Learn about your stress triggers and coping strategies', '7-9 minutes', 12, 4);

-- Assessment Questions (sample questions)
INSERT INTO assessment_questions (assessment_type_id, question, options, question_order) VALUES
(1, 'How do you usually feel in crowded, noisy places like shopping centers?', '["Very comfortable - I enjoy the energy", "Somewhat comfortable - I can manage for a while", "Somewhat uncomfortable - I prefer quieter places", "Very uncomfortable - I try to avoid these places", "It depends on the day and my energy level"]', 1),
(1, 'When you need to focus on something important, what helps you most?', '["Complete silence", "Soft background music or sounds", "A specific routine or ritual", "Being in a familiar space", "Having all distractions removed"]', 2),
(1, 'How do you prefer to receive new information or instructions?', '["Written down step-by-step", "Explained verbally with examples", "Shown through pictures or diagrams", "Demonstrated first, then I try", "A combination of methods"]', 3);

-- Communication Cards
INSERT INTO communication_cards (icon, text, category, subcategory, sort_order) VALUES
-- Needs
('💧', 'I need water', 'needs', 'basic', 1),
('🍎', 'I''m hungry', 'needs', 'basic', 2),
('🚽', 'I need the bathroom', 'needs', 'basic', 3),
('⏸️', 'I need a break', 'needs', 'basic', 4),
('🤫', 'I need quiet', 'needs', 'sensory', 5),
('🏠', 'I need space', 'needs', 'sensory', 6),
('🆘', 'I need help', 'needs', 'support', 7),
('⏰', 'I need more time', 'needs', 'support', 8),
-- Feelings
('😊', 'I feel happy', 'feelings', 'positive', 9),
('😢', 'I feel sad', 'feelings', 'negative', 10),
('😠', 'I feel angry', 'feelings', 'negative', 11),
('😰', 'I feel worried', 'feelings', 'negative', 12),
('😴', 'I feel tired', 'feelings', 'physical', 13),
('🤩', 'I feel excited', 'feelings', 'positive', 14),
('😕', 'I feel confused', 'feelings', 'neutral', 15),
('🤯', 'I feel overwhelmed', 'feelings', 'negative', 16),
-- Social
('👋', 'Hello', 'social', 'greeting', 17),
('👋', 'Goodbye', 'social', 'greeting', 18),
('🙏', 'Please', 'social', 'polite', 19),
('🙏', 'Thank you', 'social', 'polite', 20),
('✅', 'Yes', 'social', 'response', 21),
('❌', 'No', 'social', 'response', 22),
('🤔', 'Maybe', 'social', 'response', 23),
('😔', 'I''m sorry', 'social', 'polite', 24);

-- Communication Phrases
INSERT INTO communication_phrases (phrase, sort_order) VALUES
('I need a moment to process this', 1),
('Can you repeat that more slowly?', 2),
('I understand better with written instructions', 3),
('This is too loud/bright for me', 4),
('I''m feeling overwhelmed right now', 5),
('Can we take a break?', 6),
('I need to think about this', 7),
('Thank you for being patient with me', 8); 