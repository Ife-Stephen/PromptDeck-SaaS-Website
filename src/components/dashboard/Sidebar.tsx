import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  PenTool,
  Save,
  Users,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  className?: string;
  activePage?: string;
}

const Sidebar = ({ className, activePage = "dashboard" }: SidebarProps) => {
  // Mock user data - in a real app, this would come from auth context
  const user = {
    name: "Jane Cooper",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    plan: "creator",
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    {
      name: "Prompt Library",
      path: "/prompts",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Generation Workspace",
      path: "/workspace",
      icon: <PenTool className="h-5 w-5" />,
    },
    {
      name: "Saved Content",
      path: "/saved",
      icon: <Save className="h-5 w-5" />,
    },
    {
      name: "Team Workspace",
      path: "/team",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full w-[280px] border-r bg-background",
        className,
      )}
    >
      {/* Logo section */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1">
            <PenTool className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">PromptDeck</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link to={item.path}>
                <Button
                  variant={
                    activePage === item.name.toLowerCase().replace(" ", "-")
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start gap-3 font-normal"
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subscription info */}
      <div className="px-4 py-2">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium">Your Plan</h3>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary" className="capitalize">
              {user.plan}
            </Badge>
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {user.plan === "free" && "5 prompts/day"}
            {user.plan === "creator" && "50 prompts/day"}
            {user.plan === "pro" && "Unlimited prompts"}
          </div>
        </div>
      </div>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
