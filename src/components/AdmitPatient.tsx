import React, { useState } from 'react';
import { Patient, Specialty } from '../types';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdmitPatientProps {
  onAdmit: (patient: Omit<Patient, 'id'>) => Promise<void>;
}

const AdmitPatient: React.FC<AdmitPatientProps> = ({ onAdmit }) => {
  const [name, setName] = useState('');
  const [mrn, setMRN] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [diagnosis, setDiagnosis] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>('General Internal Medicine');
  const [assignedDoctor, setAssignedDoctor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    const newPatient: Omit<Patient, 'id'> = {
      name,
      mrn,
      age: parseInt(age),
      gender,
      diagnosis,
      admissionDate: new Date().toISOString(),
      status: 'Active',
      specialty,
      assignedDoctor: assignedDoctor || undefined,
    };
    
    try {
      await onAdmit(newPatient);
      navigate('/specialties');
    } catch (error) {
      console.error('Error admitting patient:', error);
      setError('An error occurred while admitting the patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <UserPlus className="mr-2" />
        Admit New Patient
      </h2>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="mrn" className="block text-sm font-medium text-gray-700">MRN (Medical Record Number)</label>
          <input
            type="text"
            id="mrn"
            value={mrn}
            onChange={(e) => setMRN(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
            className="input"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis</label>
          <input
            type="text"
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
          <select
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value as Specialty)}
            className="input"
          >
            <option value="General Internal Medicine">General Internal Medicine</option>
            <option value="Hematology">Hematology</option>
            <option value="Rheumatology">Rheumatology</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Infectious Diseases">Infectious Diseases</option>
            <option value="Neurology">Neurology</option>
            <option value="Endocrinology">Endocrinology</option>
          </select>
        </div>
        <div>
          <label htmlFor="assignedDoctor" className="block text-sm font-medium text-gray-700">Assigned Doctor (Optional)</label>
          <input
            type="text"
            id="assignedDoctor"
            value={assignedDoctor}
            onChange={(e) => setAssignedDoctor(e.target.value)}
            className="input"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Admitting...' : 'Admit Patient'}
        </button>
      </form>
    </div>
  );
};

export default AdmitPatient;