
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Copy, Download, RefreshCw, Zap, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

const CreateContent = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackUsage, canUseFeature, usage } = useSubscription();
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState("professional");
  const [enablePostProcessing, setEnablePostProcessing] = useState(true);
  const [processingInfo, setProcessingInfo] = useState<{processedWithAI?: boolean, tone?: string}>({});

  const contentTypes = {
    'social-post': {
      title: 'Social Media Post',
      description: 'Generate engaging posts for your social media platforms',
      placeholder: 'Describe what you want to post about (e.g., "A motivational post about productivity for entrepreneurs")',
      icon: '📱'
    },
    'captions': {
      title: 'Caption Generator',
      description: 'Create catchy captions for your photos and videos',
      placeholder: 'Describe your content or the mood you want (e.g., "Fun caption for a beach vacation photo")',
      icon: '💬'
    },
    'hashtags': {
      title: 'Hashtag Generator',
      description: 'Generate relevant hashtags to boost your reach',
      placeholder: 'What is your post about? (e.g., "Fitness workout at home")',
      icon: '#️⃣'
    },
    'threads': {
      title: 'Thread Content',
      description: 'Create engaging Twitter/X threads',
      placeholder: 'What topic do you want to create a thread about? (e.g., "10 productivity tips for remote workers")',
      icon: '🧵'
    },
    'blog-posts': {
      title: 'Blog Post',
      description: 'Create engaging blog content for your website',
      placeholder: 'Describe the blog post topic (e.g., "A comprehensive guide to digital marketing for small businesses")',
      icon: '📖'
    },
    'articles': {
      title: 'Article',
      description: 'Write professional articles for your industry',
      placeholder: 'What article would you like to write? (e.g., "The future of AI in healthcare industry")',
      icon: '✍️'
    },
    'website-copy': {
      title: 'Website Copy',
      description: 'Generate compelling website content',
      placeholder: 'What type of website copy do you need? (e.g., "About page for a tech startup")',
      icon: '🌐'
    },
    'marketing-copy': {
      title: 'Marketing Copy',
      description: 'Create persuasive marketing content',
      placeholder: 'Describe your marketing content needs (e.g., "Email marketing campaign for a new product launch")',
      icon: '📢'
    }
  };

  const currentType = contentTypes[type as keyof typeof contentTypes];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what content you'd like to generate",
        variant: "destructive",
      });
      return;
    }

    if (!canUseFeature) {
      toast({
        title: "🚀 Free Limit Exceeded!",
        description: "You've used all 5 free prompts for today. Upgrade to Pro (1,000 prompts/day) or Enterprise (10,000 prompts/day) to continue creating amazing content!",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const canProceed = await trackUsage();
      if (!canProceed) {
        toast({
          title: "🚀 Free Limit Exceeded!",
          description: "You've reached your 5 free prompts for today! Upgrade to Pro (1,000 prompts/day) or Enterprise (10,000 prompts/day) to continue creating amazing content.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt,
          contentType: type,
          tone,
          enablePostProcessing,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate content');
      }

      setGeneratedContent(data.content);
      setProcessingInfo({ processedWithAI: data.processedWithAI, tone: data.tone });
      
      toast({
        title: "Content generated!",
        description: data.processedWithAI ? "Enhanced with AI post-processing" : "Basic content generated",
      });
    } catch (error) {
      toast({
        title: "Error generating content",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to clipboard!",
      description: "Your content has been copied",
    });
  };

  if (!currentType) {
    return <div>Content type not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{currentType.icon}</span>
            <h1 className="text-2xl font-bold">{currentType.title}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-white/60 backdrop-blur-sm border-2 border-purple-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Content Prompt</span>
              </CardTitle>
              <CardDescription>
                {currentType.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={currentType.placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none border-purple-200/50 focus:border-purple-400 transition-colors"
              />
              
              {/* Enhancement Settings */}
              <Card className="bg-gradient-to-r from-purple-50/50 to-blue-50/50 border border-purple-200/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Enhancement Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tone-select" className="text-sm font-medium">Content Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger id="tone-select">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual & Friendly</SelectItem>
                          <SelectItem value="witty">Witty & Entertaining</SelectItem>
                          <SelectItem value="persuasive">Persuasive & Compelling</SelectItem>
                          <SelectItem value="empathetic">Empathetic & Understanding</SelectItem>
                          <SelectItem value="confident">Confident & Inspiring</SelectItem>
                          <SelectItem value="conversational">Conversational & Warm</SelectItem>
                          <SelectItem value="urgent">Urgent & Time-sensitive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="post-processing" className="text-sm font-medium">AI Post-Processing</Label>
                        <p className="text-xs text-muted-foreground">
                          Enhance with rewriting, style refinement & grammar correction
                        </p>
                      </div>
                      <Switch 
                        id="post-processing"
                        checked={enablePostProcessing} 
                        onCheckedChange={setEnablePostProcessing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="bg-white/60 backdrop-blur-sm border-2 border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>Generated Content</span>
                  {generatedContent && <Badge variant="secondary">Ready</Badge>}
                </div>
                {generatedContent && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-3">
                  {processingInfo.processedWithAI && (
                    <div className="flex flex-wrap gap-2 pb-2 border-b border-blue-200/30">
                      <Badge variant="outline" className="text-xs">
                        ✨ AI Enhanced
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📝 Style Refined
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        🎯 Tone: {processingInfo.tone || tone}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ✅ Grammar Corrected
                      </Badge>
                    </div>
                  )}
                  <div className="bg-white/80 rounded-lg p-4 border border-blue-200/50 min-h-[300px]">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-gray-500">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Ready to create amazing content?</p>
                    <p className="text-sm">Enter your prompt above and click generate to get started</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50">
          <CardHeader>
            <CardTitle className="text-lg">💡 Tips for better results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Be specific about your target audience and platform</li>
              <li>• Choose the appropriate tone from the dropdown for your content</li>
              <li>• Enable AI post-processing for more natural, engaging results</li>
              <li>• Mention any specific keywords or topics to include</li>
              <li>• Specify the length if you have requirements</li>
              <li>• Post-processing includes: rewriting for human style, tone adjustment, and grammar refinement</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;
