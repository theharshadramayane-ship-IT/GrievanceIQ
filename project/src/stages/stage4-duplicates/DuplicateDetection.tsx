import { useState } from 'react';
import type { Complaint, DuplicateGroup } from '@/types';
import { Link2, ChevronDown, ChevronRight, AlertCircle, MapPin } from 'lucide-react';
import { UrgencyBadge } from '@/components/Badges';

export function DuplicateGroupView({ complaints, groups }: { complaints: Complaint[]; groups: DuplicateGroup[] }) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (caseId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(caseId)) next.delete(caseId);
      else next.add(caseId);
      return next;
    });
  };

  // Only show groups with size > 1
  const multiGroups = groups.filter((g) => g.complaintIds.length > 1);

  if (multiGroups.length === 0) {
    return (
      <div className="card p-6 text-center">
        <Link2 className="w-8 h-8 mx-auto mb-2 text-grey-300" />
        <p className="text-sm text-grey-500">No duplicate groups detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {multiGroups.map((group) => {
        const groupComplaints = complaints.filter((c) => group.complaintIds.includes(c.id));
        const isExpanded = expandedGroups.has(group.caseId);
        if (groupComplaints.length === 0) return null;

        return (
          <div key={group.caseId} className="card overflow-hidden">
            {/* Parent row */}
            <button
              onClick={() => toggleGroup(group.caseId)}
              className="w-full flex items-center gap-3 p-4 hover:bg-grey-50 transition-colors text-left"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-grey-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-grey-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-semibold text-navy-700">{group.caseId}</span>
                  <span className="badge bg-orange-50 text-orange-700 border border-orange-200">
                    <Link2 className="w-3 h-3" />
                    {groupComplaints.length} similar complaints grouped
                  </span>
                  <UrgencyBadge urgency={group.severity} size="xs" />
                </div>
                <p className="text-xs text-grey-500 mt-1 truncate">{group.rootCause}</p>
                <p className="text-[10px] text-grey-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {group.clusterArea}
                </p>
              </div>
            </button>

            {/* Nested complaints */}
            {isExpanded && (
              <div className="border-t border-grey-100 animate-fade-in">
                {groupComplaints.map((c, idx) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      idx > 0 ? 'border-t border-grey-50' : ''
                    } hover:bg-grey-50 transition-colors`}
                  >
                    <div className="w-1 h-8 rounded-full bg-orange-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-grey-600">{c.id}</span>
                        {idx === 0 && (
                          <span className="badge bg-navy-50 text-navy-600 text-[10px]">Parent</span>
                        )}
                      </div>
                      <p className="text-xs text-grey-500 mt-0.5 line-clamp-1">{c.text}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-grey-400">{c.citizenName}</p>
                      <p className="text-[10px] text-grey-400">{c.location}</p>
                    </div>
                  </div>
                ))}
                {/* Root cause analysis */}
                <div className="px-4 py-3 bg-orange-50 border-t border-orange-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-orange-700">Root-Cause Pattern Analysis</p>
                      <p className="text-xs text-orange-600 mt-0.5">{group.rootCause}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function HotspotMap() {
  // Mock geo-clustered pins on a styled map placeholder
  const pins = [
    { top: '30%', left: '25%', size: 'large', label: 'Sector 7 — 8 complaints', count: 8 },
    { top: '45%', left: '55%', size: 'medium', label: 'Hadapsar — 5 complaints', count: 5 },
    { top: '65%', left: '35%', size: 'medium', label: 'Kothrud — 4 complaints', count: 4 },
    { top: '25%', left: '70%', size: 'small', label: 'Viman Nagar — 2 complaints', count: 2 },
    { top: '70%', left: '65%', size: 'small', label: 'Wakad — 3 complaints', count: 3 },
    { top: '50%', left: '20%', size: 'small', label: 'Baner — 2 complaints', count: 2 },
  ];

  const sizeMap = {
    large: 'w-8 h-8 text-xs',
    medium: 'w-6 h-6 text-[10px]',
    small: 'w-5 h-5 text-[9px]',
  };

  const colorMap = {
    large: 'bg-red-500 border-red-600',
    medium: 'bg-orange-500 border-orange-600',
    small: 'bg-yellow-500 border-yellow-600',
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-grey-800">Geo-Clustered Complaint Hotspots</h3>
      </div>
      <div
        className="relative w-full rounded-xl overflow-hidden border border-grey-200"
        style={{
          height: '320px',
          background: 'linear-gradient(135deg, #e8f0fe 0%, #d5e3f4 30%, #c0d4ed 60%, #abc8e8 100%)',
        }}
      >
        {/* Grid lines for map feel */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(31,73,125,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(31,73,125,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Roads */}
        <div className="absolute top-[40%] left-0 right-0 h-1 bg-grey-200 opacity-50" />
        <div className="absolute top-0 bottom-0 left-[50%] w-1 bg-grey-200 opacity-50" />
        <div className="absolute top-[15%] left-[10%] w-[60%] h-0.5 bg-grey-200 opacity-40 rotate-12" />

        {/* Pins */}
        {pins.map((pin, i) => (
          <div
            key={i}
            className="absolute group"
            style={{ top: pin.top, left: pin.left, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`relative ${sizeMap[pin.size as keyof typeof sizeMap]} rounded-full ${colorMap[pin.size as keyof typeof colorMap]} border-2 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:scale-125 transition-transform duration-200`}>
              {pin.count}
              <div className="absolute inset-0 rounded-full border-2 border-current animate-pulse-ring opacity-50" />
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-grey-800 text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {pin.label}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 right-3 bg-white/90 rounded-lg p-2.5 shadow-sm text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-grey-600">High density (5+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-grey-600">Medium (3-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-grey-600">Low (1-3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
