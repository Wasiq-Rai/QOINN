"use client"

import { useState } from "react"
import { useEquity } from "@/context/EquityContext"
import { useDropzone } from "react-dropzone"
import { uploadPDF } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload } from "lucide-react"

export const AdminEquityManager = () => {
  const { equityPercentage, refreshEquity } = useEquity()
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: uploadStatus === "loading",
    onDrop: async (files) => {
      if (files.length > 0) {
        await handlePdfUpload(files[0])
      }
    },
  })

  const handlePdfUpload = async (file: File) => {
    setUploadStatus("loading")
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      await uploadPDF(formData)
      await refreshEquity()
      setUploadStatus("success")
      setTimeout(() => setUploadStatus("idle"), 2000)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Failed to process PDF")
    }
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${uploadStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />

        <div className="text-center">
          {uploadStatus === "loading" ? (
            <div className="space-y-4">
              <p className="text-gray-600">Processing PDF...</p>
              <Progress value={33} className="w-[60%] mx-auto" />
            </div>
          ) : uploadStatus === "success" ? (
            <p className="text-green-600">Upload successful!</p>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? "Drop PDF here" : "Drag & drop statement PDF"}
                </p>
                <p className="text-sm text-gray-500">Supported format: .pdf (Robinhood account statement)</p>
              </div>
              <Button>Select File</Button>
            </div>
          )}
        </div>
      </div>

      {errorMessage && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{errorMessage}</div>}
    </div>
  )
}

