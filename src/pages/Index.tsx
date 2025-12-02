import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Stream {
  id: string;
  title: string;
  url: string;
  isLive: boolean;
}

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  sport: string;
}

interface NewsPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'stream' | 'schedule' | 'news'>('stream');
  const [streamUrl, setStreamUrl] = useState('');
  const [currentStream, setCurrentStream] = useState<Stream>({
    id: '1',
    title: 'Прямая трансляция',
    url: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    isLive: true
  });

  const scheduleEvents: ScheduleEvent[] = [
    {
      id: '1',
      title: 'Чемпионат мира - Спринт 10км',
      date: '15 декабря',
      time: '14:00 МСК',
      sport: 'Биатлон'
    },
    {
      id: '2',
      title: 'Кубок мира - Масс-старт 15км',
      date: '17 декабря',
      time: '16:30 МСК',
      sport: 'Лыжные гонки'
    },
    {
      id: '3',
      title: 'Индивидуальная гонка 20км',
      date: '20 декабря',
      time: '13:00 МСК',
      sport: 'Биатлон'
    }
  ];

  const newsPosts: NewsPost[] = [
    {
      id: '1',
      title: 'Победа сборной на этапе Кубка мира',
      content: 'Невероятная гонка завершилась триумфом наших спортсменов. Золото, серебро и бронза остались в команде после напряженной борьбы на дистанции.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
      date: '1 декабря 2024'
    },
    {
      id: '2',
      title: 'Подготовка к чемпионату в разгаре',
      content: 'Команда провела интенсивные тренировки на высокогорном полигоне. Спортсмены показывают отличные результаты и готовы к предстоящим стартам.',
      image: 'https://images.unsplash.com/photo-1483654363497-b5ebce41bfdb?w=800&h=600&fit=crop',
      date: '28 ноября 2024'
    }
  ];

  const handleStreamUpdate = () => {
    if (streamUrl.trim()) {
      let embedUrl = streamUrl;
      
      if (streamUrl.includes('youtube.com/watch')) {
        const videoId = streamUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (streamUrl.includes('youtu.be/')) {
        const videoId = streamUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      setCurrentStream({
        ...currentStream,
        url: embedUrl
      });
      setStreamUrl('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Radio" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold">Freesport</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('stream')}
              className={`font-medium transition-colors ${
                activeTab === 'stream' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Трансляция
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`font-medium transition-colors ${
                activeTab === 'schedule' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Расписание
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`font-medium transition-colors ${
                activeTab === 'news' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Новости
            </button>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'stream' && (
          <div className="space-y-8 animate-fade-in">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              {currentStream.isLive && (
                <Badge className="absolute top-4 left-4 z-10 bg-red-600 hover:bg-red-600">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </Badge>
              )}
              
              <iframe
                src={currentStream.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Панель администратора</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Вставьте ссылку на видеопоток с YouTube, Twitch или прямую ссылку на .m3u8
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStreamUpdate()}
                  />
                  <Button onClick={handleStreamUpdate}>
                    <Icon name="Play" size={18} className="mr-2" />
                    Обновить
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="transition-transform duration-200 hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="Trophy" size={24} className="text-primary" />
                    <h3 className="font-semibold">Биатлон</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Следите за гонками, стрельбой и борьбой за медали
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-transform duration-200 hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="Mountain" size={24} className="text-primary" />
                    <h3 className="font-semibold">Лыжные гонки</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Спринты, марафоны и эстафеты в прямом эфире
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Расписание трансляций</h2>
            
            {scheduleEvents.map((event) => (
              <Card key={event.id} className="transition-transform duration-200 hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{event.sport}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="Calendar" size={18} className="text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={18} className="text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold">Новости</h2>
            
            <div className="grid gap-8">
              {newsPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden transition-transform duration-200 hover:scale-105">
                  <div className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    
                    <CardContent className="md:col-span-3 pt-6">
                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <Icon name="Calendar" size={16} />
                        <span>{post.date}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold">Добавить новость</h3>
                
                <div className="space-y-3">
                  <Input placeholder="Заголовок новости" />
                  <Input placeholder="Ссылка на изображение" />
                  <Textarea placeholder="Текст новости" rows={4} />
                  <Button className="w-full md:w-auto">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Опубликовать
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Radio" size={24} className="text-primary" />
              <span className="font-semibold">Freesport</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 Freesport. Прямые трансляции лыжных гонок и биатлона
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
