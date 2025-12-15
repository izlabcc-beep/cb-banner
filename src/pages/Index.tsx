import { useState, useRef, useCallback } from "react";
import { BannerForm } from "@/components/BannerForm";
import { BannerPreview } from "@/components/BannerPreview";
import { DownloadButtons } from "@/components/DownloadButtons";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const Index = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [gradient, setGradient] = useState("blue");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);
  const downloadBannerRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Пожалуйста, опишите изображение для баннера");
      return;
    }

    setIsGenerating(true);
    
    // TODO: Connect to AI image generation
    // For now, simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Баннер сгенерирован! (AI-изображение будет добавлено позже)");
    setIsGenerating(false);
  };

  const handleDownload = useCallback(async (scale: number) => {
    if (!bannerRef.current) return;

    try {
      // Create a temporary container for the scaled banner
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      document.body.appendChild(tempContainer);

      // Create the scaled banner
      const scaledBanner = document.createElement("div");
      tempContainer.appendChild(scaledBanner);

      // Use html2canvas on the actual banner
      const canvas = await html2canvas(bannerRef.current, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
        width: 640,
        height: 168,
      });

      // Clean up
      document.body.removeChild(tempContainer);

      // Download
      const link = document.createElement("a");
      link.download = `banner-${scale}x.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success(`Баннер скачан в размере x${scale}`);
    } catch (error) {
      console.error("Error downloading banner:", error);
      toast.error("Ошибка при скачивании баннера");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">
          Banner Generator
        </h1>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* Form */}
          <div className="w-full max-w-md bg-card rounded-2xl p-6 border border-border">
            <BannerForm
              title={title}
              setTitle={setTitle}
              subtitle={subtitle}
              setSubtitle={setSubtitle}
              gradient={gradient}
              setGradient={setGradient}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
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
                gradient={gradient}
                imageUrl={generatedImage}
              />
            </div>

            {/* Download buttons */}
            <DownloadButtons
              onDownload={handleDownload}
              disabled={isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
