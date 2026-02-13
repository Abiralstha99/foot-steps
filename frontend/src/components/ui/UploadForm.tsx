import type React from "react";
import { useRef, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { selectUploadsById, useUpload } from "@/features/uploads/useUpload";

type UploadFormProps = {
    tripId: string;
    onClose?: () => void;
    onFilesSelected?: (files: File[]) => void;
};

function UploadForm({ tripId, onClose, onFilesSelected }: UploadFormProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadIds, setUploadIds] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { uploadFile } = useUpload();

    function handleFiles(files: File[]) {
        if (!files.length) return;

        setSelectedFiles(files);
        onFilesSelected?.(files);

        // TODO: plug in actual upload logic here (mutation / API call)
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files); // FileList -> File[]
        if (!files.length) return;

        handleFiles(files);
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        handleFiles(files);
    }

    function handleBrowseClick() {
        inputRef.current?.click();
    }

    async function handleUploadClick() {
        const newIds: string[] = [];

        for (const file of selectedFiles) {
            const uploadId = `upload-${Date.now()}-${file.name}`; // or let useUpload generate
            newIds.push(uploadId);

            // kick off the upload (fire-and-forget, or await if you like)
            uploadFile({
                endpoint: `/trips/${tripId}/photos`,
                file,
                uploadId, // pass it so Redux knows this id
            }).catch(console.error);
        }

        setUploadIds((prev) => [...prev, ...newIds]);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-2xl border border-[#2d302e] bg-[#0d0e0d] p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Upload photos</h2>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-2 py-1 text-sm text-[#9A9C9B] hover:bg-[#1a1b1a] hover:text-white focus:outline-none focus:ring-2 focus:ring-app-accent"
                        >
                            Close
                        </button>
                    )}
                </div>

                {/* Drop zone */}
                <div
                    className={[
                        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                        isDragging
                            ? "border-app-accent bg-app-accent/10"
                            : "border-[#2d302e] bg-[#050605]",
                    ].join(" ")}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <p className="mb-2 text-sm font-medium text-white">
                        Drag and drop your photos here
                    </p>
                    <p className="mb-4 text-xs text-[#9A9C9B]">
                        or click below to browse files from your device
                    </p>
                    <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="rounded-md bg-app-accent px-4 py-2 text-sm font-medium text-white hover:bg-app-accent-hover focus:outline-none focus:ring-2 focus:ring-app-accent"
                    >
                        Choose files
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleInputChange}
                    />
                </div>

                {/* File list */}
                {selectedFiles.length > 0 && (
                    <div className="mt-4 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-[#2d302e] bg-[#050605] px-3 py-2">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#9A9C9B]">
                            Selected files
                        </p>
                        <ul className="space-y-1 text-xs text-white">
                            {selectedFiles.map((file) => (
                                <li
                                    key={file.name + file.lastModified}
                                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-[#1a1b1a]"
                                >
                                    <span className="truncate">{file.name}</span>
                                    <span className="whitespace-nowrap text-[10px] text-[#9A9C9B]">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Upload progress */}
                {uploadIds.length > 0 && (
                    <CombinedUploadProgress uploadIds={uploadIds} />
                )}

                {/* Footer actions */}
                <div className="mt-4 flex items-center justify-end gap-2">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-3 py-1.5 text-sm text-[#9A9C9B] hover:bg-[#1a1b1a] hover:text-white focus:outline-none focus:ring-2 focus:ring-app-accent"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="button"
                        className="rounded-md bg-app-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-app-accent-hover focus:outline-none focus:ring-2 focus:ring-app-accent"
                        disabled={!selectedFiles.length}
                        onClick={handleUploadClick}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}

const CombinedUploadProgress: React.FC<{ uploadIds: string[] }> = ({ uploadIds }) => {
    const uploadsById = useAppSelector(selectUploadsById);
    const uploads = uploadIds.map((id) => uploadsById[id]).filter(Boolean);

    if (uploads.length === 0) return null;

    // Calculate overall progress as average of all uploads
    const totalProgress = uploads.reduce((sum, upload) => sum + (upload?.progress ?? 0), 0);
    const averageProgress = Math.round(totalProgress / uploads.length);

    // Check if any uploads have errors
    const hasError = uploads.some(upload => upload?.status === "error");
    const errorCount = uploads.filter(upload => upload?.status === "error").length;
    const doneCount = uploads.filter(upload => upload?.status === "done").length;

    const barColorClass = hasError ? "bg-red-500" : "bg-green-500";

    return (
        <div className="mt-4 flex flex-col gap-2 rounded-md border border-[#2d302e] bg-[#050605] p-3">
            <div className="flex items-center justify-between text-sm text-white">
                <span>Uploading {uploads.length} file{uploads.length !== 1 ? 's' : ''}</span>
                <span className="font-medium">{averageProgress}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1a1b1a]">
                <div
                    className={`h-full transition-[width] duration-300 ${barColorClass}`}
                    style={{ width: `${averageProgress}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-xs text-[#9A9C9B]">
                <span>
                    {doneCount > 0 && `${doneCount} completed`}
                    {errorCount > 0 && ` • ${errorCount} failed`}
                    {doneCount === 0 && errorCount === 0 && 'Uploading...'}
                </span>
            </div>
        </div>
    );
};

export default UploadForm;
