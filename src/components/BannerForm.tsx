import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TextAlignment = "start" | "center" | "end";

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
  titleFontSize: number;
  setTitleFontSize: (value: number) => void;
  titleLineHeight: number;
  setTitleLineHeight: (value: number) => void;
  subtitleFontSize: number;
  setSubtitleFontSize: (value: number) => void;
  subtitleLineHeight: number;
  setSubtitleLineHeight: (value: number) => void;
  textAlignment: TextAlignment;
  setTextAlignment: (value: TextAlignment) => void;
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
  titleFontSize,
  setTitleFontSize,
  titleLineHeight,
  setTitleLineHeight,
  subtitleFontSize,
  setSubtitleFontSize,
  subtitleLineHeight,
  setSubtitleLineHeight,
  textAlignment,
  setTextAlignment,
}: BannerFormProps) => {
  return (
    <div className="space-y-4">
      {/* Color picker */}
      <ColorPicker
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        gradientEnd={gradientEnd}
        setGradientEnd={setGradientEnd}
        useGradient={useGradient}
        setUseGradient={setUseGradient}
      />

      {/* Text alignment */}
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium text-foreground">Выравнивание</Label>
        <ToggleGroup
          type="single"
          value={textAlignment}
          onValueChange={(value) => value && setTextAlignment(value as TextAlignment)}
          className="justify-start"
        >
          <ToggleGroupItem value="start" aria-label="Сверху" className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <AlignVerticalJustifyStart className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="По центру" className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <AlignVerticalJustifyCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="end" aria-label="Снизу" className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <AlignVerticalJustifyEnd className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Title input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Заголовок</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={titleFontSize}
              onChange={(e) => setTitleFontSize(Number(e.target.value))}
              min={12}
              max={48}
              className="w-14 h-7 bg-input border-border text-foreground text-xs text-center"
              title="Размер шрифта"
            />
            <span className="text-muted-foreground text-xs">/</span>
            <Input
              type="number"
              value={titleLineHeight}
              onChange={(e) => setTitleLineHeight(Number(e.target.value))}
              min={12}
              max={60}
              className="w-14 h-7 bg-input border-border text-foreground text-xs text-center"
              title="Высота строки"
            />
          </div>
        </div>
        <Textarea
          placeholder="Впишите ваш заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          rows={2}
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Subtitle input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Подзаголовок</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={subtitleFontSize}
              onChange={(e) => setSubtitleFontSize(Number(e.target.value))}
              min={10}
              max={36}
              className="w-14 h-7 bg-input border-border text-foreground text-xs text-center"
              title="Размер шрифта"
            />
            <span className="text-muted-foreground text-xs">/</span>
            <Input
              type="number"
              value={subtitleLineHeight}
              onChange={(e) => setSubtitleLineHeight(Number(e.target.value))}
              min={10}
              max={48}
              className="w-14 h-7 bg-input border-border text-foreground text-xs text-center"
              title="Высота строки"
            />
          </div>
        </div>
        <Textarea
          placeholder="Впишите ваш подзаголовок"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          maxLength={200}
          rows={2}
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Image prompt */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground">
          Опишите изображение для баннера
        </Label>
        <Textarea
          placeholder="Промт для изображения"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          rows={3}
          className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground"
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
