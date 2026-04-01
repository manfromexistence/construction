"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Github from "@/assets/github.svg";
import Google from "@/assets/google.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { useToast } from "@/components/ui/use-toast";
import { PostLoginActionType } from "@/hooks/use-post-login-action";
import { authClient } from "@/lib/auth-client";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
  trigger?: React.ReactNode; // Optional trigger element
  postLoginActionType?: PostLoginActionType | null;
}

// Get contextual copy based on the post-login action
function getContextualCopy(actionType?: PostLoginActionType | null) {
  switch (actionType) {
    case "SAVE_THEME":
      return {
        title: "Sign in to Save",
        description: "Sign in to save your theme and access it from anywhere",
      };
    case "SAVE_THEME_FOR_SHARE":
      return {
        title: "Sign in to Share",
        description: "Sign in to save and share your theme with others",
      };
    case "SAVE_THEME_FOR_V0":
      return {
        title: "Sign in to open in v0",
        description: "Sign in to save your theme and open it in v0",
      };
    case "AI_GENERATE_FROM_PAGE":
    case "AI_GENERATE_FROM_CHAT":
    case "AI_GENERATE_FROM_CHAT_SUGGESTION":
    case "AI_GENERATE_EDIT":
    case "AI_GENERATE_RETRY":
      return {
        title: "Sign in for AI",
        description: "Sign in to use AI-powered theme generation",
      };
    case "CHECKOUT":
      return {
        title: "Sign in to continue",
        description: "Sign in to complete your purchase",
      };
    default:
      return null;
  }
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "signin",
  trigger,
  postLoginActionType,
}: AuthDialogProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSignIn, setIsSignIn] = useState(initialMode === "signin");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const contextualCopy = getContextualCopy(postLoginActionType);

  const getCallbackUrl = () => {
    const baseUrl = pathname || "/dashboard";
    const queryString = searchParams?.toString() || "";
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  useEffect(() => {
    if (open) {
      setIsSignIn(initialMode === "signin");
      setEmail("");
      setPassword("");
      setName("");
    }
  }, [open, initialMode]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: getCallbackUrl(),
      });
    } catch (error) {
      console.error("Google Sign In Error:", error);
      setIsGoogleLoading(false);
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: getCallbackUrl(),
      });
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      setIsGithubLoading(false);
      toast({
        title: "Error",
        description: "Failed to sign in with GitHub. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isSignIn && !name) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsEmailLoading(true);

    try {
      if (isSignIn) {
        await authClient.signIn.email({
          email,
          password,
          callbackURL: getCallbackUrl(),
        });
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
      } else {
        await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: getCallbackUrl(),
        });
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      }
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Email Auth Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description:
          errorMessage || `Failed to ${isSignIn ? "sign in" : "sign up"}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>}
      <ResponsiveDialogContent className="overflow-hidden sm:max-w-100">
        <div className="space-y-4">
          <ResponsiveDialogHeader className="sm:pt-8">
            <ResponsiveDialogTitle className="text-center text-2xl font-bold">
              {contextualCopy?.title ?? (isSignIn ? "Welcome back" : "Create account")}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="text-center">
              {contextualCopy?.description ??
                (isSignIn
                  ? "Sign in to your account to continue"
                  : "Create an account to get started")}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="space-y-6 p-6 pt-2">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isEmailLoading}
                    required={!isSignIn}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isEmailLoading}
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isEmailLoading || isGoogleLoading || isGithubLoading}
              >
                {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignIn ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="hover:bg-primary/10 hover:text-foreground flex w-full items-center justify-center gap-2"
                disabled={isGoogleLoading || isGithubLoading || isEmailLoading}
              >
                <Google className="h-5 w-5" />
                <span className="font-medium">Continue with Google</span>
                {isGoogleLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </Button>

              <Button
                variant="outline"
                onClick={handleGithubSignIn}
                size="lg"
                className="hover:bg-primary/10 hover:text-foreground flex w-full items-center justify-center gap-2"
                disabled={isGoogleLoading || isGithubLoading || isEmailLoading}
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">Continue with GitHub</span>
                {isGithubLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </Button>
            </div>

            <div className="pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    {isSignIn ? "New to Construction EDMS?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary focus:ring-primary text-sm font-medium hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  {isSignIn ? "Create an account" : "Sign in to your account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
