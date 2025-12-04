import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminStreamSection from '@/components/admin/AdminStreamSection';
import AdminScheduleSection from '@/components/admin/AdminScheduleSection';
import AdminNewsSection from '@/components/admin/AdminNewsSection';

const API_URL = 'https://functions.poehali.dev/b726b831-4bec-45c4-86a0-702fb2ab6218';

interface Stream {
  id: number;
  title: string;
  url: string;
  is_live: boolean;
  sport?: string;
}

interface ScheduleEvent {
  id: number;
  title: string;
  event_date: string;
  event_time: string;
  sport: string;
  description?: string;
}

interface NewsPost {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<'stream' | 'schedule' | 'news'>('stream');
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    await loadStream();
    await loadSchedule();
    await loadNews();
  };

  const getAuthHeaders = () => {
    const password = localStorage.getItem('admin_password');
    return {
      'Content-Type': 'application/json',
      'X-Admin-Password': password || ''
    };
  };

  const handleLogin = (passwordInput: string) => {
    if (!passwordInput.trim()) {
      toast({ title: 'Ошибка', description: 'Введите пароль', variant: 'destructive' });
      return;
    }
    localStorage.setItem('admin_password', passwordInput);
    setIsAuthenticated(true);
    loadData();
    toast({ title: 'Успешно', description: 'Вы вошли в админ-панель' });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_password');
    setIsAuthenticated(false);
    toast({ title: 'Выход', description: 'Вы вышли из админ-панели' });
  };

  const loadStream = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=stream`);
      const data = await response.json();
      if (data.stream) {
        setCurrentStream(data.stream);
      }
    } catch (error) {
      console.error('Ошибка загрузки трансляции:', error);
    }
  };

  const loadSchedule = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=schedule`);
      const data = await response.json();
      setScheduleEvents(data.events || []);
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    }
  };

  const loadNews = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=news`);
      const data = await response.json();
      setNewsPosts(data.news || []);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  };

  const updateStream = async (newStreamUrl: string, newStreamTitle: string, newStreamSport: string) => {
    if (!newStreamUrl.trim()) {
      toast({ title: 'Ошибка', description: 'Введите URL трансляции', variant: 'destructive' });
      return;
    }

    let embedUrl = newStreamUrl;
    
    if (newStreamUrl.includes('youtube.com/watch') || newStreamUrl.includes('youtube.com/live')) {
      const videoId = newStreamUrl.includes('live/') 
        ? newStreamUrl.split('live/')[1]?.split('?')[0]
        : newStreamUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&iv_load_policy=3&disablekb=1`;
    } else if (newStreamUrl.includes('youtu.be/')) {
      const videoId = newStreamUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&iv_load_policy=3&disablekb=1`;
    } else if (newStreamUrl.includes('twitch.tv/')) {
      const channelName = newStreamUrl.split('twitch.tv/')[1]?.split('?')[0].split('/')[0];
      embedUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}&autoplay=true&muted=false`;
    } else if (newStreamUrl.includes('player.twitch.tv')) {
      if (!newStreamUrl.includes('parent=')) {
        embedUrl = `${newStreamUrl}${newStreamUrl.includes('?') ? '&' : '?'}parent=${window.location.hostname}&autoplay=true&muted=false`;
      }
    } else if (newStreamUrl.includes('goodgame.ru/')) {
      const channelMatch = newStreamUrl.match(/goodgame\.ru\/([^/?]+)/);
      if (channelMatch) {
        const channelName = channelMatch[1];
        embedUrl = `https://functions.poehali.dev/1c6c72e8-7a72-433e-bd18-5667031c9e3f?channel=${channelName}`;
      }
    } else if (newStreamUrl.includes('vk.com/video') || newStreamUrl.includes('vk.ru/video')) {
      const videoMatch = newStreamUrl.match(/video(-?\d+_\d+)/);
      if (videoMatch) {
        embedUrl = `https://vk.com/video_ext.php?oid=${videoMatch[1].split('_')[0]}&id=${videoMatch[1].split('_')[1]}&hd=2&autoplay=1`;
      }
    } else if (newStreamUrl.includes('ok.ru/video') || newStreamUrl.includes('ok.ru/live')) {
      const videoId = newStreamUrl.split('/').pop()?.split('?')[0];
      embedUrl = `https://ok.ru/videoembed/${videoId}?autoplay=1`;
    } else if (newStreamUrl.includes('kick.com/')) {
      const channelName = newStreamUrl.split('kick.com/')[1]?.split('?')[0].split('/')[0];
      embedUrl = `https://player.kick.com/${channelName}?autoplay=true&muted=false&quality=auto`;
    }

    try {
      const response = await fetch(`${API_URL}?resource=stream`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          url: embedUrl,
          title: newStreamTitle || 'Прямая трансляция',
          sport: newStreamSport || 'Биатлон',
          is_live: true
        })
      });
      
      if (response.status === 401) {
        toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
        handleLogout();
        return;
      }
      
      const data = await response.json();
      setCurrentStream(data.stream);
      
      toast({ title: 'Успешно', description: 'Трансляция обновлена' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить трансляцию', variant: 'destructive' });
    }
  };

  const addScheduleEvent = async (title: string, date: string, time: string, sport: string, desc: string) => {
    if (!title || !date || !time || !sport) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}?resource=schedule`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          event_date: date,
          event_time: time,
          sport,
          description: desc
        })
      });
      
      if (response.status === 401) {
        toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
        handleLogout();
        return;
      }
      
      await loadSchedule();
      toast({ title: 'Успешно', description: 'Событие добавлено' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить событие', variant: 'destructive' });
    }
  };

  const deleteScheduleEvent = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}?resource=schedule&id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
        handleLogout();
        return;
      }
      
      await loadSchedule();
      toast({ title: 'Успешно', description: 'Событие удалено' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить событие', variant: 'destructive' });
    }
  };

  const addNewsPost = async (title: string, content: string, image: string) => {
    if (!title || !content || !image) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}?resource=news`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          content,
          image_url: image
        })
      });
      
      if (response.status === 401) {
        toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
        handleLogout();
        return;
      }
      
      await loadNews();
      toast({ title: 'Успешно', description: 'Новость добавлена' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить новость', variant: 'destructive' });
    }
  };

  const deleteNewsPost = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}?resource=news&id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
        handleLogout();
        return;
      }
      
      await loadNews();
      toast({ title: 'Успешно', description: 'Новость удалена' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить новость', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">Админ-панель</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Icon name="Home" size={20} className="mr-2" />
                На сайт
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <Icon name="LogOut" size={20} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button
              variant={activeSection === 'stream' ? 'default' : 'outline'}
              onClick={() => setActiveSection('stream')}
            >
              <Icon name="Radio" size={20} className="mr-2" />
              Трансляция
            </Button>
            <Button
              variant={activeSection === 'schedule' ? 'default' : 'outline'}
              onClick={() => setActiveSection('schedule')}
            >
              <Icon name="Calendar" size={20} className="mr-2" />
              Расписание
            </Button>
            <Button
              variant={activeSection === 'news' ? 'default' : 'outline'}
              onClick={() => setActiveSection('news')}
            >
              <Icon name="Newspaper" size={20} className="mr-2" />
              Новости
            </Button>
          </div>
        </div>

        {activeSection === 'stream' && (
          <AdminStreamSection currentStream={currentStream} onUpdate={updateStream} />
        )}

        {activeSection === 'schedule' && (
          <AdminScheduleSection 
            scheduleEvents={scheduleEvents}
            onAdd={addScheduleEvent}
            onDelete={deleteScheduleEvent}
          />
        )}

        {activeSection === 'news' && (
          <AdminNewsSection 
            newsPosts={newsPosts}
            onAdd={addNewsPost}
            onDelete={deleteNewsPost}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
