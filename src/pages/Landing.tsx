import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Users, Crown, Play } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleWatchDemo = () => {
    // For now, just show an alert. You can replace this with actual demo functionality
    alert("Demo video coming soon!");
  };

  const handleChoosePlan = (plan: string) => {
    // For now, navigate to auth. Later this could go to a specific signup with plan selection
    navigate("/auth");
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
          <Button variant="ghost" onClick={handleLogin} className="text-base">
            Login
          </Button>
          <Button onClick={handleGetStarted} className="text-base">
            Get Started
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
          <Button size="lg" variant="hero" className="text-lg px-8 py-6" onClick={handleGetStarted}>
            <Zap className="h-5 w-5 mr-2" />
            Start Creating Free
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={handleWatchDemo}>
            <Play className="h-5 w-5 mr-2" />
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Everything you need to create amazing content</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer" 
                onClick={() => handleGetStarted()}>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Generate branded posts, emails, and landing page copy using advanced AI
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleGetStarted()}>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work with virtual assistants and team members in real-time
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleGetStarted()}>
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
          {/* Starter Tier */}
          <Card className="relative hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Starter</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">Free</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  50 content generations/month
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Basic content types
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Standard support
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Export to common formats
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline" onClick={() => handleChoosePlan('starter')}>
                Choose Starter
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary shadow-lg scale-105 hover:shadow-2xl transition-all duration-300">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious content creators</CardDescription>
              <div className="text-3xl font-bold">$19<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  500 content generations/month
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  All content types
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Custom templates
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Bulk export
                </li>
              </ul>
              <Button className="w-full mt-6" onClick={() => handleChoosePlan('pro')}>
                Choose Pro
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="relative hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For teams and agencies</CardDescription>
              <div className="text-3xl font-bold">$99<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited generations
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  All features included
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  API access
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  White-label option
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline" onClick={() => handleChoosePlan('enterprise')}>
                Choose Enterprise
              </Button>
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

export default Landing;