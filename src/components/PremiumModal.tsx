import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal = ({ isOpen, onClose }: PremiumModalProps) => {
  const handleVerVantagens = () => {
    window.location.href = 'https://app-premium-ten.vercel.app/';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-gradient-to-b from-amber-900/90 to-amber-950/90 border-amber-700/50 text-center p-8 rounded-2xl">
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 text-amber-200 hover:text-white hover:bg-amber-800/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-yellow-500 rounded-full p-4">
            <Star className="h-8 w-8 text-black fill-black" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-yellow-400">
              Quase lá! ☀️
            </h2>
            <p className="text-amber-200 text-sm leading-relaxed">
              Falta só virar Premium para usar esse recurso.
            </p>
          </div>
          
          <Button 
            onClick={handleVerVantagens}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl"
          >
            Ver Vantagens
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};