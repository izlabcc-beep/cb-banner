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
  "#00A3FF", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#F97316", // Orange
  "#EC4899", // Pink
  "#1E293B", // Dark
  "#EF4444", // Red
  "#FBBF24", // Yellow
];

export const ColorPicker = ({
  backgroundColor,
  setBackgroundColor,
  gradientEnd,
  setGradientEnd,
  useGradient,
  setUseGradient,
}: ColorPickerProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">Цвет фона</Label>
      
      {/* Preset colors */}
      <div className="flex flex-wrap gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => setBackgroundColor(color)}
            className={`w-8 h-8 rounded-lg border-2 transition-all ${
              backgroundColor === color ? "border-foreground scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Custom color inputs */}
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground mb-1 block">
            {useGradient ? "Начальный цвет" : "Цвет"}
          </Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <Input
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 bg-input border-border text-foreground uppercase text-sm"
              placeholder="#00A3FF"
            />
          </div>
        </div>
      </div>

      {/* Gradient toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Использовать градиент</Label>
        <Switch
          checked={useGradient}
          onCheckedChange={setUseGradient}
        />
      </div>

      {/* Gradient end color */}
      {useGradient && (
        <div className="flex gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Конечный цвет</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <Input
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="flex-1 bg-input border-border text-foreground uppercase text-sm"
                placeholder="#0066CC"
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview gradient */}
      {useGradient && (
        <div
          className="h-8 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${backgroundColor} 0%, ${gradientEnd} 100%)`,
          }}
        />
      )}
    </div>
  );
};
