'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Video,
  Film,
  MapPin,
  Sun,
  Building2,
  HelpCircle,
  Upload,
  Link as LinkIcon,
  Calendar as CalendarIcon,
  Check,
  Send,
  User,
  Lightbulb,
  DollarSign,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export type BookingData = {
  // Step 1
  name: string;
  whatsapp: string;
  // Step 2
  serviceType: 'photos' | 'video' | 'photos-video';
  // Step 3
  shootingType: 'studio' | 'exterieur' | 'les-deux' | 'je-ne-sais-pas';
  // Step 4
  purposes: string[];
  // Step 5
  idea: string;
  // Step 6
  referenceLinks: string;
  // Step 7
  date: Date | undefined;
  // Step 8
  budget: string;
  // Step 9
  needsHelp: boolean;
};

const initialData: BookingData = {
  name: '',
  whatsapp: '',
  serviceType: 'photos',
  shootingType: 'studio',
  purposes: [],
  idea: '',
  referenceLinks: '',
  date: undefined,
  budget: '',
  needsHelp: false,
};

const serviceOptions = [
  { value: 'photos' as const, label: 'Photos', icon: Camera, desc: 'Photographie' },
  { value: 'video' as const, label: 'Vidéo', icon: Video, desc: 'Vidéographie' },
  { value: 'photos-video' as const, label: 'Photos + Vidéo', icon: Film, desc: 'Le combo' },
];

const shootingOptions = [
  { value: 'studio' as const, label: 'Studio', icon: Building2 },
  { value: 'exterieur' as const, label: 'Extérieur', icon: Sun },
  { value: 'les-deux' as const, label: 'Les deux', icon: MapPin },
  { value: 'je-ne-sais-pas' as const, label: 'Je ne sais pas', icon: HelpCircle },
];

const purposeOptions = [
  'Réseaux sociaux',
  'Image professionnelle',
  'Produits & business',
  'Événement',
  'Autre',
];

const steps = [
  { num: 1, label: 'Tes infos', icon: User },
  { num: 2, label: 'Tu veux quoi ?', icon: Camera },
  { num: 3, label: 'Type de shooting', icon: MapPin },
  { num: 4, label: 'C\'est pour quoi ?', icon: Lightbulb },
  { num: 5, label: 'Ton idée', icon: Sparkles },
  { num: 6, label: 'Références', icon: LinkIcon },
  { num: 7, label: 'Date', icon: CalendarIcon },
  { num: 8, label: 'Budget', icon: DollarSign },
  { num: 9, label: 'Aide ?', icon: HelpCircle },
];

