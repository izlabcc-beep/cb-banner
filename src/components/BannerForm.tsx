import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, RotateCcw, RotateCw, X, Bold } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

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
  titleColor: string;
  setTitleColor: (value: string) => void;
  subtitleFontSize: number;
  setSubtitleFontSize: (value: number) => void;
  subtitleLineHeight: number;
  setSubtitleLineHeight: (value: number) => void;
  subtitleColor: string;
  setSubtitleColor: (value: string) => void;
  hasSubtitleBackground: boolean;
  setHasSubtitleBackground: (value: boolean) => void;
  subtitleBackgroundColor: string;
  setSubtitleBackgroundColor: (value: string) => void;
  subtitleRotation: number;
  setSubtitleRotation: (value: number) => void;
  subtitleIsBold: boolean;
  setSubtitleIsBold: (value: boolean) => void;
  textAlignment: TextAlignment;
  setTextAlignment: (value: TextAlignment) => void;
  textGap: number;
  setTextGap: (value: number) => void;
  onReset: () => void;
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
  titleColor,
  setTitleColor,
  subtitleFontSize,
  setSubtitleFontSize,
  subtitleLineHeight,
  setSubtitleLineHeight,
  subtitleColor,
  setSubtitleColor,
  hasSubtitleBackground,
  setHasSubtitleBackground,
  subtitleBackgroundColor,
  setSubtitleBackgroundColor,
  subtitleRotation,
  setSubtitleRotation,
  subtitleIsBold,
  setSubtitleIsBold,
  textAlignment,
  setTextAlignment,
  textGap,
  setTextGap,
  onReset,
}: BannerFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Color picker */}
      <ColorPicker
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        gradientEnd={gradientEnd}
        setGradientEnd={setGradientEnd}
        useGradient={useGradient}
        setUseGradient={setUseGradient}
      />

      <Separator />

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
        <div className="flex items-center gap-1 ml-auto">
          <Label className="text-xs text-muted-foreground">Отступ</Label>
          <Input
            type="number"
            value={textGap}
            onChange={(e) => setTextGap(Number(e.target.value))}
            min={0}
            max={48}
            className="w-16 h-7 bg-input border-border text-foreground text-xs text-center"
            title="Отступ между заголовком и подзаголовком"
          />
        </div>
      </div>

      {/* Title input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Заголовок</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
              title="Цвет текста"
            />
            <Input
              value={titleColor}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith('#') && /^[0-9A-Fa-f]{0,6}$/.test(value)) {
                  value = '#' + value;
                }
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setTitleColor(value);
                }
              }}
              maxLength={7}
              className="w-20 h-7 px-2 text-xs"
              placeholder="#000000"
            />
            <ToggleGroup
              type="single"
              value={
                titleFontSize === 30 ? "M" :
                  titleFontSize === 34 ? "L" :
                    titleFontSize === 38 ? "X" : ""
              }
              onValueChange={(value) => {
                if (!value) return;
                if (value === "M") {
                  setTitleFontSize(30);
                  setTitleLineHeight(28);
                } else if (value === "L") {
                  setTitleFontSize(34);
                  setTitleLineHeight(32);
                } else if (value === "X") {
                  setTitleFontSize(38);
                  setTitleLineHeight(36);
                }
              }}
              className="h-7"
            >
              <ToggleGroupItem value="M" size="sm" className="h-7 w-7 px-0 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                M
              </ToggleGroupItem>
              <ToggleGroupItem value="L" size="sm" className="h-7 w-7 px-0 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                L
              </ToggleGroupItem>
              <ToggleGroupItem value="X" size="sm" className="h-7 w-7 px-0 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                X
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <Textarea
          placeholder="Впишите ваш заголовок"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          maxLength={200}
          rows={1}
          className="min-h-[40px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground overflow-hidden"
        />
      </div>

      {/* Subtitle input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Подзаголовок</Label>
          <div className="flex gap-2 items-center">
            <Button
              variant={subtitleIsBold ? "default" : "outline"}
              size="icon"
              className="h-7 w-7 p-0"
              onClick={() => setSubtitleIsBold(!subtitleIsBold)}
              title="Полужирный шрифт"
            >
              <Bold className="h-3 w-3" />
            </Button>
            <input
              type="color"
              value={subtitleColor}
              onChange={(e) => setSubtitleColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
              title="Цвет текста"
            />
            <Input
              value={subtitleColor}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith('#') && /^[0-9A-Fa-f]{0,6}$/.test(value)) {
                  value = '#' + value;
                }
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setSubtitleColor(value);
                }
              }}
              maxLength={7}
              className="w-20 h-7 px-2 text-xs"
              placeholder="#000000"
            />
            <ToggleGroup
              type="single"
              value={
                subtitleFontSize === 20 ? "M" :
                  subtitleFontSize === 24 ? "L" :
                    subtitleFontSize === 26 ? "X" : ""
              }
              onValueChange={(value) => {
                if (!value) return;
                if (value === "M") {
                  setSubtitleFontSize(20);
                  setSubtitleLineHeight(20);
                } else if (value === "L") {
                  setSubtitleFontSize(24);
                  setSubtitleLineHeight(28);
                } else if (value === "X") {
                  setSubtitleFontSize(26);
                  setSubtitleLineHeight(30);
                }
              }}
              className="h-7"
            >
              <ToggleGroupItem value="M" size="sm" className="h-7 w-7 px-0 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                M
              </ToggleGroupItem>
              <ToggleGroupItem value="L" size="sm" className="h-7 w-7 px-0 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                L
              </ToggleGroupItem>
              <ToggleGroupItem value="X" size="sm" className="h-7 w-7 px-0 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                X
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <Textarea
          placeholder="Впишите ваш подзаголовок"
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          maxLength={200}
          rows={1}
          className="min-h-[40px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground overflow-hidden"
        />
      </div>

      {/* Subtitle Background Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">Подложка</Label>
        <div className="flex items-center gap-2">
          {hasSubtitleBackground && (
            <div className="flex gap-1.5 items-center animate-in fade-in zoom-in duration-200">
              <input
                type="color"
                value={subtitleBackgroundColor}
                onChange={(e) => setSubtitleBackgroundColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                title="Цвет подложки"
              />
              <Input
                value={subtitleBackgroundColor}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value && !value.startsWith('#') && /^[0-9A-Fa-f]/.test(value)) {
                    value = '#' + value;
                  }
                  setSubtitleBackgroundColor(value);
                }}
                className="w-20 h-7 bg-input border-border text-foreground text-xs uppercase"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          )}
          <Switch
            checked={hasSubtitleBackground}
            onCheckedChange={setHasSubtitleBackground}
          />
        </div>
      </div>


      {/* Subtitle Rotation */}
      {hasSubtitleBackground && (
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <Label className="text-sm font-medium text-foreground">Поворот</Label>
          <ToggleGroup
            type="single"
            value={subtitleRotation.toString()}
            onValueChange={(value) => {
              if (value) setSubtitleRotation(Number(value));
            }}
            className="justify-end"
          >
            <ToggleGroupItem value="-2" aria-label="Повернуть против часовой" className="h-8 w-8 px-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <RotateCcw className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="0" aria-label="Не поворачивать" className="h-8 w-8 px-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <X className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="2" aria-label="Повернуть по часовой" className="h-8 w-8 px-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <RotateCw className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <Separator />

      {/* Image prompt */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground">
          Опишите изображение для баннера
        </Label>
        <Textarea
          placeholder="Промт для изображения"
          value={imagePrompt}
          onChange={(e) => {
            setImagePrompt(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          rows={1}
          className="min-h-[40px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground overflow-hidden"
        />
      </div>


      <div className="flex flex-col gap-1">
        {/* Generate button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full h-12 font-semibold rounded-full transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Генерация...
            </>
          ) : (
            "Сгенерировать"
          )}
        </Button>

        {/* Reset button */}
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isGenerating}
          className="w-full h-12 font-semibold rounded-full transition-all duration-200"
        >
          Очистить форму
        </Button>
      </div>
    </div>
  );
};
