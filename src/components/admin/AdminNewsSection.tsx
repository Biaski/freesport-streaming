import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface NewsPost {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
}

interface AdminNewsSectionProps {
  newsPosts: NewsPost[];
  onAdd: (title: string, content: string, image: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const AdminNewsSection = ({ newsPosts, onAdd, onDelete }: AdminNewsSectionProps) => {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  const handleAdd = async () => {
    await onAdd(newPostTitle, newPostContent, newPostImage);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage('');
  };

  return (
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
        <Button onClick={handleAdd} className="w-full">
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
              onClick={() => onDelete(post.id)}
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
  );
};

export default AdminNewsSection;
