import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface BannerFormProps {
  title: string;
  setTitle: (value: string) => void;
  subtitle: string;
  setSubtitle: (value: string) => void;
  gradient: string;
  setGradient: (value: string) => void;
  imagePrompt: string;
  setImagePrompt: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const gradientOptions = [
  { value: "blue", label: "Синий градиент", preview: "banner-gradient-blue" },
  { value: "purple", label: "Фиолетовый градиент", preview: "banner-gradient-purple" },
  { value: "green", label: "Зелёный градиент", preview: "banner-gradient-green" },
  { value: "orange", label: "Оранжевый градиент", preview: "banner-gradient-orange" },
  { value: "pink", label: "Розовый градиент", preview: "banner-gradient-pink" },
  { value: "dark", label: "Тёмный градиент", preview: "banner-gradient-dark" },
];

export const BannerForm = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  gradient,
  setGradient,
  imagePrompt,
  setImagePrompt,
  onGenerate,
  isGenerating,
}: BannerFormProps) => {
  return (
    <div className="space-y-6">
      {/* Background color selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Цвет фона</Label>
        <Select value={gradient} onValueChange={setGradient}>
          <SelectTrigger className="w-full bg-input border-border text-foreground">
            <SelectValue placeholder="Выбрать цвет" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {gradientOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-foreground focus:bg-muted focus:text-foreground"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded ${option.preview}`}
                  />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Заголовок</Label>
        <Textarea
          placeholder="Впишите ваш заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[60px]"
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
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[60px]"
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
