"use client";

import { PersonaManager } from "@/components/PersonaManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <h1 className="text-3xl font-bold">設定</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          管理您的聊天角色和偏好設定
        </p>
      </div>

      <div className="space-y-6">
        <PersonaManager />

        <Card>
          <CardHeader>
            <CardTitle>其他設定</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              更多設定選項將在未來版本中提供。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
