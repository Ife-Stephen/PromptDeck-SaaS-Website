import React, { useState } from "react";
import GenerationWorkspace from "@/components/workspace/GenerationWorkspace";
import PromptLibrary from "@/components/library/PromptLibrary";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Share2 } from "lucide-react";

type ContentType =
  | "dashboard"
  | "promptLibrary"
  | "generationWorkspace"
  | "savedContent"
  | "teamWorkspace";

interface ContentAreaProps {
  activeContent?: ContentType;
}

const ContentArea = ({ activeContent = "dashboard" }: ContentAreaProps) => {
  const [currentContent, setCurrentContent] =
    useState<ContentType>(activeContent);

  const renderContent = () => {
    switch (currentContent) {
      case "dashboard":
        return (
          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Prompt Library"
                description="Browse and manage your saved prompts"
                count={12}
                onClick={() => setCurrentContent("promptLibrary")}
              />
              <DashboardCard
                title="Generation Workspace"
                description="Create new content with AI assistance"
                count={5}
                label="Recent generations"
                onClick={() => setCurrentContent("generationWorkspace")}
              />
              <DashboardCard
                title="Saved Content"
                description="Access your previously saved content"
                count={24}
                onClick={() => setCurrentContent("savedContent")}
              />
              <DashboardCard
                title="Team Workspace"
                description="Collaborate with your team members"
                count={3}
                label="Team members"
                onClick={() => setCurrentContent("teamWorkspace")}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Item</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivityData.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.type}</td>
                        <td className="p-3">{item.date}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "promptLibrary":
        return <PromptLibrary />;
      case "generationWorkspace":
        return <GenerationWorkspace />;
      case "savedContent":
        return (
          <div className="p-6 bg-white">
            <h1 className="text-2xl font-bold mb-6">Saved Content</h1>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Button variant="outline">All Content</Button>
                <Button variant="outline">Blog Posts</Button>
                <Button variant="outline">Social Media</Button>
                <Button variant="outline">Email</Button>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Content
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedContentData.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {item.preview}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-muted-foreground">
                      {item.date}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "teamWorkspace":
        return (
          <div className="p-6 bg-white">
            <h1 className="text-2xl font-bold mb-6">Team Workspace</h1>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Button variant="outline">All Members</Button>
                <Button variant="outline">Shared Content</Button>
                <Button variant="outline">Permissions</Button>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <h2 className="text-lg font-medium mb-4">Team Members</h2>
                <div className="space-y-3">
                  {teamMembersData.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border rounded-lg"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <h2 className="text-lg font-medium mb-4">
                  Recent Shared Content
                </h2>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Content</th>
                        <th className="text-left p-3 font-medium">Shared By</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedContentData.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{item.title}</td>
                          <td className="p-3">{item.sharedBy}</td>
                          <td className="p-3">{item.date}</td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-6">
          <h2 className="text-lg font-semibold">
            {currentContent === "dashboard" && "Dashboard"}
            {currentContent === "promptLibrary" && "Prompt Library"}
            {currentContent === "generationWorkspace" && "Generation Workspace"}
            {currentContent === "savedContent" && "Saved Content"}
            {currentContent === "teamWorkspace" && "Team Workspace"}
          </h2>
          <div className="ml-auto flex items-center space-x-4">
            {currentContent !== "dashboard" && (
              <Button
                variant="outline"
                onClick={() => setCurrentContent("dashboard")}
              >
                Back to Dashboard
              </Button>
            )}
            {(currentContent === "promptLibrary" ||
              currentContent === "generationWorkspace") && (
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                {currentContent === "promptLibrary"
                  ? "New Prompt"
                  : "New Generation"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  count: number;
  label?: string;
  onClick: () => void;
}

const DashboardCard = ({
  title,
  description,
  count,
  label = "Items",
  onClick,
}: DashboardCardProps) => {
  return (
    <div
      className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold">{count}</span>
          <span className="text-sm text-muted-foreground ml-2">{label}</span>
        </div>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
    </div>
  );
};

// Mock data
const recentActivityData = [
  { name: "Marketing Email Template", type: "Prompt", date: "Today, 2:30 PM" },
  {
    name: "Blog Post: AI Trends 2024",
    type: "Content",
    date: "Yesterday, 10:15 AM",
  },
  { name: "Instagram Caption Set", type: "Prompt", date: "2 days ago" },
  { name: "Product Launch Email", type: "Content", date: "3 days ago" },
];

const savedContentData = [
  {
    title: "How AI is Transforming Content Creation",
    type: "Blog Post",
    preview:
      "Artificial intelligence is revolutionizing how creators approach content development. This post explores the latest trends...",
    date: "May 15, 2024",
  },
  {
    title: "Summer Sale Announcement",
    type: "Email",
    preview:
      "Get ready for our biggest sale of the season! Starting this weekend, enjoy up to 50% off on all premium templates...",
    date: "May 12, 2024",
  },
  {
    title: "Product Feature Highlights",
    type: "Social Media",
    preview:
      "Our latest update includes these game-changing features that will transform your workflow...",
    date: "May 10, 2024",
  },
  {
    title: "Customer Success Story: Agency X",
    type: "Case Study",
    preview:
      "Learn how Agency X increased their content output by 300% while maintaining brand consistency across all channels...",
    date: "May 8, 2024",
  },
  {
    title: "Weekly Newsletter Template",
    type: "Email",
    preview:
      "A clean, modern template for your weekly updates to subscribers with sections for featured content, tips, and announcements...",
    date: "May 5, 2024",
  },
  {
    title: "Platform Announcement",
    type: "Press Release",
    preview:
      "We are excited to announce our latest platform integration with leading industry tools to streamline your content workflow...",
    date: "May 3, 2024",
  },
];

const teamMembersData = [
  { name: "Alex Johnson", role: "Admin" },
  { name: "Sarah Williams", role: "Content Creator" },
  { name: "Michael Chen", role: "Editor" },
];

const sharedContentData = [
  {
    title: "Q2 Marketing Campaign",
    sharedBy: "Alex Johnson",
    date: "May 15, 2024",
  },
  {
    title: "Product Launch Email Sequence",
    sharedBy: "Sarah Williams",
    date: "May 12, 2024",
  },
  {
    title: "Social Media Calendar",
    sharedBy: "Michael Chen",
    date: "May 10, 2024",
  },
  {
    title: "Blog Content Strategy",
    sharedBy: "Alex Johnson",
    date: "May 8, 2024",
  },
];

export { ContentArea };
