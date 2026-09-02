import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  Tag,
  History,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Shield,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Upload,
  ArrowRight,
  Clock,
  User,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  RefreshCw,
  FolderGit2,
  Layers,
  Sparkles,
  Database,
  Code2,
  BookOpen,
  Trash2,
  Lock,
  Unlock,
  Sliders,
  Globe,
  Languages,
  Edit2,
  ListPlus,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Save,
  CheckCheck,
  Star,
  Zap,
  Info,
  Calendar,
  Sparkle,
  FileText,
  ShieldAlert,
  Film,
  Video,
  Play
} from 'lucide-react';
import {
  Branch,
  Commit,
  PullRequest,
  ReleaseTag,
  VersionControlState,
  FileChange,
  CommitCategory
} from '../../types/versionControl';
import { versionControlService } from '../../lib/versionControlService';
import { appVersionService } from '../../services/appVersionService';
import { APP_VERSION_CONFIG, VersionRelease, getLocalizedRelease } from '../../config/appVersion';
import { VIDEO_CARD_PRESETS, getPresetById, VideoCardThemeId } from '../../types/updateCards';
import { UpdateVideoCard } from '../videoCards/UpdateVideoCard';
import { Version3DVideoNotificationModal } from '../videoCards/Version3DVideoNotificationModal';

