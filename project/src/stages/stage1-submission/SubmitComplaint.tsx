import { useState, useRef, useCallback } from 'react';
import { useApp, MOCK_LOCATIONS } from '@/store';
import { PipelineStepper } from '@/components/PipelineStepper';
import { Upload, MapPin, FileText, X, Image as ImageIcon, FileCheck, Send, User, Phone } from 'lucide-react';
import type { Attachment } from '@/types';

export function SubmitComplaint() {
  const { submitComplaint } = useApp();
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [location, setLocation] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [citizenContact, setCitizenContact] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const maxWords = 500;
  const canSubmit = text.trim().length > 10 && location !== '';

  const detectLocation = useCallback(() => {
    setDetecting(true);
    setTimeout(() => {
      const loc = MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
      setLocation(loc);
      setDetecting(false);
    }, 1200);
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att?.previewUrl) URL.revokeObjectURL(att.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    submitComplaint({ text, attachments, location, citizenName, citizenContact });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-grey-800">Submit a Grievance</h1>
        <p className="text-grey-500 mt-1 text-sm sm:text-base">Describe your issue. Our AI will analyze, classify, and route it to the right department.</p>
      </div>

      <div className="card p-4 sm:p-6">
        <PipelineStepper currentStep={1} />
      </div>

      <div className="card p-5 sm:p-7 space-y-6">
        {/* Citizen info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1.5">
              <User className="w-4 h-4 inline mr-1.5" />
              Your Name
            </label>
            <input
              type="text"
              value={citizenName}
              onChange={(e) => setCitizenName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1.5">
              <Phone className="w-4 h-4 inline mr-1.5" />
              Contact Number
            </label>
            <input
              type="tel"
              value={citizenContact}
              onChange={(e) => setCitizenContact(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="input-field"
            />
          </div>
        </div>

        {/* Complaint text */}
        <div>
          <label className="block text-sm font-medium text-grey-700 mb-1.5">
            <FileText className="w-4 h-4 inline mr-1.5" />
            Complaint Details
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              const words = e.target.value.trim().split(/\s+/);
              if (words.length <= maxWords || e.target.value.trim() === '') {
                setText(e.target.value);
              }
            }}
            placeholder="Describe your grievance in detail. Include location, duration, and impact..."
            rows={5}
            className="input-field resize-none"
            aria-label="Complaint details"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-grey-400">Min 10 characters</span>
            <span className={`text-xs font-medium ${wordCount > maxWords * 0.9 ? 'text-orange-600' : 'text-grey-400'}`}>
              {wordCount} / {maxWords} words
            </span>
          </div>
        </div>

        {/* File uploader */}
        <div>
          <label className="block text-sm font-medium text-grey-700 mb-1.5">
            <Upload className="w-4 h-4 inline mr-1.5" />
            Attach Photos / Documents (optional)
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-orange-400 bg-orange-50 scale-[1.01]'
                : 'border-grey-300 bg-grey-50 hover:border-orange-300 hover:bg-orange-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Upload className="w-8 h-8 mx-auto mb-2 text-grey-400" />
            <p className="text-sm text-grey-600 font-medium">
              {dragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-grey-400 mt-1">Images (JPG, PNG) or PDF — max 5MB</p>
          </div>

          {/* Attachment previews */}
          {attachments.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 animate-fade-in-up">
              {attachments.map((att) => (
                <div key={att.id} className="relative group border border-grey-200 rounded-lg overflow-hidden bg-grey-50">
                  {att.previewUrl ? (
                    <img src={att.previewUrl} alt={att.name} className="w-full h-24 object-cover" />
                  ) : (
                    <div className="w-full h-24 flex items-center justify-center bg-navy-50">
                      <FileCheck className="w-8 h-8 text-navy-400" />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium text-grey-700 truncate">{att.name}</p>
                    <p className="text-[10px] text-grey-400">{formatSize(att.size)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeAttachment(att.id); }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-grey-600 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove attachment"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-grey-700 mb-1.5">
            <MapPin className="w-4 h-4 inline mr-1.5" />
            Location
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={detectLocation}
              disabled={detecting}
              className="btn-secondary justify-start sm:w-auto"
            >
              <MapPin className={`w-4 h-4 ${detecting ? 'animate-bounce' : ''}`} />
              {detecting ? 'Detecting...' : 'Auto-detect my location'}
            </button>
            {location && (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-scale-in">
                <MapPin className="w-4 h-4" />
                Detected: {location}
              </div>
            )}
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Or type your location manually"
            className="input-field mt-3"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-accent w-full sm:w-auto"
          >
            <Send className="w-4 h-4" />
            Submit Complaint
          </button>
          {!canSubmit && (
            <p className="text-xs text-grey-400 mt-2">
              Please enter at least 10 characters and set a location to submit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
