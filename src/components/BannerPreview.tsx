import { forwardRef } from "react";
import type { TextAlignment } from "./BannerForm";

export interface BannerPreviewProps {
  title: string;
  subtitle: string;
  backgroundColor: string;
  gradientEnd?: string;
  imageUrl?: string;
  scale?: number;
  titleFontSize: number;
  titleLineHeight: number;
  titleColor: string;
  subtitleFontSize: number;
  subtitleLineHeight: number;
  subtitleColor: string;
  hasSubtitleBackground?: boolean;
  subtitleBackgroundColor?: string;
  subtitleRotation?: number;
  subtitleIsBold?: boolean;
  textAlignment: TextAlignment;
  textGap: number;
  imageScale?: number;
  imagePanX?: number;
  imagePanY?: number;
  imageFlipX?: boolean;
  imageRotation?: number;
  isUpload?: boolean;
}

export const BannerPreview = forwardRef<HTMLDivElement, BannerPreviewProps>(
  ({
    title,
    subtitle,
    backgroundColor,
    gradientEnd,
    imageUrl,
    scale = 1,
    titleFontSize,
    titleLineHeight,
    titleColor,
    subtitleFontSize,
    subtitleLineHeight,
    subtitleColor,
    hasSubtitleBackground,
    subtitleBackgroundColor,
    subtitleRotation = 0,
    subtitleIsBold = false,
    textAlignment,
    textGap,
    imageScale = 1,
    imagePanX = 0,
    imagePanY = 0,
    imageFlipX = false,
    imageRotation = 0,
    isUpload = false,
  }, ref) => {
    const baseWidth = 640;
    const baseHeight = 168;
    const imageAreaWidth = 194;
    const paddingLeft = 32;
    const paddingVertical = 24;

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

    const justifyContent = textAlignment === "start"
      ? "flex-start"
      : textAlignment === "end"
        ? "flex-end"
        : "center";

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
          data-text-container
          className="absolute inset-0 flex flex-col z-10"
          style={{
            justifyContent,
            paddingRight: imageAreaWidth * scale,
            paddingLeft: paddingLeft * scale,
            paddingTop: paddingVertical * scale,
            paddingBottom: paddingVertical * scale,
          }}
        >
          <h2
            className=""
            style={{
              fontSize: titleFontSize * scale,
              lineHeight: `${titleLineHeight * scale}px`,
              marginBottom: textGap * scale,
              fontFamily: "'Euclid Circular A', 'Inter', sans-serif",
              fontWeight: 600,
              color: titleColor,
            }}
          >
            {renderTextWithBreaks(title, "")}
          </h2>
          <div
            style={{
              backgroundColor: hasSubtitleBackground ? subtitleBackgroundColor : 'transparent',
              paddingTop: hasSubtitleBackground ? `${8 * scale}px` : 0,
              paddingBottom: hasSubtitleBackground ? `${8 * scale}px` : 0,
              paddingLeft: hasSubtitleBackground ? `${12 * scale}px` : 0,
              paddingRight: hasSubtitleBackground ? `${12 * scale}px` : 0,
              borderRadius: `${12 * scale}px`,
              display: 'inline-block',
              width: 'fit-content',
              transform: hasSubtitleBackground ? `rotate(${subtitleRotation}deg)` : 'none',
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            <p
              style={{
                fontSize: subtitleFontSize * scale,
                lineHeight: `${subtitleLineHeight * scale}px`,
                fontFamily: "'Euclid Circular A', 'Inter', sans-serif",
                fontWeight: subtitleIsBold ? 600 : 400,
                color: subtitleColor,
                margin: 0,
              }}
            >
              {renderTextWithBreaks(subtitle, "")}
            </p>
          </div>
        </div>

        {/* Image area - full bleed */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center"
          style={{
            width: imageAreaWidth * scale,
            height: baseHeight * scale,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Banner illustration"
              className={`transition-transform duration-100 ease-out ${isUpload
                ? "absolute left-1/2 top-1/2 max-w-none h-auto w-auto"
                : "w-full h-full object-contain object-center"
                }`}
              style={{
                transform: isUpload
                  ? `translate(calc(-50% + ${imagePanX}px), calc(-50% + ${imagePanY}px)) rotate(${imageRotation}deg) scale(${imageScale}) ${imageFlipX ? 'scaleX(-1)' : ''}`
                  : `translate(${imagePanX}px, ${imagePanY}px) rotate(${imageRotation}deg) scale(${imageScale}) ${imageFlipX ? 'scaleX(-1)' : ''}`,
                transformOrigin: 'center center',
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
);

BannerPreview.displayName = "BannerPreview";
