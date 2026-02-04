import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { PaymentProviderConfig } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// Liste par défaut: toujours affichée même si l'API ne renvoie rien
const DEFAULT_CONFIGS: PaymentProviderConfig[] = [
  { provider: 'wave', enabled: true },
  { provider: 'om', enabled: true },
  { provider: 'mtn', enabled: true },
  { provider: 'moov', enabled: false },
];

function mergeWithDefaults(apiConfigs: PaymentProviderConfig[] | undefined): PaymentProviderConfig[] {
  const byProvider = new Map<string, PaymentProviderConfig>();
  for (const cfg of DEFAULT_CONFIGS) byProvider.set(cfg.provider, { ...cfg });
  for (const cfg of apiConfigs ?? []) {
    const prev = byProvider.get(cfg.provider);
    byProvider.set(cfg.provider, { ...(prev ?? {} as PaymentProviderConfig), ...cfg });
  }
  return Array.from(byProvider.values());
}

function providerLabel(p: PaymentProviderConfig['provider']): string {
  switch (p) {
    case 'wave': return 'Wave';
    case 'om': return 'Orange Money';
    case 'mtn': return 'MTN Money';
    case 'moov': return 'Moov Money';
    default: return p;
  }
}

function providerColor(p: PaymentProviderConfig['provider']): string {
  switch (p) {
    case 'wave': return 'bg-blue-500';
    case 'om': return 'bg-orange-500';
    case 'mtn': return 'bg-yellow-400';
    case 'moov': return 'bg-blue-800';
    default: return 'bg-gray-500';
  }
}

function isValidUrl(value: string): boolean {
  try {
    if (!value) return true; // callback URL optionnelle
    const u = new URL(value);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}

function validateConfig(cfg: PaymentProviderConfig): string[] {
  const errors: string[] = [];
  if (cfg.enabled) {
    if (!cfg.apiKey || cfg.apiKey.trim().length < 4) errors.push(`${providerLabel(cfg.provider)}: API Key invalide`);
    if (!cfg.apiSecret || cfg.apiSecret.trim().length < 4) errors.push(`${providerLabel(cfg.provider)}: API Secret invalide`);
  }
  if (cfg.callbackUrl && !isValidUrl(cfg.callbackUrl)) {
    errors.push(`${providerLabel(cfg.provider)}: Callback URL invalide`);
  }
  return errors;
}

export function PaymentsConfig() {
  const [configs, setConfigs] = useState<PaymentProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getPaymentConfigs().catch(() => []);
        setConfigs(mergeWithDefaults(data));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistToggle = async (updated: PaymentProviderConfig) => {
    try {
      await api.updatePaymentConfig(updated);
      setConfigs(prev => prev.map(c => c.provider === updated.provider ? updated : c));
      setMessage('Statut mis à jour.');
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage('Erreur lors de la mise à jour du statut.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const saveAll = async () => {
    setIsSaving(true);
    setMessage(null);

    // Validation des configs
    const allErrors = configs.flatMap(validateConfig);
    if (allErrors.length > 0) {
      setIsSaving(false);
      setMessage(allErrors.join(' • '));
      return;
    }

    try {
      for (const cfg of configs) {
        await api.updatePaymentConfig(cfg);
      }
      setMessage('Configuration enregistrée.');
    } catch {
      setMessage('Erreur lors de l’enregistrement des configurations.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateField = (provider: PaymentProviderConfig['provider'], field: keyof PaymentProviderConfig, value: string | boolean) => {
    setConfigs(prev => prev.map(c => c.provider === provider ? { ...c, [field]: value } : c));
  };

  const resetToDefaults = () => {
    setConfigs(mergeWithDefaults([]));
    setMessage('Réinitialisé aux valeurs par défaut.');
    setTimeout(() => setMessage(null), 2000);
  };

  if (loading) return <div>Chargement…</div>;

  return (
    <div className="space-y-6">
      {/* Message global */}
      {message && (
        <div className="p-2 rounded bg-gray-100 text-gray-700 text-sm">
          {message}
        </div>
      )}

      {configs.map(cfg => (
        <div key={cfg.provider} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${providerColor(cfg.provider)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
              {providerLabel(cfg.provider).charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{providerLabel(cfg.provider)}</p>
              <p className="text-xs text-gray-500">Paiement mobile</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!cfg.enabled}
              onChange={(e) => persistToggle({ ...cfg, enabled: e.target.checked })}
            />
            <span className="ml-2 text-sm">{cfg.enabled ? 'Activé' : 'Désactivé'}</span>
          </label>
        </div>
      ))}

      {/* Champs API pour chaque provider */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Clés API</h4>
        <p className="text-xs text-gray-500 mb-3">
          Entrez vos clés API pour activer les paiements en production.
        </p>
        {configs.map(cfg => {
          const errors = validateConfig(cfg);
          return (
            <div key={`${cfg.provider}-keys`} className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">{providerLabel(cfg.provider)}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  label="API Key"
                  value={cfg.apiKey ?? ''}
                  onChange={(e) => updateField(cfg.provider, 'apiKey', e.target.value)}
                />
                <Input
                  label="API Secret"
                  value={cfg.apiSecret ?? ''}
                  onChange={(e) => updateField(cfg.provider, 'apiSecret', e.target.value)}
                />
                <Input
                  label="Callback URL"
                  value={cfg.callbackUrl ?? ''}
                  onChange={(e) => updateField(cfg.provider, 'callbackUrl', e.target.value)}
                  error={cfg.callbackUrl && !isValidUrl(cfg.callbackUrl) ? 'URL invalide' : undefined}
                />
              </div>
              {errors.length > 0 && (
                <p className="text-xs text-red-600 mt-1">{errors.join(' • ')}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={resetToDefaults}>Réinitialiser</Button>
        <Button onClick={saveAll} disabled={isSaving}>
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
}