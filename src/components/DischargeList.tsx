import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Patient } from '../types';
import { UserMinus, Calendar, Clock, Search } from 'lucide-react';

interface DischargeListProps {
  patients: Patient[];
  onRequestDischarge: (mrn: string) => Promise<void>;
}

const DischargeList: React.FC<DischargeListProps> = ({ patients, onRequestDischarge }) => {
  const [searchMRN, setSearchMRN] = useState('');
  const [searchResult, setSearchResult] = useState<Patient | null>(null);

  const activePatients = patients.filter(patient => patient.status === 'Active');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundPatient = patients.find(patient => patient.mrn === searchMRN && patient.status === 'Active');
    setSearchResult(foundPatient || null);
  };

  const handleRequestDischarge = async () => {
    if (searchResult) {
      await onRequestDischarge(searchResult.mrn);
      setSearchMRN('');
      setSearchResult(null);
    }
  };

  // ... rest of the component remains the same ...
};

export default DischargeList;