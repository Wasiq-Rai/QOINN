"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Shield } from "lucide-react";
import { User } from "@/utils/types";

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UserManagementModal = ({ isOpen, onClose, users, setUsers }: UserManagementModalProps) => {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleMakeAdmin = async (userId: string) => {
    setActionInProgress(userId);
    try {
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? { ...user, isAdmin: true } : user))
        );
      }
    } catch (error) {
      console.error("Error making user admin:", error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionInProgress(userId);
    try {
      const response = await fetch("/api/users/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">User Management</DialogTitle>
        </DialogHeader>

        {!users?.length ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-600">
                Total Users: <span className="font-bold">{users.length}</span>
              </p>
            </div>

            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={`${user.firstName || ""} ${user.lastName || ""}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">
                          {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {user.firstName} {user.lastName}
                        {user.isAdmin && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Admin
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {!user.isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMakeAdmin(user.id)}
                        disabled={actionInProgress === user.id}
                        className="flex items-center space-x-1"
                      >
                        {actionInProgress === user.id ? (
                          <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
                        ) : (
                          <>
                            <Shield className="h-4 w-4" />
                            <span>Make Admin</span>
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={actionInProgress === user.id}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
