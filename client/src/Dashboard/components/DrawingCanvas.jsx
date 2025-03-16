import React, { useRef, useState, useEffect } from "react"
import axios from "axios"
import toast from 'react-hot-toast'
import { useAuth } from "@clerk/clerk-react"

const DrawingCanvas = ({ onClose, onSave, initialData = null }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState(null)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [title, setTitle] = useState(initialData?.title || "")
  const [loading, setLoading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { userId } = useAuth()

  const colors = [
    "#000000", "#ff0000", "#0000ff", "#00ff00",
    "#ffff00", "#ff00ff", "#00ffff", "#ff9900",
    "#663399", "#333333", "#999999", "#ffffff"
  ]

  const brushSizes = [2, 5, 10, 15, 20]

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setIsEditing(true)
    } else {
      setTitle("")
      setIsEditing(false)
    }
  }, [initialData])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.strokeStyle = color
        ctx.lineWidth = brushSize
        setContext(ctx)

        // Load existing drawing if any
        if (initialData?.drawingData) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
          img.src = initialData.drawingData
          img.crossOrigin = "anonymous"
        }
      }
    }
  }, [canvasRef, color, brushSize, initialData])

  const startDrawing = (e) => {
    if (!context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    context.beginPath()
    context.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing || !context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (!context) return

    if (isDrawing) {
      context.closePath()
      setIsDrawing(false)
    }
  }

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const saveDrawing = async () => {
    if (!canvasRef.current || !title.trim()) return

    setLoading(true)

    try {
      const drawingData = canvasRef.current.toDataURL("image/png")

      const noteData = {
        userId,
        title,
        description: "Drawing note",
        color: "blue-200",
        drawingData,
        type: "drawing"
      }

      let response

      if (isEditing && initialData?._id) {
        // Update existing note
        response = await axios.put(
          `http://localhost:3000/api/v1/drawing-notes/${initialData._id}`,
          noteData
        );
      } else {
        // Create new note
        response = await axios.post(
          "http://localhost:3000/api/v1/drawing-notes",
          noteData
        );
      }

      if (response.data.success) {
        toast.success(isEditing ? "Drawing updated successfully!" : "Drawing saved successfully!");
        if (onSave) {
          onSave(response.data.data);
        }
        onClose();
      } else {
        toast.error(response.data.message || "Failed to save drawing note");
      }
    } catch (error) {
      console.error("Error saving drawing:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while saving the drawing.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle touch events for mobile drawing
  const handleTouchStart = (e) => {
    e.preventDefault()
    if (!context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    context.beginPath()
    context.moveTo(x, y)
    setIsDrawing(true)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    if (!isDrawing || !context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    context.lineTo(x, y)
    context.stroke()
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    stopDrawing()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">{isEditing ? "Edit Drawing" : "Create New Drawing"}</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <input
            type="text"
            placeholder="Drawing Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />

          <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 border rounded hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="13.5" cy="6.5" r="2.5" />
                  <path d="M17 4c-1.5-1-3-1-4 0l-9 6.5 9 6.5c1 1 2.5 1 4 0s1.5-3 0-4l-3.5-2.5L17 8c1.5-1 1.5-3 0-4z" />
                </svg>
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-lg shadow-lg z-10 flex flex-wrap gap-2 w-40">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c)
                        setShowColorPicker(false)
                        if (context) context.strokeStyle = c
                      }}
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex border rounded-md overflow-hidden">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setBrushSize(size)
                    if (context) context.lineWidth = size
                  }}
                  className={`p-2 ${brushSize === size ? 'bg-gray-200' : 'hover:bg-gray-50'}`}
                  aria-label={`Brush size ${size}`}
                >
                  <div
                    className="rounded-full bg-black"
                    style={{ width: size, height: size }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={clearCanvas}
              className="p-2 border rounded hover:bg-gray-50 ml-auto text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative bg-gray-50 overflow-hidden" style={{ height: "400px" }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 w-full h-full cursor-crosshair"
            style={{ touchAction: "none" }}
          />
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveDrawing}
            disabled={loading || !title.trim()}
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${loading || !title.trim()
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            )}
            {isEditing ? "Update Drawing" : "Save Drawing"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DrawingCanvas
