import React, { useState } from 'react';
import { Patient, MedicalNote } from '../types';
import { Calendar, Download } from 'lucide-react';
import { api } from '../services/api';

interface ExtractPatientDataProps {
  patients: Patient[];
}

const ExtractPatientData: React.FC<ExtractPatientDataProps> = ({ patients }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [extractedData, setExtractedData] = useState<{ patient: Patient; notes: MedicalNote[] }[]>([]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleExtract = async () => {
    if (!selectedDate) return;

    const extractedData = await Promise.all(
      patients.map(async (patient) => {
        const notes = await api.getMedicalNotesByDate(patient.id, selectedDate);
        return { patient, notes };
      })
    );

    setExtractedData(extractedData.filter(data => data.notes.length > 0));
  };

  const handleDownload = () => {
    if (extractedData.length === 0) return;

    const csvContent = extractedData.map(({ patient, notes }) => {
      const notesText = notes.map(note => `"${note.note.replace(/"/g, '""')}"`).join('; ');
      return `${patient.name},${patient.mrn},${patient.specialty},${notesText}`;
    }).join('\n');

    const csvHeader = 'Patient Name,MRN,Specialty,Notes\n';
    const csvData = csvHeader + csvContent;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_data_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Extract Patient Data</h2>
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <label htmlFor="extractDate" className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            id="extractDate"
            value={selectedDate}
            onChange={handleDateChange}
            className="input w-full"
          />
        </div>
        <button onClick={handleExtract} className="btn btn-primary mt-6">
          <Calendar className="w-5 h-5 mr-2" />
          Extract Data
        </button>
      </div>
      {extractedData.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Extracted Data</h3>
          <ul className="space-y-2">
            {extractedData.map(({ patient, notes }) => (
              <li key={patient.id} className="bg-gray-50 p-3 rounded-md">
                <p className="font-semibold">{patient.name} (MRN: {patient.mrn})</p>
                <p className="text-sm text-gray-600">Specialty: {patient.specialty}</p>
                <ul className="mt-2 space-y-1">
                  {notes.map(note => (
                    <li key={note.id} className="text-sm">{note.note}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button onClick={handleDownload} className="btn btn-secondary mt-4">
            <Download className="w-5 h-5 mr-2" />
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default ExtractPatientData;