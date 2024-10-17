import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Patient } from '../types';
import { UserMinus } from 'lucide-react';

interface DischargePatientProps {
  patients: Patient[];
  onDischarge: (patientId: string, dischargeNotes: string) => Promise<void>;
}

const DischargePatient: React.FC<DischargePatientProps> = ({ patients, onDischarge }) => {
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [isDischarging, setIsDischarging] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return <div className="text-center mt-8">Patient not found</div>;
  }

  const handleDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDischarging(true);
    try {
      await onDischarge(patient.id, dischargeNotes);
      navigate('/specialties');
    } catch (error) {
      console.error('Error discharging patient:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsDischarging(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <UserMinus className="mr-2" />
        Discharge Patient
      </h2>
      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-2">Patient Information</h3>
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>MRN:</strong> {patient.mrn}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
        <p><strong>Admission Date:</strong> {new Date(patient.admissionDate).toLocaleDateString()}</p>
      </div>
      <form onSubmit={handleDischarge} className="card space-y-4">
        <div>
          <label htmlFor="dischargeNotes" className="block text-sm font-medium text-gray-700">Discharge Notes</label>
          <textarea
            id="dischargeNotes"
            value={dischargeNotes}
            onChange={(e) => setDischargeNotes(e.target.value)}
            required
            className="input"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isDischarging}
        >
          {isDischarging ? 'Discharging...' : 'Discharge Patient'}
        </button>
      </form>
    </div>
  );
};

export default DischargePatient;