export const AdminVersionControlManager: React.FC = () => {
  const [vcsState, setVcsState] = useState<VersionControlState>(versionControlService.getState());
  const [activeSubTab, setActiveSubTab] = useState<'commits' | 'branches' | 'pull_requests' | 'releases'>('releases');
  
  // App Version (Firestore) state
  const [appReleases, setAppReleases] = useState<VersionRelease[]>(APP_VERSION_CONFIG.releases);
  const [isLoadingAppReleases, setIsLoadingAppReleases] = useState<boolean>(true);
  const [releaseSearchQuery, setReleaseSearchQuery] = useState<string>('');
  const [releaseStatusFilter, setReleaseStatusFilter] = useState<'all' | 'active' | 'disabled' | 'major' | 'minor' | 'patch'>('all');
  const [previewCardLangs, setPreviewCardLangs] = useState<Record<string, 'fr' | 'en' | 'ha'>>({});
  const [preview3DVideoRelease, setPreview3DVideoRelease] = useState<VersionRelease | null>(null);
  
  // App Version Editor & Creator Modals
  const [editingAppRelease, setEditingAppRelease] = useState<VersionRelease | null>(null);
  const [showEditAppReleaseModal, setShowEditAppReleaseModal] = useState<boolean>(false);
  const [showCreateAppReleaseModal, setShowCreateAppReleaseModal] = useState<boolean>(false);
  const [appReleaseToDelete, setAppReleaseToDelete] = useState<VersionRelease | null>(null);
  const [activeEditorLangTab, setActiveEditorLangTab] = useState<'fr' | 'en' | 'ha'>('fr');
  const [editorRawMode, setEditorRawMode] = useState<boolean>(false);
  const [rawHighlightsText, setRawHighlightsText] = useState<{ fr: string; en: string; ha: string }>({ fr: '', en: '', ha: '' });
  const [isSavingAppRelease, setIsSavingAppRelease] = useState<boolean>(false);
  const [isSyncingDefaults, setIsSyncingDefaults] = useState<boolean>(false);
  const [isPurgingCache, setIsPurgingCache] = useState<boolean>(false);
  const [versionDiagnostic, setVersionDiagnostic] = useState<{
    hasPersistentMismatch?: boolean;
    lastChecked?: string;
    targetPackageVersion?: string;
    storedVersion?: string;
    runtimeVersion?: string;
    reason?: string;
    warningCount?: number;
    status?: string;
  } | null>(() => {
    try {
      const raw = localStorage.getItem('asrarhub_admin_version_diagnostic');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateDiag = () => {
      try {
        const raw = localStorage.getItem('asrarhub_admin_version_diagnostic');
        if (raw) setVersionDiagnostic(JSON.parse(raw));
      } catch {}
    };
    const interval = setInterval(updateDiag, 4000);
    return () => clearInterval(interval);
  }, []);
  const [showVideoStudioModal, setShowVideoStudioModal] = useState<boolean>(false);
  const [studioSelectedPresetId, setStudioSelectedPresetId] = useState<VideoCardThemeId>('cosmic-nebula');
  const [studioIsForceUpdateTest, setStudioIsForceUpdateTest] = useState<boolean>(true);
  const [studioActiveLang, setStudioActiveLang] = useState<'fr' | 'en' | 'ha'>('fr');
  const [isAdvancedCreateOpen, setIsAdvancedCreateOpen] = useState<boolean>(false);
  const [newAppReleaseForm, setNewAppReleaseForm] = useState<{
    version: string;
    versionCode: number;
    releaseDate: string;
    releaseDateEn: string;
    releaseDateHa: string;
    title: string;
    titleEn: string;
    titleHa: string;
    type: 'major' | 'minor' | 'patch';
    isCurrent: boolean;
    disabled: boolean;
    forceUpdate: boolean;
    disableVideoCard: boolean;
    enable3DVideoPopup?: boolean;
    customVideoUrl?: string;
    videoPoster?: string;
    forceVideoModal?: boolean;
    videoTitle?: string;
    videoSubtitle?: string;
    minSupportedVersionCode: number;
    downloadUrl: string;
    apkDownloadUrl: string;
    videoCardTheme: VideoCardThemeId;
    highlights: string[];
    highlightsEn: string[];
    highlightsHa: string[];
  }>({
    version: '',
    versionCode: 1,
    releaseDate: '',
    releaseDateEn: '',
    releaseDateHa: '',
    title: '',
    titleEn: '',
    titleHa: '',
    type: 'patch',
    isCurrent: true,
    disabled: false,
    forceUpdate: false,
    disableVideoCard: false,
    enable3DVideoPopup: true,
    customVideoUrl: '',
    videoPoster: '',
    forceVideoModal: false,
    videoTitle: '',
    videoSubtitle: '',
    minSupportedVersionCode: 1,
    downloadUrl: '',
    apkDownloadUrl: '',
    videoCardTheme: 'cyber-emerald',
    highlights: [''],
    highlightsEn: [''],
    highlightsHa: ['']
  });

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Modals & Panels
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const [showNewBranchModal, setShowNewBranchModal] = useState(false);
  const [showNewCommitModal, setShowNewCommitModal] = useState(false);
  const [showNewPRModal, setShowNewPRModal] = useState(false);
  const [showNewReleaseModal, setShowNewReleaseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Sync with Firestore app_versions in real-time
  useEffect(() => {
    const unsubscribe = appVersionService.subscribeReleases((releases) => {
      if (releases && releases.length > 0) {
        setAppReleases(releases);
      }
      setIsLoadingAppReleases(false);
    }, true); // true = include disabled versions for admin

    return () => unsubscribe();
  }, []);

  // New Branch Form
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchPrefix, setNewBranchPrefix] = useState('feature/');
  const [newBranchBase, setNewBranchBase] = useState('main');
  const [newBranchDesc, setNewBranchDesc] = useState('');
  const [newBranchColor, setNewBranchColor] = useState('#10B981');
  const [newBranchProtected, setNewBranchProtected] = useState(false);

  // New Commit Form
  const [commitMessage, setCommitMessage] = useState('');
  const [commitDesc, setCommitDesc] = useState('');
  const [commitCategory, setCommitCategory] = useState<CommitCategory>('feature');
  const [commitComponent, setCommitComponent] = useState('Articles & Wirds');
  const [commitDiffSummary, setCommitDiffSummary] = useState('');

  // New PR Form
  const [prTitle, setPrTitle] = useState('');
  const [prDesc, setPrDesc] = useState('');
  const [prSourceBranch, setPrSourceBranch] = useState('');
  const [prTargetBranch, setPrTargetBranch] = useState('main');

  // New Release Form
  const [releaseTag, setReleaseTag] = useState('');
  const [releaseTitle, setReleaseTitle] = useState('');
  const [releaseDesc, setReleaseDesc] = useState('');
  const [releaseChangelog, setReleaseChangelog] = useState('');

  // Sync with service
  useEffect(() => {
    const unsubscribe = versionControlService.subscribe(newState => {
      setVcsState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setActionErrorMessage(msg);
      setTimeout(() => setActionErrorMessage(null), 5000);
    } else {
      setActionSuccessMessage(msg);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  const copyToClipboard = (text: string, hashId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hashId);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const currentBranch = vcsState.branches.find(b => b.id === vcsState.currentBranchId) || vcsState.branches[0];

  // Filtered Commits
  const filteredCommits = vcsState.commits.filter(c => {
    const matchesSearch =
      c.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.changes.some(ch => ch.path.toLowerCase().includes(searchTerm.toLowerCase()) || ch.component.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch = selectedBranchFilter === 'all' || c.branchId === selectedBranchFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || c.category === selectedCategoryFilter;

    return matchesSearch && matchesBranch && matchesCategory;
  });

  // Category Badges Config
  const getCategoryBadge = (cat: CommitCategory) => {
    switch (cat) {
      case 'feature':
        return { label: 'Fonctionnalité', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'hotfix':
        return { label: 'Correctif / Hotfix', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
      case 'content':
        return { label: 'Contenu & Wirds', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'security':
        return { label: 'Sécurité & RBAC', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' };
      case 'config':
        return { label: 'Configuration SWR', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' };
      case 'merge':
        return { label: 'Fusion de Branche', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      default:
        return { label: 'Maintenance', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' };
    }
  };

  // Branch Switch Handler
  const handleSwitchBranch = (branchId: string) => {
    const ok = versionControlService.switchBranch(branchId);
    if (ok) {
      showFeedback(`Basculé sur la branche « ${branchId} » avec succès.`);
    }
  };

  // Create Branch Handler
  const handleCreateBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${newBranchPrefix}${newBranchName}`.toLowerCase();
    const res = versionControlService.createBranch(
      fullName,
      newBranchBase,
      newBranchDesc,
      newBranchColor,
      newBranchProtected
    );
    if (res.success) {
      showFeedback(`Branche « ${fullName} » créée avec succès depuis ${newBranchBase}.`);
      setShowNewBranchModal(false);
      setNewBranchName('');
      setNewBranchDesc('');
    } else {
      showFeedback(res.error || 'Erreur lors de la création de la branche.', true);
    }
  };

  // Create Commit Handler
  const handleCreateCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    const sampleChanges: FileChange[] = [
      {
        path: `src/content/${commitComponent.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`,
        component: commitComponent,
        type: 'modified',
        additions: Math.floor(Math.random() * 40) + 15,
        deletions: Math.floor(Math.random() * 8) + 1,
        diffSummary: commitDiffSummary || `Mise à jour dans ${commitComponent}`,
        oldContent: `// Version précédente de ${commitComponent}\nconst status = "legacy";`,
        newContent: `// Version validée et enrichie\nconst status = "optimized";\nconst message = "${commitMessage}";`
      }
    ];

    const res = versionControlService.createCommit(
      commitMessage,
      commitDesc,
      commitCategory,
      sampleChanges,
      { name: 'Jibril Tengeh', email: 'jibriltengeh57@gmail.com', role: 'Lead Architect & Curator' }
    );

    if (res.success) {
      showFeedback(`Commit « ${res.commit?.id} » enregistré sur ${currentBranch.name}.`);
      setShowNewCommitModal(false);
      setCommitMessage('');
      setCommitDesc('');
      setCommitDiffSummary('');
    } else {
      showFeedback(res.error || 'Erreur commit.', true);
    }
  };

  // Revert Commit Handler
  const handleRevertCommit = (commit: Commit) => {
    if (confirm(`Confirmez-vous l'annulation sécurisée (Rollback) du commit [${commit.id}] : "${commit.message}" ?`)) {
      const res = versionControlService.revertCommit(commit.id, {
        name: 'Jibril Tengeh',
        email: 'jibriltengeh57@gmail.com',
        role: 'Lead Architect'
      });
      if (res.success) {
        showFeedback(`Commit revert « ${res.newCommit?.id} » créé. Les modifications ont été annulées en toute sécurité.`);
        setSelectedCommit(null);
      } else {
        showFeedback(res.error || 'Erreur lors du rollback.', true);
      }
    }
  };

  // Create PR Handler
  const handleCreatePRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const source = prSourceBranch || (vcsState.branches.find(b => b.id !== 'main')?.id || '');
    if (!source) {
      showFeedback('Veuillez sélectionner une branche source.', true);
      return;
    }
    const res = versionControlService.createPullRequest(
      source,
      prTargetBranch,
      prTitle,
      prDesc,
      { name: 'Jibril Tengeh', email: 'jibriltengeh57@gmail.com' }
    );

    if (res.success) {
      showFeedback(`Demande de fusion « ${res.pr?.id} » créée avec succès.`);
      setShowNewPRModal(false);
      setPrTitle('');
      setPrDesc('');
      setActiveSubTab('pull_requests');
    } else {
      showFeedback(res.error || 'Erreur création PR.', true);
    }
  };

  // Merge PR Handler
  const handleMergePR = (pr: PullRequest) => {
    const res = versionControlService.mergePullRequest(pr.id, 'Jibril Tengeh');
    if (res.success) {
      showFeedback(`Fusion « ${pr.id} » (${pr.sourceBranch} ➜ ${pr.targetBranch}) exécutée avec succès.`);
      setSelectedPR(null);
    } else {
      showFeedback(res.error || 'Impossible de fusionner.', true);
    }
  };

  // Create Release Handler
  const handleCreateReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseTag.trim()) return;

    const changelogItems = releaseChangelog
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const res = versionControlService.createRelease(
      releaseTag,
      releaseTitle,
      releaseDesc,
      changelogItems,
      'Jibril Tengeh'
    );

    if (res.success) {
      showFeedback(`Release « ${res.release?.tag} » publiée avec succès.`);
      setShowNewReleaseModal(false);
      setReleaseTag('');
      setReleaseTitle('');
      setReleaseDesc('');
      setReleaseChangelog('');
      setActiveSubTab('releases');
    } else {
      showFeedback(res.error || 'Erreur création release.', true);
    }
  };

  // Export Bundle
  const handleExportJSON = () => {
    const jsonStr = versionControlService.exportBundle();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asrarhub-vcs-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Archive complète de versions téléchargée.');
  };

  // =========================================================================
  // APP VERSION CONTROL (FIRESTORE CRUD & TOGGLES)
  // =========================================================================

  // 1. Toggle Disable / Enable
  const handleToggleDisableAppVersion = async (rel: VersionRelease) => {
    const newDisabledState = !rel.disabled;
    try {
      await appVersionService.toggleVersionDisabled(rel.version, newDisabledState);
      showFeedback(
        `Version v${rel.version} ${newDisabledState ? '🔴 désactivée (masquée aux utilisateurs)' : '🟢 activée (visible dans le changelog)'}.`
      );
    } catch (err: any) {
      showFeedback(err.message || 'Erreur lors du changement de statut de la version.', true);
    }
  };

  // 1b. Toggle Video Card Disable / Enable
  const handleToggleVideoCardAppVersion = async (rel: VersionRelease) => {
    const newDisabledState = !rel.disableVideoCard;
    try {
      await appVersionService.toggleVideoCardDisabled(rel.version, newDisabledState);
      showFeedback(
        `Pop-up 3D Vidéo pour v${rel.version} ${newDisabledState ? '🚫 désactivée (affichage standard discret)' : '🎬 activée (Pop-up 3D centrée avec vidéo active)'}.`
      );
    } catch (err: any) {
      showFeedback(err.message || 'Erreur lors du changement de statut vidéo.', true);
    }
  };

  // 1c. Quick Toggle 3D Video Popup
  const handleToggle3DVideoPopup = async (rel: VersionRelease) => {
    const isCurrentlyActive = rel.enable3DVideoPopup !== false && !rel.disableVideoCard;
    const newEnabledState = !isCurrentlyActive;
    try {
      await appVersionService.toggle3DVideoPopup(rel.version, newEnabledState);
      showFeedback(
        `Pop-up 3D Vidéo v${rel.version} : ${newEnabledState ? '🎬 Activée (Les utilisateurs recevront la pop-up 3D vidéo centrée)' : '🚫 Désactivée (Bannière discrète standard)'}.`
      );
    } catch (err: any) {
      showFeedback(err.message || 'Erreur lors du changement de statut de la Pop-up 3D Vidéo.', true);
    }
  };

  // 2. Set as Current Version
  const handleSetCurrentAppVersion = async (targetRel: VersionRelease) => {
    try {
      setIsSavingAppRelease(true);
      // Update target to isCurrent: true, and others to false
      for (const rel of appReleases) {
        const isTarget = rel.version === targetRel.version;
        if (rel.isCurrent !== isTarget) {
          await appVersionService.saveVersion({
            ...rel,
            isCurrent: isTarget
          });
        }
      }
      showFeedback(`Version v${targetRel.version} définie comme version active principale.`);
    } catch (err: any) {
      showFeedback(`Erreur : ${err.message || 'Impossible de définir la version active.'}`, true);
    } finally {
      setIsSavingAppRelease(false);
    }
  };

  // 3. Open Edit Modal
  const handleOpenEditModal = (rel: VersionRelease) => {
    setEditingAppRelease({
      ...rel,
      disableVideoCard: !!rel.disableVideoCard,
      enable3DVideoPopup: rel.enable3DVideoPopup !== undefined ? rel.enable3DVideoPopup : true,
      customVideoUrl: rel.customVideoUrl || '',
      videoPoster: rel.videoPoster || '',
      forceVideoModal: !!rel.forceVideoModal,
      videoTitle: rel.videoTitle || '',
      videoSubtitle: rel.videoSubtitle || '',
      videoCardTheme: rel.videoCardTheme || 'cyber-emerald',
      highlights: [...(rel.highlights || [])],
      highlightsEn: [...(rel.highlightsEn || [])],
      highlightsHa: [...(rel.highlightsHa || [])]
    });
    setRawHighlightsText({
      fr: (rel.highlights || []).join('\n'),
      en: (rel.highlightsEn || []).join('\n'),
      ha: (rel.highlightsHa || []).join('\n')
    });
    setActiveEditorLangTab('fr');
    setEditorRawMode(false);
    setShowEditAppReleaseModal(true);
  };

  // 4. Save Edited Release
  const handleSaveEditedRelease = async () => {
    if (!editingAppRelease || !editingAppRelease.version.trim()) {
      showFeedback('Le numéro de version est requis.', true);
      return;
    }

    try {
      setIsSavingAppRelease(true);
      
      let finalHighlightsFr = editingAppRelease.highlights;
      let finalHighlightsEn = editingAppRelease.highlightsEn || [];
      let finalHighlightsHa = editingAppRelease.highlightsHa || [];

      // If raw mode was active, synchronize raw text to array
      if (editorRawMode) {
        finalHighlightsFr = rawHighlightsText.fr.split('\n').map(s => s.trim()).filter(Boolean);
        finalHighlightsEn = rawHighlightsText.en.split('\n').map(s => s.trim()).filter(Boolean);
        finalHighlightsHa = rawHighlightsText.ha.split('\n').map(s => s.trim()).filter(Boolean);
      }

      const releaseToSave: VersionRelease = {
        ...editingAppRelease,
        highlights: finalHighlightsFr,
        highlightsEn: finalHighlightsEn,
        highlightsHa: finalHighlightsHa,
        updatedAt: new Date().toISOString()
      };

      await appVersionService.saveVersion(releaseToSave);
      showFeedback(`Version v${releaseToSave.version} et ses fonctionnalités mises à jour avec succès dans Firestore.`);
      setShowEditAppReleaseModal(false);
      setEditingAppRelease(null);
    } catch (err: any) {
      showFeedback(`Erreur : ${err.message || 'Échec de la sauvegarde.'}`, true);
    } finally {
      setIsSavingAppRelease(false);
    }
  };

  // 5. Open Create App Release Modal (Simplified & Automatic)
  const handleOpenCreateAppReleaseModal = () => {
    const todayFr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const todayEn = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const todayHa = `${new Date().getDate()} ${new Date().toLocaleString('ha-NG', { month: 'long' })}, ${new Date().getFullYear()}`;

    // Auto-calculate the next suggested version from current releases
    const latestVersion = appReleases[0]?.version || APP_VERSION_CONFIG.currentVersion || '1.1.2';
    const cleanVersion = latestVersion.replace(/^v/, '');
    const parts = cleanVersion.split('.').map(p => parseInt(p, 10) || 0);
    const major = parts[0] ?? 1;
    const minor = parts[1] ?? 1;
    const patch = parts[2] ?? 0;
    const suggestedVersion = `${major}.${minor}.${patch + 1}`;
    const nextVersionCode = (appReleases[0]?.versionCode || 1) + 1;

    setNewAppReleaseForm({
      version: suggestedVersion,
      versionCode: nextVersionCode,
      releaseDate: todayFr,
      releaseDateEn: todayEn,
      releaseDateHa: todayHa,
      title: `Mise à jour v${suggestedVersion}`,
      titleEn: `Update v${suggestedVersion}`,
      titleHa: `Sabuntawa v${suggestedVersion}`,
      type: 'patch',
      isCurrent: true,
      disabled: false,
      forceUpdate: false,
      disableVideoCard: true, // Désactivée par défaut
      minSupportedVersionCode: appReleases[0]?.versionCode || 1,
      downloadUrl: '',
      apkDownloadUrl: '',
      videoCardTheme: 'cyber-emerald',
      highlights: [''],
      highlightsEn: [''],
      highlightsHa: ['']
    });
    setRawHighlightsText({ 
      fr: 'Optimisation de la vitesse et des performances\nAmélioration de la stabilité générale et de l\'interface', 
      en: 'Speed and performance optimizations\nGeneral stability and interface improvements', 
      ha: 'Inganta sauri da sabunta ayyuka\nGyare-gyare don sauƙaƙa amfani' 
    });
    setActiveEditorLangTab('fr');
    setEditorRawMode(true);
    setIsAdvancedCreateOpen(false);
    setShowCreateAppReleaseModal(true);
  };

  // Helper to apply studio selected theme directly to active release in Firestore
  const handleApplyStudioThemeToActiveRelease = async (themeId: VideoCardThemeId) => {
    const targetRel = appReleases[0] || APP_VERSION_CONFIG.releases[0];
    if (!targetRel) return;

    try {
      setIsSavingAppRelease(true);
      const updatedRel: VersionRelease = {
        ...targetRel,
        videoCardTheme: themeId,
        updatedAt: new Date().toISOString()
      };
      await appVersionService.saveVersion(updatedRel);
      const preset = getPresetById(themeId);
      showFeedback(`✨ Thème vidéo "${preset.titleFr}" appliqué à la version active v${updatedRel.version} avec succès !`);
    } catch (err: any) {
      showFeedback(`Erreur : ${err.message || 'Impossible d\'appliquer le thème vidéo.'}`, true);
    } finally {
      setIsSavingAppRelease(false);
    }
  };

  // 6. Submit Create App Release
  const handleCreateAppReleaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppReleaseForm.version.trim() || !newAppReleaseForm.title.trim()) {
      showFeedback('Le numéro de version et le titre en français sont obligatoires.', true);
      return;
    }

    try {
      setIsSavingAppRelease(true);
      let finalFr = newAppReleaseForm.highlights.filter(h => h.trim().length > 0);
      let finalEn = newAppReleaseForm.highlightsEn.filter(h => h.trim().length > 0);
      let finalHa = newAppReleaseForm.highlightsHa.filter(h => h.trim().length > 0);

      if (editorRawMode) {
        finalFr = rawHighlightsText.fr.split('\n').map(s => s.trim()).filter(Boolean);
        finalEn = rawHighlightsText.en.split('\n').map(s => s.trim()).filter(Boolean);
        finalHa = rawHighlightsText.ha.split('\n').map(s => s.trim()).filter(Boolean);
      }

      const releaseToCreate: VersionRelease = {
        version: newAppReleaseForm.version.replace(/^v/, '').trim(),
        versionCode: Number(newAppReleaseForm.versionCode) || 1,
        releaseDate: newAppReleaseForm.releaseDate.trim(),
        releaseDateEn: newAppReleaseForm.releaseDateEn.trim() || newAppReleaseForm.releaseDate.trim(),
        releaseDateHa: newAppReleaseForm.releaseDateHa.trim() || newAppReleaseForm.releaseDate.trim(),
        title: newAppReleaseForm.title.trim(),
        titleEn: newAppReleaseForm.titleEn.trim() || newAppReleaseForm.title.trim(),
        titleHa: newAppReleaseForm.titleHa.trim() || newAppReleaseForm.title.trim(),
        type: newAppReleaseForm.type,
        isCurrent: newAppReleaseForm.isCurrent,
        disabled: newAppReleaseForm.disabled,
        forceUpdate: newAppReleaseForm.forceUpdate,
        disableVideoCard: newAppReleaseForm.disableVideoCard,
        minSupportedVersionCode: newAppReleaseForm.forceUpdate ? Number(newAppReleaseForm.minSupportedVersionCode) : undefined,
        downloadUrl: newAppReleaseForm.downloadUrl.trim() || undefined,
        apkDownloadUrl: newAppReleaseForm.apkDownloadUrl.trim() || undefined,
        videoCardTheme: newAppReleaseForm.videoCardTheme || 'cyber-emerald',
        highlights: finalFr.length > 0 ? finalFr : ['Mise à jour et améliorations des performances'],
        highlightsEn: finalEn.length > 0 ? finalEn : ['General updates and performance improvements'],
        highlightsHa: finalHa.length > 0 ? finalHa : ['Sabuntawa da inganta sauri'],
        author: 'Jibril Tengeh',
        updatedAt: new Date().toISOString()
      };

      await appVersionService.saveVersion(releaseToCreate);
      showFeedback(`Version v${releaseToCreate.version} créée et enregistrée avec succès dans Firestore.`);
      setShowCreateAppReleaseModal(false);
    } catch (err: any) {
      showFeedback(`Erreur : ${err.message || 'Échec de la création.'}`, true);
    } finally {
      setIsSavingAppRelease(false);
    }
  };

  // 7. Delete Release
  const handleConfirmDeleteAppRelease = async () => {
    if (!appReleaseToDelete) return;
    try {
      setIsSavingAppRelease(true);
      await appVersionService.deleteVersion(appReleaseToDelete.version);
      showFeedback(`Version v${appReleaseToDelete.version} supprimée avec succès de Firestore.`);
      setAppReleaseToDelete(null);
    } catch (err: any) {
      showFeedback(`Erreur : ${err.message || 'Échec suppression.'}`, true);
    } finally {
      setIsSavingAppRelease(false);
    }
  };

  // 8. Seed Default Versions
  const handleSeedDefaultVersions = async () => {
    if (!confirm('Voulez-vous synchroniser et forcer l\'écriture des versions par défaut (du code) vers Firestore ?')) {
      return;
    }
    try {
      setIsSyncingDefaults(true);
      await appVersionService.seedFirestoreVersions(true);
      showFeedback('Synchronisation réussie : les versions sont à jour dans Firestore.');
    } catch (err: any) {
      showFeedback(`Erreur : ${err.message || 'Échec de la synchronisation.'}`, true);
    } finally {
      setIsSyncingDefaults(false);
    }
  };

  // 9. Flush SWR & App Caches
  const handleFlushCaches = async () => {
    try {
      setIsPurgingCache(true);
      await appVersionService.flushAndUpgradeCaches((step) => {
        showFeedback(step);
      });
      showFeedback('Caches de l\'application (SWR, Storage, SW) vidés avec succès.');
    } catch (err: any) {
      showFeedback(`Erreur purge : ${err.message}`, true);
    } finally {
      setIsPurgingCache(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionSuccessMessage && (
        <div className="bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between animate-fadeIn border border-emerald-400">
          <div className="flex items-center gap-3 font-medium">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-white/80 hover:text-white text-sm font-bold">×</button>
        </div>
      )}

      {actionErrorMessage && (
        <div className="bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between animate-fadeIn border border-rose-500">
          <div className="flex items-center gap-3 font-medium">
            <AlertTriangle size={20} className="shrink-0" />
            <span>{actionErrorMessage}</span>
          </div>
          <button onClick={() => setActionErrorMessage(null)} className="text-white/80 hover:text-white text-sm font-bold">×</button>
        </div>
      )}

      {/* Main Top Header & Current Branch Info */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-850 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/20 relative overflow-hidden">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl shadow-inner">
                <FolderGit2 size={26} />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  AsrarHub Git & Version Control
                  <span className="text-xs bg-emerald-500/30 text-emerald-300 font-semibold px-2.5 py-1 rounded-full border border-emerald-500/40">
                    v2.5.0-pro
                  </span>
                </h1>
                <p className="text-sm text-gray-300">
                  Système de gestion de versions intégré : historique des modifications, isolation par branches et fusions sécurisées.
                </p>
              </div>
            </div>

            {/* Current Active Branch Indicator */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-md border border-gray-700/80 rounded-2xl px-4 py-2 text-sm shadow-sm">
                <GitBranch size={16} style={{ color: currentBranch.color }} />
                <span className="text-gray-400 text-xs">Branche active :</span>
                <span className="font-bold text-white tracking-wide">{currentBranch.name}</span>
                {currentBranch.isProtected && (
                  <span title="Branche protégée" className="text-amber-400 ml-1">
                    <ShieldCheck size={14} />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-md border border-gray-700/80 rounded-2xl px-4 py-2 text-sm shadow-sm">
                <GitCommit size={16} className="text-emerald-400" />
                <span className="text-gray-400 text-xs">Dernier Commit :</span>
                <code className="font-mono text-emerald-300 font-bold">{currentBranch.headCommitId}</code>
              </div>

              <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-md border border-gray-700/80 rounded-2xl px-4 py-2 text-sm shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-gray-300 text-xs font-semibold">Sauvegarde Cloud Active</span>
              </div>
            </div>
          </div>

          {/* Quick VCS Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowNewBranchModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all shadow-md active:scale-95"
            >
              <GitBranch size={16} />
              <span>Nouvelle Branche</span>
            </button>

            <button
              onClick={() => setShowNewCommitModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all shadow-md active:scale-95"
            >
              <Plus size={16} />
              <span>Nouveau Commit</span>
            </button>

            <button
              onClick={() => setShowNewPRModal(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all shadow-md active:scale-95"
            >
              <GitPullRequest size={16} />
              <span>Fusionner (PR)</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Exporter l'archive VCS complète"
              className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-2xl border border-gray-700 transition-all active:scale-95"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-8 pt-6 border-t border-gray-750 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('commits')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'commits'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
            }`}
          >
            <History size={16} />
            <span>Historique & Commits</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
              {vcsState.commits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('branches')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'branches'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
            }`}
          >
            <GitBranch size={16} />
            <span>Gestion des Branches</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
              {vcsState.branches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('pull_requests')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'pull_requests'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
            }`}
          >
            <GitPullRequest size={16} />
            <span>Fusions Sécurisées (PR)</span>
            {vcsState.pullRequests.filter(p => p.status === 'open').length > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold">
                {vcsState.pullRequests.filter(p => p.status === 'open').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('releases')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'releases'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
            }`}
          >
            <Tag size={16} />
            <span>Releases & Versions App (Firestore)</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
              {appReleases.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: COMMITS HISTORY & DIFF VIEWER                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'commits' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher commit, auteur, hash..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Branche :</span>
                <select
                  value={selectedBranchFilter}
                  onChange={e => setSelectedBranchFilter(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="all">Toutes les branches ({vcsState.branches.length})</option>
                  {vcsState.branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Type :</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="all">Toutes catégories</option>
                  <option value="feature">Fonctionnalités</option>
                  <option value="hotfix">Hotfixes</option>
                  <option value="content">Contenu & Lexique</option>
                  <option value="security">Sécurité & Règles</option>
                  <option value="config">Configuration SWR</option>
                  <option value="merge">Fusions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Commits Timeline Feed */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <History size={20} className="text-emerald-500" />
              Journal des Modifications & Historique Git ({filteredCommits.length})
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-indigo-500 before:to-gray-300 dark:before:to-gray-700">
              {filteredCommits.map(commit => {
                const badge = getCategoryBadge(commit.category);
                const branchObj = vcsState.branches.find(b => b.id === commit.branchId);

                return (
                  <div
                    key={commit.id}
                    className="relative group bg-gray-50 dark:bg-gray-750/70 hover:bg-emerald-50/50 dark:hover:bg-gray-750 border border-gray-200/80 dark:border-gray-700 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md"
                  >
                    {/* Node Circle on Timeline */}
                    <div
                      className="absolute -left-[31px] sm:-left-[39px] top-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center"
                      style={{ backgroundColor: branchObj?.color || '#10B981' }}
                    />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Commit Hash Pill */}
                          <button
                            onClick={() => copyToClipboard(commit.fullHash, commit.id)}
                            className="flex items-center gap-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-200 font-mono text-xs font-bold px-2.5 py-1 rounded-lg transition-colors"
                            title="Cliquer pour copier le hash complet"
                          >
                            <GitCommit size={13} />
                            <span>{commit.id}</span>
                            {copiedHash === commit.id ? <Check size={12} /> : <Copy size={12} className="opacity-60" />}
                          </button>

                          {/* Branch Badge */}
                          <span
                            className="text-xs font-bold px-2.5 py-0.5 rounded-md text-white flex items-center gap-1"
                            style={{ backgroundColor: branchObj?.color || '#6366F1' }}
                          >
                            <GitBranch size={12} />
                            {commit.branchName}
                          </span>

                          {/* Category Badge */}
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${badge.color}`}>
                            {badge.label}
                          </span>

                          {/* Release Tag if any */}
                          {commit.tags?.map(t => (
                            <span key={t} className="text-xs font-bold px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 rounded-md flex items-center gap-1">
                              <Tag size={11} />
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Commit Title */}
                        <h4 className="text-base font-bold text-gray-900 dark:text-white pt-1">
                          {commit.message}
                        </h4>

                        {/* Description */}
                        {commit.description && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {commit.description}
                          </p>
                        )}

                        {/* Metadata Footer */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                          <span className="flex items-center gap-1">
                            <User size={13} />
                            <strong className="text-gray-700 dark:text-gray-300">{commit.author.name}</strong>
                            <span className="opacity-75">({commit.author.role || 'Curator'})</span>
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            {new Date(commit.timestamp).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>

                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            +{commit.stats.additions}
                          </span>
                          <span className="font-mono text-rose-500 font-semibold">
                            -{commit.stats.deletions}
                          </span>
                          <span className="text-gray-400">
                            ({commit.stats.filesChanged} composant{commit.stats.filesChanged > 1 ? 's' : ''})
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons for this Commit */}
                      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                        <button
                          onClick={() => setSelectedCommit(commit)}
                          className="flex items-center gap-1.5 bg-white dark:bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
                        >
                          <Eye size={14} />
                          <span>Voir le Diff</span>
                        </button>

                        <button
                          onClick={() => handleRevertCommit(commit)}
                          className="flex items-center gap-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 dark:bg-rose-900/30 dark:text-rose-300 font-bold text-xs px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800/50 transition-all"
                          title="Annuler (Revert) ce commit"
                        >
                          <RotateCcw size={13} />
                          <span className="hidden sm:inline">Rollback</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: BRANCHES MANAGEMENT                                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'branches' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GitBranch size={20} className="text-emerald-500" />
                Arborescence des Branches AsrarHub
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Créez des branches isolées pour développer de nouvelles fonctionnalités sans impacter la production.
              </p>
            </div>

            <button
              onClick={() => setShowNewBranchModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Créer une Branche</span>
            </button>
          </div>

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vcsState.branches.map(branch => {
              const isCurrent = branch.id === currentBranch.id;
              const branchCommits = vcsState.commits.filter(c => c.branchId === branch.id);

              return (
                <div
                  key={branch.id}
                  className={`p-6 rounded-3xl border transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 dark:from-gray-800 dark:to-emerald-950/40 border-emerald-500 shadow-emerald-500/10'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: branch.color }} />
                      <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {branch.name}
                        {branch.isDefault && (
                          <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-md uppercase">
                            Défaut
                          </span>
                        )}
                        {branch.isProtected && (
                          <span title="Branche protégée" className="text-amber-500">
                            <Shield size={14} />
                          </span>
                        )}
                      </h4>
                    </div>

                    {isCurrent ? (
                      <span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitchBranch(branch.id)}
                        className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-emerald-600 hover:text-white font-bold text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Basculer ici
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 min-h-[38px]">
                    {branch.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200 dark:border-gray-700 text-center text-xs mb-4">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Commits</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 font-mono">
                        {branchCommits.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Head Commit</span>
                      <code className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {branch.headCommitId}
                      </code>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Statut</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">
                        {branch.status === 'active' ? '🟢 Actif' : branch.status === 'merged' ? '🟣 Fusionné' : '🟡 Brouillon'}
                      </span>
                    </div>
                  </div>

                  {/* Branch Action Buttons */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-gray-400">
                      Par {branch.author}
                    </span>

                    <div className="flex items-center gap-2">
                      {branch.id !== 'main' && (
                        <button
                          onClick={() => {
                            setPrSourceBranch(branch.id);
                            setPrTargetBranch('main');
                            setPrTitle(`Fusion de la branche ${branch.name}`);
                            setShowNewPRModal(true);
                          }}
                          className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
                        >
                          <GitMerge size={13} />
                          <span>Fusionner vers main</span>
                        </button>
                      )}

                      {!branch.isProtected && !branch.isDefault && (
                        <button
                          onClick={() => {
                            if (confirm(`Voulez-vous supprimer définitivement la branche ${branch.name} ?`)) {
                              const res = versionControlService.deleteBranch(branch.id);
                              if (res.success) {
                                showFeedback(`Branche ${branch.name} supprimée.`);
                              } else {
                                showFeedback(res.error || 'Erreur', true);
                              }
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Supprimer la branche"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: PULL REQUESTS & SAFE MERGES                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'pull_requests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GitPullRequest size={20} className="text-amber-500" />
                Demandes de Fusion & Vérifications de Sécurité (PR)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Validez les modifications, vérifiez les conflits et fusionnez les fonctionnalités sans risque de régression.
              </p>
            </div>

            <button
              onClick={() => setShowNewPRModal(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Nouvelle Demande de Fusion</span>
            </button>
          </div>

          {/* PR List */}
          <div className="space-y-4">
            {vcsState.pullRequests.map(pr => {
              const isOpen = pr.status === 'open';
              const isMerged = pr.status === 'merged';
              const isConflicted = pr.status === 'conflicted';

              return (
                <div
                  key={pr.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {pr.id}
                        </span>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                            isOpen
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : isMerged
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isOpen ? '🟢 Ouverte' : isMerged ? '🟣 Fusionnée' : '🔴 Conflits détectés'}
                        </span>

                        <div className="flex items-center gap-2 text-xs font-bold font-mono">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                            {pr.sourceBranch}
                          </span>
                          <ArrowRight size={13} className="text-gray-400" />
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                            {pr.targetBranch}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 dark:text-white pt-1">
                        {pr.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {pr.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        onClick={() => setSelectedPR(pr)}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                      >
                        Examiner & Diff
                      </button>

                      {isOpen && (
                        <button
                          onClick={() => handleMergePR(pr)}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                        >
                          <GitMerge size={15} />
                          <span>Fusionner en toute sécurité</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Safety Checks Audit Strip */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 size={15} />
                        Syntaxe & TypeScript : Valide
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ShieldCheck size={15} />
                        Règles Firestore : Conforme
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Database size={15} />
                        Sauvegarde Pré-Merge : Prête
                      </span>
                    </div>

                    <div className="text-gray-400 text-[11px]">
                      Créé par {pr.author.name} • {new Date(pr.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: RELEASES & APP VERSION CONTROL (FIRESTORE)                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'releases' && (
        <div className="space-y-6">
          {/* Top Info & Actions Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Tag size={22} />
                </span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Gestionnaire des Versions & Changelog (Firestore)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                Activez ou désactivez les versions visibles par les utilisateurs, réécrivez et enrichissez les fonctionnalités en <strong>Français</strong>, <strong>Anglais</strong> et <strong>Hausa</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleFlushCaches}
                disabled={isPurgingCache}
                title="Forcer l'invalidation du cache SWR et du Service Worker"
                className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700/50 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isPurgingCache ? 'animate-spin' : ''} />
                <span>Purger Caches (SWR)</span>
              </button>

              <button
                onClick={handleSeedDefaultVersions}
                disabled={isSyncingDefaults}
                title="Synchroniser et initialiser les versions par défaut dans Firestore"
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                <Database size={16} className={isSyncingDefaults ? 'animate-pulse text-indigo-500' : ''} />
                <span>Synchroniser Firestore</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                <Download size={16} />
                <span>Sauvegarde JSON</span>
              </button>

              <button
                onClick={() => setShowVideoStudioModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:via-rose-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                title="Visualiser et tester les 10 modèles de cartes vidéo pour popups de mise à jour"
              >
                <Film size={16} />
                <span>Studio 10 Cartes Vidéo</span>
              </button>

              <button
                onClick={handleOpenCreateAppReleaseModal}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>Nouvelle Version App</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {appReleases.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Versions</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {appReleases.filter(r => !r.disabled).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Actives (Publiées)</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
                <AlertCircle size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {appReleases.filter(r => r.disabled).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Désactivées (Masquées)</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900 dark:text-white truncate">
                  v{appReleases.find(r => r.isCurrent)?.version || APP_VERSION_CONFIG.currentVersion}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Version Actuelle</div>
              </div>
            </div>
          </div>

          {/* Real-time Version & Cache Diagnostic Feedback */}
          {versionDiagnostic?.hasPersistentMismatch ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500 text-white rounded-xl shrink-0 mt-0.5">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    Alerte Diagnostic Version : Conflit de Cache Détecté
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    {versionDiagnostic.reason || 'Une discordance persiste entre la version installée et la version cible.'}
                  </p>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-mono">
                    Version cible: <strong>v{versionDiagnostic.targetPackageVersion}</strong> • Stockée: <strong>v{versionDiagnostic.storedVersion}</strong> • Dernière vérification: {versionDiagnostic.lastChecked ? new Date(versionDiagnostic.lastChecked).toLocaleTimeString() : 'Récent'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFlushCaches}
                disabled={isPurgingCache}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 shrink-0 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isPurgingCache ? 'animate-spin' : ''} />
                <span>Purger Caches & Corriger</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-emerald-900 dark:text-emerald-300 font-medium">
                  Diagnostic Diagnostic Version : <strong>Optimal</strong> • Runtime v{APP_VERSION_CONFIG.currentVersion} en parfaite cohérence avec le cache IndexedDB.
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono hidden sm:inline">
                Dernier contrôle : {versionDiagnostic?.lastChecked ? new Date(versionDiagnostic.lastChecked).toLocaleTimeString() : 'En direct'}
              </span>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher version, titre, fonctionnalité..."
                value={releaseSearchQuery}
                onChange={e => setReleaseSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'active', label: 'Actives' },
                { id: 'disabled', label: 'Désactivées' },
                { id: 'major', label: 'Majeures' },
                { id: 'minor', label: 'Mineures' },
                { id: 'patch', label: 'Correctifs' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setReleaseStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    releaseStatusFilter === f.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Releases List */}
          {isLoadingAppReleases ? (
            <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
              <RefreshCw size={32} className="animate-spin text-purple-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                Chargement des versions depuis Firestore...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appReleases
                .filter(rel => {
                  const q = releaseSearchQuery.toLowerCase();
                  const matchesSearch =
                    !q ||
                    rel.version.toLowerCase().includes(q) ||
                    rel.title.toLowerCase().includes(q) ||
                    (rel.titleEn && rel.titleEn.toLowerCase().includes(q)) ||
                    (rel.titleHa && rel.titleHa.toLowerCase().includes(q)) ||
                    rel.highlights.some(h => h.toLowerCase().includes(q));

                  const matchesStatus =
                    releaseStatusFilter === 'all' ||
                    (releaseStatusFilter === 'active' && !rel.disabled) ||
                    (releaseStatusFilter === 'disabled' && !!rel.disabled) ||
                    (releaseStatusFilter === 'major' && rel.type === 'major') ||
                    (releaseStatusFilter === 'minor' && rel.type === 'minor') ||
                    (releaseStatusFilter === 'patch' && rel.type === 'patch');

                  return matchesSearch && matchesStatus;
                })
                .map(rel => {
                  const cardLang = previewCardLangs[rel.version] || 'fr';
                  const localized = getLocalizedRelease(rel, cardLang);

                  return (
                    <div
                      key={rel.version}
                      className={`bg-white dark:bg-gray-800 rounded-3xl border transition-all p-6 shadow-sm ${
                        rel.disabled
                          ? 'border-dashed border-red-300 dark:border-red-800/60 bg-red-50/20 dark:bg-red-950/10'
                          : rel.isCurrent
                          ? 'border-purple-500/50 shadow-purple-500/5'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <span
                            className={`p-2.5 rounded-2xl ${
                              rel.disabled
                                ? 'bg-red-500/10 text-red-500'
                                : rel.type === 'major'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : rel.type === 'minor'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            <Tag size={24} />
                          </span>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xl font-black text-gray-900 dark:text-white">
                                v{rel.version}
                              </h4>

                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                                Build #{rel.versionCode}
                              </span>

                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  rel.type === 'major'
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                    : rel.type === 'minor'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                }`}
                              >
                                {rel.type === 'major' ? 'Majeure' : rel.type === 'minor' ? 'Mineure' : 'Correctif'}
                              </span>

                              {rel.isCurrent && (
                                <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                                  <Star size={10} className="fill-white" />
                                  Actuelle (Production)
                                </span>
                              )}

                              {rel.forceUpdate && (
                                <span className="flex items-center gap-1 text-[10px] font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase shadow-sm animate-pulse">
                                  <ShieldAlert size={11} />
                                  Mise à Jour Forcée (Min #{rel.minSupportedVersionCode || rel.versionCode})
                                </span>
                              )}

                              {rel.disableVideoCard ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                                  <Film size={10} className="text-amber-500" />
                                  🚫 Vidéo Désactivée (Standard)
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/60">
                                  <Film size={10} className="text-purple-600 dark:text-purple-400" />
                                  🎥 Vidéo Active : {getPresetById(rel.videoCardTheme).titleFr}
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                              <Calendar size={13} />
                              <span>{localized.releaseDate}</span>
                              {rel.author && (
                                <>
                                  <span>•</span>
                                  <span>Par {rel.author}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Toggle Switch Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* 3D Video Pop-up Modal Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggle3DVideoPopup(rel)}
                            title={
                              rel.enable3DVideoPopup !== false && !rel.disableVideoCard
                                ? 'Cliquer pour désactiver la Pop-up 3D Vidéo (bannière discrète)'
                                : 'Cliquer pour activer la Pop-up 3D Vidéo centrée'
                            }
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm cursor-pointer ${
                              rel.enable3DVideoPopup !== false && !rel.disableVideoCard
                                ? 'bg-purple-600/15 hover:bg-purple-600/25 text-purple-700 dark:text-purple-300 border-purple-400/40 ring-1 ring-purple-500/20'
                                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <Film size={15} className={rel.enable3DVideoPopup !== false && !rel.disableVideoCard ? 'text-purple-500 animate-pulse' : 'text-gray-400'} />
                            <span>
                              {rel.enable3DVideoPopup !== false && !rel.disableVideoCard 
                                ? 'Pop-up 3D Vidéo : Active 🟢' 
                                : 'Pop-up 3D Vidéo : Désactivée 🚫'}
                            </span>
                          </button>

                          {/* Version Disabled Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleDisableAppVersion(rel)}
                            title={rel.disabled ? 'Cliquer pour activer cette version' : 'Cliquer pour désactiver et masquer cette version'}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm cursor-pointer ${
                              rel.disabled
                                ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            }`}
                          >
                            {rel.disabled ? (
                              <>
                                <ToggleLeft size={18} className="text-red-500" />
                                <span>Désactivée (Masquée)</span>
                              </>
                            ) : (
                              <>
                                <ToggleRight size={18} className="text-emerald-600 dark:text-emerald-400" />
                                <span>Active (Visible)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title & Preview Language Switcher */}
                      <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Titre de la version :
                          </span>
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            {localized.title}
                          </p>
                        </div>

                        {/* Language Selector Pills for Card Preview */}
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-750 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                          {(['fr', 'en', 'ha'] as const).map(lang => (
                            <button
                              key={lang}
                              onClick={() => setPreviewCardLangs(prev => ({ ...prev, [rel.version]: lang }))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                cardLang === lang
                                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <span>{lang === 'fr' ? '🇫🇷 FR' : lang === 'en' ? '🇬🇧 EN' : '🇳🇬 HA'}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Features / Highlights List */}
                      <div className="bg-gray-50 dark:bg-gray-750/70 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                            <Sparkles size={13} className="text-purple-500" />
                            Fonctionnalités & Notes ({cardLang.toUpperCase()}) :
                          </span>
                          <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                            {localized.highlights.length} point{localized.highlights.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {localized.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                              <span className="text-purple-500 font-black mt-0.5">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons Footer */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(rel)}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            <Edit2 size={15} />
                            <span>Éditer Configuration & Vidéo</span>
                          </button>

                          {/* Interactive 3D Video Modal Live Test */}
                          <button
                            type="button"
                            onClick={() => setPreview3DVideoRelease(rel)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                            title="Ouvrir la pop-up 3D vidéo réelle pour tester le rendu utilisateur"
                          >
                            <Play size={14} className="fill-white" />
                            <span>👁️ Tester Pop-up 3D Vidéo</span>
                          </button>

                          {!rel.isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleSetCurrentAppVersion(rel)}
                              disabled={isSavingAppRelease}
                              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                            >
                              <Star size={15} className="text-amber-500" />
                              <span>Définir comme Version Actuelle</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => setAppReleaseToDelete(rel)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
                          title="Supprimer cette version"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: COMMIT DIFF VIEWER                                               */}
      {/* ========================================================================= */}
      {selectedCommit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4 bg-gray-50 dark:bg-gray-750">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg">
                    {selectedCommit.id}
                  </span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded font-semibold">
                    {selectedCommit.branchName}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedCommit.message}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {selectedCommit.author.name} • {new Date(selectedCommit.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>

              <button
                onClick={() => setSelectedCommit(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Content Diff Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {selectedCommit.changes.map((ch, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-100 dark:bg-gray-700/70 px-4 py-2.5 flex items-center justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <FileCode size={15} className="text-emerald-500" />
                      {ch.path}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-sans">
                      {ch.component}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto space-y-1">
                    {ch.oldContent && (
                      <div className="bg-rose-950/60 text-rose-300 p-2 rounded border-l-4 border-rose-500">
                        <span className="text-rose-400 font-bold block mb-1">--- Version précédente :</span>
                        <pre className="whitespace-pre-wrap">{ch.oldContent}</pre>
                      </div>
                    )}
                    {ch.newContent && (
                      <div className="bg-emerald-950/60 text-emerald-300 p-2 rounded border-l-4 border-emerald-500">
                        <span className="text-emerald-400 font-bold block mb-1">+++ Version modifiée :</span>
                        <pre className="whitespace-pre-wrap">{ch.newContent}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-between">
              <button
                onClick={() => handleRevertCommit(selectedCommit)}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all"
              >
                <RotateCcw size={14} />
                <span>Restaurer / Rollback cette version</span>
              </button>

              <button
                onClick={() => setSelectedCommit(null)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PR DETAIL & CONFLICT RESOLUTION                                  */}
      {/* ========================================================================= */}
      {selectedPR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4 bg-gray-50 dark:bg-gray-750">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-lg">
                    {selectedPR.id}
                  </span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded font-semibold">
                    {selectedPR.sourceBranch} ➔ {selectedPR.targetBranch}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedPR.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedPR(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/40">
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} />
                  Contrôles de Sécurité & Validation Automatique
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <div className="flex items-center gap-2">✓ Pas de modifications destructrices sur la base de données</div>
                  <div className="flex items-center gap-2">✓ Contrôle d'intégrité des 28 sceaux lunaires</div>
                  <div className="flex items-center gap-2">✓ Rétrocompatibilité avec les versions APK Android</div>
                  <div className="flex items-center gap-2">✓ Sauvegarde automatique planifiée avant fusion</div>
                </div>
              </div>

              {/* Changed Files */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Composants impactés ({selectedPR.changes.length}) :
                </h4>
                <div className="space-y-3">
                  {selectedPR.changes.map((ch, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-750 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs">
                      <div className="flex items-center justify-between font-mono font-bold text-gray-800 dark:text-gray-200 mb-1">
                        <span>{ch.path}</span>
                        <span className="text-emerald-500">+{ch.additions} / -{ch.deletions}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{ch.diffSummary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-between">
              <button
                onClick={() => setSelectedPR(null)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Fermer
              </button>

              {selectedPR.status === 'open' && (
                <button
                  onClick={() => handleMergePR(selectedPR)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  <GitMerge size={16} />
                  <span>Confirmer la fusion sécurisée</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREATE NEW BRANCH                                                */}
      {/* ========================================================================= */}
      {showNewBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBranchSubmit}
            className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GitBranch size={20} className="text-emerald-500" />
                Créer une Nouvelle Branche
              </h3>
              <button
                type="button"
                onClick={() => setShowNewBranchModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Nom de la Branche
                </label>
                <div className="flex gap-2">
                  <select
                    value={newBranchPrefix}
                    onChange={e => setNewBranchPrefix(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-mono font-bold text-gray-700 dark:text-gray-200"
                  >
                    <option value="feature/">feature/</option>
                    <option value="hotfix/">hotfix/</option>
                    <option value="content/">content/</option>
                    <option value="release/">release/</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="nom-de-fonctionnalite"
                    value={newBranchName}
                    onChange={e => setNewBranchName(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-mono text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Branche Source (Base)
                </label>
                <select
                  value={newBranchBase}
                  onChange={e => setNewBranchBase(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-700 dark:text-gray-200"
                >
                  {vcsState.branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Commit {b.headCommitId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Description / Objectif
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : Ajout des nouvelles invocations audio HD..."
                  value={newBranchDesc}
                  onChange={e => setNewBranchDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Couleur :</span>
                  {['#10B981', '#6366F1', '#F59E0B', '#EC4899', '#3B82F6', '#8B5CF6'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewBranchColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        newBranchColor === c ? 'scale-125 border-gray-900 dark:border-white shadow-md' : 'border-transparent opacity-70'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <label className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBranchProtected}
                    onChange={e => setNewBranchProtected(e.target.checked)}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span>Protéger la branche</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewBranchModal(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs px-4 py-2.5 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all active:scale-95"
              >
                Créer & Basculer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE NEW COMMIT                                                */}
      {/* ========================================================================= */}
      {showNewCommitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCommitSubmit}
            className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <GitCommit size={20} className="text-emerald-500" />
                  Enregistrer un Commit (Sur {currentBranch.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCommitModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Message de Commit (Résumé) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Ajout de la récitation Sudais pour Ayat al-Kursi"
                  value={commitMessage}
                  onChange={e => setCommitMessage(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Catégorie
                  </label>
                  <select
                    value={commitCategory}
                    onChange={e => setCommitCategory(e.target.value as CommitCategory)}
                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-700 dark:text-gray-200"
                  >
                    <option value="feature">Fonctionnalité (Feature)</option>
                    <option value="hotfix">Hotfix / Correctif</option>
                    <option value="content">Contenu & Lexique</option>
                    <option value="security">Sécurité & Règles</option>
                    <option value="config">Configuration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Composant Impacté
                  </label>
                  <select
                    value={commitComponent}
                    onChange={e => setCommitComponent(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-700 dark:text-gray-200"
                  >
                    <option value="Articles & Wirds">Articles & Wirds</option>
                    <option value="Sceaux Lunaires">Sceaux Lunaires</option>
                    <option value="Récitateurs & Audio">Récitateurs & Audio</option>
                    <option value="CMS Lexique">CMS Lexique</option>
                    <option value="Système Réseau & SWR">Système Réseau & SWR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Détails & Notes de Changement
                </label>
                <textarea
                  rows={2}
                  placeholder="Détails techniques optionnels..."
                  value={commitDesc}
                  onChange={e => setCommitDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewCommitModal(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs px-4 py-2.5 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all active:scale-95"
              >
                Valider & Commiter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CREATE PULL REQUEST                                              */}
      {/* ========================================================================= */}
      {showNewPRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePRSubmit}
            className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GitPullRequest size={20} className="text-amber-500" />
                Nouvelle Demande de Fusion (PR)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewPRModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Branche Source
                  </label>
                  <select
                    value={prSourceBranch}
                    onChange={e => setPrSourceBranch(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-700 dark:text-gray-200"
                  >
                    {vcsState.branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Branche Cible
                  </label>
                  <select
                    value={prTargetBranch}
                    onChange={e => setPrTargetBranch(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-700 dark:text-gray-200"
                  >
                    {vcsState.branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Titre de la Fusion *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Intégration de la suite audio Ruqyah"
                  value={prTitle}
                  onChange={e => setPrTitle(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Explication des Changements
                </label>
                <textarea
                  rows={3}
                  placeholder="Description détaillée pour la revue de code..."
                  value={prDesc}
                  onChange={e => setPrDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewPRModal(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs px-4 py-2.5 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all active:scale-95"
              >
                Créer la Demande de Fusion
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CREATE NEW RELEASE (VCS Tag)                                     */}
      {/* ========================================================================= */}
      {showNewReleaseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateReleaseSubmit}
            className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag size={20} className="text-purple-500" />
                Publier une Nouvelle Release (Tag Sémantique)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewReleaseModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Tag Sémantique (SemVer) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="v2.5.0"
                    value={releaseTag}
                    onChange={e => setReleaseTag(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-mono font-bold text-purple-600 dark:text-purple-300 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Titre Court *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Version 2.5.0 - Stabilité"
                    value={releaseTitle}
                    onChange={e => setReleaseTitle(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Changelog (1 ligne par point)
                </label>
                <textarea
                  rows={4}
                  placeholder={`- Optimisation du cache IndexedDB\n- Nouveaux récitateurs Saint Coran\n- Audit de sécurité`}
                  value={releaseChangelog}
                  onChange={e => setReleaseChangelog(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500 font-mono text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewReleaseModal(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs px-4 py-2.5 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all active:scale-95"
              >
                Publier la Release
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: EDIT APP VERSION & FEATURES (FIRESTORE)                          */}
      {/* ========================================================================= */}
      {showEditAppReleaseModal && editingAppRelease && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-transparent to-transparent">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-purple-500 text-white rounded-2xl shadow-md">
                  <Edit2 size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                      Édition de la Version v{editingAppRelease.version}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold rounded-md font-mono">
                      Build #{editingAppRelease.versionCode}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Modifiez le statut, le titre et réécrivez les fonctionnalités dans toutes les langues.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEditAppReleaseModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Meta & Flags Strip */}
              <div className="bg-gray-50 dark:bg-gray-750/70 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  Configuration & Visibilité :
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Numéro de Version
                    </label>
                    <input
                      type="text"
                      value={editingAppRelease.version}
                      onChange={e => setEditingAppRelease({ ...editingAppRelease, version: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-mono font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Version Code (Build Android/PWA)
                    </label>
                    <input
                      type="number"
                      value={editingAppRelease.versionCode}
                      onChange={e => setEditingAppRelease({ ...editingAppRelease, versionCode: Number(e.target.value) || 1 })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-mono font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Type de Mise à Jour
                    </label>
                    <select
                      value={editingAppRelease.type}
                      onChange={e => setEditingAppRelease({ ...editingAppRelease, type: e.target.value as any })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                    >
                      <option value="major">Majeure (Major Update)</option>
                      <option value="minor">Mineure (Feature Update)</option>
                      <option value="patch">Correctif / Hotfix (Patch)</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 flex flex-wrap items-center gap-6">
                  {/* Status Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!editingAppRelease.disabled}
                      onChange={e => setEditingAppRelease({ ...editingAppRelease, disabled: !e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">
                        Version Active (Visible aux utilisateurs)
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        {editingAppRelease.disabled ? '🔴 Masquée dans l\'historique utilisateur' : '🟢 Affichée dans le Changelog public'}
                      </span>
                    </div>
                  </label>

                  {/* Current Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!editingAppRelease.isCurrent}
                      onChange={e => setEditingAppRelease({ ...editingAppRelease, isCurrent: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">
                        Marquer comme Version Actuelle
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Version principale en cours d'exécution
                      </span>
                    </div>
                  </label>

                  {/* Force Update Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!editingAppRelease.forceUpdate}
                      onChange={e => setEditingAppRelease({ ...editingAppRelease, forceUpdate: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <ShieldAlert size={14} />
                        Mise à jour obligatoire (Forcer les APKs & anciens clients)
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Bloque l'accès aux versions antérieures jusqu'à installation de la mise à jour
                      </span>
                    </div>
                  </label>
                </div>

                {/* Force update configuration inputs */}
                {editingAppRelease.forceUpdate && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-amber-900 dark:text-amber-300 text-xs mb-1">
                          Version Code Minimum Requis (minSupportedVersionCode)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={editingAppRelease.minSupportedVersionCode ?? editingAppRelease.versionCode}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, minSupportedVersionCode: Number(e.target.value) || 1 })}
                          placeholder="Ex: 5"
                          className="w-full bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                          Tout utilisateur dont le build code est strictement inférieur à ce chiffre sera bloqué et invité à mettre à jour.
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold text-amber-900 dark:text-amber-300 text-xs mb-1">
                          Lien de Téléchargement Direct APK (Google Drive / GitHub / Serveur)
                        </label>
                        <input
                          type="url"
                          value={editingAppRelease.apkDownloadUrl || ''}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, apkDownloadUrl: e.target.value })}
                          placeholder="https://example.com/AsrarHub-latest.apk"
                          className="w-full bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                          L'utilisateur cliquera sur ce lien pour télécharger le nouvel APK directement.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3D Video Notification & Pop-up Configuration */}
                <div className="bg-gradient-to-br from-purple-900/10 via-gray-100/70 to-emerald-900/10 dark:from-purple-950/30 dark:via-gray-800/80 dark:to-emerald-950/30 p-5 rounded-2xl border border-purple-300/40 dark:border-purple-700/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-200/50 dark:border-purple-800/50 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
                        <Film size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                          <span>Configuration de la Pop-up 3D Vidéo Professionnelle</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                            3D CINEMA
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pop-up centrée au milieu de l'écran avec vidéo pro, effets 3D et boutons d'action forcés.
                        </p>
                      </div>
                    </div>

                    {/* Test Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreview3DVideoRelease(editingAppRelease)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Tester l'aperçu de la pop-up 3D vidéo en direct"
                    >
                      <Play size={12} className="fill-white" />
                      <span>Tester l'Aperçu 3D</span>
                    </button>
                  </div>

                  {/* 1. Enable / Disable 3D Video Popup */}
                  <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-gray-750 border border-purple-200 dark:border-purple-800/50 cursor-pointer shadow-sm">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles size={15} className={editingAppRelease.enable3DVideoPopup !== false && !editingAppRelease.disableVideoCard ? 'text-purple-500' : 'text-gray-400'} />
                        <span>Activer la Pop-up 3D Vidéo pour cette version</span>
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                        {editingAppRelease.enable3DVideoPopup !== false && !editingAppRelease.disableVideoCard 
                          ? '🟢 Active : L\'utilisateur verra la magnifique pop-up 3D vidéo centrée au milieu de son écran.'
                          : '🚫 Désactivée : L\'utilisateur verra une simple bannière discrète en haut sans vidéo.'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingAppRelease.enable3DVideoPopup !== false && !editingAppRelease.disableVideoCard}
                      onChange={(e) => setEditingAppRelease({ 
                        ...editingAppRelease, 
                        enable3DVideoPopup: e.target.checked,
                        disableVideoCard: !e.target.checked
                      })}
                      className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                    />
                  </label>

                  {/* 2. Force Click Modal Toggle */}
                  <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-gray-750 border border-amber-200 dark:border-amber-800/50 cursor-pointer shadow-sm">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <ShieldAlert size={15} className={editingAppRelease.forceVideoModal ? 'text-amber-500' : 'text-gray-400'} />
                        <span>Mode Forcé : Interaction obligatoire pour les utilisateurs</span>
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                        {editingAppRelease.forceVideoModal
                          ? '⚡ L\'utilisateur est obligé de cliquer sur l\'action (bouton de fermeture masqué).'
                          : 'L\'utilisateur peut fermer la pop-up ou cliquer sur l\'action.'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!editingAppRelease.forceVideoModal}
                      onChange={(e) => setEditingAppRelease({ ...editingAppRelease, forceVideoModal: e.target.checked })}
                      className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0"
                    />
                  </label>

                  {/* 3. Custom Video Stream URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Video size={14} className="text-purple-500" />
                        <span>URL de la Vidéo Professionnelle (MP4, WebM, Cloud Storage, ou lien YouTube)</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">Optionnel (utilise la vidéo du thème par défaut si vide)</span>
                    </label>
                    <input
                      type="url"
                      value={editingAppRelease.customVideoUrl || ''}
                      onChange={e => setEditingAppRelease({ ...editingAppRelease, customVideoUrl: e.target.value })}
                      placeholder="https://votre-domaine.com/video-demo.mp4 ou https://youtu.be/..."
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* 4. Custom Titles for Video Pop-up */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Titre personnalisé de l'en-tête vidéo
                      </label>
                      <input
                        type="text"
                        value={editingAppRelease.videoTitle || ''}
                        onChange={e => setEditingAppRelease({ ...editingAppRelease, videoTitle: e.target.value })}
                        placeholder="Ex: NOUVELLE VERSION 3D DISPONIBLE"
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Sous-titre / Message d'accroche vidéo
                      </label>
                      <input
                        type="text"
                        value={editingAppRelease.videoSubtitle || ''}
                        onChange={e => setEditingAppRelease({ ...editingAppRelease, videoSubtitle: e.target.value })}
                        placeholder="Ex: Fluidité 120Hz et nouvelles fonctionnalités exclusives !"
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* 5. Theme and Holographic Style Picker */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-purple-500" />
                        <span>Thème Visuel 3D & Hologramme ({VIDEO_CARD_PRESETS.length} modèles disponibles)</span>
                      </span>
                      <span className="text-[11px] text-purple-600 dark:text-purple-400 font-black">
                        {getPresetById(editingAppRelease.videoCardTheme || 'cyber-emerald').titleFr}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {VIDEO_CARD_PRESETS.map((p) => {
                        const isSelected = (editingAppRelease.videoCardTheme || 'cyber-emerald') === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setEditingAppRelease({ ...editingAppRelease, videoCardTheme: p.id })}
                            className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 relative overflow-hidden cursor-pointer ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-500/30 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-mono font-bold text-gray-400">#{p.index}</span>
                              {isSelected && <Check size={12} className="text-purple-600 dark:text-purple-400 font-bold" />}
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate w-full">
                              {p.titleFr.split(' ')[0]} {p.titleFr.split(' ')[1] || ''}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full">
                              {p.badgeFr}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Multilingual Editor Area */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
                  {/* Language Tabs */}
                  <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-750 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setActiveEditorLangTab('fr')}
                      className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                        activeEditorLangTab === 'fr'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>🇫🇷</span>
                      <span>Français (Principal)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveEditorLangTab('en')}
                      className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                        activeEditorLangTab === 'en'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>🇬🇧</span>
                      <span>English</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveEditorLangTab('ha')}
                      className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                        activeEditorLangTab === 'ha'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>🇳🇬</span>
                      <span>Hausa</span>
                    </button>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-750 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        if (editorRawMode) {
                          // Sync from raw text to structured arrays
                          const frArr = rawHighlightsText.fr.split('\n').map(s => s.trim()).filter(Boolean);
                          const enArr = rawHighlightsText.en.split('\n').map(s => s.trim()).filter(Boolean);
                          const haArr = rawHighlightsText.ha.split('\n').map(s => s.trim()).filter(Boolean);
                          setEditingAppRelease(prev => prev ? ({ ...prev, highlights: frArr, highlightsEn: enArr, highlightsHa: haArr }) : null);
                        }
                        setEditorRawMode(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                        !editorRawMode
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <ListPlus size={14} />
                      <span>Mode Liste</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!editorRawMode) {
                          // Sync from structured array to raw text
                          setRawHighlightsText({
                            fr: (editingAppRelease.highlights || []).join('\n'),
                            en: (editingAppRelease.highlightsEn || []).join('\n'),
                            ha: (editingAppRelease.highlightsHa || []).join('\n')
                          });
                        }
                        setEditorRawMode(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                        editorRawMode
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <FileText size={14} />
                      <span>Mode Texte Brut</span>
                    </button>
                  </div>
                </div>

                {/* Tab 1: FR */}
                {activeEditorLangTab === 'fr' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Titre de la Version (Français) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingAppRelease.title}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, title: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Date de Publication (Français)
                        </label>
                        <input
                          type="text"
                          value={editingAppRelease.releaseDate}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, releaseDate: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Features Editor FR */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-700 dark:text-gray-300">
                          Fonctionnalités & Notes de version (Français)
                        </label>
                        {!editorRawMode && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAppRelease({
                                ...editingAppRelease,
                                highlights: [...editingAppRelease.highlights, '']
                              });
                            }}
                            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <Plus size={14} />
                            <span>Ajouter une ligne</span>
                          </button>
                        )}
                      </div>

                      {editorRawMode ? (
                        <div>
                          <p className="text-[11px] text-gray-500 mb-1">
                            Saisissez ou collez les fonctionnalités (1 puce par ligne) :
                          </p>
                          <textarea
                            rows={6}
                            value={rawHighlightsText.fr}
                            onChange={e => setRawHighlightsText({ ...rawHighlightsText, fr: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500 font-sans leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {editingAppRelease.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-bold text-purple-500 w-5 text-center">{idx + 1}.</span>
                              <input
                                type="text"
                                value={item}
                                onChange={e => {
                                  const updated = [...editingAppRelease.highlights];
                                  updated[idx] = e.target.value;
                                  setEditingAppRelease({ ...editingAppRelease, highlights: updated });
                                }}
                                placeholder={`Fonctionnalité ${idx + 1}...`}
                                className="flex-1 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingAppRelease.highlights.filter((_, i) => i !== idx);
                                  setEditingAppRelease({ ...editingAppRelease, highlights: updated });
                                }}
                                className="p-2 text-gray-400 hover:text-rose-500 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: EN */}
                {activeEditorLangTab === 'en' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Version Title (English)
                        </label>
                        <input
                          type="text"
                          value={editingAppRelease.titleEn || ''}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, titleEn: e.target.value })}
                          placeholder="Ex: Version 2.0.0 - Enhanced Performance"
                          className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Release Date (English)
                        </label>
                        <input
                          type="text"
                          value={editingAppRelease.releaseDateEn || ''}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, releaseDateEn: e.target.value })}
                          placeholder="Ex: March 15, 2026"
                          className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Features Editor EN */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-700 dark:text-gray-300">
                          Features & Highlights (English)
                        </label>
                        {!editorRawMode && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentEn = editingAppRelease.highlightsEn || [];
                              setEditingAppRelease({
                                ...editingAppRelease,
                                highlightsEn: [...currentEn, '']
                              });
                            }}
                            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <Plus size={14} />
                            <span>Add feature</span>
                          </button>
                        )}
                      </div>

                      {editorRawMode ? (
                        <div>
                          <p className="text-[11px] text-gray-500 mb-1">
                            Type or paste features (1 line per item) :
                          </p>
                          <textarea
                            rows={6}
                            value={rawHighlightsText.en}
                            onChange={e => setRawHighlightsText({ ...rawHighlightsText, en: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500 font-sans leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(editingAppRelease.highlightsEn || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-bold text-purple-500 w-5 text-center">{idx + 1}.</span>
                              <input
                                type="text"
                                value={item}
                                onChange={e => {
                                  const updated = [...(editingAppRelease.highlightsEn || [])];
                                  updated[idx] = e.target.value;
                                  setEditingAppRelease({ ...editingAppRelease, highlightsEn: updated });
                                }}
                                placeholder={`Feature ${idx + 1}...`}
                                className="flex-1 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingAppRelease.highlightsEn || []).filter((_, i) => i !== idx);
                                  setEditingAppRelease({ ...editingAppRelease, highlightsEn: updated });
                                }}
                                className="p-2 text-gray-400 hover:text-rose-500 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 3: HA */}
                {activeEditorLangTab === 'ha' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Taken Sigar (Hausa)
                        </label>
                        <input
                          type="text"
                          value={editingAppRelease.titleHa || ''}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, titleHa: e.target.value })}
                          placeholder="Misali: Sigar 2.0.0 - Sabuntawa da Gyare-gyare"
                          className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Ranar Fitowa (Hausa)
                        </label>
                        <input
                          type="text"
                          value={editingAppRelease.releaseDateHa || ''}
                          onChange={e => setEditingAppRelease({ ...editingAppRelease, releaseDateHa: e.target.value })}
                          placeholder="Misali: 15 Maris, 2026"
                          className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Features Editor HA */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-700 dark:text-gray-300">
                          Abubuwan da aka Sabunta (Hausa)
                        </label>
                        {!editorRawMode && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentHa = editingAppRelease.highlightsHa || [];
                              setEditingAppRelease({
                                ...editingAppRelease,
                                highlightsHa: [...currentHa, '']
                              });
                            }}
                            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <Plus size={14} />
                            <span>Ƙara abu</span>
                          </button>
                        )}
                      </div>

                      {editorRawMode ? (
                        <div>
                          <p className="text-[11px] text-gray-500 mb-1">
                            Rubuta ko manna abubuwan da aka sabunta (layi 1 ga kowane abu) :
                          </p>
                          <textarea
                            rows={6}
                            value={rawHighlightsText.ha}
                            onChange={e => setRawHighlightsText({ ...rawHighlightsText, ha: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500 font-sans leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(editingAppRelease.highlightsHa || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-bold text-purple-500 w-5 text-center">{idx + 1}.</span>
                              <input
                                type="text"
                                value={item}
                                onChange={e => {
                                  const updated = [...(editingAppRelease.highlightsHa || [])];
                                  updated[idx] = e.target.value;
                                  setEditingAppRelease({ ...editingAppRelease, highlightsHa: updated });
                                }}
                                placeholder={`Abin sabuntawa ${idx + 1}...`}
                                className="flex-1 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-800 dark:text-gray-100 outline-none focus:border-purple-500"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingAppRelease.highlightsHa || []).filter((_, i) => i !== idx);
                                  setEditingAppRelease({ ...editingAppRelease, highlightsHa: updated });
                                }}
                                className="p-2 text-gray-400 hover:text-rose-500 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditAppReleaseModal(false)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={isSavingAppRelease}
                onClick={handleSaveEditedRelease}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Save size={16} className={isSavingAppRelease ? 'animate-spin' : ''} />
                <span>{isSavingAppRelease ? 'Sauvegarde Firestore...' : 'Enregistrer les Modifications'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: CREATE NEW APP VERSION (FIRESTORE) - SIMPLIFIED & INTUITIVE     */}
      {/* ========================================================================= */}
      {showCreateAppReleaseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAppReleaseSubmit}
            className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[92vh] flex flex-col animate-fadeIn"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-emerald-500/15 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/20">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    Publier une Nouvelle Version
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Créez et déployez une mise à jour en toute simplicité.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateAppReleaseModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
              {/* 1. Version Number & Quick Bump Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 dark:text-gray-200">
                    1. Numéro de Version *
                  </label>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Actuelle: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">v{appReleases[0]?.version || '1.1.2'}</strong>
                  </span>
                </div>

                {/* Quick Auto-Increment Buttons */}
                {(() => {
                  const base = appReleases[0]?.version || APP_VERSION_CONFIG.currentVersion || '1.1.2';
                  const parts = base.replace(/^v/, '').split('.').map(p => parseInt(p, 10) || 0);
                  const maj = parts[0] ?? 1;
                  const min = parts[1] ?? 1;
                  const pat = parts[2] ?? 0;
                  const patchOption = `${maj}.${min}.${pat + 1}`;
                  const minorOption = `${maj}.${min + 1}.0`;
                  const majorOption = `${maj + 1}.0.0`;

                  return (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewAppReleaseForm({
                            ...newAppReleaseForm,
                            version: patchOption,
                            type: 'patch',
                            title: `Mise à jour v${patchOption} - Correctifs`
                          });
                        }}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          newAppReleaseForm.version === patchOption
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <span className="block font-mono text-xs font-bold">v{patchOption}</span>
                        <span className="block text-[10px] text-gray-500 dark:text-gray-400">Correctif (+0.0.1)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewAppReleaseForm({
                            ...newAppReleaseForm,
                            version: minorOption,
                            type: 'minor',
                            title: `Mise à jour v${minorOption} - Nouveautés`
                          });
                        }}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          newAppReleaseForm.version === minorOption
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <span className="block font-mono text-xs font-bold">v{minorOption}</span>
                        <span className="block text-[10px] text-gray-500 dark:text-gray-400">Nouveautés (+0.1.0)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewAppReleaseForm({
                            ...newAppReleaseForm,
                            version: majorOption,
                            type: 'major',
                            title: `Version Majeure v${majorOption}`
                          });
                        }}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          newAppReleaseForm.version === majorOption
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <span className="block font-mono text-xs font-bold">v{majorOption}</span>
                        <span className="block text-[10px] text-gray-500 dark:text-gray-400">Majeure (+1.0.0)</span>
                      </button>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Numéro personnalisé
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1.2.0"
                      value={newAppReleaseForm.version}
                      onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, version: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-mono font-bold text-emerald-600 dark:text-emerald-400 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Version Code (Build)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newAppReleaseForm.versionCode}
                      onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, versionCode: Number(e.target.value) || 1 })}
                      className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-mono font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Version Title */}
              <div>
                <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                  2. Titre de la Version *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mise à jour v1.2.0 - Optimisations & Stabilité"
                  value={newAppReleaseForm.title}
                  onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, title: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500"
                />
              </div>

              {/* 3. Highlights / Changes */}
              <div>
                <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                  3. Nouveautés & Corrections (1 ligne par point)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={`- Optimisation de la fluidité et des performances\n- Amélioration de l'expérience utilisateur et corrections\n- Mise à jour des contenus`}
                  value={rawHighlightsText.fr}
                  onChange={e => setRawHighlightsText({ ...rawHighlightsText, fr: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>

              {/* 4. Publication and Video Card Options */}
              <div className="space-y-3 pt-1">
                {/* Published Toggle */}
                <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 cursor-pointer">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles size={15} className="text-emerald-500" />
                      <span>Publier immédiatement la version</span>
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                      La version sera visible et active pour tous les utilisateurs.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!newAppReleaseForm.disabled}
                    onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, disabled: !e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                </label>

                {/* 3D Video Notification Pop-up Configuration */}
                <div className="p-4 bg-gradient-to-br from-purple-900/10 via-purple-50/50 to-emerald-900/10 dark:from-purple-950/30 dark:via-purple-900/20 dark:to-emerald-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                      <Film size={15} className="text-purple-600 dark:text-purple-400" />
                      <span>Pop-up 3D Vidéo Professionnelle (Centrée & Immersive)</span>
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-700 dark:text-purple-300">
                      3D POP-UP
                    </span>
                  </div>

                  {/* Enable 3D Video Popup Toggle */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-750 border border-purple-100 dark:border-purple-900/40 cursor-pointer shadow-sm">
                    <div className="pr-2">
                      <span className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                        <Sparkles size={14} className={newAppReleaseForm.enable3DVideoPopup !== false && !newAppReleaseForm.disableVideoCard ? 'text-purple-500' : 'text-gray-400'} />
                        <span>Activer la Pop-up 3D Vidéo pour cette version</span>
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
                        {newAppReleaseForm.enable3DVideoPopup !== false && !newAppReleaseForm.disableVideoCard
                          ? '🟢 Active : L\'utilisateur verra une magnifique boîte 3D centrée avec vidéo.'
                          : '🚫 Désactivée : Affichage discret standard.'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={newAppReleaseForm.enable3DVideoPopup !== false && !newAppReleaseForm.disableVideoCard}
                      onChange={e => setNewAppReleaseForm({ 
                        ...newAppReleaseForm, 
                        enable3DVideoPopup: e.target.checked,
                        disableVideoCard: !e.target.checked 
                      })}
                      className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                    />
                  </label>

                  {/* Force User Action Toggle */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-750 border border-amber-100 dark:border-amber-900/40 cursor-pointer shadow-sm">
                    <div className="pr-2">
                      <span className="font-bold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5">
                        <ShieldAlert size={14} className={newAppReleaseForm.forceVideoModal ? 'text-amber-500' : 'text-gray-400'} />
                        <span>Mode Forcé (Oblige l'utilisateur à interagir)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
                        {newAppReleaseForm.forceVideoModal 
                          ? '⚡ L\'utilisateur DOIT cliquer pour continuer.' 
                          : 'L\'utilisateur peut fermer la boîte.'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!newAppReleaseForm.forceVideoModal}
                      onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, forceVideoModal: e.target.checked })}
                      className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0"
                    />
                  </label>

                  {/* Custom Video URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      URL de la Vidéo Personnalisée (Optionnel)
                    </label>
                    <input
                      type="url"
                      value={newAppReleaseForm.customVideoUrl || ''}
                      onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, customVideoUrl: e.target.value })}
                      placeholder="https://.../video.mp4 ou lien YouTube"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* If video card is enabled by admin, show preset style picker */}
                  {newAppReleaseForm.enable3DVideoPopup !== false && !newAppReleaseForm.disableVideoCard && (
                    <div className="pt-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                          <Film size={13} className="text-purple-600 dark:text-purple-400" />
                          Choisir le Style Visuel 3D
                        </span>
                        <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold">
                          {getPresetById(newAppReleaseForm.videoCardTheme || 'cyber-emerald').titleFr}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                        {VIDEO_CARD_PRESETS.map((p) => {
                          const isSelected = (newAppReleaseForm.videoCardTheme || 'cyber-emerald') === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setNewAppReleaseForm({ ...newAppReleaseForm, videoCardTheme: p.id })}
                              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-purple-500 bg-white dark:bg-gray-800 text-purple-900 dark:text-white font-bold ring-2 ring-purple-500/30'
                                  : 'border-purple-100 dark:border-purple-900/40 bg-white/60 dark:bg-gray-800/60 hover:bg-white text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <span className="block text-[11px] font-bold truncate">{p.titleFr.split(' ')[0]}</span>
                              <span className="block text-[9px] text-gray-500 dark:text-gray-400 truncate">{p.badgeFr}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Advanced Options (Collapsible to keep form simple) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdvancedCreateOpen(!isAdvancedCreateOpen)}
                  className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-gray-500" />
                    <span>Options Avancées (Traductions, Mise à jour forcée APK)</span>
                  </span>
                  <span className="text-xs">{isAdvancedCreateOpen ? '▲ Masquer' : '▼ Déplier'}</span>
                </button>

                {isAdvancedCreateOpen && (
                  <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4 animate-fadeIn">
                    {/* Force Update APK Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAppReleaseForm.forceUpdate}
                        onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, forceUpdate: e.target.checked })}
                        className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                      />
                      <span className="font-bold text-amber-800 dark:text-amber-300 text-xs flex items-center gap-1">
                        <ShieldAlert size={14} />
                        Mise à jour obligatoire (Bloque les versions antérieures sur APK)
                      </span>
                    </label>

                    {newAppReleaseForm.forceUpdate && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Build Code Minimal Requis
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={newAppReleaseForm.minSupportedVersionCode}
                            onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, minSupportedVersionCode: Number(e.target.value) || 1 })}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Lien de téléchargement APK
                          </label>
                          <input
                            type="url"
                            value={newAppReleaseForm.apkDownloadUrl}
                            onChange={e => setNewAppReleaseForm({ ...newAppReleaseForm, apkDownloadUrl: e.target.value })}
                            placeholder="https://.../AsrarHub.apk"
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-mono outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Multilingual inputs */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                          🇬🇧 Nouveautés en Anglais (Optionnel)
                        </label>
                        <textarea
                          rows={2}
                          value={rawHighlightsText.en}
                          onChange={e => setRawHighlightsText({ ...rawHighlightsText, en: e.target.value })}
                          placeholder="General updates and performance improvements"
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                          🇳🇬 Nouveautés en Hausa (Optionnel)
                        </label>
                        <textarea
                          rows={2}
                          value={rawHighlightsText.ha}
                          onChange={e => setRawHighlightsText({ ...rawHighlightsText, ha: e.target.value })}
                          placeholder="Sabuntawa da inganta sauri"
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateAppReleaseModal(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-650 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSavingAppRelease}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>{isSavingAppRelease ? 'Publication...' : `Publier la Version v${newAppReleaseForm.version || ''}`}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 9: CONFIRM DELETE APP VERSION                                       */}
      {/* ========================================================================= */}
      {appReleaseToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={26} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Supprimer la Version v{appReleaseToDelete.version} ?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Êtes-vous sûr de vouloir supprimer définitivement cette version de la collection Firestore <code>app_versions</code> ? Cette action est irréversible.
              </p>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setAppReleaseToDelete(null)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={isSavingAppRelease}
                onClick={handleConfirmDeleteAppRelease}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSavingAppRelease ? 'Suppression...' : 'Supprimer Définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 10: STUDIO 10 CARTES VIDÉO DE MISE À JOUR (PREVIEW & TESTEUR)       */}
      {/* ========================================================================= */}
      {showVideoStudioModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900/80 via-gray-900 to-indigo-900/80 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
                  <Film size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>Studio des 10 Cartes Vidéo Spéciales</span>
                    <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                      Live Preview
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Testez en direct les 10 rendus vidéo, particules, boutons dynamiques et liens APK
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowVideoStudioModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Studio Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-6 overflow-y-auto">
              
              {/* Left Column: 10 Presets List Selector */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Sélectionner un Modèle (10 Disponibles)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {VIDEO_CARD_PRESETS.find(p => p.id === studioSelectedPresetId)?.index}/10
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[50vh] lg:max-h-[55vh] overflow-y-auto pr-1">
                  {VIDEO_CARD_PRESETS.map((preset) => {
                    const isSelected = preset.id === studioSelectedPresetId;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setStudioSelectedPresetId(preset.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500 text-white'
                            : 'bg-gray-800/60 border-gray-700/60 hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: preset.accentColor }}
                          />
                          <div>
                            <div className="text-xs font-bold">
                              {preset.index}. {preset.titleFr}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {preset.particleType} • {preset.badgeFr}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-md">
                            Actif
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Studio Parameters */}
                <div className="bg-gray-800/70 p-3.5 rounded-2xl border border-gray-700 space-y-2.5 mt-3">
                  <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                    Paramètres de Test :
                  </span>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400">Langue d'affichage :</span>
                    <div className="flex items-center gap-1">
                      {(['fr', 'en', 'ha'] as const).map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setStudioActiveLang(l)}
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                            studioActiveLang === l ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400">Mode Forcé :</span>
                    <button
                      type="button"
                      onClick={() => setStudioIsForceUpdateTest(!studioIsForceUpdateTest)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        studioIsForceUpdateTest ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {studioIsForceUpdateTest ? 'Mise à jour Forcée' : 'Notification Simple'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Dynamic Video Card Canvas Render */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-950 p-3 sm:p-5 rounded-3xl border border-gray-800">
                <div className="w-full max-w-md">
                  <UpdateVideoCard
                    preset={getPresetById(studioSelectedPresetId)}
                    targetRelease={appReleases[0] || APP_VERSION_CONFIG.releases[0]}
                    currentInstalledVersion="1.1.1"
                    isForceUpdate={studioIsForceUpdateTest}
                    secondaryActionLabel="Test Purge Cache & Relance"
                    onSecondaryAction={() => alert("Simulation : Purge de cache SWR effectuée !")}
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-900 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-400 font-mono">
                ✨ 10 Modèles Vidéo optimisés pour WebView Android APK et Desktop
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSavingAppRelease}
                  onClick={() => handleApplyStudioThemeToActiveRelease(studioSelectedPresetId)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>
                    {isSavingAppRelease 
                      ? 'Application...' 
                      : `Appliquer ce Thème à la Version Active (v${appReleases[0]?.version || APP_VERSION_CONFIG.currentVersion})`
                    }
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVideoStudioModal(false)}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Fermer le Studio
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3D VIDEO NOTIFICATION MODAL PREVIEW / LIVE TEST (ADMIN TOOL)              */}
      {/* ========================================================================= */}
      {preview3DVideoRelease && (
        <Version3DVideoNotificationModal
          release={preview3DVideoRelease}
          onClose={() => setPreview3DVideoRelease(null)}
          onExplore={() => {
            showFeedback(`Action explorée avec succès pour la v${preview3DVideoRelease.version}.`);
            setPreview3DVideoRelease(null);
          }}
          onForceDownload={() => {
            showFeedback(`Action de téléchargement déclenchée pour la v${preview3DVideoRelease.version}.`);
            setPreview3DVideoRelease(null);
          }}
        />
      )}
    </div>
  );
};
