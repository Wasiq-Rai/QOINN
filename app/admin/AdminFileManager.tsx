"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, FileText, Upload, RefreshCcw, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminFileManager() {
  const [folders, setFolders] = useState<Record<string, string[]>>({});
  const [newFolder, setNewFolder] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [replaceConfirm, setReplaceConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ folder: string; file: string } | null>(null);

  // Modals
  const [availableModals, setAvailableModals] = useState<string[]>([]);
  const [selectedModals, setSelectedModals] = useState<string[]>([]);
  const [newModal, setNewModal] = useState("");

  const fetchFiles = async () => {
    const res = await axios.get(`${API_URL}/files/`);
    setFolders(res.data);
  };

  const fetchModals = async () => {
    const res = await axios.get(`${API_URL}/admin/settings/`);
    setAvailableModals(res.data.available_modals || []);
    setSelectedModals(res.data.selected_modals || []);
  };

  useEffect(() => {
    fetchFiles();
    fetchModals();
  }, []);

  const saveModals = async (modals: string[], available: string[] = availableModals) => {
    setSelectedModals(modals);
    setAvailableModals(available);
    await axios.put(`${API_URL}/admin/settings/`, {
      selected_modals: modals,
      available_modals: available
    });
    toast.success("Modal settings updated");
  };

  const createFolder = async () => {
    if (!newFolder.trim()) return;
    await axios.post(`${API_URL}/folders/create/`, { folder: newFolder });
    setNewFolder("");
    fetchFiles();
    toast.success(`Folder "${newFolder}" created`);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("folder", selectedFolder);
    formData.append("file", file);
    formData.append("replace", replaceConfirm.toString());

    try {
      await axios.post(`${API_URL}/files/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReplaceConfirm(false);
      setPendingFile(null);
      fetchFiles();
      toast.success(`Uploaded "${file.name}"`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setPendingFile(file);
        toast.error("File already exists. Click 'Replace' to overwrite.");
      }
    }
  };

  const handleReplace = () => {
    if (pendingFile) {
      setReplaceConfirm(true);
      handleUpload(pendingFile);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    await axios.delete(`${API_URL}/files/delete/`, { data: fileToDelete });
    toast.success(`Deleted "${fileToDelete.file}"`);
    setDeleteDialogOpen(false);
    setFileToDelete(null);
    fetchFiles();
  };

  const toggleModalSelection = (modalName: string) => {
    const newSelection = selectedModals.includes(modalName)
      ? selectedModals.filter((m) => m !== modalName)
      : [...selectedModals, modalName];
    saveModals(newSelection);
  };

  const addNewModal = () => {
    if (!newModal.trim() || availableModals.includes(newModal)) return;
    const updatedAvailable = [...availableModals, newModal];
    saveModals(selectedModals, updatedAvailable);
    setNewModal("");
    toast.success(`Modal "${newModal}" added`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">Admin File Manager</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Folders Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Folders</CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchFiles}>
              <RefreshCcw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New Folder Name"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
              />
              <Button onClick={createFolder} variant="default">
                <Plus className="w-4 h-4 mr-1" /> Create
              </Button>
            </div>
            <Separator className="mb-3" />
            <ScrollArea className="h-72 pr-2">
              <ul className="space-y-2">
                {Object.keys(folders).map((folder) => (
                  <li
                    key={folder}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border transition ${
                      selectedFolder === folder
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50 border-transparent"
                    }`}
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <Folder className="w-4 h-4 text-blue-500" />
                    <span className="flex-1">{folder}</span>
                    <span className="text-xs text-gray-400">{folders[folder]?.length || 0} files</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Files Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {selectedFolder ? `Files in "${selectedFolder}"` : "Files"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFolder ? (
              <>
                <ScrollArea className="h-72 pr-2 mb-4">
                  <ul className="space-y-2">
                    {folders[selectedFolder]
                      ?.filter((file) => typeof file === "string" && file)
                      .map((file) => (
                        <li
                          key={file}
                          className="flex items-center justify-between gap-2 p-2 rounded-md border hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            {file}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setFileToDelete({ folder: selectedFolder, file });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                  </ul>
                </ScrollArea>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    multiple
                    className="py-0"
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach((file) =>
                          handleUpload(file)
                        );
                      }
                    }}
                  />
                  {pendingFile && (
                    <Button variant="destructive" onClick={handleReplace}>
                      Replace File
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Select a folder to view files.</p>
            )}
          </CardContent>
        </Card>

        {/* Modal Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Live Modal Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New Modal Name"
                value={newModal}
                onChange={(e) => setNewModal(e.target.value)}
              />
              <Button onClick={addNewModal} variant="default">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <Separator className="mb-3" />
            <ScrollArea className="h-72 pr-2">
              <ul className="space-y-3">
                {availableModals.map((modal) => (
                  <li key={modal} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedModals.includes(modal)}
                      onCheckedChange={() => toggleModalSelection(modal)}
                    />
                    <span>{modal}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <div className="mt-4 text-sm text-gray-600">
              Selected:{" "}
              <span className="font-medium">
                {selectedModals.join(", ") || "None"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{fileToDelete?.file}</strong>?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
