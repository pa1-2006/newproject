import React from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampleCollectionGuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Divide the Field & Clear Surface',
      desc: 'Divide field into uniform sampling units based on soil color, slope, or crop history. Scrape away surface litter, dry weeds, and stones. Do not disturb the topsoil layer.',
    },
    {
      step: '02',
      title: 'Dig a V-Shaped Pit (15 cm Depth)',
      desc: 'Using a clean stainless spade or khurpi, dig a V-shaped cut to a depth of 15 cm (6 inches) for field crops like wheat/cotton, or 30 cm (12 inches) for orchards and trees.',
    },
    {
      step: '03',
      title: 'Take a Uniform 1-Inch Soil Slice',
      desc: 'Shave a uniform slice of soil (about 1 inch / 2.5 cm thick) from top to bottom along one side of the V-cut. Place it into a clean plastic container or tray.',
    },
    {
      step: '04',
      title: 'Sample 8–10 Spots in Zig-Zag Pattern',
      desc: 'Repeat this across the field in a zig-zag path to ensure representative sampling. Never sample near compost pits, field bunds, water channels, or under tree shades.',
    },
    {
      step: '05',
      title: 'Thoroughly Mix & Quarter Down to 500g',
      desc: 'Thoroughly mix all collected slices in a clean tray. Form a circle, divide into four quarters, discard opposite two quarters. Repeat until approximately 500 grams of composite soil remains.',
    },
    {
      step: '06',
      title: 'Shade Dry & Label Cleanly',
      desc: 'Spread the 500g sample on clean paper under shade (never direct sun or stove heat). Pack in a dry plastic or cloth bag with your Name, Survey Number, Date, and Intended Crop.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-emerald-800 text-white flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
              Farmer Advisory Guide
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">
              Scientific Soil Sampling Protocol (V-Cut Method)
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Accurate test results depend 90% on proper field sample collection.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-stone-700">
          {/* Quick Warning / Dos & Don'ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Recommended Practices</span>
              </div>
              <ul className="text-xs text-emerald-800 space-y-1.5 list-disc pl-4">
                <li>Sample 15 to 30 days before sowing season.</li>
                <li>Ensure sampling tools are rust-free and clean.</li>
                <li>Shade-dry moist soil on clean newspaper.</li>
                <li>Bring ~500 grams per field sample bag.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Areas to Avoid</span>
              </div>
              <ul className="text-xs text-amber-800 space-y-1.5 list-disc pl-4">
                <li>Avoid spots near fertilizer bags or manure heaps.</li>
                <li>Do not sample wet waterlogged marshy patches.</li>
                <li>Keep away from field boundaries and tree shades.</li>
                <li>Never use heat or direct harsh sunlight to dry soil.</li>
              </ul>
            </div>
          </div>

          {/* Step by Step visual flow */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-2">
              Step-by-Step Field Procedure
            </h4>
            <div className="grid grid-cols-1 gap-3.5">
              {steps.map((st) => (
                <div
                  key={st.step}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-stone-100 bg-stone-50/70 hover:bg-stone-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {st.step}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-stone-900">{st.title}</h5>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Compliant with ICAR Soil Health Card standard sampling norms
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Understood, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
