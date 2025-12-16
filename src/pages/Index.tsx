
import { useState, useRef, useCallback, useEffect } from "react";
import { BannerForm, TextAlignment } from "@/components/BannerForm";
import { BannerPreview } from "@/components/BannerPreview";
import { DownloadButtons } from "@/components/DownloadButtons";
import { toast } from "sonner";
import { toPng } from "html-to-image";

const Index = () => {
  // Default state for reset and initial load
  const DEFAULT_STATE = {
    title: "",
    subtitle: "",
    backgroundColor: "#0065FF",
    gradientEnd: "#3F99FF",
    useGradient: true,
    imagePrompt: "",
    titleFontSize: 34,
    titleLineHeight: 32,
    titleColor: "#FFFFFF",
    subtitleFontSize: 24,
    subtitleLineHeight: 28,
    subtitleColor: "#FFFFFF",
    hasSubtitleBackground: false,
    subtitleBackgroundColor: "#000000",
    subtitleRotation: 0,
    subtitleIsBold: false,
    textAlignment: "start" as TextAlignment,
    textGap: 8,
  };

  // Load state from localStorage or use defaults
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("banner-state");
    if (saved) {
      try {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse saved state", e);
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  const [title, setTitle] = useState(state.title);
  const [subtitle, setSubtitle] = useState(state.subtitle);
  const [backgroundColor, setBackgroundColor] = useState(state.backgroundColor);
  const [gradientEnd, setGradientEnd] = useState(state.gradientEnd);
  const [useGradient, setUseGradient] = useState(state.useGradient);
  const [imagePrompt, setImagePrompt] = useState(state.imagePrompt);

  // Non-persisted state
  const [generatedImage, setGeneratedImage] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  // Typography settings
  const [titleFontSize, setTitleFontSize] = useState(state.titleFontSize);
  const [titleLineHeight, setTitleLineHeight] = useState(state.titleLineHeight);
  const [titleColor, setTitleColor] = useState(state.titleColor);
  const [subtitleFontSize, setSubtitleFontSize] = useState(state.subtitleFontSize);
  const [subtitleLineHeight, setSubtitleLineHeight] = useState(state.subtitleLineHeight);
  const [subtitleColor, setSubtitleColor] = useState(state.subtitleColor);
  const [hasSubtitleBackground, setHasSubtitleBackground] = useState(state.hasSubtitleBackground || false);
  const [subtitleBackgroundColor, setSubtitleBackgroundColor] = useState(state.subtitleBackgroundColor || "#000000");
  const [subtitleRotation, setSubtitleRotation] = useState(state.subtitleRotation || 0);
  const [subtitleIsBold, setSubtitleIsBold] = useState(state.subtitleIsBold || false);
  const [textAlignment, setTextAlignment] = useState<TextAlignment>(state.textAlignment);
  const [textGap, setTextGap] = useState(state.textGap);

  // Save to localStorage on change
  useEffect(() => {
    const stateToSave = {
      title,
      subtitle,
      backgroundColor,
      gradientEnd,
      useGradient,
      imagePrompt,
      titleFontSize,
      titleLineHeight,
      titleColor,
      subtitleFontSize,
      subtitleLineHeight,
      subtitleColor,
      hasSubtitleBackground,
      subtitleBackgroundColor,
      subtitleRotation,
      subtitleIsBold,
      textAlignment,
      textGap,
    };
    localStorage.setItem("banner-state", JSON.stringify(stateToSave));
  }, [
    title, subtitle, backgroundColor, gradientEnd, useGradient, imagePrompt,
    titleFontSize, titleLineHeight, titleColor, subtitleFontSize, subtitleLineHeight, subtitleColor,
    hasSubtitleBackground, subtitleBackgroundColor, subtitleRotation, subtitleIsBold,
    textAlignment, textGap
  ]);

  const handleReset = () => {
    setTitle(DEFAULT_STATE.title);
    setSubtitle(DEFAULT_STATE.subtitle);
    setBackgroundColor(DEFAULT_STATE.backgroundColor);
    setGradientEnd(DEFAULT_STATE.gradientEnd);
    setUseGradient(DEFAULT_STATE.useGradient);
    setImagePrompt(DEFAULT_STATE.imagePrompt);
    setTitleFontSize(DEFAULT_STATE.titleFontSize);
    setTitleLineHeight(DEFAULT_STATE.titleLineHeight);
    setTitleColor(DEFAULT_STATE.titleColor);
    setSubtitleFontSize(DEFAULT_STATE.subtitleFontSize);
    setSubtitleLineHeight(DEFAULT_STATE.subtitleLineHeight);
    setSubtitleColor(DEFAULT_STATE.subtitleColor);
    setHasSubtitleBackground(DEFAULT_STATE.hasSubtitleBackground);
    setSubtitleBackgroundColor(DEFAULT_STATE.subtitleBackgroundColor);
    setSubtitleRotation(DEFAULT_STATE.subtitleRotation);
    setSubtitleIsBold(DEFAULT_STATE.subtitleIsBold);
    setTextAlignment(DEFAULT_STATE.textAlignment);
    setTextGap(DEFAULT_STATE.textGap);

    if (generatedImage) {
      // confirm reset logic if needed, but for now we keep the image
      // or we can clear it: setGeneratedImage(undefined);
    }
  };

  const bannerRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!imagePrompt) return;

    setIsGenerating(true);
    try {
      // Simulated generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, this would call an API
      // For now we just use a placeholder based on the prompt
      setGeneratedImage(`https://source.unsplash.com/random/800x400/?${encodeURIComponent(imagePrompt)}`);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            gradientEnd={gradientEnd}
            setGradientEnd={setGradientEnd}
            useGradient={useGradient}
            setUseGradient={setUseGradient}
            imagePrompt={imagePrompt}
            setImagePrompt={setImagePrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            titleFontSize={titleFontSize}
            setTitleFontSize={setTitleFontSize}
            titleLineHeight={titleLineHeight}
            setTitleLineHeight={setTitleLineHeight}
            titleColor={titleColor}
            setTitleColor={setTitleColor}
            subtitleFontSize={subtitleFontSize}
            setSubtitleFontSize={setSubtitleFontSize}
            subtitleLineHeight={subtitleLineHeight}
            setSubtitleLineHeight={setSubtitleLineHeight}
            subtitleColor={subtitleColor}
            setSubtitleColor={setSubtitleColor}
            hasSubtitleBackground={hasSubtitleBackground}
            setHasSubtitleBackground={setHasSubtitleBackground}
            subtitleBackgroundColor={subtitleBackgroundColor}
            setSubtitleBackgroundColor={setSubtitleBackgroundColor}
            subtitleRotation={subtitleRotation}
            setSubtitleRotation={setSubtitleRotation}
            subtitleIsBold={subtitleIsBold}
            setSubtitleIsBold={setSubtitleIsBold}
            textAlignment={textAlignment}
            setTextAlignment={setTextAlignment}
            textGap={textGap}
            setTextGap={setTextGap}
            onReset={handleReset}
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
              backgroundColor={backgroundColor}
              gradientEnd={useGradient ? gradientEnd : undefined}
              imageUrl={generatedImage}
              titleFontSize={titleFontSize}
              titleLineHeight={titleLineHeight}
              titleColor={titleColor}
              subtitleFontSize={subtitleFontSize}
              subtitleLineHeight={subtitleLineHeight}
              subtitleColor={subtitleColor}
              hasSubtitleBackground={hasSubtitleBackground}
              subtitleBackgroundColor={subtitleBackgroundColor}
              subtitleRotation={subtitleRotation}
              subtitleIsBold={subtitleIsBold}
              textAlignment={textAlignment}
              textGap={textGap}
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
