import { useState, useRef, useCallback, useEffect } from "react";
import { BannerForm, TextAlignment } from "@/components/BannerForm";
import { BannerPreview } from "@/components/BannerPreview";
import { generateImage } from "@/services/imageService";
import { DownloadButtons } from "@/components/DownloadButtons";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { THEMES, ThemeId } from "@/constants/themes";

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

  const [title, setTitle] = useState(state.title);
  const [subtitle, setSubtitle] = useState(state.subtitle);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(state.currentTheme);
  const [imagePrompt, setImagePrompt] = useState(state.imagePrompt);

  // Persisted state
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(state.generatedImage);
  const [isGenerating, setIsGenerating] = useState(false);
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
      generatedImage, // Add generatedImage to save
    };
    localStorage.setItem("banner-state", JSON.stringify(stateToSave));
  }, [
    title, subtitle, currentTheme, imagePrompt,
    titleFontSize, titleLineHeight,
    hasSubtitleBackground, subtitleRotation,
    generatedImageScale, generatedImagePanX, generatedImagePanY, generatedImageFlipX,
    uploadedImageScale, uploadedImagePanX, uploadedImagePanY, uploadedImageFlipX,
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

    if (generatedImage) {
      // Keep generated image on reset as per new requirements or reset?
      // User asked to persist it. Reset usually resets *settings*.
      // If we want to clear everything:
      // setGeneratedImage(undefined);
      // But let's respect the "clear" button for that.
      // Actually, standard "Reset" clears everything.
      setGeneratedImage(undefined);
    }
    setUploadedImage(undefined);
    setActiveTab("generate");
  };

  const handleClearGeneratedImage = () => {
    setGeneratedImage(undefined);
    // Reset generated image settings maybe?
    setGeneratedImageScale(1);
    setGeneratedImagePanX(0);
    setGeneratedImagePanY(0);
    setGeneratedImageFlipX(false);
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
            imageScale={activeTab === 'generate' ? generatedImageScale : uploadedImageScale}
            setImageScale={activeTab === 'generate' ? setGeneratedImageScale : setUploadedImageScale}
            imagePanX={activeTab === 'generate' ? generatedImagePanX : uploadedImagePanX}
            setImagePanX={activeTab === 'generate' ? setGeneratedImagePanX : setUploadedImagePanX}
            imagePanY={activeTab === 'generate' ? generatedImagePanY : uploadedImagePanY}
            setImagePanY={activeTab === 'generate' ? setGeneratedImagePanY : setUploadedImagePanY}
            imageFlipX={activeTab === 'generate' ? generatedImageFlipX : uploadedImageFlipX}
            setImageFlipX={activeTab === 'generate' ? setGeneratedImageFlipX : setUploadedImageFlipX}
            generatedImage={generatedImage}
            onClearGeneratedImage={handleClearGeneratedImage}
          />
        </div>

        {/* Preview section */}
        <div className="flex flex-col items-center gap-6">
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
              isUpload={true}
            />
          </div>

          {/* Download buttons */}
          <DownloadButtons
            onDownload={handleDownload}
            disabled={isGenerating}
          />
        </div>
      </div>
    </div >
  );
};

export default Index;
