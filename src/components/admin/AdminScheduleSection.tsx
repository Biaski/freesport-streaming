import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ScheduleEvent {
  id: number;
  title: string;
  event_date: string;
  event_time: string;
  sport: string;
  description?: string;
}

interface AdminScheduleSectionProps {
  scheduleEvents: ScheduleEvent[];
  onAdd: (title: string, date: string, time: string, sport: string, desc: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const AdminScheduleSection = ({ scheduleEvents, onAdd, onDelete }: AdminScheduleSectionProps) => {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventSport, setNewEventSport] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const handleAdd = async () => {
    await onAdd(newEventTitle, newEventDate, newEventTime, newEventSport, newEventDesc);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventSport('');
    setNewEventDesc('');
  };

  return (
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
        <Button onClick={handleAdd} className="w-full">
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
              onClick={() => onDelete(event.id)}
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
  );
};

export default AdminScheduleSection;
