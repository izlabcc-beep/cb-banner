import { forwardRef } from "react";

interface BannerPreviewProps {
  title: string;
  subtitle: string;
  gradient: string;
  imageUrl?: string;
  scale?: number;
}

const gradientClasses: Record<string, string> = {
  blue: "banner-gradient-blue",
  purple: "banner-gradient-purple",
  green: "banner-gradient-green",
  orange: "banner-gradient-orange",
  pink: "banner-gradient-pink",
  dark: "banner-gradient-dark",
};

export const BannerPreview = forwardRef<HTMLDivElement, BannerPreviewProps>(
  ({ title, subtitle, gradient, imageUrl, scale = 1 }, ref) => {
    const baseWidth = 640;
    const baseHeight = 168;
    const imageAreaWidth = 194;

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-banner ${gradientClasses[gradient] || gradientClasses.blue}`}
        style={{
          width: baseWidth * scale,
          height: baseHeight * scale,
        }}
      >
        {/* Text content */}
        <div
          className="absolute inset-0 flex flex-col justify-center p-6"
          style={{
            paddingRight: (imageAreaWidth + 16) * scale,
            paddingLeft: 24 * scale,
            paddingTop: 24 * scale,
            paddingBottom: 24 * scale,
          }}
        >
          <h2
            className="font-bold text-foreground leading-tight mb-2"
            style={{
              fontSize: 24 * scale,
              lineHeight: 1.2,
            }}
          >
            {title || "Заголовок вашего баннера написаный в пару строк"}
          </h2>
          <p
            className="text-foreground/80"
            style={{
              fontSize: 14 * scale,
              lineHeight: 1.4,
            }}
          >
            {subtitle || "Подзаголовок для информации дополнительной в пару строк"}
          </p>
        </div>

        {/* Image area */}
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
              className="max-w-full max-h-full object-contain"
              style={{
                maxWidth: (imageAreaWidth - 16) * scale,
                maxHeight: (baseHeight - 16) * scale,
              }}
            />
          ) : (
            <div
              className="rounded-lg bg-foreground/10 flex items-center justify-center"
              style={{
                width: (imageAreaWidth - 32) * scale,
                height: (baseHeight - 32) * scale,
              }}
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
