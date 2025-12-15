import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ColorPickerProps {
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  gradientEnd: string;
  setGradientEnd: (value: string) => void;
  useGradient: boolean;
  setUseGradient: (value: boolean) => void;
}

const presetColors = [
  "#00A3FF", "#8B5CF6", "#10B981", "#F97316",
  "#EC4899", "#1E293B", "#EF4444", "#FBBF24",
];

const normalizeColor = (value: string): string => {
  const cleaned = value.trim();
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return `#${cleaned}`;
  }
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    return `#${cleaned}`;
  }
  return cleaned;
};

export const ColorPicker = ({
  backgroundColor,
  setBackgroundColor,
  gradientEnd,
  setGradientEnd,
  useGradient,
  setUseGradient,
}: ColorPickerProps) => {
  const handleBackgroundChange = (value: string) => {
    setBackgroundColor(normalizeColor(value));
  };

  const handleGradientEndChange = (value: string) => {
    setGradientEnd(normalizeColor(value));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">Цвет фона</Label>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Градиент</Label>
          <Switch
            checked={useGradient}
            onCheckedChange={setUseGradient}
          />
        </div>
      </div>
      
      {/* Preset colors */}
      <div className="flex flex-wrap gap-1.5">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => setBackgroundColor(color)}
            className={`w-7 h-7 rounded-md border-2 transition-all ${
              backgroundColor === color ? "border-foreground scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Color inputs in a row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="flex gap-1.5 items-center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <Input
              value={backgroundColor}
              onChange={(e) => handleBackgroundChange(e.target.value)}
              className="flex-1 h-8 bg-input border-border text-foreground uppercase text-xs"
              placeholder="#00A3FF"
            />
          </div>
        </div>

        {useGradient && (
          <div className="flex-1 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex gap-1.5 items-center">
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <Input
                value={gradientEnd}
                onChange={(e) => handleGradientEndChange(e.target.value)}
                className="flex-1 h-8 bg-input border-border text-foreground uppercase text-xs"
                placeholder="#0066CC"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview gradient */}
      {useGradient && (
        <div
          className="h-6 rounded-md"
          style={{
            background: `linear-gradient(135deg, ${backgroundColor} 0%, ${gradientEnd} 100%)`,
          }}
        />
      )}
    </div>
  );
};
