import axios from 'axios';
import { Patient, MedicalNote } from '../types';

const API_URL = '/.netlify/functions/api';

export const api = {
  async getPatients(): Promise<Patient[]> {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
  },

  async addPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const response = await axios.post(`${API_URL}/patients`, patient);
    return response.data;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const response = await axios.put(`${API_URL}/patients/${id}`, updates);
    return response.data;
  },

  async getMedicalNotes(patientId: string): Promise<MedicalNote[]> {
    const response = await axios.get(`${API_URL}/patients/${patientId}/notes`);
    return response.data;
  },

  async addMedicalNote(note: Omit<MedicalNote, 'id'>): Promise<MedicalNote> {
    const response = await axios.post(`${API_URL}/notes`, note);
    return response.data;
  },

  async getMedicalNotesByDate(patientId: string, date: string): Promise<MedicalNote[]> {
    const response = await axios.get(`${API_URL}/patients/${patientId}/notes`, { params: { date } });
    return response.data;
  },
};