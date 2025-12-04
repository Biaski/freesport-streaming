import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [passwordInput, setPasswordInput] = useState('');

  const handleLogin = () => {
    onLogin(passwordInput);
    setPasswordInput('');
  };

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
};

export default AdminLogin;
