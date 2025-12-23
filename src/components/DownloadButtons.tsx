import { Button } from "@/components/ui/button";
import { Download, Save, Image } from "lucide-react";

interface DownloadButtonsProps {
  onDownload: (scale: number) => void;
  onSave: () => void;
  onDownloadImage: () => void;
  disabled: boolean;
}

export const DownloadButtons = ({ onDownload, onSave, onDownloadImage, disabled }: DownloadButtonsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 w-full">
      <Button
        variant="outline"
        onClick={onDownloadImage}
        disabled={disabled}
        className="flex-1 px-6 min-w-fit justify-center border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
      >
        <Image className="w-4 h-4 mr-2" />
        Скачать фото
      </Button>

      <Button
        variant="outline"
        onClick={() => onDownload(1)}
        disabled={disabled}
        className="flex-1 px-6 min-w-fit justify-center border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
      >
        <Download className="w-4 h-4 mr-2" />
        x1
      </Button>

      <Button
        variant="outline"
        onClick={() => onDownload(2)}
        disabled={disabled}
        className="flex-1 px-6 min-w-fit justify-center border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
      >
        <Download className="w-4 h-4 mr-2" />
        x2
      </Button>

      <Button
        onClick={onSave}
        disabled={disabled}
        className="flex-1 px-6 min-w-fit justify-center whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
      >
        <Save className="w-4 h-4 mr-2" />
        Сохранить баннер
      </Button>
    </div>
  );
};
