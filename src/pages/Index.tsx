import { useState, useRef, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { BannerForm, TextAlignment } from "@/components/BannerForm";
import { BannerPreview } from "@/components/BannerPreview";
import { generateImage } from "@/services/imageService";
import { removeBackground } from "@/services/imageService";
import { Template, TemplatesDialog } from "@/components/TemplatesDialog";
import { DownloadButtons } from "@/components/DownloadButtons";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { THEMES, ThemeId } from "@/constants/themes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  // Constants for fixed values
  const FIXED_SUBTITLE_FONT_SIZE = 20;
  const FIXED_SUBTITLE_LINE_HEIGHT = 20;
  const FIXED_TEXT_GAP = 12;
  const FIXED_TEXT_ALIGNMENT: TextAlignment = "center";

  // Default state for reset and initial load
  const DEFAULT_STATE = {
    title: "",
    subtitle: "",
    currentTheme: "white" as ThemeId,
    imagePrompt: "",
    titleFontSize: 34,
    titleLineHeight: 32,
    hasSubtitleBackground: false,
    subtitleRotation: 0,
    generatedImageScale: 1,
    generatedImagePanX: 0,
    generatedImagePanY: 0,
    generatedImageFlipX: false,
    uploadedImageScale: 1,
    uploadedImagePanX: 0,
    uploadedImagePanY: 0,
    uploadedImageFlipX: false,
    generatedImageRotation: 0,
    uploadedImageRotation: 0,
    generatedImage: undefined as string | undefined, // Add generatedImage to persisted state
  };

  // Load state from localStorage or use defaults
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("banner-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure theme is valid, default to white if not
        const themeId = parsed.currentTheme && THEMES[parsed.currentTheme as ThemeId]
          ? parsed.currentTheme
          : DEFAULT_STATE.currentTheme;

        return { ...DEFAULT_STATE, ...parsed, currentTheme: themeId };
      } catch (e) {
        console.error("Failed to parse saved state", e);
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  // Templates state
  const [savedTemplates, setSavedTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem("banner-templates");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse templates", e);
        return [];
      }
    }
    return [];
  });

  // Track currently loaded template
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);
  const [isOverwriteAlertOpen, setIsOverwriteAlertOpen] = useState(false);
  const [templatesDialogMode, setTemplatesDialogMode] = useState<"list" | "save">("list");
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("banner-templates", JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  const [title, setTitle] = useState(state.title);
  const [subtitle, setSubtitle] = useState(state.subtitle);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(state.currentTheme);
  const [imagePrompt, setImagePrompt] = useState(state.imagePrompt);

  // Persisted state
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(state.generatedImage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "upload">("generate");
  const [uploadedImage, setUploadedImage] = useState<string | undefined>();

  // Image adjustments - separate for generated and uploaded
  const [generatedImageScale, setGeneratedImageScale] = useState(state.generatedImageScale || 1);
  const [generatedImagePanX, setGeneratedImagePanX] = useState(state.generatedImagePanX || 0);
  const [generatedImagePanY, setGeneratedImagePanY] = useState(state.generatedImagePanY || 0);
  const [generatedImageFlipX, setGeneratedImageFlipX] = useState(state.generatedImageFlipX || false);
  const [uploadedImageScale, setUploadedImageScale] = useState(state.uploadedImageScale || 1);
  const [uploadedImagePanX, setUploadedImagePanX] = useState(state.uploadedImagePanX || 0);
  const [uploadedImagePanY, setUploadedImagePanY] = useState(state.uploadedImagePanY || 0);
  const [uploadedImageFlipX, setUploadedImageFlipX] = useState(state.uploadedImageFlipX || false);
  const [generatedImageRotation, setGeneratedImageRotation] = useState(state.generatedImageRotation || 0);
  const [uploadedImageRotation, setUploadedImageRotation] = useState(state.uploadedImageRotation || 0);

  // Typography settings
  const [titleFontSize, setTitleFontSize] = useState(state.titleFontSize);
  const [titleLineHeight, setTitleLineHeight] = useState(state.titleLineHeight);
  // Fixed subtitle values
  const subtitleFontSize = FIXED_SUBTITLE_FONT_SIZE;
  const subtitleLineHeight = FIXED_SUBTITLE_LINE_HEIGHT;
  const textGap = FIXED_TEXT_GAP;
  const textAlignment = FIXED_TEXT_ALIGNMENT;

  const [hasSubtitleBackground, setHasSubtitleBackground] = useState(state.hasSubtitleBackground || false);
  const [subtitleRotation, setSubtitleRotation] = useState(state.subtitleRotation || 0);

  // Derive theme colors based on current theme and subtitle background state
  const theme = THEMES[currentTheme];
  // REVERT: Title color is now INDEPENDENT of subtitle background
  const derivedTitleColor = theme.titleColor;
  const derivedSubtitleColor = hasSubtitleBackground ? theme.subtitleColorOnBackground : theme.subtitleColor;
  const derivedSubtitleBackgroundColor = theme.subtitleBackgroundColor;

  // Save to localStorage on change
  useEffect(() => {
    const stateToSave = {
      title,
      subtitle,
      currentTheme,
      imagePrompt,
      titleFontSize,
      titleLineHeight,
      hasSubtitleBackground,
      subtitleRotation,
      // textAlignment is fixed, no need to save but saving for compatibility if we change back? 
      // Actually let's not save fixed values to state if we don't read them back into state hooks.
      generatedImageScale,
      generatedImagePanX,
      generatedImagePanY,
      generatedImageFlipX,
      uploadedImageScale,
      uploadedImagePanX,
      uploadedImagePanY,
      uploadedImageFlipX,
      generatedImageRotation,
      uploadedImageRotation,
      generatedImage, // Add generatedImage to save
    };
    localStorage.setItem("banner-state", JSON.stringify(stateToSave));
  }, [
    title, subtitle, currentTheme, imagePrompt,
    titleFontSize, titleLineHeight,
    hasSubtitleBackground, subtitleRotation,
    generatedImageScale, generatedImagePanX, generatedImagePanY, generatedImageFlipX, generatedImageRotation,
    uploadedImageScale, uploadedImagePanX, uploadedImagePanY, uploadedImageFlipX, uploadedImageRotation,
    generatedImage // Add generatedImage to dependencies
  ]);

  const handleReset = () => {
    setTitle(DEFAULT_STATE.title);
    setSubtitle(DEFAULT_STATE.subtitle);
    setCurrentTheme(DEFAULT_STATE.currentTheme);
    setImagePrompt(DEFAULT_STATE.imagePrompt);
    setTitleFontSize(DEFAULT_STATE.titleFontSize);
    setTitleLineHeight(DEFAULT_STATE.titleLineHeight);
    setHasSubtitleBackground(DEFAULT_STATE.hasSubtitleBackground);
    setSubtitleRotation(DEFAULT_STATE.subtitleRotation);
    setGeneratedImageScale(1);
    setGeneratedImagePanX(0);
    setGeneratedImagePanY(0);
    setGeneratedImageFlipX(false);
    setUploadedImageScale(1);
    setUploadedImagePanX(0);
    setUploadedImagePanY(0);
    setUploadedImageFlipX(false);
    setGeneratedImageRotation(0);
    setUploadedImageRotation(0);

    // Actually, standard "Reset" clears everything.
    setGeneratedImage(undefined);
    setUploadedImage(undefined);
    setActiveTab("generate");
    setCurrentTemplateId(null);
  };

  const handleClearGeneratedImage = () => {
    setGeneratedImage(undefined);
    // Reset generated image settings maybe?
    setGeneratedImagePanX(0);
    setGeneratedImagePanY(0);
    setGeneratedImageFlipX(false);
    setGeneratedImageRotation(0);
  };

  const handleGenerate = async () => {
    if (!imagePrompt) return;

    setIsGenerating(true);
    toast.loading("Генерация изображения...", { id: "generate" });

    try {
      const finalPrompt = theme.promptTemplate
        ? theme.promptTemplate.replace("@PROMT@", imagePrompt)
        : imagePrompt;
      const imageUrl = await generateImage(finalPrompt);
      setGeneratedImage(imageUrl);
      setActiveTab("generate");
      toast.success("Изображение готово!", { id: "generate" });

      // Auto-scale generated image
      const img = new Image();
      img.onload = () => {
        const BANNER_HEIGHT = 168;
        // Calculate scale to match banner height
        const scale = BANNER_HEIGHT / img.naturalHeight;
        setGeneratedImageScale(scale);
        setGeneratedImagePanX(0); // Reset pan
        setGeneratedImagePanY(0);
      };
      img.src = imageUrl;

    } catch (error) {
      console.error("Generation failed", error);
      toast.error("Ошибка генерации. Попробуйте еще раз.", { id: "generate" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);

        // Auto-calculate scale to fit height
        const img = new Image();
        img.onload = () => {
          const BANNER_HEIGHT = 168;
          // Calculate scale to match banner height, but allow user to adjust from there
          // We want the image to fill the height initially
          const scale = BANNER_HEIGHT / img.naturalHeight;
          setUploadedImageScale(scale);
          setUploadedImagePanX(0); // Reset pan
          setUploadedImagePanY(0);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;

    setIsRemovingBackground(true);
    toast.loading("Удаление фона...", { id: "remove-bg" });

    try {
      const resultUrl = await removeBackground(uploadedImage);
      setUploadedImage(resultUrl);
      toast.success("Фон удалён!", { id: "remove-bg" });
    } catch (error) {
      console.error("Background removal failed", error);
      toast.error("Ошибка при удалении фона. Попробуйте еще раз.", { id: "remove-bg" });
    } finally {
      setIsRemovingBackground(false);
    }
  };

  // Template Handlers
  const getCurrentStateRaw = () => ({
    title,
    subtitle,
    currentTheme,
    imagePrompt,
    titleFontSize,
    titleLineHeight,
    hasSubtitleBackground,
    subtitleRotation,
    generatedImageScale,
    generatedImagePanX,
    generatedImagePanY,
    generatedImageFlipX,
    uploadedImageScale,
    uploadedImagePanX,
    uploadedImagePanY,
    uploadedImageFlipX,
    generatedImageRotation,
    uploadedImageRotation,
    generatedImage,
  });

  const handleSaveTemplate = (name: string) => {
    const currentState = getCurrentStateRaw();

    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      state: currentState,
    };

    setSavedTemplates(prev => [newTemplate, ...prev]);
    setCurrentTemplateId(newTemplate.id);
    toast.success("Шаблон сохранен!");
    setIsTemplatesDialogOpen(false);
  };

  const handleUpdateCurrentTemplate = () => {
    if (!currentTemplateId) return;

    const currentState = getCurrentStateRaw();

    setSavedTemplates(prev => prev.map(t => {
      if (t.id === currentTemplateId) {
        return {
          ...t,
          state: currentState,
          createdAt: Date.now() // Update timestamp? Maybe useful.
        };
      }
      return t;
    }));

    toast.success("Шаблон обновлен!");
    setIsOverwriteAlertOpen(false);
  };

  const handleLoadTemplate = (template: Template) => {
    const s = template.state;
    setTitle(s.title || DEFAULT_STATE.title);
    setSubtitle(s.subtitle || DEFAULT_STATE.subtitle);
    setCurrentTheme(s.currentTheme || DEFAULT_STATE.currentTheme);
    setImagePrompt(s.imagePrompt || DEFAULT_STATE.imagePrompt);
    setTitleFontSize(s.titleFontSize || DEFAULT_STATE.titleFontSize);
    setTitleLineHeight(s.titleLineHeight || DEFAULT_STATE.titleLineHeight);
    setHasSubtitleBackground(s.hasSubtitleBackground || DEFAULT_STATE.hasSubtitleBackground);
    setSubtitleRotation(s.subtitleRotation || DEFAULT_STATE.subtitleRotation);

    setGeneratedImageScale(s.generatedImageScale || 1);
    setGeneratedImagePanX(s.generatedImagePanX || 0);
    setGeneratedImagePanY(s.generatedImagePanY || 0);
    setGeneratedImageFlipX(s.generatedImageFlipX || false);
    setGeneratedImageRotation(s.generatedImageRotation || 0);

    setUploadedImageScale(s.uploadedImageScale || 1);
    setUploadedImagePanX(s.uploadedImagePanX || 0);
    setUploadedImagePanY(s.uploadedImagePanY || 0);
    setUploadedImageFlipX(s.uploadedImageFlipX || false);
    setUploadedImageRotation(s.uploadedImageRotation || 0);

    setGeneratedImage(s.generatedImage);

    if (s.generatedImage) {
      setActiveTab("generate");
    } else {
      setActiveTab("generate");
    }

    setCurrentTemplateId(template.id);
    toast.success("Шаблон загружен!");
    setIsTemplatesDialogOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setSavedTemplates(prev => prev.filter(t => t.id !== id));
    if (currentTemplateId === id) {
      setCurrentTemplateId(null);
    }
    toast.success("Шаблон удален");
  };

  const handleSaveBannerClick = () => {
    if (currentTemplateId) {
      setIsOverwriteAlertOpen(true);
    } else {
      setTemplatesDialogMode("save");
      setIsTemplatesDialogOpen(true);
    }
  };

  const bannerRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async (scale: number) => {
    if (!bannerRef.current) return;

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small delay to ensure rendering is stable
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(bannerRef.current, {
        cacheBust: true,
        pixelRatio: scale,
      });

      const link = document.createElement("a");
      link.download = `banner-${scale}x.png`;
      link.href = dataUrl;
      link.click();

      toast.success(`Баннер скачан в размере x${scale}`);
    } catch (error) {
      console.error("Error downloading banner:", error);
      toast.error("Ошибка при скачивании баннера");
    }
  }, []);

  const handleDownloadImage = async () => {
    const url = activeTab === 'generate' ? generatedImage : uploadedImage;
    if (!url) {
      toast.error("Нет изображения для скачивания");
      return;
    }

    try {
      // For data URLs (uploads)
      if (url.startsWith('data:')) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Изображение скачано");
        return;
      }

      // For remote URLs (generated)
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Изображение скачано");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Ошибка при скачивании изображения");
    }
  };

  // Find current template object
  const currentTemplate = savedTemplates.find(t => t.id === currentTemplateId);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-center w-full">
        {/* Controls section */}
        <div className="w-full max-w-md bg-card rounded-3xl p-6 shadow-sm border border-border/50">
          <BannerForm
            title={title}
            setTitle={setTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            imagePrompt={imagePrompt}
            setImagePrompt={setImagePrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            titleFontSize={titleFontSize}
            setTitleFontSize={setTitleFontSize}
            titleLineHeight={titleLineHeight}
            setTitleLineHeight={setTitleLineHeight}
            // Removed subtitle size/bold controls from props
            hasSubtitleBackground={hasSubtitleBackground}
            setHasSubtitleBackground={setHasSubtitleBackground}
            subtitleRotation={subtitleRotation}
            setSubtitleRotation={setSubtitleRotation}
            // textAlignment removed from props
            onReset={handleReset}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onFileUpload={handleFileUpload}
            uploadedImage={uploadedImage}
            onRemoveImage={() => setUploadedImage(undefined)}
            onRemoveBackground={handleRemoveBackground}
            isRemovingBackground={isRemovingBackground}
            imageScale={activeTab === 'generate' ? generatedImageScale : uploadedImageScale}
            setImageScale={activeTab === 'generate' ? setGeneratedImageScale : setUploadedImageScale}
            imagePanX={activeTab === 'generate' ? generatedImagePanX : uploadedImagePanX}
            setImagePanX={activeTab === 'generate' ? setGeneratedImagePanX : setUploadedImagePanX}
            imagePanY={activeTab === 'generate' ? generatedImagePanY : uploadedImagePanY}
            setImagePanY={activeTab === 'generate' ? setGeneratedImagePanY : setUploadedImagePanY}
            imageFlipX={activeTab === 'generate' ? generatedImageFlipX : uploadedImageFlipX}
            setImageFlipX={activeTab === 'generate' ? setGeneratedImageFlipX : setUploadedImageFlipX}
            imageRotation={activeTab === 'generate' ? generatedImageRotation : uploadedImageRotation}
            setImageRotation={activeTab === 'generate' ? setGeneratedImageRotation : setUploadedImageRotation}
            generatedImage={generatedImage}
            onClearGeneratedImage={handleClearGeneratedImage}

            // Templates
            templates={savedTemplates}
            onSaveTemplate={handleSaveTemplate}
            onLoadTemplate={handleLoadTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onOpenTemplates={() => {
              setTemplatesDialogMode("list");
              setIsTemplatesDialogOpen(true);
            }}
          />
        </div>

        {/* Preview section */}
        <div className="flex flex-col items-center gap-6">
          <Button
            variant="outline"
            onClick={() => {
              setTemplatesDialogMode("list");
              setIsTemplatesDialogOpen(true);
            }}
            className="gap-2 px-6 justify-center border-white/40 bg-transparent text-foreground hover:bg-white/10 hover:text-foreground transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Сохранённые баннеры
          </Button>

          {/* Active Template Indicator */}
          {currentTemplate && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
              <span className="text-sm font-medium text-muted-foreground">
                Текущий шаблон
              </span>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <span>{currentTemplate.name}</span>
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {format(currentTemplate.createdAt, "d MMM, HH:mm", { locale: ru })}
                </span>
              </div>
            </div>
          )}

          {/* Banner preview */}
          <div className="relative">
            <BannerPreview
              ref={bannerRef}
              title={title}
              subtitle={subtitle}
              backgroundColor={theme.backgroundStart}
              gradientEnd={theme.backgroundEnd}
              imageUrl={activeTab === 'generate' ? generatedImage : uploadedImage}
              titleFontSize={titleFontSize}
              titleLineHeight={titleLineHeight}
              titleColor={derivedTitleColor}
              subtitleFontSize={subtitleFontSize} // Fixed at 20
              subtitleLineHeight={subtitleLineHeight} // Fixed at 20
              subtitleColor={derivedSubtitleColor}
              hasSubtitleBackground={hasSubtitleBackground}
              subtitleBackgroundColor={derivedSubtitleBackgroundColor}
              subtitleRotation={subtitleRotation}
              subtitleIsBold={true} // Always bold
              textAlignment={textAlignment} // Fixed at center
              textGap={textGap} // Fixed at 12
              imageScale={activeTab === 'generate' ? generatedImageScale : uploadedImageScale}
              imagePanX={activeTab === 'generate' ? generatedImagePanX : uploadedImagePanX}
              imagePanY={activeTab === 'generate' ? generatedImagePanY : uploadedImagePanY}
              imageFlipX={activeTab === 'generate' ? generatedImageFlipX : uploadedImageFlipX}
              imageRotation={activeTab === 'generate' ? generatedImageRotation : uploadedImageRotation}
              isUpload={true}
            />
          </div>

          {/* Download buttons */}
          <DownloadButtons
            onDownload={handleDownload}
            onSave={handleSaveBannerClick}
            onDownloadImage={handleDownloadImage}
            disabled={isGenerating}
          />
        </div>
      </div>

      <TemplatesDialog
        isOpen={isTemplatesDialogOpen}
        onClose={() => setIsTemplatesDialogOpen(false)}
        templates={savedTemplates}
        onSave={handleSaveTemplate}
        onLoad={handleLoadTemplate}
        onDelete={handleDeleteTemplate}
        initialMode={templatesDialogMode}
      />

      <AlertDialog open={isOverwriteAlertOpen} onOpenChange={setIsOverwriteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сохранить шаблон</AlertDialogTitle>
            <AlertDialogDescription>
              Этот шаблон уже существует. Вы хотите обновить его или сохранить как новый?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setTemplatesDialogMode("save");
              setIsOverwriteAlertOpen(false);
              setIsTemplatesDialogOpen(true);
            }}>
              Сохранить как новый
            </AlertDialogAction>
            <AlertDialogAction onClick={handleUpdateCurrentTemplate}>
              Обновить текущий
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
};

export default Index;
