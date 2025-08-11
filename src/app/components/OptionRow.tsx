import { HelpCircle } from "lucide-react";

type Props = {
  label: string;
  note?: string;
  onClick?: () => void;
};

export default function OptionRow({ label, note, onClick }: Props) {
  return (
    <div className="option-item">
      <button className="option-button" onClick={onClick} aria-label={label}>
        <div>{label}</div>
        {note && <div className="option-note mt-1">{note}</div>}
      </button>
      <button className="help-btn" aria-label={`More info about ${label}`}>
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
