
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface StudyMaterialButtonProps {
  materialUrl?: string;
  lessonTitle?: string;
}

export const StudyMaterialButton = ({ materialUrl, lessonTitle }: StudyMaterialButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!materialUrl || materialUrl.trim() === '') {
    return null;
  }

  const getDirectDownloadUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }
    return url;
  };

  const handleDownload = async () => {
    if (!materialUrl) return;

    setIsDownloading(true);
    
    try {
      const downloadUrl = getDirectDownloadUrl(materialUrl);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Material - ${lessonTitle || 'Aula'}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download do material iniciado!');
    } catch (error) {
      console.error('Error downloading material:', error);
      window.open(materialUrl, '_blank');
      toast.info('Material aberto em nova aba');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="fixed bottom-28 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in rounded-full w-14 h-14 p-0 border-2 border-white/20"
      size="lg"
    >
      {isDownloading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
      ) : (
        <FileDown className="h-5 w-5" />
      )}
    </Button>
  );
};