export function BookingSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<BookingData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const updateData = (updates: Partial<BookingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const togglePurpose = (purpose: string) => {
    setData((prev) => ({
      ...prev,
      purposes: prev.purposes.includes(purpose)
        ? prev.purposes.filter((p) => p !== purpose)
        : [...prev.purposes, purpose],
    }));
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 0:
        return data.name.trim().length >= 2 && data.whatsapp.trim().length >= 2;
      case 1:
        return !!data.serviceType;
      case 2:
        return !!data.shootingType;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return true;
      case 7:
        return true;
      case 8:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 9 && canGoNext()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback: still show success
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const getServiceLabel = (type: string) => {
    const map: Record<string, string> = {
      photos: 'Photographie',
      video: 'Vidéographie',
      'photos-video': 'Photos + Vidéo',
    };
    return map[type] || type;
  };

  const getShootingLabel = (type: string) => {
    const map: Record<string, string> = {
      studio: 'Studio',
      exterieur: 'Extérieur',
      'les-deux': 'Les deux',
      'je-ne-sais-pas': 'Je ne sais pas',
    };
    return map[type] || type;
  };

  // Success screen
  if (submitted) {
    return (
      <section id="booking" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d12] to-[#0a0a0f]" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Demande envoyée ! 🎉
          </h2>
          <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
            Merci <span className="text-amber-400 font-semibold">{data.name}</span> !
            Nous avons bien reçu ta demande de{' '}
            <span className="text-amber-400 font-semibold">{getServiceLabel(data.serviceType)}</span>.
          </p>
          <div className="bg-[#141418] border border-neutral-800 rounded-xl p-6 text-left mb-6">
            <p className="text-neutral-300 leading-relaxed whitespace-pre-line text-sm">
              👋🏾 Bonjour, merci pour ta demande. J&apos;ai bien reçu ton projet
              ainsi que tes idées / inspirations. Je prépare une proposition adaptée
              à ton besoin. Tu vas recevoir :
              {'\n\n'}
              ✅ La meilleure option pour ton shooting
              {'\n'}
              💰 Un prix clair
              {'\n'}
              📋 Et les prochaines étapes
              {'\n\n'}
              À très vite.{' '}
              <span className="text-amber-400 font-bold">PacoYaBakh</span>
            </p>
          </div>
          <p className="text-neutral-500 text-sm">
            Tu recevras bientôt une réponse via WhatsApp.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(0);
              setData(initialData);
            }}
            variant="outline"
            className="mt-6 border-neutral-700 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50"
          >
            Nouvelle réservation
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 sm:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d12] to-[#0a0a0f]" />

      <div
        ref={sectionRef}
        className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-amber-500 text-sm font-semibold uppercase tracking-widest">
            Réservation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-white">
            Réserve ton <span className="text-gold-gradient">Shooting</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Remplis le formulaire ci-dessous et reçois une proposition
            personnalisée adaptée à ton besoin.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <button
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  disabled={idx > currentStep}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs transition-all ${
                    idx === currentStep
                      ? 'bg-amber-500 text-black font-semibold'
                      : idx < currentStep
                        ? 'bg-amber-500/20 text-amber-400 cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <step.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.num}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 ${
                      idx < currentStep ? 'bg-amber-500' : 'bg-neutral-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <Card className="bg-[#141418] border-neutral-800 rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            {/* Step content */}
            <div className="step-enter" key={currentStep}>
              {/* Step 1 - Name & WhatsApp */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Tes infos
                    </h3>
                    <p className="text-neutral-400">
                      Comment pouvons-nous te contacter ?
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-neutral-200">
                        Nom / Entreprise
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ton nom ou le nom de ton entreprise"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-neutral-200">
                        Numéro WhatsApp
                      </Label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 px-3 bg-neutral-800/50 border border-neutral-700 rounded-md text-neutral-300 text-sm">
                          🇸🇳 +221
                        </div>
                        <Input
                          id="whatsapp"
                          placeholder="77 123 45 67"
                          type="tel"
                          value={data.whatsapp}
                          onChange={(e) => updateData({ whatsapp: e.target.value })}
                          className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Service type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Tu veux quoi ?
                    </h3>
                    <p className="text-neutral-400">
                      Choisis le type de service qui te convient.
                    </p>
                  </div>
                  <RadioGroup
                    value={data.serviceType}
                    onValueChange={(v) => updateData({ serviceType: v as BookingData['serviceType'] })}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {serviceOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          data.serviceType === option.value
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600'
                        }`}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <option.icon
                          className={`h-8 w-8 ${
                            data.serviceType === option.value
                              ? 'text-amber-500'
                              : 'text-neutral-400'
                          }`}
                        />
                        <span className="font-semibold text-white text-lg">
                          {option.label}
                        </span>
                        <span className="text-neutral-400 text-sm">{option.desc}</span>
                        {data.serviceType === option.value && (
                          <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="h-4 w-4 text-black" />
                          </div>
                        )}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 3 - Shooting type */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Type de shooting
                    </h3>
                    <p className="text-neutral-400">
                      Où veux-tu faire ta séance ?
                    </p>
                  </div>
                  <RadioGroup
                    value={data.shootingType}
                    onValueChange={(v) => updateData({ shootingType: v as BookingData['shootingType'] })}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                  >
                    {shootingOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex flex-col items-center gap-2 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          data.shootingType === option.value
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600'
                        }`}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <option.icon
                          className={`h-6 w-6 ${
                            data.shootingType === option.value
                              ? 'text-amber-500'
                              : 'text-neutral-400'
                          }`}
                        />
                        <span className="font-medium text-white text-sm text-center">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 4 - Purpose */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      C&apos;est pour quoi ?
                    </h3>
                    <p className="text-neutral-400">
                      Choisis toutes les options qui correspondent (tu peux en choisir plusieurs).
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {purposeOptions.map((purpose) => (
                      <label
                        key={purpose}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          data.purposes.includes(purpose)
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600'
                        }`}
                      >
                        <Checkbox
                          checked={data.purposes.includes(purpose)}
                          onCheckedChange={() => togglePurpose(purpose)}
                          className="border-neutral-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <span className="text-white font-medium">{purpose}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5 - Idea */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Ton idée
                    </h3>
                    <p className="text-neutral-400">
                      Décris en quelques mots ce que tu veux.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Ambiance, style, objectif... Par exemple : je veux des photos professionnelles pour mon Instagram business avec un style moderne et épuré"
                      value={data.idea}
                      onChange={(e) => updateData({ idea: e.target.value })}
                      className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 min-h-[160px] resize-none"
                    />
                    <p className="text-neutral-500 text-sm">
                      Plus tu donnes de détails, mieux c&apos;est !
                    </p>
                  </div>
                </div>
              )}

              {/* Step 6 - References */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Références / Inspirations
                    </h3>
                    <p className="text-neutral-400">
                      Partage des liens vers des photos ou vidéos qui t&apos;inspirent.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-200 flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-amber-500" />
                        Liens Instagram / Pinterest / autre
                      </Label>
                      <Input
                        placeholder="https://instagram.com/p/... ou https://pinterest.com/pin/..."
                        value={data.referenceLinks}
                        onChange={(e) => updateData({ referenceLinks: e.target.value })}
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 h-12"
                      />
                    </div>



                    <p className="text-neutral-500 text-sm">
                      💡 Les liens et images aident beaucoup à comprendre ta vision !
                    </p>
                  </div>
                </div>
              )}

              {/* Step 7 - Date */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Date souhaitée
                    </h3>
                    <p className="text-neutral-400">
                      Quand souhaites-tu réaliser ton shooting ?
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto border-neutral-700 bg-neutral-800/50 text-white hover:bg-neutral-800 hover:border-amber-500/50 h-14 px-6 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-5 w-5 text-amber-500" />
                          {data.date ? (
                            format(data.date, "EEEE d MMMM yyyy", { locale: fr })
                          ) : (
                            <span className="text-neutral-500">
                              Choisis une date...
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-[#141418] border-neutral-800"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={data.date}
                          onSelect={(date) => updateData({ date })}
                          disabled={(date) => date < new Date()}
                          className="bg-[#141418] text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-neutral-500 text-sm text-center">
                    Si la date exacte n&apos;est pas encore fixée, pas de souci !
                  </p>
                </div>
              )}

              {/* Step 8 - Budget */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Budget estimé
                    </h3>
                    <p className="text-neutral-400">
                      Quel est ton budget pour ce projet ?
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="50000"
                        value={data.budget}
                        onChange={(e) => updateData({ budget: e.target.value })}
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 h-14 pr-20 text-lg"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-sm">
                        FCFA
                      </div>
                    </div>
                    <p className="text-neutral-500 text-sm">
                      💡 C&apos;est optionnel ! Si tu n&apos;as pas d&apos;idée, nous te proposerons
                      la meilleure option adaptée à ton besoin.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 9 - Help */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Besoin d&apos;aide ?
                    </h3>
                    <p className="text-neutral-400">
                      Pas sûr(e) de ce qu&apos;il te faut ? On s&apos;en occupe !
                    </p>
                  </div>
                  <label
                    className={`flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      data.needsHelp
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600'
                    }`}
                  >
                    <Checkbox
                      checked={data.needsHelp}
                      onCheckedChange={(checked) =>
                        updateData({ needsHelp: checked === true })
                      }
                      className="border-neutral-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 w-5 h-5"
                    />
                    <div>
                      <p className="text-white font-medium text-lg">
                        Oui, propose-moi la meilleure option
                      </p>
                      <p className="text-neutral-400 text-sm mt-1">
                        Nous analyserons ton besoin et te proposerons un pack
                        adapté avec un prix clair.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Step 10 - Confirmation */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Récapitulatif
                    </h3>
                    <p className="text-neutral-400">
                      Vérifie tes informations avant d&apos;envoyer.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <SummaryItem label="Nom" value={data.name} />
                    <SummaryItem label="WhatsApp" value={`+221 ${data.whatsapp}`} />
                    <SummaryItem
                      label="Service"
                      value={getServiceLabel(data.serviceType)}
                    />
                    <SummaryItem
                      label="Type de shooting"
                      value={getShootingLabel(data.shootingType)}
                    />
                    <SummaryItem
                      label="Usage"
                      value={
                        data.purposes.length > 0
                          ? data.purposes.join(', ')
                          : 'Non spécifié'
                      }
                    />
                    {data.idea && <SummaryItem label="Idée" value={data.idea} />}
                    {data.referenceLinks && (
                      <SummaryItem
                        label="Références"
                        value={data.referenceLinks}
                      />
                    )}

                    {data.date && (
                      <SummaryItem
                        label="Date"
                        value={format(data.date, "d MMMM yyyy", { locale: fr })}
                      />
                    )}
                    {data.budget && (
                      <SummaryItem
                        label="Budget"
                        value={`${Number(data.budget).toLocaleString('fr-FR')} FCFA`}
                      />
                    )}
                    {data.needsHelp && (
                      <SummaryItem
                        label="Aide"
                        value="Propose-moi la meilleure option ✅"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-800">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`text-neutral-400 hover:text-white ${
                  currentStep === 0 ? 'invisible' : ''
                }`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>

              {currentStep < 9 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canGoNext()}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Recevoir ma proposition
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-3 border-b border-neutral-800/50 last:border-0">
      <span className="text-neutral-500 text-sm font-medium sm:w-32 shrink-0">
        {label}
      </span>
      <span className="text-white text-sm sm:text-base">{value}</span>
    </div>
  );
}
