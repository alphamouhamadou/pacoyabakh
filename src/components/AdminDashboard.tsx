'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  X,
  LogOut,
  Lock,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Search,
  ChevronDown,
  Eye,
  Check,
  MessageSquare,
  Trash2,
  Send,
  Save,
  Loader2,
  Calendar,
  Phone,
  Camera,
  Video,
  Film,
  DollarSign,
  Lightbulb,
  MapPin,
  Building2,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowUpDown,
  FileText,
  Package,
  Image as ImageIcon,
  Timer,
  CalendarCheck,
  Eye as EyeIcon,
  Truck,
  ClipboardCheck,
  GalleryHorizontalEnd,
  Upload,
  Pencil,
  EyeOff,
} from 'lucide-react';

const ADMIN_PASSWORD = 'pacobakh-admin';
const ADMIN_KEY = 'pacobakh-admin-2024';
const STORAGE_KEY = 'pacobakh-admin-auth';

interface Booking {
  id: string;
  name: string;
  whatsapp: string;
  serviceType: string;
  shootingType: string;
  purposes: string;
  idea: string | null;
  referenceLinks: string | null;
  bookingDate: string | null;
  budget: string | null;
  needsHelp: boolean;
  status: string;
  proposalText: string | null;
  proposalPrice: string | null;
  proposalDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

type StatusType =
  | 'nouveau'
  | 'en-cours'
  | 'propose'
  | 'confirme'
  | 'termine'
  | 'annule';

const statusConfig: Record<
  StatusType,
  { label: string; color: string; bgClass: string; icon: React.ElementType }
> = {
  nouveau: {
    label: 'Nouveau',
    color: 'text-neutral-300',
    bgClass: 'bg-neutral-700/50 border-neutral-600',
    icon: Clock,
  },
  'en-cours': {
    label: 'En cours',
    color: 'text-teal-300',
    bgClass: 'bg-teal-900/30 border-teal-700/50',
    icon: AlertCircle,
  },
  propose: {
    label: 'Proposé',
    color: 'text-amber-300',
    bgClass: 'bg-amber-900/30 border-amber-700/50',
    icon: Send,
  },
  confirme: {
    label: 'Confirmé',
    color: 'text-green-300',
    bgClass: 'bg-green-900/30 border-green-700/50',
    icon: CheckCircle2,
  },
  termine: {
    label: 'Terminé',
    color: 'text-emerald-300',
    bgClass: 'bg-emerald-900/30 border-emerald-700/50',
    icon: CheckCircle2,
  },
  annule: {
    label: 'Annulé',
    color: 'text-red-300',
    bgClass: 'bg-red-900/30 border-red-700/50',
    icon: XCircle,
  },
};

const serviceLabels: Record<string, string> = {
  photos: 'Photographie',
  video: 'Vidéographie',
  'photos-video': 'Photos + Vidéo',
};

const shootingLabels: Record<string, string> = {
  studio: 'Studio',
  exterieur: 'Extérieur',
  'les-deux': 'Les deux',
  'je-ne-sais-pas': 'Je ne sais pas',
};

interface PortfolioPhoto {
  id: string;
  title: string | null;
  description: string | null;
  category: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const photoCategories = [
  { value: 'studio', label: 'Studio', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'exterieur', label: 'Extérieur', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'evenement', label: 'Événement', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'produit', label: 'Produit', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
];

const photoCategoryBadge: Record<string, string> = {
  studio: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  exterieur: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  evenement: 'bg-red-500/20 text-red-300 border-red-500/30',
  produit: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

export function AdminDashboard({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Proposal editing
  const [proposalText, setProposalText] = useState('');
  const [proposalPrice, setProposalPrice] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<string>('');

  // Detailed proposal form state
  const [proposalPack, setProposalPack] = useState('essentiel');
  const [proposalDuration, setProposalDuration] = useState('');
  const [proposalLocation, setProposalLocation] = useState('');
  const [proposalNbPhotos, setProposalNbPhotos] = useState('');
  const [proposalNbVideos, setProposalNbVideos] = useState('');
  const [proposalRetouches, setProposalRetouches] = useState(true);
  const [proposalDelivery, setProposalDelivery] = useState('');
  const [proposalIncludes, setProposalIncludes] = useState<string[]>(['Photos retouchées en haute qualité']);
  const [proposalConditions, setProposalConditions] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Gallery state
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('studio');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editPhotoDialog, setEditPhotoDialog] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PortfolioPhoto | null>(null);
  const [editPhotoTitle, setEditPhotoTitle] = useState('');
  const [editPhotoDescription, setEditPhotoDescription] = useState('');
  const [editPhotoCategory, setEditPhotoCategory] = useState('');
  const [editPhotoActive, setEditPhotoActive] = useState(true);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [deletePhotoDialog, setDeletePhotoDialog] = useState(false);
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check localStorage for existing auth on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch bookings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchPhotos();
    }
  }, [isAuthenticated]);

  const fetchPhotos = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const res = await fetch('/api/photos', {
        headers: { 'admin-key': ADMIN_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      } else {
        toast.error('Erreur lors du chargement des photos');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Type de fichier non autorisé (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 10 Mo)');
      return;
    }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadCategory('studio');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Sélectionnez un fichier');
      return;
    }
    setUploading(true);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle);
      formData.append('description', uploadDescription);
      formData.append('category', uploadCategory);

