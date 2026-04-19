import { Phone, StickyNote, FileText, MessageSquare, Mail, CheckCircle2, ArrowRight, Award, Plus } from "lucide-react";
import { prettyDateTime } from "@/lib/format";
import type { Activity, ActivityKind } from "@/types";

const ICON: Record<ActivityKind, { icon: typeof Phone; color: string }> = {
  call:            { icon: Phone,         color: "bg-info-100 text-info-700" },
  note:            { icon: StickyNote,    color: "bg-amber-100 text-amber-700" },
  status_change:   { icon: ArrowRight,    color: "bg-ink-100 text-ink-700" },
  text:            { icon: MessageSquare, color: "bg-info-100 text-info-700" },
  email:           { icon: Mail,          color: "bg-info-100 text-info-700" },
  task_created:    { icon: Plus,          color: "bg-ink-100 text-ink-700" },
  task_completed:  { icon: CheckCircle2,  color: "bg-success-50 text-success-700" },
  app_submitted:   { icon: FileText,      color: "bg-info-100 text-info-700" },
  policy_issued:   { icon: Award,         color: "bg-success-500 text-white" },
};

export function ActivityTimeline({ items }: { items: Activity[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-500 py-4">No activity yet.</p>;
  }

  return (
    <ol className="relative">
      {items.map((a, idx) => {
        const { icon: Icon, color } = ICON[a.kind];
        return (
          <li key={a.id} className="relative pl-10 pb-5 last:pb-0">
            {idx < items.length - 1 && (
              <span className="absolute left-[15px] top-8 bottom-0 w-px bg-ink-200" />
            )}
            <div className={`absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-ink-900">{a.body}</p>
              <div className="text-xs text-ink-500 mt-1">
                Activity · {prettyDateTime(a.timestamp)}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
