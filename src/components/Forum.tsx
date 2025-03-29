
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare, FileText, Upload, Mic, Video } from 'lucide-react';
import { ForumPost, getForumPosts, createForumPost } from '@/lib/api';
import { toast } from "sonner";

const Forum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMediaType, setNewPostMediaType] = useState<'text' | 'audio' | 'video'>('text');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getForumPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast.error("Failed to load forum posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const handleCreatePost = async () => {
    if (!newPostTitle.trim()) {
      toast.error("Please enter a title for your post.");
      return;
    }
    
    if (!newPostContent.trim()) {
      toast.error("Please enter content for your post.");
      return;
    }
    
    try {
      const post = {
        userId: "current-user", // In a real app, this would be the authenticated user's ID
        username: "CurrentUser", // In a real app, this would be the authenticated user's username
        title: newPostTitle,
        content: newPostContent,
        mediaType: newPostMediaType,
        mediaUrl: newPostMediaUrl.trim() || undefined
      };
      
      const createdPost = await createForumPost(post);
      setPosts([createdPost, ...posts]);
      
      // Reset form
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostMediaType('text');
      setNewPostMediaUrl('');
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again later.");
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
        <p className="text-gray-600 mb-6">
          Join the conversation about civic issues that matter to you.
        </p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[120px]"
            />
            <div>
              <p className="text-sm font-medium mb-2">Media Type</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={newPostMediaType === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewPostMediaType('text')}
                >
                  <FileText className="h-4 w-4 mr-1" /> Text Only
                </Button>
                <Button
                  type="button"
                  variant={newPostMediaType === 'audio' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewPostMediaType('audio')}
                >
                  <Mic className="h-4 w-4 mr-1" /> Audio
                </Button>
                <Button
                  type="button"
                  variant={newPostMediaType === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewPostMediaType('video')}
                >
                  <Video className="h-4 w-4 mr-1" /> Video
                </Button>
              </div>
            </div>
            
            {newPostMediaType !== 'text' && (
              <div>
                <p className="text-sm font-medium mb-2">Media URL</p>
                <div className="flex gap-2">
                  <Input
                    placeholder={`Enter ${newPostMediaType} URL`}
                    value={newPostMediaUrl}
                    onChange={(e) => setNewPostMediaUrl(e.target.value)}
                  />
                  <Button variant="outline" disabled>
                    <Upload className="h-4 w-4 mr-1" /> Upload
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  For demo purposes, you can enter any URL. In a production app, you would be able to upload files.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreatePost}>
              Post
            </Button>
          </CardFooter>
        </Card>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderPosts(posts, loading, formatDate)}
          </TabsContent>
          
          <TabsContent value="text">
            {renderPosts(posts.filter(post => post.mediaType === 'text' || !post.mediaType), loading, formatDate)}
          </TabsContent>
          
          <TabsContent value="audio">
            {renderPosts(posts.filter(post => post.mediaType === 'audio'), loading, formatDate)}
          </TabsContent>
          
          <TabsContent value="video">
            {renderPosts(posts.filter(post => post.mediaType === 'video'), loading, formatDate)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper function to render posts
const renderPosts = (posts: ForumPost[], loading: boolean, formatDate: (date: string) => string) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  Posted by {post.username} on {formatDate(post.createdAt)}
                </p>
              </div>
              <Badge>{post.mediaType || 'text'}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{post.content}</p>
            
            {post.mediaType === 'audio' && post.mediaUrl && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Audio Content</p>
                <audio controls className="w-full">
                  <source src={post.mediaUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {post.mediaType === 'video' && post.mediaUrl && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Video Content</p>
                <video controls className="w-full rounded">
                  <source src={post.mediaUrl} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between text-gray-500 text-sm">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" /> {post.comments}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Forum;
