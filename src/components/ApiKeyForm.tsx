
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InfoIcon, Key, Check } from 'lucide-react';

const ApiKeyForm = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">LegiScan API Status</CardTitle>
          </div>
        </div>
        <CardDescription>
          API credentials for LegiScan are pre-configured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <Check className="h-4 w-4" />
          API key is pre-configured and ready to use
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
