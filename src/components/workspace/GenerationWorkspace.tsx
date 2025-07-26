import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Save,
  RefreshCw,
  Download,
  Copy,
  Wand2,
  Settings,
  Sparkles,
  Send,
} from "lucide-react";

interface GenerationWorkspaceProps {
  templates?: TemplateType[];
  brandVoices?: BrandVoiceType[];
}

interface TemplateType {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface BrandVoiceType {
  id: string;
  name: string;
  description: string;
  tone: string;
}

const GenerationWorkspace: React.FC<GenerationWorkspaceProps> = ({
  templates = [
    {
      id: "1",
      name: "Social Media Post",
      description: "Create engaging social media content",
      category: "Social",
    },
    {
      id: "2",
      name: "Blog Article",
      description: "Generate full blog articles with sections",
      category: "Blog",
    },
    {
      id: "3",
      name: "Email Newsletter",
      description: "Craft compelling email newsletters",
      category: "Email",
    },
    {
      id: "4",
      name: "Landing Page Copy",
      description: "Create converting landing page content",
      category: "Website",
    },
    {
      id: "5",
      name: "Product Description",
      description: "Write detailed product descriptions",
      category: "E-commerce",
    },
  ],
  brandVoices = [
    {
      id: "1",
      name: "Professional",
      description: "Formal and business-oriented tone",
      tone: "Formal",
    },
    {
      id: "2",
      name: "Casual",
      description: "Friendly and conversational",
      tone: "Casual",
    },
    {
      id: "3",
      name: "Enthusiastic",
      description: "Energetic and exciting",
      tone: "Energetic",
    },
    {
      id: "4",
      name: "Authoritative",
      description: "Expert and confident",
      tone: "Confident",
    },
    {
      id: "5",
      name: "Humorous",
      description: "Light-hearted and funny",
      tone: "Funny",
    },
  ],
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [creativityLevel, setCreativityLevel] = useState<number[]>([50]);
  const [contentLength, setContentLength] = useState<string>("medium");
  const [includeKeywords, setIncludeKeywords] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>("");

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate AI generation with a timeout
    setTimeout(() => {
      setGeneratedContent(
        `# Generated Content Example

This is a sample of AI-generated content based on your inputs. In a real implementation, this would be the response from the AI model.

## Parameters Used
- Template: ${templates.find((t) => t.id === selectedTemplate)?.name || "None selected"}
- Brand Voice: ${brandVoices.find((v) => v.id === selectedVoice)?.name || "None selected"}
- Creativity Level: ${creativityLevel[0]}%
- Content Length: ${contentLength}
- Keywords: ${includeKeywords ? keywords : "None"}

## Your Prompt
${prompt || "No prompt provided"}

## Generated Content
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.`,
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    // Placeholder for save functionality
    console.log("Content saved");
  };

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Content exported");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    // In a real app, you would show a toast notification here
    console.log("Content copied to clipboard");
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    // Simulate regeneration
    setTimeout(() => {
      setGeneratedContent(
        `${generatedContent}\n\n--- Regenerated Content ---\n\nThis is a regenerated version of the content with some variations. In a real implementation, this would be a new response from the AI model with the same parameters but potentially different output due to the nature of generative AI.`,
      );
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-background">
      <div className="container mx-auto p-4 h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Generation Workspace</h1>
            <p className="text-muted-foreground">
              Create AI-powered content with your brand voice
            </p>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save to library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[800px] rounded-lg border"
        >
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="h-full p-4 bg-card">
              <h2 className="text-lg font-semibold mb-4">Configuration</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && (
                    <p className="text-xs text-muted-foreground">
                      {
                        templates.find((t) => t.id === selectedTemplate)
                          ?.description
                      }
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-voice">Brand Voice</Label>
                  <Select
                    value={selectedVoice}
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger id="brand-voice">
                      <SelectValue placeholder="Select a brand voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVoice && (
                    <p className="text-xs text-muted-foreground">
                      {
                        brandVoices.find((v) => v.id === selectedVoice)
                          ?.description
                      }
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="creativity">Creativity Level</Label>
                      <Badge variant="outline">{creativityLevel[0]}%</Badge>
                    </div>
                    <Slider
                      id="creativity"
                      min={0}
                      max={100}
                      step={1}
                      value={creativityLevel}
                      onValueChange={setCreativityLevel}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-length">Content Length</Label>
                    <Select
                      value={contentLength}
                      onValueChange={setContentLength}
                    >
                      <SelectTrigger id="content-length">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="keywords"
                      checked={includeKeywords}
                      onCheckedChange={setIncludeKeywords}
                    />
                    <Label htmlFor="keywords">Include Keywords</Label>
                  </div>

                  {includeKeywords && (
                    <div className="space-y-2">
                      <Label htmlFor="keywords-input">
                        Keywords (comma separated)
                      </Label>
                      <Input
                        id="keywords-input"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter keywords..."
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="prompt">Your Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to create..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={
                    isGenerating ||
                    !selectedTemplate ||
                    !selectedVoice ||
                    !prompt.trim()
                  }
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={70}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Generated Content</h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!generatedContent}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={!generatedContent || isGenerating}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
                    />
                    Regenerate
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                {generatedContent ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans">
                      {generatedContent}
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">
                      No Content Generated Yet
                    </h3>
                    <p className="max-w-sm mt-2">
                      Select a template, set your brand voice, and enter a
                      prompt to generate AI-powered content.
                    </p>
                  </div>
                )}
              </ScrollArea>

              {generatedContent && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a comment or feedback for regeneration..."
                      className="flex-1"
                    />
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Send Feedback
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export { GenerationWorkspace };
export default GenerationWorkspace;
