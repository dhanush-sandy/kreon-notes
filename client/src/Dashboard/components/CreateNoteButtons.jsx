import React from 'react';
import { PenLine, FileText, Clock11Icon } from 'lucide-react';

const CreateNoteButtons = ({ onCreateNote }) => {
  return (
    <div className="flex space-x-4 mb-8">
      <button
        onClick={() => onCreateNote('text')}
        className="flex-1 bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-amber-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
          <FileText size={20} className="text-gray-700" />
        </div>
        <div className="text-xs text-gray-500">New Note</div>
        <div className="text-sm font-medium">Take a Note</div>
      </button>

      <button
        onClick={() => onCreateNote('drawing')}
        className="flex-1 bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-blue-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
          <PenLine size={20} className="text-gray-700" />
        </div>
        <div className="text-xs text-gray-500">New Drawing</div>
        <div className="text-sm font-medium">Create a Drawing</div>
      </button>

      <button
        onClick={() => onCreateNote('reminder')}
        className="flex-1 bg-green-50 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-green-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
          <Clock11Icon size={20} className="text-gray-700" />
        </div>
        <div className="text-xs text-gray-500">New Reminder</div>
        <div className="text-sm font-medium">Set a Reminder</div>
      </button>
    </div>
  );
};

export default CreateNoteButtons;