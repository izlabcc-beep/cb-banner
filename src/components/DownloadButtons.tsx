import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonsProps {
  onDownload: (scale: number) => void;
  disabled: boolean;
}

export const DownloadButtons = ({ onDownload, disabled }: DownloadButtonsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => onDownload(1)}
        disabled={disabled}
        className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
      >
        <Download className="w-4 h-4 mr-2" />
        Скачать x1
      </Button>
      <Button
        variant="outline"
        onClick={() => onDownload(2)}
        disabled={disabled}
        className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
      >
        <Download className="w-4 h-4 mr-2" />
        Скачать x2
      </Button>
    </div>
  );
};
