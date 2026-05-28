"use client";

import { useState } from "react";

export default function Home() {

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Network response failed");

      // Convert the response stream into a file blob
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary hidden anchor link to trigger the browser download save dialog
      const a = document.createElement("a");
      a.href = downloadUrl;
      
      // Extract filename from headers if sent, or fallback to default
      a.download = "video.mp4"; 
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-3 items-center justify-center font-sans dark:bg-white">
      <p className="text-black">YouTube Media Downloader</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="url" placeholder="youtube.com/watch?v=xxx" value={url} onChange={(e) => setUrl(e.target.value)} className="px-4 py-1 rounded-md border border-slate-400 placeholder-slate-400 shadow-sm text-black"></input>
        <button type="submit" disabled={isLoading} className="px-3 text-black border border-slate-400 rounded-md cursor-pointer hover:ring-1">{isLoading ? "Processing..." : "Submit"}</button>
      </form>
      
    </div>
  );
}
