import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, RotateCcw, RotateCw, X, Upload, Trash2, Check, ArrowLeftRight, FolderOpen, Scissors } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Template } from "./TemplatesDialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { THEMES, ThemeId } from "@/constants/themes";
import { cn } from "@/lib/utils";

export type TextAlignment = "start" | "center" | "end";

interface BannerFormProps {
  title: string;
  setTitle: (value: string) => void;
  subtitle: string;
  setSubtitle: (value: string) => void;

  // Theme props
  currentTheme: ThemeId;
  setTheme: (value: ThemeId) => void;

  imagePrompt: string;
  setImagePrompt: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;

  // Title Size props only
  titleFontSize: number;
  setTitleFontSize: (value: number) => void;
  titleLineHeight: number;
  setTitleLineHeight: (value: number) => void;

  hasSubtitleBackground: boolean;
  setHasSubtitleBackground: (value: boolean) => void;
  subtitleRotation: number;
  setSubtitleRotation: (value: number) => void;

  // Removed textAlignment prop as it is fixed to center

  onReset: () => void;
  activeTab: "generate" | "upload";
  setActiveTab: (value: "generate" | "upload") => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedImage?: string;
  onRemoveImage?: () => void;
  onRemoveBackground?: () => void;
  isRemovingBackground?: boolean;
  imageScale: number;
  setImageScale: (value: number) => void;
  imagePanX: number;
  setImagePanX: (value: number) => void;
  imagePanY: number;
  setImagePanY: (value: number) => void;
  imageFlipX: boolean;
  setImageFlipX: (value: boolean) => void;
  imageRotation: number;
  setImageRotation: (value: number) => void;
  generatedImage?: string;
  onClearGeneratedImage: () => void;

  templates: Template[];
  onSaveTemplate: (name: string) => void;
  onLoadTemplate: (template: Template) => void;
  onDeleteTemplate: (id: string) => void;
  onOpenTemplates: () => void;
}



