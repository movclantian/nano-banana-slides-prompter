import { useState } from 'react';
import { Check, Copy, FileText, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { SlideCard } from './SlideCard';
import type { GeneratedPrompt, OutputFormat } from '@/types/slidePrompt';

interface PromptOutputProps {
  prompt: GeneratedPrompt | null;
}

export function PromptOutput({ prompt }: PromptOutputProps) {
  const [format, setFormat] = useState<OutputFormat>('text');
  const [copied, setCopied] = useState(false);
  const [allExpanded, setAllExpanded] = useState(true);
  const { toast } = useToast();

  if (!prompt) {
    return (
      <Card className="border-dashed border-2 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-2xl bg-muted/50 mb-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No prompt generated yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Add your content, select a style, and configure settings, then click "Generate Prompt" to create your slide prompt.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleCopyAll = async () => {
    const textToCopy = format === 'text'
      ? prompt.plainText
      : JSON.stringify(prompt.jsonFormat, null, 2);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({
        title: 'Copied All!',
        description: `All ${prompt.slides.length} slide prompts copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please select and copy the text manually.',
        variant: 'destructive',
      });
    }
  };

  const hasSlides = prompt.slides && prompt.slides.length > 0;

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl shadow-black/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Generated Prompts
            {hasSlides && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({prompt.slides.length} slides)
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasSlides && format === 'text' && (
              <Button
                onClick={() => setAllExpanded(!allExpanded)}
                variant="ghost"
                size="sm"
              >
                {allExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Collapse All
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Expand All
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={handleCopyAll}
              variant="outline"
              size="sm"
              className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy All'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Slides
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Raw Output
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-0">
            {hasSlides ? (
              <div className="space-y-3">
                {prompt.slides.map((slide) => (
                  <SlideCard
                    key={slide.slideNumber}
                    slide={slide}
                    defaultOpen={allExpanded}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 max-h-96 overflow-auto border border-border/30">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {prompt.plainText}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="json" className="mt-0">
            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 max-h-96 overflow-auto border border-border/30">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {prompt.plainText}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground mt-4">
          {format === 'text'
            ? 'Click on each slide to expand. Copy individual prompts or all at once.'
            : 'Raw LLM output for debugging or custom processing.'}
        </p>
      </CardContent>
    </Card>
  );
}
