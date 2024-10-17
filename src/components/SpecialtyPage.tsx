import React, { useState } from 'react';
import { Patient, Specialty, MedicalNote } from '../types';
import { Calendar, Clock, User, FileText, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface SpecialtyPageProps {
  specialty: Specialty;
  patients: Patient[];
}

const SpecialtyPage: React.FC<SpecialtyPageProps> = ({ specialty, patients }) => {
  const [notes, setNotes] = useState<{ [patientId: string]: string }>({});
  const [loading, setLoading] = useState<{ [patientId: string]: boolean }>({});

  const activePatients = patients.filter(patient => patient.status === 'Active');

  const handleNoteChange = (patientId: string, note: string) => {
    setNotes(prevNotes => ({ ...prevNotes, [patientId]: note }));
  };

  const handleAddNote = async (patientId: string) => {
    const note = notes[patientId];
    if (note && note.trim()) {
      setLoading(prev => ({ ...prev, [patientId]: true }));
      try {
        const newNote: Omit<MedicalNote, 'id'> = {
          patientId,
          date: new Date().toISOString(),
          note,
          user: 'Current User', // Replace with actual user when authentication is implemented
        };
        await api.addMedicalNote(newNote);
        setNotes(prevNotes => ({ ...prevNotes, [patientId]: '' }));
      } catch (error) {
        console.error('Error adding note:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(prev => ({ ...prev, [patientId]: false }));
      }
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{specialty}</h3>
      {activePatients.length === 0 ? (
        <p className="text-gray-600">No active patients in this specialty.</p>
      ) : (
        <div className="space-y-6">
          {activePatients.map(patient => (
            <div key={`${specialty}-${patient.id}`} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <Link to={`/patient/${patient.id}`} className="block hover:text-indigo-600 transition-colors duration-200">
                <h4 className="text-lg font-semibold mb-2">{patient.name}</h4>
              </Link>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Age: {patient.age}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Days Admitted: {Math.floor((Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
              </div>
              <Link
                to={`/discharge/${patient.id}`}
                className="btn btn-danger mt-3 text-sm"
              >
                Discharge
              </Link>
              <div className="mt-3">
                <label htmlFor={`note-${patient.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Add Note
                </label>
                <textarea
                  id={`note-${patient.id}`}
                  rows={3}
                  className="input w-full text-sm"
                  placeholder={`Add a note for ${patient.name}...`}
                  value={notes[patient.id] || ''}
                  onChange={(e) => handleNoteChange(patient.id, e.target.value)}
                />
                <button
                  onClick={() => handleAddNote(patient.id)}
                  disabled={loading[patient.id] || !notes[patient.id]?.trim()}
                  className="btn btn-primary mt-2 text-sm flex items-center justify-center"
                >
                  {loading[patient.id] ? (
                    'Adding...'
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Note
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialtyPage;