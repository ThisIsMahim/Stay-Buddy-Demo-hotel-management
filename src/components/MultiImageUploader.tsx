/**
 * MultiImageUploader
 * – Lets users pick up to `maxImages` local files (or paste URLs)
 * – Shows live thumbnails with individual remove buttons
 * – Exports selected images as object-URL strings (or data-URLs) that can
 *   be stored in the mock backend and rendered anywhere in the app.
 */
import { useRef, useState, useCallback } from "react";
import { ImagePlus, X, UploadCloud } from "lucide-react";

interface Props {
  /** Called whenever the image list changes; receives array of data-URL strings */
  onChange: (images: string[]) => void;
  maxImages?: number;
  /** Dark-mode aware colour scheme */
  dark?: boolean;
  initialImages?: string[];
}

export default function MultiImageUploader({ onChange, maxImages = 5, dark = false, initialImages }: Props) {
  const [previews, setPreviews] = useState<string[]>(initialImages || []);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: File[]) => {
    const remaining = maxImages - previews.length;
    const toProcess = files.slice(0, remaining);
    if (toProcess.length === 0) return;

    const readers = toProcess.map(file => {
      return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const maxDimension = 800;

            if (width > height) {
              if (width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              }
            } else {
              if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL("image/jpeg", 0.6));
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      const updated = [...previews, ...results];
      setPreviews(updated);
      onChange(updated);
    });
  }, [previews, maxImages, onChange]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/")));
  };

  const removeImage = (idx: number) => {
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    onChange(updated);
  };

  const bg = dark ? "bg-slate-800/60 border-slate-700" : "bg-gray-50 border-gray-300";
  const bgHover = dark ? "hover:border-indigo-500" : "hover:border-indigo-400";
  const labelText = dark ? "text-slate-400" : "text-gray-500";

  return (
    <div className="space-y-3">
      {/* Drop-zone / click-to-browse */}
      {previews.length < maxImages && (
        <div
          className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer ${bg} ${bgHover} ${dragging ? "border-indigo-500 bg-indigo-950/20" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <div className="flex flex-col items-center justify-center py-8 pointer-events-none select-none gap-2">
            <UploadCloud className={`w-8 h-8 ${dragging ? "text-indigo-400" : labelText}`} />
            <p className={`text-sm font-medium ${labelText}`}>
              {dragging ? "Drop images here…" : "Click to browse or drag & drop"}
            </p>
            <p className={`text-xs ${labelText}`}>
              PNG, JPG, WEBP • up to {maxImages} images
            </p>
          </div>
        </div>
      )}

      {/* Thumbnails grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-900">
              <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
              {/* First image badge */}
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Cover</span>
              )}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeImage(idx); }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* Add-more tile */}
          {previews.length < maxImages && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-video rounded-lg border-2 border-dashed border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-indigo-400 transition"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-xs">Add more</span>
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-slate-500">{previews.length}/{maxImages} image{previews.length !== 1 ? "s" : ""} selected</p>
    </div>
  );
}
