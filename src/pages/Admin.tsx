import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

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
  const [passwordInput, setPasswordInput] = useState('');
  const [activeSection, setActiveSection] = useState<'stream' | 'schedule' | 'news'>('stream');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Stream state
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [newStreamTitle, setNewStreamTitle] = useState('');
  const [newStreamSport, setNewStreamSport] = useState('');

  // Schedule state
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventSport, setNewEventSport] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // News state
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

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

  const handleLogin = () => {
    if (!passwordInput.trim()) {
      toast({ title: 'Ошибка', description: 'Введите пароль', variant: 'destructive' });
      return;
    }
    localStorage.setItem('admin_password', passwordInput);
    setIsAuthenticated(true);
    setPasswordInput('');
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
        setNewStreamTitle(data.stream.title);
        setNewStreamSport(data.stream.sport || '');
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

  const updateStream = async () => {
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
      setNewStreamUrl('');
      
      toast({ title: 'Успешно', description: 'Трансляция обновлена' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить трансляцию', variant: 'destructive' });
    }
  };

  const addScheduleEvent = async () => {
    if (!newEventTitle || !newEventDate || !newEventTime || !newEventSport) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}?resource=schedule`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newEventTitle,
          event_date: newEventDate,
          event_time: newEventTime,
          sport: newEventSport,
          description: newEventDesc
        })
      });
      
      if (response.status === 401) {
        toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
        handleLogout();
        return;
      }
      
      await loadSchedule();
      setNewEventTitle('');
      setNewEventDate('');
      setNewEventTime('');
      setNewEventSport('');
      setNewEventDesc('');
      
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

  const addNewsPost = async () => {
    if (!newPostTitle || !newPostContent || !newPostImage) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}?resource=news`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          image_url: newPostImage
        })
      });
      
      if (response.status === 401) {
        toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
        handleLogout();
        return;
      }
      
      await loadNews();
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImage('');
      
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Icon name="Lock" size={48} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Админ-панель</h1>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
          </div>
        </div>
      </div>
    );
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
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Управление трансляцией</h2>
            
            {currentStream && (
              <div className="bg-secondary/10 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">Текущая трансляция:</p>
                <p className="font-bold">{currentStream.title}</p>
                <p className="text-sm text-gray-600">{currentStream.sport}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL трансляции</label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={newStreamUrl}
                  onChange={(e) => setNewStreamUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Поддерживается: YouTube, Twitch, VK, OK, Goodgame, Kick, Tach
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <Input
                  placeholder="Биатлон: Кубок мира"
                  value={newStreamTitle}
                  onChange={(e) => setNewStreamTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Вид спорта</label>
                <Input
                  placeholder="Биатлон"
                  value={newStreamSport}
                  onChange={(e) => setNewStreamSport(e.target.value)}
                />
              </div>
              
              <Button onClick={updateStream} className="w-full">
                <Icon name="Upload" size={20} className="mr-2" />
                Обновить трансляцию
              </Button>
            </div>
          </div>
        )}

        {activeSection === 'schedule' && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Управление расписанием</h2>
            
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Название события"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                />
                <Input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                />
              </div>
              <Input
                placeholder="Вид спорта"
                value={newEventSport}
                onChange={(e) => setNewEventSport(e.target.value)}
              />
              <Textarea
                placeholder="Описание (необязательно)"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
              />
              <Button onClick={addScheduleEvent} className="w-full">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить событие
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold mb-2">Список событий</h3>
              {scheduleEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {event.event_date} в {event.event_time} • {event.sport}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteScheduleEvent(event.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
              {scheduleEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">Нет событий</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'news' && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Управление новостями</h2>
            
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Заголовок новости"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="Текст новости"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
              <Input
                placeholder="URL изображения"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
              />
              <Button onClick={addNewsPost} className="w-full">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить новость
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold mb-2">Список новостей</h3>
              {newsPosts.map((post) => (
                <div key={post.id} className="flex items-start justify-between p-3 bg-secondary/10 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.published_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNewsPost(post.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
              {newsPosts.length === 0 && (
                <p className="text-gray-500 text-center py-4">Нет новостей</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
