import React, { useState, useEffect } from 'react';
import {
  SHOPPING_CATEGORIES,
  WHITEFIELD_LOCALITIES,
  EarlyAccessFormData,
  UTMParams,
  ShoppingPreference,
} from '../../types';
import { validateEarlyAccessForm } from '../../lib/validation';
import { Loader2, CheckCircle2, MapPin, Phone, User, Mail } from 'lucide-react';

interface EarlyAccessFormProps {
  utmParams: UTMParams;
  onSuccess: (data: { name: string; phone: string; isDuplicate?: boolean }) => void;
}

export const EarlyAccessForm: React.FC<EarlyAccessFormProps> = ({
  utmParams,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<EarlyAccessFormData>({
    name: '',
    email: '',
    phone: '',
    area: '',
    shoppingPreferences: [],
    whatsappConsent: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Validate on change when field is touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validation = validateEarlyAccessForm(formData);
      setErrors(validation.errors);
    }
  }, [formData, touched]);

  const handleBlur = (field: keyof EarlyAccessFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateEarlyAccessForm(formData);
    setErrors(validation.errors);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: cleaned }));
    setServerError(null);
  };

  const toggleCategory = (catId: ShoppingPreference) => {
    setFormData((prev) => {
      let current = [...prev.shoppingPreferences];

      if (catId === 'All of them') {
        if (current.includes('All of them')) {
          return { ...prev, shoppingPreferences: [] };
        } else {
          return {
            ...prev,
            shoppingPreferences: ['Groceries', 'Fruits & Vegetables', 'Fresh Meat', 'All of them'],
          };
        }
      }

      if (current.includes(catId)) {
        current = current.filter((id) => id !== catId && id !== 'All of them');
      } else {
        current.push(catId);
        const allIndividual = ['Groceries', 'Fruits & Vegetables', 'Fresh Meat'];
        const hasAllIndividual = allIndividual.every((c) => current.includes(c));
        if (hasAllIndividual && !current.includes('All of them')) {
          current.push('All of them');
        }
      }
      return { ...prev, shoppingPreferences: current };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    setTouched({ name: true, email: true, phone: true, area: true });
    setServerError(null);

    const validation = validateEarlyAccessForm(formData);
    if (!validation.isValid || !validation.normalizedData) {
      setErrors(validation.errors);
      const firstErrorField = Object.keys(validation.errors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const trimmedName = validation.normalizedData.name;
    const cleanEmail = validation.normalizedData.email;
    const tenDigitPhone = validation.normalizedData.normalizedPhone;
    const trimmedArea = validation.normalizedData.area;
    const selectedPreferences = validation.normalizedData.shoppingPreferences;
    const whatsappConsent = Boolean(formData.whatsappConsent);

    const utmSource = utmParams.utm_source?.trim() || null;
    const utmMedium = utmParams.utm_medium?.trim() || null;
    const utmCampaign = utmParams.utm_campaign?.trim() || null;
    const utmContent = utmParams.utm_content?.trim() || null;

    try {
      const apiResponse = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: cleanEmail || null,
          phone: tenDigitPhone,
          area: trimmedArea,
          shoppingPreferences: selectedPreferences,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm: utmParams.utm_term?.trim() || null,
          whatsappConsent,
        }),
      });

      const result = await apiResponse.json().catch(() => null);

      if (apiResponse.ok && result?.success) {
        onSuccess({
          name: trimmedName,
          phone: tenDigitPhone,
          isDuplicate: Boolean(result.isDuplicate),
        });
        return;
      }

      setServerError(
        result?.error || 'Unable to submit your registration. Please check your details and try again.'
      );
    } catch (err) {
      console.error('[Namma Stores submission exception]:', err);
      setServerError('Connection issue. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="early-access-form-section"
      className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-7 md:p-9 relative overflow-hidden"
    >
      <div className="mb-5 sm:mb-6">
        <h2
          id="form-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]"
        >
          Join Namma Stores Early Access
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-1.5 leading-relaxed">
          Be among the first to know when Namma Stores launches in Whitefield.
        </p>
      </div>

      {serverError && (
        <div
          id="server-error-alert"
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
        >
          <span className="shrink-0 text-base">⚠️</span>
          <div className="flex-1 font-medium">{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
        {/* Field 1: Name */}
        <div id="field-name">
          <label
            htmlFor="input-name"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            NAME <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="input-name"
              type="text"
              name="name"
              autoComplete="name"
              required
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                setServerError(null);
              }}
              onBlur={() => handleBlur('name')}
              className={`w-full pl-10 pr-4 py-3 sm:py-3.5 text-base rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                touched.name && errors.name
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            />
          </div>
          {touched.name && errors.name && (
            <p
              className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              id="error-name"
            >
              <span>•</span> {errors.name}
            </p>
          )}
        </div>

        {/* Field 2: Email */}
        <div id="field-email">
          <label
            htmlFor="input-email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            EMAIL <span className="text-slate-400 font-medium">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="input-email"
              type="email"
              inputMode="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                setServerError(null);
              }}
              onBlur={() => handleBlur('email')}
              className={`w-full pl-10 pr-4 py-3 sm:py-3.5 text-base rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                touched.email && errors.email
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p
              className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              id="error-email"
            >
              <span>•</span> {errors.email}
            </p>
          )}
        </div>

        {/* Field 3: Mobile Number */}
        <div id="field-phone">
          <label
            htmlFor="input-phone"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            MOBILE NUMBER <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex rounded-xl shadow-xs">
            <div className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-semibold text-sm select-none">
              <span className="mr-1.5">🇮🇳</span> +91
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="input-phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                name="phone"
                autoComplete="tel-national"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full pl-9 pr-4 py-3 sm:py-3.5 text-base rounded-r-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                  touched.phone && errors.phone
                    ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>
          {touched.phone && errors.phone && (
            <p
              className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              id="error-phone"
            >
              <span>•</span> {errors.phone}
            </p>
          )}
        </div>

        {/* Field 4: Area / Locality */}
        <div id="field-area">
          <label
            htmlFor="input-area"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            AREA / LOCALITY <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              id="input-area"
              type="text"
              name="area"
              required
              placeholder="e.g. ITPL, ECC Road, Kundalahalli..."
              value={formData.area}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, area: e.target.value }));
                setServerError(null);
              }}
              onBlur={() => handleBlur('area')}
              className={`w-full pl-10 pr-4 py-3 sm:py-3.5 text-base rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                touched.area && errors.area
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            />
          </div>

          {/* Quick Locality selection chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[11px] text-slate-500 self-center mr-1">Popular in Whitefield:</span>
            {WHITEFIELD_LOCALITIES.slice(0, 4).map((loc) => (
              <button
                key={loc}
                type="button"
                id={`chip-${loc.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, area: loc }));
                  setTouched((prev) => ({ ...prev, area: true }));
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                  formData.area === loc
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border-slate-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {touched.area && errors.area && (
            <p
              className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1"
              id="error-area"
            >
              <span>•</span> {errors.area}
            </p>
          )}
        </div>

        {/* Field 5: Shopping Preferences (Optional) */}
        <div id="field-preferences" className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              WHAT WOULD YOU SHOP FOR?
            </label>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SHOPPING_CATEGORIES.map((cat) => {
              const isSelected = formData.shoppingPreferences.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  id={`pref-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm font-medium transition-all select-none cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-lg shrink-0">{cat.icon}</span>
                  <span className="flex-1 truncate text-xs sm:text-sm font-semibold">{cat.label}</span>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Consent Checkbox & Privacy */}
        <div className="pt-2 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              id="checkbox-whatsapp-consent"
              checked={formData.whatsappConsent}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, whatsappConsent: e.target.checked }))
              }
              className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-relaxed font-medium">
              Send me Namma Stores launch updates and exclusive early-access offers on WhatsApp.
            </span>
          </label>
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-join-early-access"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl sm:rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white font-extrabold text-base sm:text-lg tracking-wide uppercase shadow-lg shadow-emerald-700/25 hover:shadow-emerald-700/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>JOINING EARLY ACCESS...</span>
              </>
            ) : (
              <>
                <span>JOIN EARLY ACCESS →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
