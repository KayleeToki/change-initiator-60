
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForumPost, getForumPosts, createForumPost } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, Heart, ThumbsUp, Plus, Image, Mic, Video } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const Forum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    mediaType: 'text' as 'text' | 'audio' | 'video',
    mediaUrl: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getForumPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch forum posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const handleSubmitPost = async () => {
    if (!newPost.title || !newPost.content) {
      return;
    }
    
    try {
      const createdPost = await createForumPost({
        userId: 'user1', // In a real app, this would be the logged-in user's ID
        username: 'CurrentUser', // In a real app, this would be the logged-in user's username
        title: newPost.title,
        content: newPost.content,
        mediaType: newPost.mediaType,
        mediaUrl: newPost.mediaUrl
      });
      
      setPosts([createdPost, ...posts]);
      setNewPost({
        title: '',
        content: '',
        mediaType: 'text',
        mediaUrl: ''
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold">Community Forum</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts, questions, or insights with the community.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter a title for your post"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your post..."
                    rows={5}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Media Type</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newPost.mediaType === 'text' ? 'default' : 'outline'}
                      onClick={() => setNewPost({ ...newPost, mediaType: 'text', mediaUrl: '' })}
                      className="flex-1"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" /> Text
                    </Button>
                    <Button
                      type="button"
                      variant={newPost.mediaType === 'image' ? 'default' : 'outline'}
                      onClick={() => setNewPost({ ...newPost, mediaType: 'image' as any, mediaUrl: '' })}
                      className="flex-1"
                    >
                      <Image className="h-4 w-4 mr-2" /> Image
                    </Button>
                    <Button
                      type="button"
                      variant={newPost.mediaType === 'audio' ? 'default' : 'outline'}
                      onClick={() => setNewPost({ ...newPost, mediaType: 'audio', mediaUrl: '' })}
                      className="flex-1"
                    >
                      <Mic className="h-4 w-4 mr-2" /> Audio
                    </Button>
                    <Button
                      type="button"
                      variant={newPost.mediaType === 'video' ? 'default' : 'outline'}
                      onClick={() => setNewPost({ ...newPost, mediaType: 'video', mediaUrl: '' })}
                      className="flex-1"
                    >
                      <Video className="h-4 w-4 mr-2" /> Video
                    </Button>
                  </div>
                </div>
                {newPost.mediaType !== 'text' && (
                  <div className="mb-4">
                    <label htmlFor="mediaUrl" className="block text-sm font-medium mb-1">Media URL</label>
                    <Input
                      id="mediaUrl"
                      value={newPost.mediaUrl}
                      onChange={(e) => setNewPost({ ...newPost, mediaUrl: e.target.value })}
                      placeholder={`Enter a URL for your ${newPost.mediaType}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      In a real app, you would be able to upload media directly.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitPost}>
                  Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="recent">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="bills">Bill Discussions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/3 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-8 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <div className="text-sm text-gray-500">
                        Posted by {post.username} on {formatDate(post.createdAt)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{post.content}</p>
                      
                      {post.mediaType === 'audio' && post.mediaUrl && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-md">
                          <p className="text-sm text-gray-500 mb-2">Audio Attachment</p>
                          <div className="flex items-center justify-center h-20 bg-gray-200 rounded-md">
                            <Mic className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      )}
                      
                      {post.mediaType === 'video' && post.mediaUrl && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-md">
                          <p className="text-sm text-gray-500 mb-2">Video Attachment</p>
                          <div className="flex items-center justify-center aspect-video bg-gray-200 rounded-md">
                            <Video className="h-12 w-12 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <MessageSquare className="h-4 w-4 mr-1" /> {post.comments}
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        View Discussion
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="w-full p-8 text-center">
                <CardContent>
                  <p className="text-gray-500">No posts yet. Be the first to start a discussion!</p>
                  <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create a Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            <Card className="w-full p-8 text-center">
              <CardContent>
                <p className="text-gray-500">Popular posts will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bills">
            <Card className="w-full p-8 text-center">
              <CardContent>
                <p className="text-gray-500">Bill discussions will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Forum;
