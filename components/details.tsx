"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Calendar,
  Package,
  MapPin,
  Briefcase,
  FileText,
  CheckSquare,
} from "lucide-react";

interface ScheduleRequest {
  id: number;
  siNo: number;
  planner: string;
  salesOrder: string;
  requestedDateTime: string;
  unit: number;
  quantity: number;
  language: string;
  location: string;
  project: string;
  lpoRefNo: string;
  isCombo: boolean;
  attachment: File | null;
}

interface FormData {
  siNo: number | string;
  planner: string;
  salesOrder: string;
  requestedDateTime: string;
  unit: number | string;
  quantity: number | string;
  language: string;
  location: string;
  project: string;
  lpoRefNo: string;
  isCombo: boolean;
  attachment: File | null;
}

export default function ScheduleRequestManager() {
  const [requests, setRequests] = useState<ScheduleRequest[]>([
    {
      id: 1,
      siNo: 1,
      planner: "John Doe",
      salesOrder: "SO-2024-001",
      requestedDateTime: "2024-11-10T10:00",
      unit: 5,
      quantity: 100,
      language: "English",
      location: "Warehouse A",
      project: "Project Alpha",
      lpoRefNo: "LPO-001",
      isCombo: false,
      attachment: null,
    },
    {
      id: 2,
      siNo: 2,
      planner: "Jane Smith",
      salesOrder: "SO-2024-002",
      requestedDateTime: "2024-11-12T14:30",
      unit: 3,
      quantity: 75,
      language: "Arabic",
      location: "Warehouse B",
      project: "Project Beta",
      lpoRefNo: "LPO-002",
      isCombo: true,
      attachment: null,
    },
  ]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    siNo: "",
    planner: "",
    salesOrder: "",
    requestedDateTime: "",
    unit: "",
    quantity: "",
    language: "English",
    location: "Warehouse A",
    project: "Project Alpha",
    lpoRefNo: "LPO-001",
    isCombo: false,
    attachment: null,
  });

  const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} at ${formattedTime}`;
  };

  const languages: string[] = [
    "English",
    "Arabic",
    "Spanish",
    "French",
    "German",
  ];
  const locations: string[] = [
    "Warehouse A",
    "Warehouse B",
    "Warehouse C",
    "Distribution Center",
  ];
  const projects: string[] = [
    "Project Alpha",
    "Project Beta",
    "Project Gamma",
    "Project Delta",
  ];
  const lpoOptions: string[] = ["LPO-001", "LPO-002", "LPO-003", "LPO-004"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked, files } = target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] || null
          : value,
    }));
  };

  const handleCreate = (): void => {
    const newSiNo =
      requests.length > 0 ? Math.max(...requests.map((r) => r.siNo)) + 1 : 1;
    setFormData({
      siNo: newSiNo,
      planner: "",
      salesOrder: "",
      requestedDateTime: "",
      unit: "",
      quantity: "",
      language: "English",
      location: "Warehouse A",
      project: "Project Alpha",
      lpoRefNo: "LPO-001",
      isCombo: false,
      attachment: null,
    });
    setIsEditing(true);
    setEditingId(null);
  };

  const handleEdit = (request: ScheduleRequest): void => {
    setFormData({ ...request });
    setIsEditing(true);
    setEditingId(request.id);
  };

  const handleSave = (): void => {
    if (editingId) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? ({
                ...formData,
                id: editingId,
                siNo: Number(formData.siNo),
                unit: Number(formData.unit),
                quantity: Number(formData.quantity),
              } as ScheduleRequest)
            : r
        )
      );
    } else {
      const newRequest: ScheduleRequest = {
        ...formData,
        id: Date.now(),
        siNo: Number(formData.siNo),
        unit: Number(formData.unit),
        quantity: Number(formData.quantity),
      };
      setRequests((prev) => [...prev, newRequest]);
    }
    setIsEditing(false);
    setEditingId(null);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id: number): void => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-indigo-500 mb-2">
                Schedule Requests
              </h1>
              <p className="text-slate-600">
                Manage and organize your schedule requests
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus size={20} />
                New Request
              </button>
            )}
          </div>
        </div>

        {/* Create/Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="text-indigo-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Edit Schedule Request" : "Create New Request"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  SI No
                </label>
                <input
                  type="text"
                  name="siNo"
                  value={formData.siNo}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Schedule Request Planner
                </label>
                <input
                  type="text"
                  name="planner"
                  value={formData.planner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter planner name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sales Order
                </label>
                <input
                  type="text"
                  name="salesOrder"
                  value={formData.salesOrder}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter sales order"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Requested Time and Date
                </label>
                <input
                  type="datetime-local"
                  name="requestedDateTime"
                  value={formData.requestedDateTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Unit
                </label>
                <input
                  type="number"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter unit"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  {projects.map((proj) => (
                    <option key={proj} value={proj}>
                      {proj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  LPO Reference No
                </label>
                <select
                  name="lpoRefNo"
                  value={formData.lpoRefNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  {lpoOptions.map((lpo) => (
                    <option key={lpo} value={lpo}>
                      {lpo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="isCombo"
                  checked={formData.isCombo}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-3 text-sm font-semibold text-slate-700">
                  Is Combo
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Attachment
                </label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Save size={18} />
                Save Request
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-xl transition-all duration-200 font-semibold"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-indigo-500 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-indigo-100 text-sm font-semibold">
                        SI No
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold">
                        #{request.siNo}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {request.planner}
                    </h3>
                    <p className="text-indigo-100 font-medium">
                      {request.salesOrder}
                    </p>
                  </div>
                  {request.isCombo && (
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        <CheckSquare size={14} />
                        COMBO
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Calendar size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Date & Time
                    </p>
                    <p className="font-semibold">
                      {formatDateTime(request.requestedDateTime)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Package size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">
                        Unit
                      </p>
                      <p className="font-bold text-lg">{request.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-pink-50 rounded-lg">
                      <Package size={18} className="text-pink-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">
                        Quantity
                      </p>
                      <p className="font-bold text-lg">{request.quantity}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Language
                    </p>
                    <p className="font-semibold text-slate-700">
                      {request.language}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      LPO Ref
                    </p>
                    <p className="font-semibold text-slate-700">
                      {request.lpoRefNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MapPin size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Location
                    </p>
                    <p className="font-semibold">{request.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Project
                    </p>
                    <p className="font-semibold">{request.project}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => handleEdit(request)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-3 rounded-xl transition-all duration-200 font-semibold"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-xl transition-all duration-200 font-semibold"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && !isEditing && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-indigo-100">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-indigo-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No Schedule Requests
            </h3>
            <p className="text-slate-600 mb-6">
              Get started by creating your first schedule request
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <Plus size={20} />
              Create Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
