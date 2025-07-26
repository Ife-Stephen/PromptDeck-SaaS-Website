import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Grid3X3,
  List,
  Tag,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  usageCount: number;
  isFavorite: boolean;
  createdAt: string;
}

const PromptLibrary = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock data for prompts
  const mockPrompts: Prompt[] = [
    {
      id: "1",
      title: "Blog Post Introduction",
      description:
        "Generate an engaging introduction for a blog post about {topic}.",
      category: "Blog",
      usageCount: 24,
      isFavorite: true,
      createdAt: "2023-06-15",
    },
    {
      id: "2",
      title: "Social Media Caption",
      description:
        "Create a catchy social media caption for {platform} about {subject}.",
      category: "Social Media",
      usageCount: 56,
      isFavorite: false,
      createdAt: "2023-07-22",
    },
    {
      id: "3",
      title: "Email Newsletter",
      description:
        "Write an email newsletter about {topic} with a compelling call to action.",
      category: "Email",
      usageCount: 18,
      isFavorite: true,
      createdAt: "2023-08-05",
    },
    {
      id: "4",
      title: "Product Description",
      description:
        "Generate a persuasive product description for {product} highlighting its benefits.",
      category: "E-commerce",
      usageCount: 32,
      isFavorite: false,
      createdAt: "2023-09-10",
    },
    {
      id: "5",
      title: "Landing Page Headline",
      description:
        "Create a compelling headline for a landing page about {service}.",
      category: "Website",
      usageCount: 41,
      isFavorite: true,
      createdAt: "2023-10-18",
    },
    {
      id: "6",
      title: "YouTube Video Script",
      description: "Write a script outline for a YouTube video about {topic}.",
      category: "Video",
      usageCount: 27,
      isFavorite: false,
      createdAt: "2023-11-05",
    },
  ];

  // Filter prompts based on search query and category
  const filteredPrompts = mockPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [
    "all",
    ...new Set(mockPrompts.map((prompt) => prompt.category)),
  ];

  return (
    <div className="bg-background p-6 h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prompt Library</h1>
        <Button className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Create New Prompt
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search prompts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs
            defaultValue="grid"
            className="w-[120px]"
            onValueChange={(value) => setView(value as "grid" | "list")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-medium mb-2">No prompts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters, or create a new prompt.
          </p>
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className={`${view === "list" ? "flex flex-row items-center" : ""} border hover:shadow-md transition-shadow`}
            >
              {view === "grid" ? (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      {prompt.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" /> {prompt.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {prompt.usageCount} uses
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Button variant="outline" size="sm">
                      Use Prompt
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Star
                        className={`h-4 w-4 ${prompt.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
                      />
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{prompt.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" /> {prompt.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {prompt.usageCount} uses
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {prompt.description}
                    </p>
                  </div>
                  <div className="p-4 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Use
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Star
                        className={`h-4 w-4 ${prompt.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export { PromptLibrary };
export default PromptLibrary;
