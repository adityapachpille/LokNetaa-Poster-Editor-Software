"use client";

import { useRef, useState, useEffect } from "react";

export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 220, y: 220 });

  const canvasSize = 600;
  const imageSize = 160;

  const handleUpload = (e) => {
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    const candidate = new Image();
    candidate.src = "/candidate.jpeg";
    candidate.onload = () => {
      ctx.drawImage(candidate, 0, 0, canvasSize, canvasSize);

      if (image) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          position.x + imageSize / 2,
          position.y + imageSize / 2,
          imageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.clip();
        ctx.drawImage(image, position.x, position.y, imageSize, imageSize);
        ctx.restore();
      }
    };
  };

  useEffect(() => {
    drawCanvas();
  }, [image, position]);

  // Desktop drag
  const handleMouseDown = (e) => {
    if (!image) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (
      x > position.x &&
      x < position.x + imageSize &&
      y > position.y &&
      y < position.y + imageSize
    ) {
      setDragging(true);
      setOffset({ x: x - position.x, y: y - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x: x - offset.x, y: y - offset.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Mobile drag
  const handleTouchStart = (e) => {
    if (!image) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    if (
      x > position.x &&
      x < position.x + imageSize &&
      y > position.y &&
      y < position.y + imageSize
    ) {
      setDragging(true);
      setOffset({ x: x - position.x, y: y - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setPosition({ x: x - offset.x, y: y - offset.y });
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "election-compare.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Election Compare",
        text: "Check out my campaign poster!",
        url: window.location.href,
      });
    } catch {
      alert("Sharing not supported. Link copied.");
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="topBarWrapper">
        <h2 className="title">📲🗳️ LokNetaa Poster Editor Software 👥📸✨</h2>
        <div className="topBar">
          <button className="button" onClick={() => fileRef.current?.click()}>
            📤 Import Photo
          </button>
          <button className="button" onClick={handleDownload} disabled={!image}>
            📥 Download
          </button>
          <button className="button" onClick={handleShare}>
            🔗 Share
          </button>
        </div>
      </div>

      {/* Canvas with upload patch */}
      <div className="canvasWrapper pt-10">
        {!image && (
          <div
            className="uploadPatch"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleUpload}
          >
            <p>📤 Import Image (click or drag)</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </>
  );
}
