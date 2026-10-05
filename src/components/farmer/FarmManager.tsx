import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Farm, SoilType } from '../../types';
import { Sprout, MapPin, Plus, Edit2, Trash2, CheckCircle2, Layers } from 'lucide-react';

export const FarmManager: React.FC = () => {
  const { farms, currentUser, addFarm, updateFarm, deleteFarm, setActiveNav } = useApp();

  const farmerFarms = farms.filter(
    (f) => f.farmerId === currentUser.id || currentUser.role === 'admin'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [village, setVillage] = useState(currentUser.village || 'Keregodu');
  const [district, setDistrict] = useState(currentUser.district || 'Mandya');
  const [state, setState] = useState(currentUser.state || 'Karnataka');
  const [acreage, setAcreage] = useState(3.0);
  const [soilType, setSoilType] = useState<SoilType>('Red Sandy Loam');
  const [currentCrop, setCurrentCrop] = useState('Sugarcane (Co 86032)');
  const [irrigationSource, setIrrigationSource] = useState('VC Canal Water');

  const openAddModal = () => {
    setEditingFarm(null);
    setName('');
    setSurveyNumber(`SY-${Math.floor(100 + Math.random() * 900)}/A`);
    setVillage(currentUser.village || 'Keregodu');
    setDistrict(currentUser.district || 'Mandya');
    setState(currentUser.state || 'Karnataka');
    setAcreage(2.5);
    setSoilType('Red Sandy Loam');
    setCurrentCrop('Sugarcane');
    setIrrigationSource('VC Canal Water');
    setIsModalOpen(true);
  };

  const openEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setName(farm.name);
    setSurveyNumber(farm.surveyNumber);
    setVillage(farm.village);
    setDistrict(farm.district);
    setState(farm.state);
    setAcreage(farm.acreage);
    setSoilType(farm.soilType);
    setCurrentCrop(farm.currentCrop);
    setIrrigationSource(farm.irrigationSource);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFarm) {
      updateFarm(editingFarm.id, {
        name,
        surveyNumber,
        village,
        district,
        state,
        acreage: Number(acreage),
        soilType,
        currentCrop,
        irrigationSource,
      });
    } else {
      addFarm({
        name,
        surveyNumber,
        village,
        district,
        state,
        acreage: Number(acreage),
        soilType,
        currentCrop,
        irrigationSource,
        coordinates: { lat: 22.56, lng: 72.92 },
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Registered Farm Land Parcels
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Maintain accurate survey numbers and soil characteristics for geo-tagged test records.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farm Plot</span>
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {farmerFarms.map((farm) => (
          <div
            key={farm.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">{farm.name}</h3>
                  <div className="text-xs font-mono text-emerald-800 font-semibold mt-0.5">
                    Survey No: {farm.surveyNumber}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
              </div>

              <div className="py-3 text-xs space-y-2 text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Acreage:</span>
                  <span className="font-bold text-stone-900">{farm.acreage} Acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Soil Classification:</span>
                  <span className="font-medium text-stone-800">{farm.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Current Standing Crop:</span>
                  <span className="font-semibold text-emerald-800">{farm.currentCrop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Irrigation Source:</span>
                  <span className="text-stone-800">{farm.irrigationSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Location:</span>
                  <span className="text-stone-800">{farm.village}, {farm.district}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setActiveNav('book')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                + Book Test on Plot
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(farm)}
                  className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Edit Plot Details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteFarm(farm.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Farm Plot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Farm Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              {editingFarm ? 'Update Farm Parcel Details' : 'Register New Farm Parcel'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Accurate farm details ensure proper agronomic dosage calculations in your report.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Plot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Canal Wheat Parcel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Survey / Khasra No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SY-142/2A"
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Parcel Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={acreage}
                    onChange={(e) => setAcreage(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Soil Classification</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Black Clay (Regur)">Black Clay (Regur)</option>
                    <option value="Alluvial Loam">Alluvial Loam</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Laterite Soil">Laterite Soil</option>
                    <option value="Silty Clay Loam">Silty Clay Loam</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Standing Crop</label>
                  <input
                    type="text"
                    placeholder="e.g. Cotton, Wheat, Fallow"
                    value={currentCrop}
                    onChange={(e) => setCurrentCrop(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Irrigation Infrastructure
                </label>
                <input
                  type="text"
                  placeholder="e.g. Canal Lift + Drip System"
                  value={irrigationSource}
                  onChange={(e) => setIrrigationSource(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900"
                >
                  {editingFarm ? 'Save Changes' : 'Register Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
