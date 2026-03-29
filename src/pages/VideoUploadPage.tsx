import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Video, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useUploadVideo } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface FileUpload {
  file: File;
  title: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
}

export default function VideoUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const uploadVideo = useUploadVideo();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File, title: string) => {
    const fileId = file.name + file.size;
    
    try {
      await uploadVideo.mutateAsync({
        file,
        title,
        onProgress: (progress) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.file.name + f.file.size === fileId
                ? { ...f, progress: progress.percentage, status: "uploading" as const }
                : f
            )
          );
        },
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.file.name + f.file.size === fileId
            ? { ...f, progress: 100, status: "done" as const }
            : f
        )
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file.name + f.file.size === fileId
            ? { ...f, status: "error" as const }
            : f
        )
      );
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file) => {
      if (file.type.startsWith("video/")) {
        const newFile: FileUpload = {
          file,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          progress: 0,
          status: "pending",
        };
        setFiles((prev) => [...prev, newFile]);
      } else {
        toast({
          title: "Invalid file",
          description: `${file.name} is not a video file`,
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      selectedFiles.forEach((file) => {
        const newFile: FileUpload = {
          file,
          title: file.name.replace(/\.[^/.]+$/, ""),
          progress: 0,
          status: "pending",
        };
        setFiles((prev) => [...prev, newFile]);
      });
    },
    []
  );

  const updateTitle = (index: number, newTitle: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, title: newTitle } : f))
    );
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startUpload = (index: number) => {
    const file = files[index];
    if (file && file.status === "pending") {
      handleUpload(file.file, file.title);
    }
  };

  const uploadAll = () => {
    files.forEach((file, index) => {
      if (file.status === "pending") {
        handleUpload(file.file, file.title);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Upload Movement Videos</h1>
        <p className="mt-1 text-muted-foreground">Submit videos for coach review and movement assessment</p>

        {/* Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${dragOver ? "border-primary bg-primary/5" : "border-border bg-card"}`}
        >
          <Upload className={`h-12 w-12 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
          <p className="mt-4 font-heading text-lg font-semibold text-card-foreground">
            {dragOver ? "Drop your files here" : "Drag & drop videos here"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
          <label className="mt-4 cursor-pointer">
            <Button variant="outline" asChild><span>Browse Files</span></Button>
            <input type="file" className="hidden" accept="video/*" multiple onChange={handleFileInput} />
          </label>
          <p className="mt-3 text-xs text-muted-foreground">Supports MP4, MOV, AVI • Max 500MB per file</p>
        </motion.div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground">Files ({files.length})</h2>
              {files.some((f) => f.status === "pending") && (
                <Button onClick={uploadAll} size="sm" variant="hero">
                  Upload All
                </Button>
              )}
            </div>

            {files.map((f, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {f.status === "done" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Video className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {f.status === "pending" ? (
                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`} className="text-sm">
                          Video Title
                        </Label>
                        <Input
                          id={`title-${index}`}
                          value={f.title}
                          onChange={(e) => updateTitle(index, e.target.value)}
                          placeholder="Enter video title"
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <p className="font-medium text-card-foreground">{f.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {f.file.name} • {(f.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {f.status === "uploading" && (
                      <div className="mt-2">
                        <Progress value={f.progress} className="h-1.5" />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {Math.round(f.progress)}% uploaded
                        </p>
                      </div>
                    )}
                    {f.status === "error" && (
                      <p className="mt-1 text-xs text-destructive">Upload failed. Please try again.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {f.status === "pending" && (
                      <Button onClick={() => startUpload(index)} size="sm">
                        Upload
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={f.status === "uploading"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
