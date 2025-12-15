import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { ColorPicker } from "./ColorPicker";

interface BannerFormProps {
  title: string;
  setTitle: (value: string) => void;
  subtitle: string;
  setSubtitle: (value: string) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  gradientEnd: string;
  setGradientEnd: (value: string) => void;
  useGradient: boolean;
  setUseGradient: (value: boolean) => void;
  imagePrompt: string;
  setImagePrompt: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const BannerForm = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  backgroundColor,
  setBackgroundColor,
  gradientEnd,
  setGradientEnd,
  useGradient,
  setUseGradient,
  imagePrompt,
  setImagePrompt,
  onGenerate,
  isGenerating,
}: BannerFormProps) => {
  return (
    <div className="space-y-6">
      {/* Color picker */}
      <ColorPicker
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        gradientEnd={gradientEnd}
        setGradientEnd={setGradientEnd}
        useGradient={useGradient}
        setUseGradient={setUseGradient}
      />

      {/* Title input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Заголовок</Label>
        <Textarea
          placeholder="Впишите ваш заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[70px]"
        />
        <p className="text-xs text-muted-foreground">Max: 200</p>
      </div>

      {/* Subtitle input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Подзаголовок</Label>
        <Textarea
          placeholder="Впишите ваш подзаголовок"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          maxLength={200}
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[70px]"
        />
        <p className="text-xs text-muted-foreground">Max: 200</p>
      </div>

      {/* Image prompt */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Опишите изображение для баннера
        </Label>
        <Textarea
          placeholder="Промт для изображения"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
        />
      </div>

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all duration-200"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Генерация...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Сгенерировать
          </>
        )}
      </Button>
    </div>
  );
};
