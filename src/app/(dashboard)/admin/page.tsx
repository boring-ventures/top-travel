import { RoleManagement } from "@/components/admin/role-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Settings } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Super Admin controls and user management
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Registered users in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Users with super admin privileges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="text-xs">
              Operational
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              All systems running normally
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <RoleManagement />

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">User Management</h4>
              <p className="text-sm text-muted-foreground">
                Use the role management tool to promote or demote users.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">CMS Access</h4>
              <p className="text-sm text-muted-foreground">
                Access the content management system to manage destinations,
                packages, and other content.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">System Settings</h4>
              <p className="text-sm text-muted-foreground">
                Configure application settings and preferences.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
