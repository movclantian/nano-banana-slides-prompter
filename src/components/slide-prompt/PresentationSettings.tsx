import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { PresentationSettings as PresentationSettingsType, AspectRatio, ColorPalette, LayoutStructure } from '@/types/slidePrompt';

const aspectRatios: { value: AspectRatio; label: string; preview: string }[] = [
  { value: '16:9', label: '16:9', preview: 'Widescreen' },
  { value: '4:3', label: '4:3', preview: 'Standard' },
  { value: '1:1', label: '1:1', preview: 'Square' },
  { value: '9:16', label: '9:16', preview: 'Portrait' }
];

const colorPalettes: { value: ColorPalette; label: string; colors: string[] }[] = [
  { value: 'corporate-blue', label: 'Corporate Blue', colors: ['hsl(210 60% 25%)', 'hsl(210 70% 55%)', 'hsl(210 20% 90%)'] },
  { value: 'modern-purple', label: 'Modern Purple', colors: ['hsl(270 60% 40%)', 'hsl(270 80% 65%)', 'hsl(270 30% 95%)'] },
  { value: 'nature-green', label: 'Nature Green', colors: ['hsl(140 50% 25%)', 'hsl(140 60% 65%)', 'hsl(40 30% 95%)'] },
  { value: 'warm-orange', label: 'Warm Orange', colors: ['hsl(25 80% 45%)', 'hsl(25 90% 60%)', 'hsl(40 30% 95%)'] },
  { value: 'elegant-monochrome', label: 'Elegant Mono', colors: ['hsl(0 0% 10%)', 'hsl(0 0% 50%)', 'hsl(0 0% 95%)'] },
  { value: 'vibrant-gradient', label: 'Vibrant Gradient', colors: ['hsl(180 80% 50%)', 'hsl(280 80% 60%)', 'hsl(320 80% 60%)'] },
  { value: 'ocean-teal', label: 'Ocean Teal', colors: ['hsl(172 66% 30%)', 'hsl(168 80% 60%)', 'hsl(45 40% 90%)'] },
  { value: 'sunset-pink', label: 'Sunset Pink', colors: ['hsl(330 80% 55%)', 'hsl(40 90% 55%)', 'hsl(15 80% 90%)'] },
  { value: 'forest-earth', label: 'Forest Earth', colors: ['hsl(30 75% 25%)', 'hsl(35 80% 50%)', 'hsl(80 30% 45%)'] },
  { value: 'royal-gold', label: 'Royal Gold', colors: ['hsl(225 70% 35%)', 'hsl(40 95% 50%)', 'hsl(220 30% 95%)'] },
  { value: 'arctic-frost', label: 'Arctic Frost', colors: ['hsl(200 90% 60%)', 'hsl(215 20% 60%)', 'hsl(270 30% 95%)'] },
  { value: 'neon-night', label: 'Neon Night', colors: ['hsl(270 80% 60%)', 'hsl(140 70% 50%)', 'hsl(330 90% 60%)'] }
];

const layoutStructures: { value: LayoutStructure; label: string; description: string }[] = [
  { value: 'visual-heavy', label: 'Visual Heavy', description: '70% images' },
  { value: 'balanced', label: 'Balanced', description: '50/50 mix' },
  { value: 'text-heavy', label: 'Text Heavy', description: '70% text' }
];

interface PresentationSettingsProps {
  value: PresentationSettingsType;
  onChange: (value: PresentationSettingsType) => void;
}

export function PresentationSettings({ value, onChange }: PresentationSettingsProps) {
  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10">
      <CardContent className="pt-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Presentation Settings</h3>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <Label>Aspect Ratio</Label>
          <div className="flex gap-3">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => onChange({ ...value, aspectRatio: ratio.value })}
                className={cn(
                  'group flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 flex-1',
                  'hover:-translate-y-0.5 hover:shadow-md',
                  value.aspectRatio === ratio.value
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                    : 'border-border/50 hover:border-primary/50 hover:bg-accent/50'
                )}
              >
                <div
                  className={cn(
                    'bg-gradient-to-br from-muted to-muted/50 rounded border border-border/50 mb-2 transition-transform duration-300 group-hover:scale-105',
                    ratio.value === '16:9' && 'w-12 h-7',
                    ratio.value === '4:3' && 'w-10 h-8',
                    ratio.value === '1:1' && 'w-8 h-8',
                    ratio.value === '9:16' && 'w-5 h-9'
                  )}
                />
                <span className="text-xs font-medium">{ratio.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slide Count */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Number of Slides</Label>
            <span className="text-sm font-medium text-primary">{value.slideCount}</span>
          </div>
          <Slider
            value={[value.slideCount]}
            onValueChange={([count]) => onChange({ ...value, slideCount: count })}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Color Palette</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {value.colorPalette === 'auto' ? 'AI chooses' : 'Custom'}
              </span>
              <Switch
                checked={value.colorPalette !== 'auto'}
                onCheckedChange={(checked) => 
                  onChange({ ...value, colorPalette: checked ? 'corporate-blue' : 'auto' })
                }
              />
            </div>
          </div>
          
          {value.colorPalette === 'auto' ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-border/50 bg-muted/30">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                AI will automatically choose the best colors based on your content and style
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.value}
                  onClick={() => onChange({ ...value, colorPalette: palette.value })}
                  className={cn(
                    'group flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300',
                    'hover:-translate-y-0.5 hover:shadow-md',
                    value.colorPalette === palette.value
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-border/50 hover:border-primary/50 hover:bg-accent/50'
                  )}
                >
                  <div className="flex gap-1.5 mb-2">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-center">{palette.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout Structure */}
        <div className="space-y-3">
          <Label>Layout Structure</Label>
          <Select
            value={value.layoutStructure}
            onValueChange={(v: LayoutStructure) => onChange({ ...value, layoutStructure: v })}
          >
            <SelectTrigger className="transition-all duration-300 hover:border-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {layoutStructures.map((layout) => (
                <SelectItem key={layout.value} value={layout.value}>
                  <div className="flex items-center gap-2">
                    <span>{layout.label}</span>
                    <span className="text-muted-foreground">- {layout.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}