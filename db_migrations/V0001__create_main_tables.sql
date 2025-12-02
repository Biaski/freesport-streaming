-- Таблица трансляций
CREATE TABLE streams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    is_live BOOLEAN DEFAULT false,
    sport VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица расписания
CREATE TABLE schedule_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    sport VARCHAR(100) NOT NULL,
    description TEXT,
    stream_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица новостей
CREATE TABLE news_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_streams_is_live ON streams(is_live);
CREATE INDEX idx_schedule_date ON schedule_events(event_date);
CREATE INDEX idx_news_published ON news_posts(published_at DESC);

-- Вставим начальные данные
INSERT INTO streams (title, url, is_live, sport) VALUES 
('Прямая трансляция', 'https://www.youtube.com/embed/jfKfPfyJRdk', true, 'Биатлон');

INSERT INTO schedule_events (title, event_date, event_time, sport, description) VALUES 
('Чемпионат мира - Спринт 10км', '2024-12-15', '14:00:00', 'Биатлон', 'Спринтерская гонка на 10 километров'),
('Кубок мира - Масс-старт 15км', '2024-12-17', '16:30:00', 'Лыжные гонки', 'Масс-старт на 15 километров'),
('Индивидуальная гонка 20км', '2024-12-20', '13:00:00', 'Биатлон', 'Индивидуальная гонка');

INSERT INTO news_posts (title, content, image_url) VALUES 
('Победа сборной на этапе Кубка мира', 'Невероятная гонка завершилась триумфом наших спортсменов. Золото, серебро и бронза остались в команде после напряженной борьбы на дистанции.', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop'),
('Подготовка к чемпионату в разгаре', 'Команда провела интенсивные тренировки на высокогорном полигоне. Спортсмены показывают отличные результаты и готовы к предстоящим стартам.', 'https://images.unsplash.com/photo-1483654363497-b5ebce41bfdb?w=800&h=600&fit=crop');
