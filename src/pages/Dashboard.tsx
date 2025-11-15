
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Users, Crown, LogOut, FileText, MessageSquare, Hash, Heart, PenTool, Globe, Mail, BookOpen, Megaphone, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

const Dashboard = () => {
  const { user, loading, userProfile, signOut } = useAuth();
  const { subscription, usage, createCheckout, openCustomerPortal } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateContent = (type: string) => {
    navigate(`/create/${type}`);
  };

  const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
    try {
      const checkoutUrl = await createCheckout(plan);
      window.open(checkoutUrl, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            PromptDeck
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Welcome, </span>
            <span className="font-medium">{userProfile?.display_name || user.email}</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {subscription.subscription_tier === 'free' && 'Free'}
              {subscription.subscription_tier === 'pro' && 'Pro'}
              {subscription.subscription_tier === 'enterprise' && 'Enterprise'}
            </Badge>
          </div>
          {subscription.subscribed && (
            <Button variant="outline" size="sm" onClick={openCustomerPortal} className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Manage</span>
            </Button>
          )}
          <Button variant="outline" onClick={signOut} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Content Creation Hub */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">AI Content Generation</h2>
        <p className="text-muted-foreground mb-8">Powered by Groq's llama-3.3-70b-versatile model for high-quality text content</p>
        
        {/* Social Media Content */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Social Media Content</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('social-post')}>
              <CardHeader className="text-center">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Social Posts</CardTitle>
                <CardDescription>Generate engaging social media posts</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('captions')}>
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Captions</CardTitle>
                <CardDescription>Create catchy captions for your content</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('hashtags')}>
              <CardHeader className="text-center">
                <Hash className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Hashtags</CardTitle>
                <CardDescription>Generate trending hashtags</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('threads')}>
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Thread Content</CardTitle>
                <CardDescription>Create Twitter/X thread content</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Professional Content */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Professional Content</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('blog-posts')}>
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Blog Posts</CardTitle>
                <CardDescription>Create engaging blog content</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('articles')}>
              <CardHeader className="text-center">
                <PenTool className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Articles</CardTitle>
                <CardDescription>Write professional articles</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('website-copy')}>
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Website Copy</CardTitle>
                <CardDescription>Generate website content</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-105" 
                  onClick={() => handleCreateContent('marketing-copy')}>
              <CardHeader className="text-center">
                <Megaphone className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Marketing Copy</CardTitle>
                <CardDescription>Create compelling marketing content</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Tier */}
          <Card className="bg-white/60 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                <Zap className="h-6 w-6 text-blue-500" />
                <span>Starter</span>
              </CardTitle>
              <div className="text-3xl font-bold mt-4">Free</div>
              <CardDescription className="mt-4">Perfect for getting started with AI content generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>• 5 prompts per day</li>
                <li>• Social media posts & captions</li>
                <li>• Basic hashtag generation</li>
                <li>• Thread content creation</li>
                <li>• Community support</li>
              </ul>
              {subscription.subscription_tier === 'free' ? (
                <Button className="w-full" variant="outline" disabled>Current Plan</Button>
              ) : (
                <Button className="w-full" variant="outline" onClick={() => handleUpgrade('pro')}>Downgrade</Button>
              )}
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 hover:shadow-xl transition-all duration-300 relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Most Popular
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                <Crown className="h-6 w-6 text-purple-600" />
                <span>Pro</span>
              </CardTitle>
              <div className="text-3xl font-bold mt-4">$19<span className="text-base font-normal">/month</span></div>
              <CardDescription className="mt-4">For content creators and small businesses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>• 1,000 prompts per day</li>
                <li>• All social media content types</li>
                <li>• Blog posts & articles</li>
                <li>• Website copy generation</li>
                <li>• Marketing content creation</li>
                <li>• Priority support</li>
                <li>• AI post-processing</li>
              </ul>
              {subscription.subscription_tier === 'pro' ? (
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled>Current Plan</Button>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => handleUpgrade('pro')}
                >
                  Upgrade to Pro
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card className="bg-white/60 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                <Users className="h-6 w-6 text-indigo-600" />
                <span>Enterprise</span>
              </CardTitle>
              <div className="text-3xl font-bold mt-4">$99<span className="text-base font-normal">/month</span></div>
              <CardDescription className="mt-4">For teams and large organizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>• 10,000 prompts per day</li>
                <li>• All content types available</li>
                <li>• Team collaboration features</li>
                <li>• Custom content templates</li>
                <li>• Brand voice customization</li>
                <li>• Dedicated account manager</li>
                <li>• API access</li>
                <li>• Advanced analytics</li>
              </ul>
              {subscription.subscription_tier === 'enterprise' ? (
                <Button className="w-full" variant="outline" disabled>Current Plan</Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleUpgrade('enterprise')}
                >
                  Upgrade to Enterprise
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Recent Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Product Launch Campaign</span>
                <Badge variant="secondary" className="text-xs">2 days ago</Badge>
              </CardTitle>
              <CardDescription>Social media strategy for SaaS product</CardDescription>
              <Badge variant="secondary" className="w-fit">Marketing Copy</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                "🚀 Transform your workflow with our new AI-powered tool. Say goodbye to manual tasks and hello to efficiency..."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">3 pieces generated</span>
                <Button size="sm" onClick={() => handleCreateContent('social-post')}>View Project</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SEO Blog Series</span>
                <Badge variant="secondary" className="text-xs">5 days ago</Badge>
              </CardTitle>
              <CardDescription>Complete guide to digital marketing</CardDescription>
              <Badge variant="secondary" className="w-fit">Blog Posts</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                "Master Digital Marketing in 2024: A comprehensive guide covering SEO, content strategy, and social media..."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">8 articles created</span>
                <Button size="sm" onClick={() => handleCreateContent('blog-posts')}>View Project</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Weekly Newsletter</span>
                <Badge variant="secondary" className="text-xs">1 week ago</Badge>
              </CardTitle>
              <CardDescription>Technology trends and insights</CardDescription>
              <Badge variant="secondary" className="w-fit">Articles</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                "This Week in Tech: AI breakthroughs, startup funding news, and the latest in cybersecurity developments..."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">5 editions published</span>
                <Button size="sm" onClick={() => handleCreateContent('articles')}>View Project</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Stats */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Your Usage</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Daily Usage</span>
              </CardTitle>
              <div className="text-3xl font-bold">{usage.prompts_used} <span className="text-base font-normal text-muted-foreground">/ {usage.limit}</span></div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${(usage.prompts_used / usage.limit) * 100}%` }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{usage.limit - usage.prompts_used} prompts remaining today</p>
              {usage.prompts_used >= usage.limit && subscription.subscription_tier === 'free' && (
                <p className="text-xs text-destructive mt-1">Daily limit reached. Upgrade to continue.</p>
              )}
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Total Projects</span>
              </CardTitle>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">3 active projects</p>
              <div className="flex space-x-1 mt-2">
                <Badge variant="outline" className="text-xs">Social: 5</Badge>
                <Badge variant="outline" className="text-xs">Blog: 4</Badge>
                <Badge variant="outline" className="text-xs">Copy: 3</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <span>Membership</span>
              </CardTitle>
              <div className="text-xl font-semibold">
                {subscription.subscription_tier === 'free' && 'Free Plan'}
                {subscription.subscription_tier === 'pro' && 'Pro Plan'}
                {subscription.subscription_tier === 'enterprise' && 'Enterprise Plan'}
              </div>
              <p className="text-sm text-muted-foreground">Member since Dec 2024</p>
              {!subscription.subscribed ? (
                <Button size="sm" variant="outline" className="w-fit mt-2" 
                        onClick={() => handleUpgrade('pro')}>
                  Upgrade Plan
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="w-fit mt-2" 
                        onClick={openCustomerPortal}>
                  Manage Subscription
                </Button>
              )}
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
