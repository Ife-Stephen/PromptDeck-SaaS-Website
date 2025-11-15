import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for email confirmation or password reset in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'signup') {
      // Email confirmed successfully
      toast({
        title: "Email verified!",
        description: "Your email address has been activated. You can now sign in.",
      });
      setActiveTab("signin");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (type === 'recovery') {
      // Password reset link clicked
      setShowResetPassword(true);
      toast({
        title: "Reset your password",
        description: "Please enter your new password below.",
      });
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !showResetPassword) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate, toast, showResetPassword]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            first_name: firstName,
            last_name: lastName,
            display_name: firstName
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setShowForgotPassword(false);
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been changed successfully.",
      });
      
      setShowResetPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-gradient px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-background/80"></div>
      <Card className="w-full max-w-md relative z-10 card-glow border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl font-bold text-primary-foreground">P</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent mb-2">
            PromptDeck
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {showResetPassword ? "Reset your password" : showForgotPassword ? "Reset your password" : "Welcome to the future of AI prompts"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          {showResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="new-password" className="text-sm font-semibold text-foreground">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 auth-button text-white font-semibold text-base rounded-lg shadow-lg" 
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          ) : showForgotPassword ? (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="reset-email" className="text-sm font-semibold text-foreground">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 auth-button text-white font-semibold text-base rounded-lg shadow-lg" 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setEmail("");
                  }}
                >
                  Back to Sign In
                </Button>
              </form>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="signin" className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-6">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 auth-button text-white font-semibold text-base rounded-lg shadow-lg" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-email" className="text-sm font-semibold text-foreground">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password" className="text-sm font-semibold text-foreground">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Choose a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input h-12 px-4 bg-background/50 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 auth-button text-white font-semibold text-base rounded-lg shadow-lg" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;