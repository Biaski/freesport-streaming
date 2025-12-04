import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Stream {
  id: number;
  title: string;
  url: string;
  is_live: boolean;
  sport?: string;
}

interface AdminStreamSectionProps {
  currentStream: Stream | null;
  onUpdate: (url: string, title: string, sport: string) => Promise<void>;
}

const AdminStreamSection = ({ currentStream, onUpdate }: AdminStreamSectionProps) => {
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [newStreamTitle, setNewStreamTitle] = useState(currentStream?.title || '');
  const [newStreamSport, setNewStreamSport] = useState(currentStream?.sport || '');

  const handleUpdate = async () => {
    await onUpdate(newStreamUrl, newStreamTitle, newStreamSport);
    setNewStreamUrl('');
  };

  return (
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
        
        <Button onClick={handleUpdate} className="w-full">
          <Icon name="Upload" size={20} className="mr-2" />
          Обновить трансляцию
        </Button>
      </div>
    </div>
  );
};

export default AdminStreamSection;
