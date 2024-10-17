import React, { useState } from 'react';
import { DailyReport as DailyReportType, Specialty } from '../types';
import { Calendar, Download, Printer, Users, Filter } from 'lucide-react';

interface DailyReportProps {
  report: DailyReportType;
}

const DailyReportComponent: React.FC<DailyReportProps> = ({ report }) => {
  const [viewMode, setViewMode] = useState<'specialty' | 'day'>('specialty');
  const specialties: Specialty[] = [
    'General Internal Medicine',
    'Hematology',
    'Rheumatology',
    'Pulmonology',
    'Infectious Diseases',
    'Neurology',
    'Endocrinology',
  ];

  const handleDownload = () => {
    // Implement PDF download functionality
    console.log('Downloading report...');
  };

  const handlePrint = () => {
    window.print();
  };

  const renderSpecialtyView = () => (
    <>
      {specialties.map((specialty) => (
        <div key={specialty} className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            {specialty}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-medium mb-2 text-gray-700">Active Patients</h4>
              <ul className="space-y-2">
                {report.specialties[specialty].activePatients.map((patient) => (
                  <li key={`active-${patient.id}`} className="bg-green-50 p-2 rounded-md text-green-800">
                    {patient.name} (Age: {patient.age}, Days Admitted: {Math.floor((Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-medium mb-2 text-gray-700">Discharged Patients</h4>
              <ul className="space-y-2">
                {report.specialties[specialty].dischargedPatients.map((patient) => (
                  <li key={`discharged-${patient.id}`} className="bg-gray-50 p-2 rounded-md text-gray-800">
                    {patient.name} (Age: {patient.age}, Discharged: {new Date(patient.dischargeDate!).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  const renderDayView = () => {
    const allPatients = specialties.flatMap(specialty => [
      ...report.specialties[specialty].activePatients,
      ...report.specialties[specialty].dischargedPatients
    ]);

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Daily Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-medium mb-2 text-gray-700">Active Patients</h4>
            <ul className="space-y-2">
              {allPatients.filter(p => p.status === 'Active').map((patient) => (
                <li key={`active-${patient.id}`} className="bg-green-50 p-2 rounded-md text-green-800">
                  {patient.name} (Age: {patient.age}, Specialty: {patient.specialty}, Days Admitted: {Math.floor((Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-medium mb-2 text-gray-700">Discharged Patients</h4>
            <ul className="space-y-2">
              {allPatients.filter(p => p.status === 'Discharged').map((patient) => (
                <li key={`discharged-${patient.id}`} className="bg-gray-50 p-2 rounded-md text-gray-800">
                  {patient.name} (Age: {patient.age}, Specialty: {patient.specialty}, Discharged: {new Date(patient.dischargeDate!).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Daily Report</h2>
        <div className="flex space-x-4">
          <button onClick={handleDownload} className="btn btn-secondary flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
          <button onClick={handlePrint} className="btn btn-secondary flex items-center">
            <Printer className="w-5 h-5 mr-2" />
            Print
          </button>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="text-xl">{new Date(report.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'specialty' | 'day')}
              className="input py-1 px-2"
            >
              <option value="specialty">View by Specialty</option>
              <option value="day">View by Day</option>
            </select>
          </div>
        </div>
        {viewMode === 'specialty' ? renderSpecialtyView() : renderDayView()}
      </div>
    </div>
  );
};

export default DailyReportComponent;