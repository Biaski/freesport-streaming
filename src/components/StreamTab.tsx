import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Stream {
  id: number;
  title: string;
  url: string;
  is_live: boolean;
  sport?: string;
}

interface StreamTabProps {
  currentStream: Stream | null;
}

const StreamTab = ({ currentStream }: StreamTabProps) => {
  if (!currentStream) return null;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div 
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
        onContextMenu={handleContextMenu}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
      >
        {currentStream.is_live && (
          <Badge className="absolute top-4 left-4 z-10 bg-red-600 hover:bg-red-600">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            LIVE
          </Badge>
        )}
        
        <iframe
          src={currentStream.url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-presentation allow-forms"
          referrerPolicy="no-referrer"
          title="Live Stream Player"
          style={{ 
            border: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        ></iframe>
        
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{ 
            background: 'linear-gradient(to bottom, transparent 0%, transparent 85%, rgba(0,0,0,0.2) 100%)',
            touchAction: 'manipulation'
          }}
        ></div>
        
        <style dangerouslySetInnerHTML={{__html: `
          iframe {
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
          }
          @media (max-width: 768px) {
            iframe {
              width: 100% !important;
              height: 100% !important;
            }
          }
        `}} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">{currentStream.title}</h2>
            {currentStream.sport && (
              <Badge variant="outline" className="text-lg px-4 py-1">
                <Icon name="Trophy" size={18} className="mr-2" />
                {currentStream.sport}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Наслаждайтесь просмотром спортивных трансляций в высоком качестве
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamTab;