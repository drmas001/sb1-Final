import React, { useState, useEffect } from 'react';
import { Patient, MedicalNote } from '../types';
import { Calendar, Clock, User, FileText, PlusCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

interface PatientDetailsProps {
  patients: Patient[];
  onAddNote: (note: Omit<MedicalNote, 'id'>) => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patients, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [patientNotes, setPatientNotes] = useState<MedicalNote[]>([]);
  const { id } = useParams<{ id: string }>();

  const patient = patients.find(p => p.id === id);

  useEffect(() => {
    const fetchNotes = async () => {
      if (id) {
        const notes = await api.getMedicalNotes(id);
        setPatientNotes(notes);
      }
    };
    fetchNotes();
  }, [id]);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const noteToAdd: Omit<MedicalNote, 'id'> = {
        patientId: patient.id,
        date: new Date().toISOString(),
        note: newNote,
        user: 'Current User', // Replace with actual user when authentication is implemented
      };
      await onAddNote(noteToAdd);
      const updatedNotes = await api.getMedicalNotes(patient.id);
      setPatientNotes(updatedNotes);
      setNewNote('');
    }
  };

  // ... rest of the component remains the same ...
};

export default PatientDetails;