      setUploadProgress(30);

      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'admin-key': ADMIN_KEY },
        body: formData,
      });

      setUploadProgress(90);

      if (res.ok) {
        toast.success('Photo ajoutée avec succès');
        resetUploadForm();
        fetchPhotos();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erreur lors de l\'upload');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const openEditPhotoDialog = (photo: PortfolioPhoto) => {
    setEditingPhoto(photo);
    setEditPhotoTitle(photo.title || '');
    setEditPhotoDescription(photo.description || '');
    setEditPhotoCategory(photo.category);
    setEditPhotoActive(photo.active);
    setEditPhotoDialog(true);
  };

  const handleSavePhoto = async () => {
    if (!editingPhoto) return;
    setSavingPhoto(true);
    try {
      const res = await fetch(`/api/photos/${editingPhoto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'admin-key': ADMIN_KEY,
        },
        body: JSON.stringify({
          title: editPhotoTitle,
          description: editPhotoDescription,
          category: editPhotoCategory,
          active: editPhotoActive,
        }),
      });
      if (res.ok) {
        toast.success('Photo mise à jour');
        setEditPhotoDialog(false);
        fetchPhotos();
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleTogglePhotoActive = async (photo: PortfolioPhoto) => {
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'admin-key': ADMIN_KEY,
        },
        body: JSON.stringify({ active: !photo.active }),
      });
      if (res.ok) {
        toast.success(photo.active ? 'Photo masquée' : 'Photo affichée');
        fetchPhotos();
      } else {
        toast.error('Erreur');
      }
    } catch {
      toast.error('Erreur de connexion');
    }
  };

  const handleDeletePhoto = async () => {
    if (!deletePhotoId) return;
    try {
      const res = await fetch(`/api/photos/${deletePhotoId}`, {
        method: 'DELETE',
        headers: { 'admin-key': ADMIN_KEY },
      });
      if (res.ok) {
        toast.success('Photo supprimée');
        setDeletePhotoDialog(false);
        setDeletePhotoId(null);
        fetchPhotos();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch {
      toast.error('Erreur de connexion');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'admin-key': ADMIN_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        toast.error('Erreur lors du chargement des réservations');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    // Simulate a slight delay for UX
    await new Promise((r) => setTimeout(r, 500));
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      setPassword('');
      toast.success('Connexion réussie');
    } else {
      toast.error('Mot de passe incorrect');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
    setActiveTab('dashboard');
    onClose();
  };

  const openBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || '');
    setProposalText(booking.proposalText || '');
    setProposalPrice(booking.proposalPrice || '');
    setDetailOpen(true);
  };

  const handleSaveBooking = async () => {
    if (!selectedBooking) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'admin-key': ADMIN_KEY,
        },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes,
          proposalText: buildProposalMessage() || null,
          proposalPrice: proposalPrice || null,
          proposalDate: buildProposalMessage() ? new Date().toISOString() : null,
        }),
      });
      if (res.ok) {
        toast.success('Réservation mise à jour');
        fetchBookings();
        // Update selected booking
        const updated = await res.json();
        setSelectedBooking(updated);
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/bookings/${deleteId}`, {
        method: 'DELETE',
        headers: { 'admin-key': ADMIN_KEY },
      });
      if (res.ok) {
        toast.success('Réservation supprimée');
        setDeleteDialogOpen(false);
        setDeleteId(null);
        setDetailOpen(false);
        fetchBookings();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch {
      toast.error('Erreur de connexion');
    }
  };

  const openWhatsApp = (phone: string, message?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = message
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${cleanPhone}`;
    window.open(url, '_blank');
  };

  const proposalIncludesOptions = [
    'Photos retouchées en haute qualité',
    'Vidéos montées et colorées',
    'Séance en studio',
    'Séance en extérieur',
    'Maquillage inclus',
    'Changement de tenue',
    'Galerie privée en ligne',
    'Fichiers sources (RAW)',
    'Livraison par USB',
    'Séance express (1h)',
  ];

  const toggleProposalInclude = (item: string) => {
    setProposalIncludes((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const buildProposalMessage = () => {
    if (!selectedBooking) return '';

    const packLabel = proposalPack === 'essentiel' ? '📋 Pack Essentiel'
      : proposalPack === 'premium' ? '⭐ Pack Premium'
      : '👑 Pack VIP';

    const serviceLabel = serviceLabels[selectedBooking.serviceType] || selectedBooking.serviceType;

    let msg = `Bonjour ${selectedBooking.name} 👋🏾\n\n`;
    msg += `Merci pour ta demande de *${serviceLabel}*.\n\n`;
    msg += `Voici notre proposition :\n\n`;
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `📸 *PROPOSITION DE SHOOTING*\n`;
    msg += `━━━━━━━━━━━━━━━\n\n`;
    msg += `${packLabel}\n\n`;

    if (proposalDuration) {
      msg += `⏱️ *Durée* : ${proposalDuration}\n`;
    }
    if (proposalLocation) {
      msg += `📍 *Lieu* : ${proposalLocation}\n`;
    }
    if (proposalNbPhotos) {
      msg += `🖼️ *Nombre de photos* : ${proposalNbPhotos}\n`;
    }
    if (proposalNbVideos) {
      msg += `🎥 *Nombre de vidéos* : ${proposalNbVideos}\n`;
    }
    if (proposalRetouches) {
      msg += `✨ *Retouches* : Incluses\n`;
    }
    if (proposalDelivery) {
      msg += `📅 *Délai de livraison* : ${proposalDelivery}\n`;
    }

    msg += `\n`;
    msg += `📦 *Ce qui est inclus* :\n`;
    if (proposalIncludes.length > 0) {
      proposalIncludes.forEach((item) => {
        msg += `   ✅ ${item}\n`;
      });
    } else {
      msg += `   À définir\n`;
    }

    if (proposalPrice) {
      msg += `\n`;
      msg += `💰 *Prix* : ${Number(proposalPrice).toLocaleString('fr-FR')} FCFA\n`;
    }

    if (proposalText) {
      msg += `\n`;
      msg += `💬 *Note* : ${proposalText}\n`;
    }

    if (proposalConditions) {
      msg += `\n`;
      msg += `📋 *Conditions* : ${proposalConditions}\n`;
    }

    msg += `\n━━━━━━━━━━━━━━━\n\n`;
    msg += `Tu peux nous répondre directement ici pour confirmer ou poser tes questions. 🙏🏾\n\n`;
    msg += `— *PacoYaBakh* 📸`;

    return msg;
  };

  const generateWhatsAppProposal = () => {
    if (!selectedBooking) return;
    const msg = buildProposalMessage();
    openWhatsApp(selectedBooking.whatsapp, msg);
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.whatsapp.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  // Stats
  const totalBookings = bookings.length;
  const newBookings = bookings.filter((b) => b.status === 'nouveau').length;
  const proposedBookings = bookings.filter(
    (b) => b.status === 'propose'
  ).length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === 'confirme'
  ).length;
  const estimatedRevenue = bookings
    .filter((b) => b.status === 'confirme' && b.proposalPrice)
    .reduce((sum, b) => sum + Number(b.proposalPrice || 0), 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const parsePurposes = (purposesStr: string): string[] => {
    try {
      const parsed = JSON.parse(purposesStr);
      return Array.isArray(parsed) ? parsed : [purposesStr];
    } catch {
      return purposesStr ? [purposesStr] : [];
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as StatusType] || statusConfig.nouveau;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgClass} ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'photos':
        return Camera;
      case 'video':
        return Video;
      case 'photos-video':
        return Film;
      default:
        return Camera;
    }
  };

  // =================== LOGIN SCREEN ===================
  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-[#141418] border-neutral-800 text-white p-0 overflow-hidden">
          <DialogTitle className="sr-only">Administration PacoYaBakh</DialogTitle>
          <DialogDescription className="sr-only">Connexion au tableau de bord administrateur</DialogDescription>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Administration
              </h2>
              <p className="text-neutral-400 text-sm">
                Connectez-vous pour accéder au tableau de bord
              </p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Mot de passe administrateur"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 h-12"
                autoFocus
              />
              <Button
                onClick={handleLogin}
                disabled={loginLoading || !password}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold h-12"
              >
                {loginLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Se connecter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // =================== ADMIN DASHBOARD ===================
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw] h-[90vh] sm:h-[85vh] bg-[#111115] border-neutral-800 text-white p-0 !flex !flex-col !overflow-hidden">
        <DialogTitle className="sr-only">PACOYABAKH Admin - Tableau de bord</DialogTitle>
        <DialogDescription className="sr-only">Gestion des réservations et propositions</DialogDescription>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-white">
              <span className="text-amber-500">PACO</span>
              <span className="text-neutral-300">YABAKH</span>
              <span className="text-neutral-500 text-sm font-normal ml-2">
                Admin
              </span>
            </h1>
            {newBookings > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
                {newBookings} nouveau{newBookings > 1 ? 'x' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchBookings}
              className="text-neutral-400 hover:text-white"
              title="Actualiser"
            >
              <Loader2
                className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-neutral-400 hover:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Desktop */}
          <div className="hidden md:flex flex-col w-56 border-r border-neutral-800 py-4 px-3 shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'bookings'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Réservations
                {totalBookings > 0 && (
                  <span className="ml-auto text-xs text-neutral-500">
                    {totalBookings}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <GalleryHorizontalEnd className="h-4 w-4" />
                Galerie
                {photos.length > 0 && (
                  <span className="ml-auto text-xs text-neutral-500">
                    {photos.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </button>
            </nav>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Mobile tabs */}
            <div className="md:hidden border-b border-neutral-800 px-4 pt-3 shrink-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-neutral-800/50 w-full h-10">
                  <TabsTrigger
                    value="dashboard"
                    className="flex-1 text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
                    Bord
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="flex-1 text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                  >
                    <ClipboardList className="h-3.5 w-3.5 mr-1" />
                    Réserv.
                  </TabsTrigger>
                  <TabsTrigger
                    value="gallery"
                    className="flex-1 text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                  >
                    <GalleryHorizontalEnd className="h-3.5 w-3.5 mr-1" />
                    Galerie
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex-1 text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Config
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 sm:p-6">
                {/* ========== DASHBOARD TAB ========== */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Tableau de bord
                      </h2>
                      <p className="text-neutral-500 text-sm">
                        Vue d&apos;ensemble de vos réservations
                      </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                      <Card className="bg-[#1a1a20] border-neutral-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ClipboardList className="h-4 w-4 text-neutral-400" />
                            <span className="text-neutral-500 text-xs uppercase tracking-wider">
                              Total
                            </span>
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-white">
                            {totalBookings}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a20] border-neutral-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-neutral-400" />
                            <span className="text-neutral-500 text-xs uppercase tracking-wider">
                              Nouvelles
                            </span>
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-neutral-300">
                            {newBookings}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a20] border-neutral-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Send className="h-4 w-4 text-amber-500" />
                            <span className="text-neutral-500 text-xs uppercase tracking-wider">
                              Propositions
                            </span>
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                            {proposedBookings}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a20] border-neutral-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-neutral-500 text-xs uppercase tracking-wider">
                              Confirmées
                            </span>
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-green-400">
                            {confirmedBookings}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a20] border-neutral-800 col-span-2 lg:col-span-1">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-amber-500" />
                            <span className="text-neutral-500 text-xs uppercase tracking-wider">
                              Revenu estimé
                            </span>
                          </div>
                          <p className="text-lg sm:text-2xl font-bold text-amber-400">
                            {estimatedRevenue.toLocaleString('fr-FR')}{' '}
                            <span className="text-sm font-normal text-neutral-500">
                              FCFA
                            </span>
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent bookings */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Réservations récentes
                      </h3>
                      {bookings.length === 0 ? (
                        <div className="bg-[#1a1a20] border border-neutral-800 rounded-xl p-8 text-center">
                          <ClipboardList className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                          <p className="text-neutral-400">
                            Aucune réservation pour le moment
                          </p>
                          <p className="text-neutral-600 text-sm mt-1">
                            Les nouvelles demandes apparaîtront ici
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {bookings.slice(0, 5).map((booking) => {
                            const ServiceIcon = getServiceIcon(
                              booking.serviceType
                            );
                            return (
                              <button
                                key={booking.id}
                                onClick={() => openBookingDetail(booking)}
                                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#1a1a20] border border-neutral-800 rounded-xl hover:border-amber-500/30 transition-colors text-left"
                              >
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                  <ServiceIcon className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-white font-medium text-sm truncate">
                                      {booking.name}
                                    </p>
                                    <StatusBadge status={booking.status} />
                                  </div>
                                  <p className="text-neutral-500 text-xs mt-0.5">
                                    {serviceLabels[booking.serviceType] ||
                                      booking.serviceType}{' '}
                                    · {formatDateShort(booking.createdAt)}
                                  </p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-neutral-600 shrink-0 rotate-[-90deg]" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========== BOOKINGS TAB ========== */}
                {activeTab === 'bookings' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Réservations
                      </h2>
                      <p className="text-neutral-500 text-sm">
                        Gérez toutes vos demandes de réservation
                      </p>
                    </div>

                    {/* Filters bar */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                        <Input
                          placeholder="Rechercher par nom ou WhatsApp..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 h-10"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger className="w-[160px] bg-neutral-800/50 border-neutral-700 text-white h-10">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a20] border-neutral-800">
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="nouveau">Nouveau</SelectItem>
                            <SelectItem value="en-cours">En cours</SelectItem>
                            <SelectItem value="propose">Proposé</SelectItem>
                            <SelectItem value="confirme">Confirmé</SelectItem>
                            <SelectItem value="termine">Terminé</SelectItem>
                            <SelectItem value="annule">Annulé</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSortOrder(
                              sortOrder === 'newest' ? 'oldest' : 'newest'
                            )
                          }
                          className="border-neutral-700 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 h-10 shrink-0"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">
                            {sortOrder === 'newest'
                              ? 'Plus récents'
                              : 'Plus anciens'}
                          </span>
                        </Button>
                      </div>
                    </div>

                    {/* Bookings list */}
                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div className="bg-[#1a1a20] border border-neutral-800 rounded-xl p-12 text-center">
                        <ClipboardList className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-neutral-400 text-lg">
                          {searchQuery || statusFilter !== 'all'
                            ? 'Aucun résultat trouvé'
                            : 'Aucune réservation'}
                        </p>
                        <p className="text-neutral-600 text-sm mt-1">
                          {searchQuery || statusFilter !== 'all'
                            ? 'Essayez de modifier vos filtres'
                            : 'Les nouvelles demandes apparaîtront ici'}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop table */}
                        <div className="hidden lg:block bg-[#1a1a20] border border-neutral-800 rounded-xl overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-neutral-800">
                                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                  Client
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                  Service
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                  Statut
                                </th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                              {filteredBookings.map((booking) => {
                                const ServiceIcon = getServiceIcon(
                                  booking.serviceType
                                );
                                return (
                                  <tr
                                    key={booking.id}
                                    className="hover:bg-neutral-800/30 transition-colors"
                                  >
                                    <td className="px-4 py-3 text-sm text-neutral-400 whitespace-nowrap">
                                      {formatDateShort(booking.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div>
                                        <p className="text-sm font-medium text-white">
                                          {booking.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                          {booking.whatsapp}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <ServiceIcon className="h-4 w-4 text-amber-500" />
                                        <span className="text-sm text-neutral-300">
                                          {serviceLabels[booking.serviceType] ||
                                            booking.serviceType}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            openBookingDetail(booking)
                                          }
                                          className="text-neutral-400 hover:text-amber-400 h-8"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            openWhatsApp(booking.whatsapp)
                                          }
                                          className="text-neutral-400 hover:text-green-400 h-8"
                                        >
                                          <MessageSquare className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="lg:hidden space-y-2">
                          {filteredBookings.map((booking) => {
                            const ServiceIcon = getServiceIcon(
                              booking.serviceType
                            );
                            return (
                              <button
                                key={booking.id}
                                onClick={() => openBookingDetail(booking)}
                                className="w-full bg-[#1a1a20] border border-neutral-800 rounded-xl p-4 text-left hover:border-amber-500/30 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                      <ServiceIcon className="h-4 w-4 text-amber-500" />
                                    </div>
                                    <div>
                                      <p className="text-white font-medium text-sm">
                                        {booking.name}
                                      </p>
                                      <p className="text-neutral-500 text-xs">
                                        {booking.whatsapp}
                                      </p>
                                    </div>
                                  </div>
                                  <StatusBadge status={booking.status} />
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                  <span className="text-neutral-500 text-xs">
                                    {formatDate(booking.createdAt)}
                                  </span>
                                  <span className="text-amber-400 text-xs font-medium">
                                    {serviceLabels[booking.serviceType] ||
                                      booking.serviceType}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <p className="text-neutral-600 text-xs text-center mt-4">
                          {filteredBookings.length} réservation
                          {filteredBookings.length > 1 ? 's' : ''} affichée
                          {filteredBookings.length > 1 ? 's' : ''}
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* ========== SETTINGS TAB ========== */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Paramètres
                      </h2>
                      <p className="text-neutral-500 text-sm">
                        Configuration de votre espace d&apos;administration
                      </p>
                    </div>
                    <Card className="bg-[#1a1a20] border-neutral-800">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">
                          Informations du compte
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Camera className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              PACOYABAKH
                            </p>
                            <p className="text-neutral-500 text-sm">
                              Administrateur
                            </p>
                          </div>
                        </div>
                        <Separator className="bg-neutral-800" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                              Plateforme
                            </p>
                            <p className="text-neutral-300 text-sm">
                              PACOYABAKH Booking System
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                              Version
                            </p>
                            <p className="text-neutral-300 text-sm">1.0.0</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ========== GALLERY TAB ========== */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Galerie Photo
                      </h2>
                      <p className="text-neutral-500 text-sm">
                        Gérez les photos de votre portfolio
                      </p>
                    </div>

                    {/* Upload Section */}
                    <Card className="bg-[#1a1a20] border-neutral-800 overflow-hidden">
                      <CardContent className="p-0">
                        {/* Drag & Drop Zone */}
                        {!uploadPreview ? (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-8 sm:p-12 border-2 border-dashed cursor-pointer transition-all duration-300 ${
                              dragOver
                                ? 'border-amber-500/50 bg-amber-500/5'
                                : 'border-neutral-700 hover:border-amber-500/30 hover:bg-neutral-800/20'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Upload className="h-8 w-8 text-amber-500" />
                              </div>
                              <div className="text-center">
                                <p className="text-white font-semibold text-lg mb-1">
                                  Ajouter une photo
                                </p>
                                <p className="text-neutral-400 text-sm">
                                  Glissez-déposez une image ici ou{' '}
                                  <span className="text-amber-400 underline">parcourir</span>
                                </p>
                                <p className="text-neutral-600 text-xs mt-2">
                                  JPG, PNG ou WebP — Max 10 Mo
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 sm:p-6">
                            {/* Preview & Form */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                                <img
                                  src={uploadPreview}
                                  alt="Aperçu"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-4">
                                <div>
                                  <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block">
                                    Catégorie
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {photoCategories.map((cat) => (
                                      <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setUploadCategory(cat.value)}
                                        className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all text-center ${
                                          uploadCategory === cat.value
                                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                            : 'border-neutral-700 bg-neutral-800/30 text-neutral-400 hover:border-neutral-600'
                                        }`}
                                      >
                                        {cat.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block">
                                      Titre (optionnel)
                                    </label>
                                    <Input
                                      value={uploadTitle}
                                      onChange={(e) => setUploadTitle(e.target.value)}
                                      placeholder="Ex: Portrait Studio"
                                      className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block">
                                      Description (optionnel)
                                    </label>
                                    <Input
                                      value={uploadDescription}
                                      onChange={(e) => setUploadDescription(e.target.value)}
                                      placeholder="Description courte..."
                                      className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-10 flex-1"
                                  >
                                    {uploading ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    {uploading ? 'Envoi en cours...' : 'Uploader'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={resetUploadForm}
                                    disabled={uploading}
                                    className="border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 h-10"
                                  >
                                    Annuler
                                  </Button>
                                </div>
                                {/* Progress bar */}
                                {uploading && uploadProgress > 0 && (
                                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                                      style={{ width: `${uploadProgress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                          }}
                        />
                      </CardContent>
                    </Card>

                    {/* Gallery Filter */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGalleryFilter('all')}
                        className={
                          galleryFilter === 'all'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30 h-8'
                            : 'border-neutral-700 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 h-8'
                        }
                      >
                        Tout
                        <span className="ml-1 text-xs opacity-60">{photos.length}</span>
                      </Button>
                      {photoCategories.map((cat) => {
                        const count = photos.filter((p) => p.category === cat.value).length;
                        return (
                          <Button
                            key={cat.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setGalleryFilter(cat.value)}
                            className={
                              galleryFilter === cat.value
                                ? `h-8 ${cat.color}`
                                : 'border-neutral-700 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 h-8'
                            }
                          >
                            {cat.label}
                            <span className="ml-1 text-xs opacity-60">{count}</span>
                          </Button>
                        );
                      })}
                    </div>

                    {/* Photo Grid */}
                    {galleryLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                      </div>
                    ) : (() => {
                      const filteredPhotos = galleryFilter === 'all'
                        ? photos
                        : photos.filter((p) => p.category === galleryFilter);
                      return filteredPhotos.length === 0 ? (
                        <div className="bg-[#1a1a20] border border-neutral-800 rounded-xl p-12 text-center">
                          <GalleryHorizontalEnd className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                          <p className="text-neutral-400 text-lg">Aucune photo</p>
                          <p className="text-neutral-600 text-sm mt-1">
                            Uploadez votre première photo ci-dessus
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                          {filteredPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className="relative group rounded-xl overflow-hidden bg-[#1a1a20] border border-neutral-800 hover:border-neutral-700 transition-all duration-200"
                            >
                              <div className="aspect-square relative">
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.title || 'Photo portfolio'}
                                  className="w-full h-full object-cover"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => openEditPhotoDialog(photo)}
                                    className="h-8 w-8 p-0 bg-neutral-800/90 hover:bg-neutral-700 text-white rounded-lg"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleTogglePhotoActive(photo)}
                                    className="h-8 w-8 p-0 bg-neutral-800/90 hover:bg-neutral-700 text-white rounded-lg"
                                    title={photo.active ? 'Masquer' : 'Afficher'}
                                  >
                                    {photo.active ? (
                                      <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      setDeletePhotoId(photo.id);
                                      setDeletePhotoDialog(true);
                                    }}
                                    className="h-8 w-8 p-0 bg-red-900/80 hover:bg-red-800 text-white rounded-lg"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                {/* Inactive indicator */}
                                {!photo.active && (
                                  <div className="absolute top-2 left-2 bg-black/70 text-neutral-400 text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <EyeOff className="h-3 w-3" />
                                    Masquée
                                  </div>
                                )}
                              </div>
                              {/* Info */}
                              <div className="p-2.5">
                                <p className="text-white text-sm font-medium truncate">
                                  {photo.title || 'Sans titre'}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${photoCategoryBadge[photo.category] || 'bg-neutral-700 text-neutral-300 border-neutral-600'}`}>
                                    {photoCategories.find(c => c.value === photo.category)?.label || photo.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========== BOOKING DETAIL DIALOG ========== */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl h-[90vh] bg-[#111115] border-neutral-800 text-white p-0 !flex !flex-col !overflow-hidden">
            {selectedBooking && (
              <>
                <DialogHeader className="px-6 py-4 border-b border-neutral-800 shrink-0">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                      Détails de la réservation
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                  </div>
                  <p className="text-neutral-500 text-sm mt-1">
                    Créée le {formatDate(selectedBooking.createdAt)}
                  </p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <div className="px-6 py-4 space-y-6">
                    {/* Client info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#1a1a20] border border-neutral-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="h-4 w-4 text-amber-500" />
                          <span className="text-neutral-500 text-xs uppercase tracking-wider">
                            Client
                          </span>
                        </div>
                        <p className="text-white font-semibold">
                          {selectedBooking.name}
                        </p>
                        <p className="text-neutral-400 text-sm">
                          {selectedBooking.whatsapp}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openWhatsApp(selectedBooking.whatsapp)
                          }
                          className="mt-2 border-green-700/50 text-green-400 hover:bg-green-900/20 hover:text-green-300 h-8 text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contacter via WhatsApp
                        </Button>
                      </div>
                      <div className="bg-[#1a1a20] border border-neutral-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="h-4 w-4 text-amber-500" />
                          <span className="text-neutral-500 text-xs uppercase tracking-wider">
                            Service
                          </span>
                        </div>
                        <p className="text-white font-semibold">
                          {serviceLabels[selectedBooking.serviceType] ||
                            selectedBooking.serviceType}
                        </p>
                        <p className="text-neutral-400 text-sm">
                          {shootingLabels[selectedBooking.shootingType] ||
                            selectedBooking.shootingType}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="bg-[#1a1a20] border border-neutral-800 rounded-xl p-4 space-y-3">
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        Détails de la demande
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-neutral-500">Usages :</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {parsePurposes(selectedBooking.purposes).map(
                              (p, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="border-neutral-700 text-neutral-300 text-xs"
                                >
                                  {p}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-neutral-500">
                            Date souhaitée :
                          </span>
                          <p className="text-neutral-300 mt-1">
                            {selectedBooking.bookingDate
                              ? formatDateShort(selectedBooking.bookingDate)
                              : 'Non spécifiée'}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Budget :</span>
                          <p className="text-neutral-300 mt-1">
                            {selectedBooking.budget
                              ? `${Number(selectedBooking.budget).toLocaleString('fr-FR')} FCFA`
                              : 'Non spécifié'}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Besoin d&apos;aide :</span>
                          <p className="text-neutral-300 mt-1">
                            {selectedBooking.needsHelp ? 'Oui ✅' : 'Non'}
                          </p>
                        </div>
                      </div>
                      {selectedBooking.idea && (
                        <div className="pt-2">
                          <span className="text-neutral-500 text-sm">
                            Idée / Description :
                          </span>
                          <p className="text-neutral-300 text-sm mt-1 bg-neutral-800/30 rounded-lg p-3">
                            {selectedBooking.idea}
                          </p>
                        </div>
                      )}
                      {selectedBooking.referenceLinks && (
                        <div>
                          <span className="text-neutral-500 text-sm">
                            Références :
                          </span>
                          <p className="text-amber-400 text-sm mt-1 break-all">
                            {selectedBooking.referenceLinks}
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-neutral-800" />

                    {/* Status & Notes */}
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        <Settings className="h-4 w-4 text-amber-500" />
                        Gestion
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-neutral-500 text-xs uppercase tracking-wider mb-2 block">
                            Changer le statut
                          </label>
                          <Select
                            value={editStatus}
                            onValueChange={setEditStatus}
                          >
                            <SelectTrigger className="bg-neutral-800/50 border-neutral-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a20] border-neutral-800">
                              <SelectItem value="nouveau">Nouveau</SelectItem>
                              <SelectItem value="en-cours">En cours</SelectItem>
                              <SelectItem value="propose">Proposé</SelectItem>
                              <SelectItem value="confirme">Confirmé</SelectItem>
                              <SelectItem value="termine">Terminé</SelectItem>
                              <SelectItem value="annule">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-neutral-500 text-xs uppercase tracking-wider mb-2 block">
                            Notes internes
                          </label>
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Notes visibles uniquement par l'admin..."
                            className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 min-h-[60px] resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-neutral-800" />

                    {/* ========== PROPOSAL FORM (FICHE DE PROPOSITION) ========== */}
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4 text-amber-500" />
                          Fiche de Proposition
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-neutral-400 hover:text-amber-400 h-8 text-xs"
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            {showPreview ? 'Formulaire' : 'Aperçu'}
                          </Button>
                          {selectedBooking.proposalDate && (
                            <span className="text-neutral-600 text-xs">
                              Dernière : {formatDate(selectedBooking.proposalDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      {showPreview ? (
                        /* ========== WHATSAPP PREVIEW ========== */
                        <div className="space-y-4">
                          <div className="bg-[#0b141a] rounded-xl p-4 border border-neutral-700/50">
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-700/30">
                              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{selectedBooking.name}</p>
                                <p className="text-neutral-500 text-xs">{selectedBooking.whatsapp}</p>
                              </div>
                            </div>
                            <div className="bg-[#005c4b] rounded-lg rounded-tl-none p-3 text-white text-sm leading-relaxed whitespace-pre-line">
                              {buildProposalMessage() || 'Remplissez la fiche pour voir l\'aperçu...'}
                            </div>
                            <p className="text-neutral-600 text-xs text-right mt-2">
                              {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={generateWhatsAppProposal}
                              className="bg-green-600 hover:bg-green-500 text-white font-semibold h-11 flex-1"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Envoyer par WhatsApp
                            </Button>
                            <Button
                              onClick={() => {
                                handleSaveBooking();
                              }}
                              disabled={saving}
                              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11 flex-1"
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Sauvegarder
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* ========== PROPOSAL FORM ========== */
                        <div className="space-y-5">
                          {/* Pack Selection */}
                          <div>
                            <label className="text-neutral-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                              <Package className="h-3 w-3 text-amber-500" />
                              Pack proposé
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { value: 'essentiel', label: 'Essentiel', icon: '📋' },
                                { value: 'premium', label: 'Premium', icon: '⭐' },
                                { value: 'vip', label: 'VIP', icon: '👑' },
                              ].map((pack) => (
                                <button
                                  key={pack.value}
                                  onClick={() => setProposalPack(pack.value)}
                                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                                    proposalPack === pack.value
                                      ? 'border-amber-500 bg-amber-500/10'
                                      : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600'
                                  }`}
                                >
                                  <span className="text-xl block mb-1">{pack.icon}</span>
                                  <span className="text-white text-sm font-medium">{pack.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Timer className="h-3 w-3 text-amber-500" />
                                Durée
                              </label>
                              <Input
                                value={proposalDuration}
                                onChange={(e) => setProposalDuration(e.target.value)}
                                placeholder="Ex: 2 heures"
                                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                              />
                            </div>
                            <div>
                              <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-amber-500" />
                                Lieu
                              </label>
                              <Input
                                value={proposalLocation}
                                onChange={(e) => setProposalLocation(e.target.value)}
                                placeholder="Ex: Studio Dakar"
                                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                              />
                            </div>
                            <div>
                              <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <ImageIcon className="h-3 w-3 text-amber-500" />
                                Nb. photos
                              </label>
                              <Input
                                value={proposalNbPhotos}
                                onChange={(e) => setProposalNbPhotos(e.target.value)}
                                placeholder="Ex: 30 photos"
                                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                              />
                            </div>
                            <div>
                              <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Video className="h-3 w-3 text-amber-500" />
                                Nb. vidéos
                              </label>
                              <Input
                                value={proposalNbVideos}
                                onChange={(e) => setProposalNbVideos(e.target.value)}
                                placeholder="Ex: 2 vidéos"
                                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                              />
                            </div>
                          </div>

                          {/* Retouches toggle */}
                          <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-700 bg-neutral-800/30 cursor-pointer hover:border-neutral-600 transition-all">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                              <span className="text-white text-sm font-medium">Retouches incluses</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setProposalRetouches(!proposalRetouches)}
                              className={`relative w-11 h-6 rounded-full transition-colors ${
                                proposalRetouches ? 'bg-amber-500' : 'bg-neutral-700'
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                  proposalRetouches ? 'translate-x-5' : ''
                                }`}
                              />
                            </button>
                          </label>

                          {/* Délai de livraison */}
                          <div>
                            <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <Truck className="h-3 w-3 text-amber-500" />
                              Délai de livraison
                            </label>
                            <Input
                              value={proposalDelivery}
                              onChange={(e) => setProposalDelivery(e.target.value)}
                              placeholder="Ex: 3 à 5 jours ouvrés"
                              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                            />
                          </div>

                          {/* Services inclus (checkboxes) */}
                          <div>
                            <label className="text-neutral-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                              <ClipboardCheck className="h-3 w-3 text-amber-500" />
                              Services inclus
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {proposalIncludesOptions.map((item) => (
                                <label
                                  key={item}
                                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                                    proposalIncludes.includes(item)
                                      ? 'border-amber-500/50 bg-amber-500/10 text-white'
                                      : 'border-neutral-700 bg-neutral-800/20 text-neutral-400 hover:border-neutral-600'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                      proposalIncludes.includes(item)
                                        ? 'bg-amber-500 border-amber-500'
                                        : 'border-neutral-600'
                                    }`}
                                  >
                                    {proposalIncludes.includes(item) && (
                                      <Check className="h-3 w-3 text-black" />
                                    )}
                                  </div>
                                  <span className="text-xs">{item}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Prix */}
                          <div>
                            <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-amber-500" />
                              Prix proposé
                            </label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={proposalPrice}
                                onChange={(e) => setProposalPrice(e.target.value)}
                                placeholder="Ex: 75000"
                                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-11 pr-16 text-lg font-semibold"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 text-sm font-bold">
                                FCFA
                              </span>
                            </div>
                          </div>

                          {/* Note additionnelle */}
                          <div>
                            <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-amber-500" />
                              Note additionnelle
                            </label>
                            <Textarea
                              value={proposalText}
                              onChange={(e) => setProposalText(e.target.value)}
                              placeholder="Informations complémentaires pour le client..."
                              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 min-h-[80px] resize-none"
                            />
                          </div>

                          {/* Conditions */}
                          <div>
                            <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <CalendarCheck className="h-3 w-3 text-amber-500" />
                              Conditions
                            </label>
                            <Textarea
                              value={proposalConditions}
                              onChange={(e) => setProposalConditions(e.target.value)}
                              placeholder="Ex: Accompte de 50% à la confirmation, solde le jour du shooting..."
                              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 min-h-[60px] resize-none"
                            />
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                              onClick={generateWhatsAppProposal}
                              className="bg-green-600 hover:bg-green-500 text-white font-semibold h-11 flex-1"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Envoyer par WhatsApp
                            </Button>
                            <Button
                              onClick={() => setShowPreview(true)}
                              variant="outline"
                              className="border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 h-11 flex-1"
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              Aperçu du message
                            </Button>
                            <Button
                              onClick={handleSaveBooking}
                              disabled={saving}
                              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11 flex-1"
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Sauvegarder
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-neutral-800" />

                    {/* Danger zone */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-red-400 font-semibold text-sm">
                          Zone dangereuse
                        </h4>
                        <p className="text-neutral-600 text-xs mt-0.5">
                          Cette action est irréversible
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteId(selectedBooking.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="border-red-900/50 text-red-400 hover:bg-red-900/20 hover:text-red-300 h-9"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ========== DELETE CONFIRMATION (BOOKING) ========== */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#141418] border-neutral-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Supprimer cette réservation ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                Cette action est irréversible. La réservation sera définitivement
                supprimée de la base de données.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBooking}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ========== EDIT PHOTO DIALOG ========== */}
        <Dialog open={editPhotoDialog} onOpenChange={setEditPhotoDialog}>
          <DialogContent className="sm:max-w-lg bg-[#111115] border-neutral-800 text-white p-0 overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b border-neutral-800">
              <DialogTitle className="text-lg font-bold text-white">
                Modifier la photo
              </DialogTitle>
              <DialogDescription className="text-neutral-500 text-sm">
                Modifiez les informations de la photo
              </DialogDescription>
            </DialogHeader>
            {editingPhoto && (
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Image Preview */}
                <div className="w-full h-48 rounded-xl overflow-hidden bg-neutral-800">
                  <img
                    src={editingPhoto.imageUrl}
                    alt={editingPhoto.title || 'Photo'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block">
                      Titre
                    </label>
                    <Input
                      value={editPhotoTitle}
                      onChange={(e) => setEditPhotoTitle(e.target.value)}
                      placeholder="Titre de la photo"
                      className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 h-10"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block">
                      Description
                    </label>
                    <Textarea
                      value={editPhotoDescription}
                      onChange={(e) => setEditPhotoDescription(e.target.value)}
                      placeholder="Description..."
                      className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-amber-500 min-h-[60px] resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block">
                      Catégorie
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {photoCategories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setEditPhotoCategory(cat.value)}
                          className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all text-center ${
                            editPhotoCategory === cat.value
                              ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                              : 'border-neutral-700 bg-neutral-800/30 text-neutral-400 hover:border-neutral-600'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-700 bg-neutral-800/30 cursor-pointer hover:border-neutral-600 transition-all">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-amber-500" />
                      <span className="text-white text-sm font-medium">Visible sur le portfolio</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditPhotoActive(!editPhotoActive)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        editPhotoActive ? 'bg-amber-500' : 'bg-neutral-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          editPhotoActive ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSavePhoto}
                    disabled={savingPhoto}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-10 flex-1"
                  >
                    {savingPhoto ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditPhotoDialog(false)}
                    className="border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 h-10"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ========== DELETE PHOTO CONFIRMATION ========== */}
        <AlertDialog open={deletePhotoDialog} onOpenChange={setDeletePhotoDialog}>
          <AlertDialogContent className="bg-[#141418] border-neutral-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Supprimer cette photo ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                Cette action est irréversible. La photo sera définitivement
                supprimée de la galerie et du serveur.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePhoto}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
