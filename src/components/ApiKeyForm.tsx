
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { setApiKey, getApiKey } from '@/lib/api';
import { InfoIcon, Key } from 'lucide-react';

const ApiKeyForm = () => {
  const [apiKey, setApiKeyState] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKeyState(savedKey);
      setIsKeySet(true);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      setIsKeySet(true);
      setIsEditing(false);
    }
  };

  const handleEditKey = () => {
    setIsEditing(true);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">LegiScan API Key</CardTitle>
          </div>
          {isKeySet && !isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEditKey}
            >
              Edit
            </Button>
          )}
        </div>
        <CardDescription>
          Required to fetch real legislative data from LegiScan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your LegiScan API key"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveKey}>Save</Button>
            </div>
            <div className="text-sm text-gray-500 flex items-start gap-2">
              <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                To get an API key, visit <a 
                  href="https://legiscan.com/legiscan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  LegiScan.com
                </a>. The key is stored only in your browser.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-green-600 font-medium">
            API key is set. You can now fetch real legislative data.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
