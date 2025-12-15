import { forwardRef } from "react";

interface BannerPreviewProps {
  title: string;
  subtitle: string;
  backgroundColor: string;
  gradientEnd?: string;
  imageUrl?: string;
  scale?: number;
}

export const BannerPreview = forwardRef<HTMLDivElement, BannerPreviewProps>(
  ({ title, subtitle, backgroundColor, gradientEnd, imageUrl, scale = 1 }, ref) => {
    const baseWidth = 640;
    const baseHeight = 168;
    const imageAreaWidth = 194;

    const backgroundStyle = gradientEnd
      ? { background: `linear-gradient(135deg, ${backgroundColor} 0%, ${gradientEnd} 100%)` }
      : { backgroundColor };

    // Split text by newlines and render with <br> tags
    const renderTextWithBreaks = (text: string, defaultText: string) => {
      const content = text || defaultText;
      return content.split('\n').map((line, index, array) => (
        <span key={index}>
          {line}
          {index < array.length - 1 && <br />}
        </span>
      ));
    };

    return (
      <div
        ref={ref}
        className="relative overflow-hidden"
        style={{
          width: baseWidth * scale,
          height: baseHeight * scale,
          borderRadius: 24 * scale,
          ...backgroundStyle,
        }}
      >
        {/* Text content */}
        <div
          className="absolute inset-0 flex flex-col justify-center"
          style={{
            paddingRight: imageAreaWidth * scale,
            paddingLeft: 24 * scale,
            paddingTop: 20 * scale,
            paddingBottom: 20 * scale,
          }}
        >
          <h2
            className="font-bold text-foreground leading-tight"
            style={{
              fontSize: 28 * scale,
              lineHeight: `${32 * scale}px`,
              marginBottom: 8 * scale,
              fontFamily: "'Euclid Circular A', 'Inter', sans-serif",
              fontWeight: 700,
            }}
          >
            {renderTextWithBreaks(title, "Заголовок вашего баннера\nнаписаный в пару строк")}
          </h2>
          <p
            className="text-foreground/80"
            style={{
              fontSize: 14 * scale,
              lineHeight: `${18 * scale}px`,
              fontFamily: "'Euclid Circular A', 'Inter', sans-serif",
              fontWeight: 400,
            }}
          >
            {renderTextWithBreaks(subtitle, "Подзаголовок для информации\nдополнительной в пару строк")}
          </p>
        </div>

        {/* Image area - full bleed */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center overflow-hidden"
          style={{
            width: imageAreaWidth * scale,
            height: baseHeight * scale,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Banner illustration"
              className="w-full h-full object-contain object-center"
            />
          ) : (
            <div
              className="w-full h-full bg-foreground/10 flex items-center justify-center"
            >
              <span
                className="text-foreground/40"
                style={{ fontSize: 12 * scale }}
              >
                AI Image
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

BannerPreview.displayName = "BannerPreview";
