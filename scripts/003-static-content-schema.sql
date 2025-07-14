-- Static Content Management Schema
-- This file adds tables for admin-controlled static content

-- Community Support Groups
CREATE TABLE IF NOT EXISTS community_support_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    address TEXT,
    schedule TEXT,
    contact VARCHAR(100),
    website VARCHAR(255),
    type VARCHAR(100),
    capacity VARCHAR(100),
    facilitator VARCHAR(255),
    cost VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Activities
CREATE TABLE IF NOT EXISTS community_activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    schedule TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    cost VARCHAR(100),
    age_group VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Services
CREATE TABLE IF NOT EXISTS community_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact VARCHAR(100),
    website VARCHAR(255),
    type VARCHAR(100),
    eligibility VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coping Strategies
CREATE TABLE IF NOT EXISTS coping_strategies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    difficulty VARCHAR(50),
    icon VARCHAR(50),
    color VARCHAR(20),
    category VARCHAR(50), -- 'immediate', 'daily', 'audio'
    steps JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    audio_url VARCHAR(500),
    audio_duration VARCHAR(50),
    audio_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Help FAQs
CREATE TABLE IF NOT EXISTS help_faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Types
CREATE TABLE IF NOT EXISTS assessment_types (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    questions_count INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Questions
CREATE TABLE IF NOT EXISTS assessment_questions (
    id SERIAL PRIMARY KEY,
    assessment_type_id INTEGER REFERENCES assessment_types(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of answer options
    question_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication Cards
CREATE TABLE IF NOT EXISTS communication_cards (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(10) NOT NULL,
    text VARCHAR(255) NOT NULL,
    category VARCHAR(50), -- 'needs', 'feelings', 'social'
    subcategory VARCHAR(50), -- 'basic', 'sensory', 'support', 'positive', 'negative', 'physical', 'neutral', 'greeting', 'polite', 'response'
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication Phrases
CREATE TABLE IF NOT EXISTS communication_phrases (
    id SERIAL PRIMARY KEY,
    phrase TEXT NOT NULL,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_support_groups_active ON community_support_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_community_activities_active ON community_activities(is_active);
CREATE INDEX IF NOT EXISTS idx_community_services_active ON community_services(is_active);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_category ON coping_strategies(category);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_active ON coping_strategies(is_active);
CREATE INDEX IF NOT EXISTS idx_help_faqs_active ON help_faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_types_active ON assessment_types(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_type ON assessment_questions(assessment_type_id);
CREATE INDEX IF NOT EXISTS idx_communication_cards_category ON communication_cards(category);
CREATE INDEX IF NOT EXISTS idx_communication_cards_active ON communication_cards(is_active);
CREATE INDEX IF NOT EXISTS idx_communication_phrases_active ON communication_phrases(is_active);

-- Create triggers for updated_at
CREATE TRIGGER update_community_support_groups_updated_at BEFORE UPDATE ON community_support_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_activities_updated_at BEFORE UPDATE ON community_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_services_updated_at BEFORE UPDATE ON community_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coping_strategies_updated_at BEFORE UPDATE ON coping_strategies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_help_faqs_updated_at BEFORE UPDATE ON help_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_types_updated_at BEFORE UPDATE ON assessment_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_questions_updated_at BEFORE UPDATE ON assessment_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communication_cards_updated_at BEFORE UPDATE ON communication_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communication_phrases_updated_at BEFORE UPDATE ON communication_phrases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 