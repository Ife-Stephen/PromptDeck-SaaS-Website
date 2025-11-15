import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Users, Crown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
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
          <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
          <Button variant="outline" onClick={signOut} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-6">
          <Sparkles className="h-4 w-4 mr-1" />
          AI-Powered Content Creation
        </Badge>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Turn your ideas into
          <br />
          branded content, fast.
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          PromptDeck is the all-in-one content creation workspace for digital creators and entrepreneurs. 
          Generate, organize, and collaborate on branded content with AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="hero" className="text-lg px-8 py-6">
            <Zap className="h-5 w-5 mr-2" />
            Start Creating Free
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Everything you need to create amazing content</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Generate branded posts, emails, and landing page copy using advanced AI
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work with virtual assistants and team members in real-time
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <Crown className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Premium Templates</CardTitle>
              <CardDescription>
                Access pre-designed templates with stunning AI-generated visuals
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Choose your plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  5 prompts per day
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Basic templates
                </li>
                <li className="flex items-center text-muted-foreground">
                  Watermark on assets
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Get Started</Button>
            </CardContent>
          </Card>

          {/* Creator Plan */}
          <Card className="relative border-primary shadow-lg scale-105">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Creator</CardTitle>
              <CardDescription>For serious content creators</CardDescription>
              <div className="text-3xl font-bold">$12<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited prompts
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Save & export content
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Premium templates
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  No watermarks
                </li>
              </ul>
              <Button className="w-full mt-6" variant="premium">Choose Creator</Button>
            </CardContent>
          </Card>

          {/* Pro Studio */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Pro Studio</CardTitle>
              <CardDescription>For teams and agencies</CardDescription>
              <div className="text-3xl font-bold">$29<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Everything in Creator
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  AI workflows
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Design export
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Priority support
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Choose Pro</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PromptDeck</span>
          </div>
          <p className="text-muted-foreground">
            Turn your ideas into branded content, fast.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;