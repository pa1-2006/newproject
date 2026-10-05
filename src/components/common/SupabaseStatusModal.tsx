import React, { useState } from 'react';
import {
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SCHEMA_SQL,
  isSupabaseConfigured,
} from '../../lib/supabase';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  Code,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const { appointments, addToast } = useApp();
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    tableFound?: boolean;
  }>({
    tested: false,
    success: false,
    message: '',
  });

  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const testSupabaseConnection = async () => {
    setTestingConnection(true);
    try {
      // Test querying the appointments table
      const { data, error } = await supabase.from('appointments').select('id').limit(1);

      if (error) {
        if (error.code === '42P01' || error.message.includes('relation "appointments" does not exist')) {
          setTestResult({
            tested: true,
            success: true,
            tableFound: false,
            message:
              'Connected to Supabase project! Note: The "appointments" table does not exist yet. Please copy the SQL below and run it in your Supabase SQL Editor.',
          });
        } else {
          setTestResult({
            tested: true,
            success: false,
            message: `Connection error: ${error.message}`,
          });
        }
      } else {
        setTestResult({
          tested: true,
          success: true,
          tableFound: true,
          message:
            'Connection verified! Table "appointments" exists and is ready to store bookings in project ' +
            SUPABASE_PROJECT_ID,
        });
      }
    } catch (err: any) {
      setTestResult({
        tested: true,
        success: false,
        message: err?.message || 'Failed to ping Supabase URL.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    addToast('success', 'SQL Copied', 'Paste this SQL in your Supabase Dashboard SQL Editor.');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-emerald-850 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/50 flex items-center justify-center text-white border border-emerald-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Supabase Backend Connection</h3>
              <p className="text-xs text-emerald-200">
                Live database synchronization for soil testing appointments
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-stone-700 max-h-[75vh] overflow-y-auto">
          {/* Project Details Grid */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-500">Project ID:</span>
              <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                {SUPABASE_PROJECT_ID}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-500">Project Endpoint:</span>
              <span className="font-mono text-emerald-800 break-all text-right">{SUPABASE_URL}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-500">API Key Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Configured (Publishable Anon Key)</span>
              </span>
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={testSupabaseConnection}
              disabled={testingConnection}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'Pinging Supabase...' : 'Test Database Connection'}</span>
            </button>

            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 text-xs text-emerald-800 font-semibold hover:underline"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {testResult.tested && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                testResult.success
                  ? testResult.tableFound === false
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {testResult.success ? 'Supabase Reachable' : 'Supabase Ping Failed'}
                  </div>
                  <div className="mt-1">{testResult.message}</div>
                </div>
              </div>
            </div>
          )}

          {/* SQL Setup Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-800" />
                <span>Supabase SQL Table Schema (appointments)</span>
              </span>
              <button
                onClick={copySqlToClipboard}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Run this one-time SQL script in your{' '}
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-800 font-semibold underline"
              >
                Supabase SQL Editor
              </a>{' '}
              to create the table and enable automatic insertion:
            </p>
            <div className="p-3 bg-stone-950 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-stone-800">
              <pre>{SUPABASE_SCHEMA_SQL}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
