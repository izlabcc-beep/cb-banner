import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, RotateCcw, RotateCw, X, Bold, Upload, Trash2 } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

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
  activeTab: "generate" | "upload";
  setActiveTab: (value: "generate" | "upload") => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedImage?: string;
  onRemoveImage?: () => void;
  imageScale: number;
  setImageScale: (value: number) => void;
  imagePanX: number;
  setImagePanX: (value: number) => void;
  imagePanY: number;
  setImagePanY: (value: number) => void;
  imageFlipX: boolean;
  setImageFlipX: (value: boolean) => void;
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
  activeTab,
  setActiveTab,
  onFileUpload,
  uploadedImage,
  onRemoveImage,
  imageScale,
  setImageScale,
  imagePanX,
  setImagePanX,
  imagePanY,
  setImagePanY,
  imageFlipX,
  setImageFlipX,
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
            onClick={onGenerate}
            disabled={isGenerating || !imagePrompt}
            className="w-full h-12 font-semibold rounded-full transition-all duration-200"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Генерация..." : "Сгенерировать"}
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
            <Button
              variant="destructive"
              onClick={onRemoveImage}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить изображение
            </Button>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Adjustments */}
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <Label>Масштаб изображения</Label>
            <div className="flex items-center gap-2">
              <Button
                variant={imageFlipX ? "default" : "outline"}
                size="sm"
                onClick={() => setImageFlipX(!imageFlipX)}
                className="h-7 px-2 text-xs"
              >
                Отразить
              </Button>
              <span className="text-muted-foreground text-xs">{imageScale.toFixed(2)}x</span>
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
    </div>

  );
};
