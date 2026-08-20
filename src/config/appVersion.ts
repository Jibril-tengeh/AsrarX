export interface VersionRelease {
  id?: string;
  version: string; // e.g. "1.1.0"
  versionCode: number; // e.g. 2
  releaseDate: string; // e.g. "17 Août 2026"
  releaseDateEn?: string;
  releaseDateHa?: string;
  title: string;
  titleEn?: string;
  titleHa?: string;
  isCurrent?: boolean;
  disabled?: boolean;
  forceUpdate?: boolean; // Bloquer l'application si l'utilisateur est sur une version antérieure
  minSupportedVersionCode?: number; // Code de version minimum obligatoire
  downloadUrl?: string; // Lien de mise à jour (Play Store, Téléchargement APK direct, ou Web)
  apkDownloadUrl?: string; // Lien direct de téléchargement du fichier APK
  highlights: string[];
  highlightsEn?: string[];
  highlightsHa?: string[];
  type: 'major' | 'minor' | 'patch';
  author?: string;
  updatedAt?: string;
}

const dynamicVersion = (typeof __APP_VERSION__ !== 'undefined' && __APP_VERSION__) ? __APP_VERSION__ : '1.1.0';

export const APP_VERSION_CONFIG = {
  currentVersion: dynamicVersion,
  currentVersionCode: 1,
  buildNumber: '2026.08.17.02',
  releaseDate: '17 Août 2026',
  releaseDateEn: 'August 17, 2026',
  releaseDateHa: '17 ga Agusta, 2026',
  appTitle: 'AsrarHub',
  bundleId: 'com.asrarhub.app',
  releases: [
    {
      version: dynamicVersion,
      versionCode: 2,
      releaseDate: '17 Août 2026',
      releaseDateEn: 'August 17, 2026',
      releaseDateHa: '17 ga Agusta, 2026',
      title: `Mise à jour v${dynamicVersion} : Versioning & Recadrage Média`,
      titleEn: `Update v${dynamicVersion}: Versioning & Media Cropping`,
      titleHa: `Sabuntawa v${dynamicVersion}: Sarrafa Siga & Gyaran Hotuna`,
      isCurrent: true,
      type: 'minor',
      highlights: [
        'Mises à jour fluides et simplifiées sans désinstallation',
        'Système dynamique de gestion et affichage des versions d\'application',
        'Contrôle automatique du cache SWR et purge lors du changement de version',
        'Journal des modifications (Changelog) interactif et synchronisé',
        'Outil interactif de recadrage d’images multi-ratios (16:9, 4:3, 1:1, 9:16) dans l’éditeur',
        'Gestionnaire de médias enrichi avec recadrage et remplacement en place'
      ],
      highlightsEn: [
        'Seamless updates without uninstallation',
        'Dynamic application version management and display system',
        'Automatic SWR cache validation and purge on version changes',
        'Interactive synchronized Changelog',
        'Interactive multi-aspect image cropping tool (16:9, 4:3, 1:1, 9:16) in the editor',
        'Enriched media manager with integrated cropping and instant replacement'
      ],
      highlightsHa: [
        'Sabuntawa cikin sauki ba tare da goge manhaja ba',
        'Tsarin sarrafawa da nuna sabbin sigogin manhaja mai aiki kai tsaye',
        'Kula da share cache na SWR ta atomatik yayin canjin siga',
        'Tarihin sauye-sauye (Changelog) mai aiki kai tsaye',
        'Kayan aikin gyara da yanka hotuna da ma\'auni daban-daban (16:9, 4:3, 1:1, 9:16) a cikin edita',
        'Ingantaccen manajan fayilolin labarai tare da yankan hoto da sauya shi kai tsaye'
      ]
    },
    {
      version: '1.0.0',
      versionCode: 1,
      releaseDate: '1 Août 2026',
      releaseDateEn: 'August 1, 2026',
      releaseDateHa: '1 ga Agusta, 2026',
      title: 'Version Initiale v1.0 : Lancement Officiel AsrarHub',
      titleEn: 'Initial Release v1.0: Official Launch of AsrarHub',
      titleHa: 'Siga ta Farko v1.0: Kaddamar da AsrarHub a Hukumance',
      isCurrent: false,
      type: 'major',
      highlights: [
        'Sanctuaire spirituel complet avec 6 grands Wirds et secrets sacrés',
        'Corpus Shams al-Ma\'arif & calculs ésotériques (Abjad, Asma al-Husna, Raml)',
        'Moteur audio des récitateurs et Ruqyah Shariah avec cache hors-ligne',
        'Sauvegarde Cloud sécurisée et synchronisation multi-appareils',
        'Mode sombre / clair et support multilingue (Français, Anglais, Hausa)'
      ],
      highlightsEn: [
        'Complete spiritual sanctuary with 6 major Wirds and sacred secrets',
        'Shams al-Ma\'arif corpus & esoteric calculations (Abjad, Asma al-Husna, Raml)',
        'Audio engine of reciters and Ruqyah Shariah with offline caching',
        'Secure Cloud backup and multi-device synchronization',
        'Dark / Light mode and multilingual support (French, English, Hausa)'
      ],
      highlightsHa: [
        'Cikakken dakin ibada na ruhi tare da manyan Wirdodi 6 da asirai masu tsarki',
        'Ilimin Shams al-Ma\'arif da lissafin asiri (Abjad, Asma al-Husna, Raml)',
        'Sautin makaranta da Ruqyah Shariah tare da ajiya ba tare da intanet ba',
        'Ajiye bayanai a Cloud da daidaita na\'urori da yawa',
        'Yanayin duhu / haske da goyon bayan yaruka da dama (Faransanci, Turanci, Hausa)'
      ]
    }
  ] as VersionRelease[]
};

export const getLocalizedRelease = (rel: VersionRelease, lang: string) => {
  if (lang === 'en') {
    return {
      title: rel.titleEn || rel.title,
      releaseDate: rel.releaseDateEn || rel.releaseDate,
      highlights: (rel.highlightsEn && rel.highlightsEn.length > 0) ? rel.highlightsEn : rel.highlights
    };
  }
  if (lang === 'ha') {
    return {
      title: rel.titleHa || rel.title,
      releaseDate: rel.releaseDateHa || rel.releaseDate,
      highlights: (rel.highlightsHa && rel.highlightsHa.length > 0) ? rel.highlightsHa : rel.highlights
    };
  }
  return {
    title: rel.title,
    releaseDate: rel.releaseDate,
    highlights: rel.highlights
  };
};

export const getLocalizedReleaseDate = (lang: string) => {
  if (lang === 'en') return APP_VERSION_CONFIG.releaseDateEn;
  if (lang === 'ha') return APP_VERSION_CONFIG.releaseDateHa;
  return APP_VERSION_CONFIG.releaseDate;
};

export const getAppVersion = () => (typeof __APP_VERSION__ !== 'undefined' && __APP_VERSION__) ? __APP_VERSION__ : APP_VERSION_CONFIG.currentVersion;
export const getAppVersionCode = () => APP_VERSION_CONFIG.currentVersionCode;
export const getFullVersionDisplay = () => `v${getAppVersion()} (Build ${APP_VERSION_CONFIG.currentVersionCode})`;