export const BannerForm = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  currentTheme,
  setTheme,
  imagePrompt,
  setImagePrompt,
  onGenerate,
  isGenerating,
  titleFontSize,
  setTitleFontSize,
  titleLineHeight,
  setTitleLineHeight,
  hasSubtitleBackground,
  setHasSubtitleBackground,
  subtitleRotation,
  setSubtitleRotation,
  // textAlignment removed
  onReset,
  activeTab,
  setActiveTab,
  onFileUpload,
  uploadedImage,
  onRemoveImage,
  onRemoveBackground,
  isRemovingBackground,
  imageScale,
  setImageScale,
  imagePanX,
  setImagePanX,
  imagePanY,
  setImagePanY,
  imageFlipX,
  setImageFlipX,
  imageRotation,
  setImageRotation,
  generatedImage,
  onClearGeneratedImage,
  templates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onOpenTemplates,
}: BannerFormProps) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (element: HTMLTextAreaElement | null) => {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight(titleRef.current);
  }, [title]);

  useEffect(() => {
    adjustHeight(subtitleRef.current);
  }, [subtitle]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    setValue: (value: string) => void,
    value: string
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = value.substring(0, start) + "\n" + value.substring(end);
      setValue(newValue);

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };



  return (
    <div className="flex flex-col gap-4">
      {/* Theme Picker */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">Выберите тему</Label>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.values(THEMES).map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={cn(
                "relative w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                currentTheme === theme.id
                  ? "border-primary shadow-md"
                  : "border-border/50 hover:border-border"
              )}
              style={{
                background: `linear-gradient(135deg, ${theme.backgroundStart} 0%, ${theme.backgroundEnd} 100%)`
              }}
              title={theme.name}
            >
              {currentTheme === theme.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className={cn(
                    "w-6 h-6 drop-shadow-md",
                    // Adjust checkmark color for better contrast
                    theme.id === 'white' ? "text-black" : "text-white"
                  )} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Title input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Заголовок</Label>
          <div className="flex gap-2 items-center">
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
              className="gap-1"
            >
              <ToggleGroupItem
                value="M"
                size="sm"
                className="h-8 w-8 rounded-[4px] p-0 text-[20px] font-medium border border-input hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                M
              </ToggleGroupItem>
              <ToggleGroupItem
                value="L"
                size="sm"
                className="h-8 w-8 rounded-[8px] p-0 text-[20px] font-medium border border-input hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                L
              </ToggleGroupItem>
              <ToggleGroupItem
                value="X"
                size="sm"
                className="h-8 w-8 rounded-[8px] p-0 text-[20px] font-medium border border-input hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                X
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <Textarea
          ref={titleRef}
          placeholder="Впишите ваш заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
          onKeyDown={(e) => handleKeyDown(e, setTitle, title)}
          maxLength={200}
          rows={1}
          className="min-h-[40px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground overflow-hidden"
        />
      </div>

      {/* Subtitle input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Подзаголовок</Label>
        </div>
        <Textarea
          ref={subtitleRef}
          placeholder="Впишите ваш подзаголовок"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
          onKeyDown={(e) => handleKeyDown(e, setSubtitle, subtitle)}
          maxLength={200}
          rows={1}
          className="min-h-[40px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground overflow-hidden"
        />
      </div>

      {/* Subtitle Background Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">Подложка</Label>
        <div className="flex items-center gap-2">
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
            className="justify-end gap-1"
          >
            <ToggleGroupItem
              value="-2"
              aria-label="Повернуть против часовой"
              className="h-8 w-8 rounded-[8px] p-0 border border-input hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <RotateCcw className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="0"
              aria-label="Не поворачивать"
              className="h-8 w-8 rounded-[8px] p-0 border border-input hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <X className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="2"
              aria-label="Повернуть по часовой"
              className="h-8 w-8 rounded-[8px] p-0 border border-input hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <RotateCw className="h-5 w-5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <Separator />

      {/* Image Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generate" | "upload")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="generate">Сгенерировать</TabsTrigger>
          <TabsTrigger value="upload">Загрузить</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Описание изображения</Label>
            <Textarea
              id="prompt"
              placeholder="Опишите, что должно быть на фоне баннера..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <Button
            onClick={generatedImage ? onClearGeneratedImage : onGenerate}
            disabled={isGenerating || (!imagePrompt && !generatedImage)}
            variant={generatedImage ? "destructive" : "default"}
            className="w-full h-12 font-semibold rounded-full transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Генерация...
              </>
            ) : generatedImage ? (
              <>
                <Trash2 className="mr-2 h-5 w-5" />
                Очистить и создать новое
              </>
            ) : (
              "Сгенерировать"
            )}
          </Button>
        </TabsContent>
        <TabsContent value="upload" className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="upload-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors relative"
            >
              {uploadedImage ? (
                <>
                  <div className="absolute inset-0 w-full h-full opacity-10 bg-center bg-cover rounded-lg" style={{ backgroundImage: `url(${uploadedImage})` }} />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-foreground font-medium">
                      Нажмите чтобы заменить
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Нажмите для загрузки</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                </div>
              )}
              <Input
                id="upload-file"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onFileUpload}
              />
            </Label>
          </div>

          {uploadedImage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onRemoveBackground}
                disabled={isRemovingBackground}
                className="flex-1"
              >
                {isRemovingBackground ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4 mr-2" />
                    Вырезать фон
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={onRemoveImage || (() => { })}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Adjustments */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <Label>Масштаб</Label>
              <div className="flex items-center gap-1">
                <Button
                  variant={imageFlipX ? "default" : "outline"}
                  size="icon"
                  className="h-6 w-6 rounded-[8px]"
                  onClick={() => setImageFlipX(!imageFlipX)}
                  title="Отразить горизонтально"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-[8px]"
                  onClick={() => setImageScale(1)}
                  title="Сбросить масштаб"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground text-xs w-8 text-right">{imageScale.toFixed(2)}x</span>
              </div>
            </div>
            <Slider
              value={[imageScale]}
              onValueChange={(value) => setImageScale(value[0])}
              min={0.05}
              max={3}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <Label>Поворот</Label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-[8px]"
                  onClick={() => setImageRotation(0)}
                  title="Сбросить поворот"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground text-xs w-8 text-right">{imageRotation}°</span>
              </div>
            </div>
            <Slider
              value={[imageRotation]}
              onValueChange={(value) => setImageRotation(value[0])}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <Label>Позиция по X</Label>
              <span className="text-muted-foreground text-xs">{imagePanX}px</span>
            </div>
            <Slider
              value={[imagePanX]}
              onValueChange={(value) => setImagePanX(value[0])}
              min={-200}
              max={200}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <Label>Позиция по Y</Label>
              <span className="text-muted-foreground text-xs">{imagePanY}px</span>
            </div>
            <Slider
              value={[imagePanY]}
              onValueChange={(value) => setImagePanY(value[0])}
              min={-200}
              max={200}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onReset}
        disabled={isGenerating}
        className="w-full h-12 font-semibold rounded-full transition-all duration-200"
      >
        Очистить форму
      </Button>
    </div >
  );
};
