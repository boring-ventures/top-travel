"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@prisma/client";

interface User {
  id: string;
  email?: string | null;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}

export function RoleManagement() {
  const [targetUserId, setTargetUserId] = useState("");
  const [newRole, setNewRole] = useState<UserRole>(UserRole.USER);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleUpdate = async () => {
    if (!targetUserId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/fix-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId,
          newRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      toast({
        title: "Success",
        description: data.message,
      });

      setTargetUserId("");
      setNewRole(UserRole.USER);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>
          Promote or demote users to different roles. Only SUPERADMIN users can
          access this feature.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            placeholder="Enter user ID to update"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">New Role</Label>
          <Select
            value={newRole}
            onValueChange={(value) => setNewRole(value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.USER}>User</SelectItem>
              <SelectItem value={UserRole.SUPERADMIN}>Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleRoleUpdate}
          disabled={isLoading || !targetUserId}
          className="w-full"
        >
          {isLoading ? "Updating..." : "Update Role"}
        </Button>
      </CardContent>
    </Card>
  );
}

