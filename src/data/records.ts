export interface Track {
  id: string;
  title: string;
  duration: number;
  side: 'A' | 'B';
}

export interface CoverVariant {
  id: string;
  label: string;
  gradient: string;
  pattern: string;
  accentColor: string;
  filter?: string;
}

export type VinylFinish = string;

export interface VinylFinishOption {
  id: string;
  label: string;
  color: string;
  background: string;
  isTranslucent?: boolean;
  isColorful?: boolean;
}

export type InsertType = 'signature-card' | 'lyric-book' | 'photo' | 'note' | 'poster';

export interface BonusInsert {
  id: string;
  type: InsertType;
  label: string;
  description: string;
  image: string;
}

export interface Record {
  id: string;
  album: string;
  artist: string;
  year: number;
  mood: string[];
  tracks: Track[];
  coverVariants: CoverVariant[];
  vinylFinishes: VinylFinishOption[];
  defaultFinish: VinylFinish;
  accentColor: string;
  labelColor: string;
  coverImage?: string;
  isLimitedEdition?: boolean;
  limitedEditionLabel?: string;
  bonusInserts?: BonusInsert[];
}

// ─── Helpers ──────────────────────────────────────────

function t(id: string, title: string, min: number, sec: number, side: 'A' | 'B'): Track {
  return { id, title, duration: min * 60 + sec, side };
}

function vf(id: string, label: string, color: string, background: string, translucent?: boolean, colorful?: boolean): VinylFinishOption {
  return { id, label, color, background, isTranslucent: translucent, isColorful: colorful };
}

function imgVariants(prefix: string, grad: string, accent: string, uniqueLabel: string, uniqueFilter: string): CoverVariant[] {
  return [
    { id: `${prefix}-orig`, label: 'Original', gradient: grad, pattern: 'none', accentColor: accent },
    { id: `${prefix}-noir`, label: 'Noir', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #333 50%, #0a0a0a 100%)', pattern: 'none', accentColor: '#555', filter: 'grayscale(1) contrast(1.15) brightness(0.95)' },
    { id: `${prefix}-warm`, label: 'Warm Tone', gradient: 'linear-gradient(135deg, #8B6830 0%, #D4A060 50%, #6B4820 100%)', pattern: 'none', accentColor: '#D4A060', filter: 'sepia(0.3) saturate(1.15) brightness(1.05)' },
    { id: `${prefix}-faded`, label: 'Faded', gradient: 'linear-gradient(135deg, #C8C0B8 0%, #E0D8D0 50%, #B0A898 100%)', pattern: 'none', accentColor: '#C8C0B8', filter: 'brightness(1.12) contrast(0.82) saturate(0.6)' },
    { id: `${prefix}-uniq`, label: uniqueLabel, gradient: `linear-gradient(160deg, ${accent}dd 0%, ${accent} 50%, ${accent}88 100%)`, pattern: 'none', accentColor: accent, filter: uniqueFilter },
  ];
}

// ─── Cannons ────────────────────────────────────────────

const cannonsUpAllNight: Record = {
  id: 'cannons-up-all-night',
  album: 'Up All Night',
  artist: 'Cannons',
  year: 2014,
  mood: ['dreamy', 'indie', 'nocturnal'],
  accentColor: '#8B1A1A',
  labelColor: '#D4453A',
  defaultFinish: 'uan-crimson',
  coverImage: '/albums/cannons/up-all-night.jpg',
  coverVariants: imgVariants('uan', 'linear-gradient(135deg, #8B1A1A 0%, #D4453A 50%, #4A0E0E 100%)', '#D4453A', 'Bloodshot', 'saturate(1.6) hue-rotate(-10deg) contrast(1.1)'),
  vinylFinishes: [
    vf('uan-crimson', 'Crimson', '#8B1A1A', 'radial-gradient(circle at 45% 45%, #8B2020 0%, #5A1010 60%, #3A0808 100%)'),
    vf('uan-midnight-rose', 'Midnight Rose', '#4A0E1E', 'radial-gradient(circle at 45% 45%, #4A0E1Ecc 0%, #320818bf 60%, #1E0510b3 100%)', true),
    vf('uan-blood-moon', 'Blood Moon', '#6B1A2A', 'conic-gradient(from 30deg, #6B1A2A, #1A0808, #8B2030, #2A0A0A, #6B1A2A)'),
    vf('uan-ruby-haze', 'Ruby Haze', '#5A1818', 'radial-gradient(circle at 45% 45%, #5A1818d9 0%, #3A0C0Ce0 60%, #2A0808e6 100%)', true),
    vf('uan-garnet', 'Garnet', '#7A1828', 'radial-gradient(circle at 45% 45%, #7A1828cc 0%, #501018bf 60%, #380810b3 100%)', true),
  ],
  tracks: [
    t('uan-1', 'Touch', 3, 33, 'A'),
    t('uan-2', 'Temporary Romance', 4, 8, 'A'),
    t('uan-3', 'Up All Night', 3, 59, 'B'),
    t('uan-4', 'Neon Light', 4, 56, 'B'),
  ],
};

const cannonsNightDrive: Record = {
  id: 'cannons-night-drive',
  album: 'Night Drive',
  artist: 'Cannons',
  year: 2017,
  mood: ['synth', 'nocturnal', 'romantic'],
  accentColor: '#4A7080',
  labelColor: '#88B8C8',
  defaultFinish: 'nd-deep-teal',
  coverImage: '/albums/cannons/night-drive.jpg',
  coverVariants: imgVariants('nd', 'linear-gradient(135deg, #2A3848 0%, #4A7080 50%, #88B8C8 100%)', '#4A7080', 'Neon', 'saturate(1.5) brightness(1.1) hue-rotate(10deg)'),
  vinylFinishes: [
    vf('nd-deep-teal', 'Deep Teal', '#2A5060', 'radial-gradient(circle at 45% 45%, #2A5060 0%, #1A3040 60%, #0A1820 100%)'),
    vf('nd-neon-surf', 'Neon Surf', '#40A0B8', 'radial-gradient(circle at 45% 45%, #40A0B8cc 0%, #2878A0bf 60%, #185878b3 100%)', true),
    vf('nd-twilight', 'Twilight', '#1A2838', 'radial-gradient(circle at 45% 45%, #1A2838d9 0%, #101820e0 60%, #080C14e6 100%)', true),
    vf('nd-ocean-mist', 'Ocean Mist', '#6090A8', 'radial-gradient(circle at 45% 45%, #6090A8cc 0%, #4878A0bf 60%, #306088b3 100%)', true),
    vf('nd-starlit', 'Starlit Blue', '#1A2848', 'radial-gradient(circle at 45% 45%, #1A2848cc 0%, #101838bf 60%, #080C28b3 100%)', true),
  ],
  tracks: [
    t('nd-1', 'Miracle', 4, 27, 'A'),
    t('nd-2', 'Can You Feel It', 3, 13, 'A'),
    t('nd-3', 'Kiss Me', 4, 20, 'A'),
    t('nd-4', 'Stuck on You', 3, 45, 'A'),
    t('nd-5', 'Night Drive', 3, 51, 'A'),
    t('nd-6', 'The Beach', 3, 30, 'B'),
    t('nd-7', 'Future Love', 3, 20, 'B'),
    t('nd-8', '100 Lovers', 3, 28, 'B'),
    t('nd-9', 'High off Love', 3, 27, 'B'),
    t('nd-10', 'Mood Ring', 3, 27, 'B'),
  ],
};

const cannonsInAHeartbeat: Record = {
  id: 'cannons-in-a-heartbeat',
  album: 'In a Heartbeat',
  artist: 'Cannons',
  year: 2018,
  mood: ['dreamy', 'indie-pop', 'wistful'],
  accentColor: '#3A6858',
  labelColor: '#E88080',
  defaultFinish: 'iah-emerald',
  coverImage: '/albums/cannons/in-a-heartbeat.jpg',
  coverVariants: imgVariants('iah', 'linear-gradient(135deg, #3A6858 0%, #E88080 50%, #C85050 100%)', '#E88080', 'Bloom', 'saturate(1.3) hue-rotate(-20deg) brightness(1.08)'),
  vinylFinishes: [
    vf('iah-emerald', 'Emerald', '#2A5840', 'radial-gradient(circle at 45% 45%, #2A5840 0%, #1A3828 60%, #0A2018 100%)'),
    vf('iah-coral', 'Coral Blush', '#D87070', 'radial-gradient(circle at 45% 45%, #D87070 0%, #B85050 60%, #983838 100%)'),
    vf('iah-forest', 'Forest Dusk', '#1A3028', 'radial-gradient(circle at 45% 45%, #1A3028d9 0%, #0C1C14e0 60%, #080C0Ae6 100%)', true),
    vf('iah-rose-quartz', 'Rose Quartz', '#E8A0A0', 'radial-gradient(circle at 45% 45%, #E8A0A0cc 0%, #D08080bf 60%, #B86868b3 100%)', true),
    vf('iah-jade', 'Jade Glass', '#48A080', 'radial-gradient(circle at 45% 45%, #48A080cc 0%, #308868bf 60%, #207050b3 100%)', true),
  ],
  tracks: [
    t('iah-1', 'Round and Round', 3, 24, 'A'),
    t('iah-2', 'Nevermind, Never Mine', 3, 29, 'A'),
    t('iah-3', 'Backwards', 3, 9, 'B'),
    t('iah-4', 'Holding On', 3, 46, 'B'),
    t('iah-5', "Can't Help Falling in Love", 2, 54, 'B'),
  ],
};

const cannonsShadows: Record = {
  id: 'cannons-shadows',
  album: 'Shadows',
  artist: 'Cannons',
  year: 2019,
  mood: ['sensual', 'warm', 'pink'],
  accentColor: '#D84080',
  labelColor: '#F0A0B8',
  defaultFinish: 'sh-pink-marble',
  coverImage: '/albums/cannons/shadows.jpg',
  coverVariants: imgVariants('sh', 'linear-gradient(135deg, #D84080 0%, #F0A0B8 50%, #C83060 100%)', '#D84080', 'Velvet', 'saturate(1.4) contrast(1.15) hue-rotate(-5deg)'),
  vinylFinishes: [
    vf('sh-pink-marble', 'Pink Marble', '#D870A0', 'conic-gradient(from 45deg, #D870A0, #F0A0C0, #E88098, #C85080, #F0B0C8, #D870A0)', false, true),
    vf('sh-flamingo', 'Flamingo', '#E84888', 'radial-gradient(circle at 45% 45%, #E84888 0%, #C83068 60%, #A01848 100%)'),
    vf('sh-blush-pearl', 'Blush Pearl', '#F0D0D8', 'radial-gradient(circle at 40% 40%, #FAF0F2 0%, #F0D0D8 30%, #E8C0C8 60%, #F0D8E0 100%)'),
    vf('sh-magenta-smoke', 'Magenta Smoke', '#A03060', 'radial-gradient(circle at 45% 45%, #A03060d9 0%, #781848e0 60%, #501030e6 100%)', true),
    vf('sh-cotton-candy', 'Cotton Candy', '#F0B0D0', 'radial-gradient(circle at 45% 45%, #F0B0D0cc 0%, #E898C0bf 60%, #D880B0b3 100%)', true),
  ],
  tracks: [
    t('sh-1', 'Baby', 3, 15, 'A'),
    t('sh-2', 'Fire for You', 3, 52, 'A'),
    t('sh-3', 'Talk Talk', 3, 35, 'A'),
    t('sh-4', 'Love Chained', 3, 24, 'B'),
    t('sh-5', 'Bright Lights', 3, 25, 'B'),
    t('sh-6', 'Shadows', 3, 55, 'B'),
    t('sh-7', 'Love on the Ground', 3, 42, 'B'),
  ],
};

const cannonsShadowsMidnight: Record = {
  id: 'cannons-shadows-midnight',
  album: 'Shadows (Midnight Edition)',
  artist: 'Cannons',
  year: 2019,
  mood: ['sensual', 'dark', 'purple'],
  accentColor: '#7840A8',
  labelColor: '#C8A0E8',
  defaultFinish: 'shm-amethyst',
  coverImage: '/albums/cannons/shadows-midnight.jpg',
  isLimitedEdition: true,
  limitedEditionLabel: 'Midnight Edition',
  coverVariants: imgVariants('shm', 'linear-gradient(135deg, #7840A8 0%, #C8A0E8 50%, #5020A0 100%)', '#7840A8', 'Eclipse', 'hue-rotate(20deg) saturate(1.5) brightness(0.9) contrast(1.2)'),
  vinylFinishes: [
    vf('shm-amethyst', 'Amethyst', '#6830A0', 'radial-gradient(circle at 45% 45%, #6830A0 0%, #481878 60%, #280850 100%)'),
    vf('shm-midnight-velvet', 'Midnight Velvet', '#1A0830', 'radial-gradient(circle at 45% 45%, #1A0830 0%, #0C0418 60%, #04020A 100%)'),
    vf('shm-ultraviolet', 'Ultraviolet', '#9050D0', 'radial-gradient(circle at 45% 45%, #9050D0cc 0%, #7038B8bf 60%, #5020A0b3 100%)', true),
    vf('shm-plum-smoke', 'Plum Smoke', '#503070', 'radial-gradient(circle at 45% 45%, #503070d9 0%, #381850e0 60%, #200838e6 100%)', true),
    vf('shm-dark-crystal', 'Dark Crystal', '#7040B0', 'radial-gradient(circle at 45% 45%, #7040B0cc 0%, #4828a0bf 60%, #281880b3 100%)', true),
  ],
  tracks: [
    t('shm-1', 'Baby', 3, 15, 'A'),
    t('shm-2', 'Fire for You', 3, 52, 'A'),
    t('shm-3', 'Talk Talk', 3, 35, 'A'),
    t('shm-4', 'Love Chained', 3, 24, 'A'),
    t('shm-5', 'Bright Lights', 3, 25, 'A'),
    t('shm-6', 'Shadows', 3, 55, 'B'),
    t('shm-7', 'Love on the Ground', 3, 43, 'B'),
    t('shm-8', 'Fire for You - Midnight Version', 3, 30, 'B'),
    t('shm-9', 'Shadows - Dark Wave Mix', 3, 34, 'B'),
    t('shm-10', 'Talk Talk - Dub Mix', 3, 19, 'B'),
  ],
};

const cannonsFeverDream: Record = {
  id: 'cannons-fever-dream',
  album: 'Fever Dream',
  artist: 'Cannons',
  year: 2022,
  mood: ['fiery', 'bold', 'retro'],
  accentColor: '#E83020',
  labelColor: '#F88070',
  defaultFinish: 'fd-fever-red',
  coverImage: '/albums/cannons/fever-dream.jpg',
  coverVariants: imgVariants('fd', 'linear-gradient(135deg, #E83020 0%, #F88070 50%, #A01810 100%)', '#E83020', 'Inferno', 'saturate(1.6) hue-rotate(-15deg) contrast(1.1)'),
  vinylFinishes: [
    vf('fd-fever-red', 'Fever Red', '#E83020', 'radial-gradient(circle at 45% 45%, #E83020 0%, #B81810 60%, #801008 100%)'),
    vf('fd-inferno', 'Inferno', '#E86020', 'radial-gradient(circle at 45% 45%, #E86020 0%, #C04010 60%, #982808 100%)'),
    vf('fd-flame-marble', 'Flame Marble', '#D84820', 'conic-gradient(from 30deg, #D84820, #F08840, #E83020, #A01808, #F07030, #D84820)', false, true),
    vf('fd-ember', 'Ember', '#982818', 'radial-gradient(circle at 45% 45%, #982818cc 0%, #701810bf 60%, #500C08b3 100%)', true),
    vf('fd-sunset-blaze', 'Sunset Blaze', '#F08040', 'radial-gradient(circle at 45% 45%, #F08040cc 0%, #D06028bf 60%, #B04818b3 100%)', true),
  ],
  tracks: [
    t('fd-1', 'Come Alive', 3, 21, 'A'),
    t('fd-2', 'Hurricane', 3, 1, 'A'),
    t('fd-3', 'Strangers', 3, 12, 'A'),
    t('fd-4', 'Tunnel of You', 4, 23, 'A'),
    t('fd-5', 'Bad Dream', 3, 22, 'A'),
    t('fd-6', 'Ruthless', 3, 25, 'B'),
    t('fd-7', 'Only You', 3, 22, 'B'),
    t('fd-8', 'Goodbye', 4, 22, 'B'),
    t('fd-9', 'Purple Sun', 4, 1, 'B'),
    t('fd-10', 'Afterglow', 3, 19, 'B'),
    t('fd-11', 'Lightning', 2, 35, 'B'),
  ],
};

const cannonsHeartbeatHighway: Record = {
  id: 'cannons-heartbeat-highway',
  album: 'Heartbeat Highway',
  artist: 'Cannons',
  year: 2023,
  mood: ['glamorous', 'gold', 'retro'],
  accentColor: '#C8A040',
  labelColor: '#E8D090',
  defaultFinish: 'hh-highway-gold',
  coverImage: '/albums/cannons/heartbeat-highway.jpg',
  coverVariants: imgVariants('hh', 'linear-gradient(135deg, #2A1820 0%, #C8A040 50%, #E8D090 100%)', '#C8A040', 'Golden', 'sepia(0.4) saturate(1.5) brightness(1.08)'),
  vinylFinishes: [
    vf('hh-highway-gold', 'Highway Gold', '#C8A040', 'radial-gradient(circle at 45% 45%, #C8A040 0%, #A07828 60%, #786018 100%)'),
    vf('hh-champagne', 'Champagne', '#E8D098', 'radial-gradient(circle at 45% 45%, #E8D098cc 0%, #D0B878bf 60%, #B8A060b3 100%)', true),
    vf('hh-amber', 'Amber Honey', '#D89030', 'radial-gradient(circle at 45% 45%, #D89030 0%, #B87020 60%, #985818 100%)'),
    vf('hh-bronze', 'Bronze', '#7A5828', 'radial-gradient(circle at 45% 45%, #7A5828 0%, #5A4018 60%, #3A280C 100%)'),
    vf('hh-golden-hour', 'Golden Hour', '#E0B050', 'radial-gradient(circle at 45% 45%, #E0B050cc 0%, #C89838bf 60%, #B08028b3 100%)', true),
  ],
  tracks: [
    t('hh-1', 'Heartbeat Highway', 3, 41, 'A'),
    t('hh-2', 'Crush', 3, 1, 'A'),
    t('hh-3', 'Metal Heart', 2, 53, 'A'),
    t('hh-4', 'Sweeter', 3, 27, 'A'),
    t('hh-5', 'Loving You', 3, 14, 'A'),
    t('hh-6', 'Bad Tattoo', 2, 43, 'A'),
    t('hh-7', 'Desire', 3, 12, 'B'),
    t('hh-8', 'Can You Feel My Heart', 3, 12, 'B'),
    t('hh-9', 'Always Will', 3, 7, 'B'),
    t('hh-10', 'Cry Baby', 3, 23, 'B'),
    t('hh-11', 'You', 3, 57, 'B'),
    t('hh-12', 'Dancing In The Moonlight', 3, 6, 'B'),
  ],
};

const cannonsEverythingGlows: Record = {
  id: 'cannons-everything-glows',
  album: 'Everything Glows',
  artist: 'Cannons',
  year: 2026,
  mood: ['cinematic', 'dreamy', 'euphoric'],
  accentColor: '#6A5ACD',
  labelColor: '#F0C880',
  defaultFinish: 'eg-aqua-glow',
  coverImage: '/albums/cannons/everything-glows.jpg',
  isLimitedEdition: true,
  limitedEditionLabel: 'Signed Edition',
  bonusInserts: [
    { id: 'eg-sig', type: 'signature-card', label: 'Signed Card', description: 'Hand-signed card by all three members of Cannons', image: '/albums/cannons/everything-glows-signed.png' },
  ],
  coverVariants: imgVariants('eg', 'linear-gradient(135deg, #1A1040 0%, #6A5ACD 50%, #F0C880 100%)', '#6A5ACD', 'Aurora', 'hue-rotate(30deg) saturate(1.3) brightness(1.05)'),
  vinylFinishes: [
    vf('eg-aqua-glow', 'Aqua Glow', '#60C8E0', 'radial-gradient(circle at 45% 45%, #60C8E0cc 0%, #48A8C8bf 60%, #3090B0b3 100%)', true),
    vf('eg-cosmic-purple', 'Cosmic Purple', '#7858C8', 'radial-gradient(circle at 45% 45%, #7858C8cc 0%, #5838A8bf 60%, #382088b3 100%)', true),
    vf('eg-crystal-clear', 'Crystal Clear', '#D0E8F0', 'radial-gradient(circle at 45% 45%, #D0E8F0cc 0%, #B8D8E8bf 60%, #A0C8E0b3 100%)', true),
    vf('eg-stardust', 'Stardust', '#8068D0', 'conic-gradient(from 30deg, #8068D0, #60C0D8, #7050C8, #50B0C8, #9078E0, #8068D0)', false, true),
    vf('eg-aurora', 'Aurora', '#50B8D0', 'conic-gradient(from 60deg, #50B8D0, #6870D8, #48D0B8, #8060E0, #50C8C0, #50B8D0)', false, true),
  ],
  tracks: [
    t('eg-1', 'All I Need', 3, 47, 'A'),
    t('eg-2', 'Starlight', 3, 21, 'A'),
    t('eg-3', 'Carousel', 3, 36, 'A'),
    t('eg-4', 'I Get Weak', 3, 13, 'A'),
    t('eg-5', 'These Nights', 4, 39, 'A'),
    t('eg-6', 'Shine', 4, 23, 'B'),
    t('eg-7', 'Light as a Feather', 3, 36, 'B'),
    t('eg-8', 'Fool for You', 3, 9, 'B'),
    t('eg-9', 'Good Luck Charm', 3, 21, 'B'),
    t('eg-10', 'Photographs', 3, 32, 'B'),
    t('eg-11', 'Take Me to Tokyo', 3, 20, 'B'),
  ],
};

// ─── Bob Moses ──────────────────────────────────────────

const bobMosesDaysGoneBy: Record = {
  id: 'bob-moses-days-gone-by',
  album: 'Days Gone By',
  artist: 'Bob Moses',
  year: 2015,
  mood: ['deep', 'nocturnal', 'hypnotic'],
  accentColor: '#808080',
  labelColor: '#C0C0C0',
  defaultFinish: 'dgb-silver-smoke',
  coverImage: '/albums/bob-moses/days-gone-by.jpg',
  coverVariants: imgVariants('dgb', 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #808080 100%)', '#808080', 'Monochrome', 'grayscale(0.6) contrast(1.25) brightness(0.92)'),
  vinylFinishes: [
    vf('dgb-silver-smoke', 'Silver Smoke', '#A8B0B8', 'radial-gradient(circle at 45% 45%, #A8B0B8cc 0%, #889098bf 60%, #687078b3 100%)', true),
    vf('dgb-concrete', 'Concrete', '#686868', 'radial-gradient(circle at 45% 45%, #686868 0%, #484848 60%, #303030 100%)'),
    vf('dgb-graphite', 'Graphite', '#2A2C30', 'radial-gradient(circle at 45% 45%, #2A2C30 0%, #1A1C20 60%, #0A0C10 100%)'),
    vf('dgb-ghost-glass', 'Ghost Glass', '#C0C8D0', 'radial-gradient(circle at 45% 45%, #C0C8D0cc 0%, #A0A8B0bf 60%, #8890A0b3 100%)', true),
    vf('dgb-ash', 'Ash', '#787880', 'radial-gradient(circle at 45% 45%, #787880d9 0%, #585860e0 60%, #404048e6 100%)', true),
  ],
  tracks: [
    t('dgb-1', 'Like It Or Not', 6, 20, 'A'),
    t('dgb-2', 'Talk', 6, 49, 'A'),
    t('dgb-3', 'Before I Fall', 3, 59, 'A'),
    t('dgb-4', 'Too Much Is Never Enough', 5, 25, 'A'),
    t('dgb-5', 'Tearing Me Up', 7, 50, 'A'),
    t('dgb-6', 'Keeping Me Alive', 4, 53, 'B'),
    t('dgb-7', 'Nothing At All', 5, 17, 'B'),
    t('dgb-8', 'Days Gone By', 6, 45, 'B'),
    t('dgb-9', 'Writing On The Wall', 4, 14, 'B'),
    t('dgb-10', 'Touch and Go', 7, 26, 'B'),
  ],
};

const bobMosesBattleLines: Record = {
  id: 'bob-moses-battle-lines',
  album: 'Battle Lines',
  artist: 'Bob Moses',
  year: 2018,
  mood: ['intense', 'fiery', 'electronic'],
  accentColor: '#E87020',
  labelColor: '#F0A060',
  defaultFinish: 'bl-fire-marble',
  coverImage: '/albums/bob-moses/battle-lines.jpg',
  coverVariants: imgVariants('bl', 'linear-gradient(135deg, #0A0A0A 0%, #E87020 50%, #A04010 100%)', '#E87020', 'Ember', 'hue-rotate(-10deg) saturate(1.6) contrast(1.15)'),
  vinylFinishes: [
    vf('bl-fire-marble', 'Fire Marble', '#D86020', 'conic-gradient(from 30deg, #D86020, #F0A040, #E87020, #A04010, #F09030, #D86020)', false, true),
    vf('bl-burnt-amber', 'Burnt Amber', '#A05818', 'radial-gradient(circle at 45% 45%, #A05818 0%, #784010 60%, #582808 100%)'),
    vf('bl-wildfire', 'Wildfire', '#E05828', 'conic-gradient(from 60deg, #E05828, #F08838, #C83818, #F09848, #D04820, #E05828)', false, true),
    vf('bl-copper', 'Copper Flame', '#B87040', 'radial-gradient(circle at 45% 45%, #B87040 0%, #985828 60%, #784018 100%)'),
    vf('bl-molten', 'Molten', '#C84818', 'radial-gradient(circle at 45% 45%, #C84818cc 0%, #A03010bf 60%, #782008b3 100%)', true),
  ],
  tracks: [
    t('bl-1', 'Heaven Only Knows', 4, 22, 'A'),
    t('bl-2', 'Battle Lines', 4, 14, 'A'),
    t('bl-3', 'Back Down', 4, 10, 'A'),
    t('bl-4', 'Eye for an Eye', 4, 1, 'A'),
    t('bl-5', 'The Only Thing We Know', 4, 55, 'A'),
    t('bl-6', 'Nothing But You', 3, 39, 'B'),
    t('bl-7', 'Enough to Believe', 4, 39, 'B'),
    t('bl-8', 'Listen to Me', 3, 47, 'B'),
    t('bl-9', 'Selling Me Sympathy', 4, 34, 'B'),
    t('bl-10', "Don't Hold Back", 5, 1, 'B'),
    t('bl-11', 'Fallen From Your Arms', 4, 43, 'B'),
  ],
};

const bobMosesSilenceInBetween: Record = {
  id: 'bob-moses-silence-in-between',
  album: 'The Silence in Between',
  artist: 'Bob Moses',
  year: 2022,
  mood: ['introspective', 'moody', 'monochrome'],
  accentColor: '#A03030',
  labelColor: '#D06060',
  defaultFinish: 'sib-blood-red',
  coverImage: '/albums/bob-moses/the-silence-in-between.jpg',
  coverVariants: imgVariants('sib', 'linear-gradient(135deg, #F5F0EA 0%, #808080 50%, #1A1A1A 100%)', '#A03030', 'Ghost', 'brightness(1.2) contrast(0.75) saturate(0.4)'),
  vinylFinishes: [
    vf('sib-blood-red', 'Blood Red', '#A02020', 'radial-gradient(circle at 45% 45%, #A02020 0%, #781010 60%, #500808 100%)'),
    vf('sib-obsidian', 'Obsidian', '#0C0E12', 'radial-gradient(circle at 45% 45%, #181C22 0%, #0C0E12 60%, #040608 100%)'),
    vf('sib-charcoal', 'Charcoal', '#3A3840', 'radial-gradient(circle at 45% 45%, #3A3840d9 0%, #282830e0 60%, #181820e6 100%)', true),
    vf('sib-crimson-eclipse', 'Crimson Eclipse', '#601018', 'conic-gradient(from 30deg, #601018, #0C0E12, #801820, #181820, #601018)'),
    vf('sib-bone', 'Bone', '#E8E0D8', 'radial-gradient(circle at 40% 40%, #F0EBE6 0%, #E0D8D0 30%, #D0C8C0 60%, #E8E0D8 100%)'),
  ],
  tracks: [
    t('sib-1', 'Seen it Coming', 4, 13, 'A'),
    t('sib-2', 'Love Brand New', 3, 18, 'A'),
    t('sib-3', 'Never Ending', 4, 2, 'A'),
    t('sib-4', 'Time and Time Again', 5, 40, 'A'),
    t('sib-5', 'Back to You', 4, 22, 'A'),
    t('sib-6', 'Hanging On', 3, 55, 'B'),
    t('sib-7', 'The Rush', 3, 38, 'B'),
    t('sib-8', 'Broken Belief', 4, 10, 'B'),
    t('sib-9', 'Ordinary Friend', 3, 10, 'B'),
    t('sib-10', 'Believe', 5, 51, 'B'),
  ],
};

const bobMosesBlink: Record = {
  id: 'bob-moses-blink',
  album: 'Blink',
  artist: 'Bob Moses',
  year: 2025,
  mood: ['urban', 'gritty', 'visceral'],
  accentColor: '#E02020',
  labelColor: '#F06060',
  defaultFinish: 'bk-red-marble',
  coverImage: '/albums/bob-moses/blink.jpg',
  coverVariants: imgVariants('bk', 'linear-gradient(135deg, #1A1008 0%, #E02020 50%, #801010 100%)', '#E02020', 'Pulse', 'contrast(1.3) saturate(1.5) hue-rotate(-5deg)'),
  vinylFinishes: [
    vf('bk-red-marble', 'Red Marble', '#C82020', 'conic-gradient(from 30deg, #C82020, #801010, #E03030, #601010, #D82828, #C82020)', false, true),
    vf('bk-splatter', 'Splatter', '#E8E0D8', 'radial-gradient(circle at 30% 30%, #D02020 0%, transparent 15%), radial-gradient(circle at 70% 60%, #181818 0%, transparent 10%), radial-gradient(circle at 50% 80%, #C81818 0%, transparent 12%), radial-gradient(circle at 45% 45%, #E8E0D8 0%, #D8D0C8 100%)', false, true),
    vf('bk-neon-red', 'Neon Red', '#F03030', 'radial-gradient(circle at 45% 45%, #F03030cc 0%, #D01818bf 60%, #A81010b3 100%)', true),
    vf('bk-phantom', 'Phantom White', '#E8E0D8', 'radial-gradient(circle at 40% 40%, #F5F0EA 0%, #E8E0D8 30%, #D8D0C8 60%, #E0D8D0 100%)'),
    vf('bk-urban-black', 'Urban Black', '#0F1114', 'radial-gradient(circle at 45% 45%, #1E2028 0%, #0A0C10 60%, #05070A 100%)'),
  ],
  tracks: [
    t('bk-1', 'Time of Your Life', 2, 29, 'A'),
    t('bk-2', 'Waiting on the World', 3, 53, 'A'),
    t('bk-3', 'Keep Love Waiting', 3, 57, 'A'),
    t('bk-4', 'Last Forever', 5, 9, 'A'),
    t('bk-5', 'We Made It', 4, 24, 'A'),
    t('bk-6', 'Higher Ground', 3, 8, 'B'),
    t('bk-7', 'Better Broken', 3, 42, 'B'),
    t('bk-8', 'Mine to Hold', 3, 49, 'B'),
    t('bk-9', 'No One Has to Know', 2, 32, 'B'),
    t('bk-10', 'Blink', 5, 14, 'B'),
  ],
};

// ─── Generic / Fictional Records ────────────────────────

const lifeInABubble: Record = {
  id: 'life-in-a-bubble',
  album: 'Life in a Bubble',
  artist: 'Alpha & the Van',
  year: 2023,
  mood: ['dreamy', 'glassy', 'pastel'],
  accentColor: '#C5A8FF',
  labelColor: '#E8DCF8',
  defaultFinish: 'liab-lavender',
  coverVariants: [
    { id: 'liab-1', label: 'Original', gradient: 'linear-gradient(135deg, #C5A8FF 0%, #8EA5FF 50%, #E8DCF8 100%)', pattern: 'radial', accentColor: '#C5A8FF' },
    { id: 'liab-2', label: 'Sunset', gradient: 'linear-gradient(135deg, #F5A9C8 0%, #C5A8FF 50%, #8EA5FF 100%)', pattern: 'waves', accentColor: '#F5A9C8' },
    { id: 'liab-3', label: 'Frost', gradient: 'linear-gradient(135deg, #E8F0FF 0%, #C5D8FF 50%, #A8B8E8 100%)', pattern: 'dots', accentColor: '#A8B8E8' },
    { id: 'liab-4', label: 'Nebula', gradient: 'linear-gradient(135deg, #9070D8 0%, #C5A8FF 50%, #6050B0 100%)', pattern: 'radial', accentColor: '#9070D8' },
    { id: 'liab-5', label: 'Prism', gradient: 'linear-gradient(160deg, #A8D8F0 0%, #C5A8FF 33%, #F0A8C8 66%, #F0D8A8 100%)', pattern: 'lines', accentColor: '#C5A8FF' },
  ],
  vinylFinishes: [
    vf('liab-lavender', 'Lavender Dream', '#B098E0', 'radial-gradient(circle at 45% 45%, #B098E0 0%, #9078C0 60%, #7060A0 100%)'),
    vf('liab-bubble', 'Bubble', '#C0B8F0', 'conic-gradient(from 45deg, #C0B8F0, #E8B8D0, #B0D0F0, #D8C0F0, #B8E8D8, #C0B8F0)', false, true),
    vf('liab-lilac', 'Frosted Lilac', '#C8B0E0', 'radial-gradient(circle at 45% 45%, #C8B0E0cc 0%, #A890C8bf 60%, #8878B0b3 100%)', true),
    vf('liab-periwinkle', 'Periwinkle', '#8090D8', 'radial-gradient(circle at 45% 45%, #8090D8 0%, #6070B8 60%, #4858A0 100%)'),
    vf('liab-opal', 'Crystal Opal', '#D0C8E8', 'conic-gradient(from 60deg, #D0C8E8, #C0E8D8, #E0C8D0, #C8D8F0, #E0D0C8, #D0C8E8)', false, true),
  ],
  tracks: [
    t('liab-t1', 'Glass Ceiling', 3, 54, 'A'),
    t('liab-t2', 'Pastel Drift', 3, 18, 'A'),
    t('liab-t3', 'Surface Tension', 4, 27, 'A'),
    t('liab-t4', 'Refracted Light', 3, 32, 'B'),
    t('liab-t5', 'Bubble Pop', 3, 5, 'B'),
  ],
};

const midnightIndex: Record = {
  id: 'midnight-index',
  album: 'Midnight Index',
  artist: 'The Halcyon Club',
  year: 2024,
  mood: ['sleek', 'late-night', 'electronic'],
  accentColor: '#8EA5FF',
  labelColor: '#1F2430',
  defaultFinish: 'mi-indigo',
  coverVariants: [
    { id: 'mi-1', label: 'Original', gradient: 'linear-gradient(135deg, #1F2430 0%, #2A3448 50%, #8EA5FF 100%)', pattern: 'lines', accentColor: '#8EA5FF' },
    { id: 'mi-2', label: 'Neon', gradient: 'linear-gradient(135deg, #0D1117 0%, #1A1040 50%, #6B3FA0 100%)', pattern: 'grid', accentColor: '#6B3FA0' },
    { id: 'mi-3', label: 'Chrome', gradient: 'linear-gradient(135deg, #2A2D35 0%, #4A4D55 50%, #8A8D95 100%)', pattern: 'lines', accentColor: '#8A8D95' },
    { id: 'mi-4', label: 'Haze', gradient: 'linear-gradient(135deg, #101828 0%, #283848 50%, #506078 100%)', pattern: 'dots', accentColor: '#506078' },
    { id: 'mi-5', label: 'Cipher', gradient: 'linear-gradient(160deg, #0A0C10 0%, #182030 33%, #304060 66%, #0A1020 100%)', pattern: 'grid', accentColor: '#304060' },
  ],
  vinylFinishes: [
    vf('mi-indigo', 'Indigo Noir', '#1A1840', 'radial-gradient(circle at 45% 45%, #1A1840 0%, #0C0C28 60%, #040418 100%)'),
    vf('mi-circuit', 'Circuit', '#183828', 'radial-gradient(circle at 45% 45%, #183828 0%, #0C2018 60%, #04100A 100%)'),
    vf('mi-neon-grid', 'Neon Grid', '#18404A', 'conic-gradient(from 30deg, #18404A, #081820, #28606A, #0C2428, #18404A)'),
    vf('mi-void', 'Deep Void', '#08081A', 'radial-gradient(circle at 45% 45%, #0C0C20 0%, #060610 60%, #020208 100%)'),
    vf('mi-slate', 'Electric Slate', '#485868', 'radial-gradient(circle at 45% 45%, #485868cc 0%, #384858bf 60%, #283848b3 100%)', true),
  ],
  tracks: [
    t('mi-t1', 'Late Protocol', 4, 5, 'A'),
    t('mi-t2', 'Binary Sunset', 3, 30, 'A'),
    t('mi-t3', 'Index Zero', 4, 38, 'A'),
    t('mi-t4', 'Signal Lost', 3, 15, 'B'),
    t('mi-t5', 'After Hours', 4, 16, 'B'),
    t('mi-t6', 'Midnight Clear', 3, 43, 'B'),
  ],
};

const goldHourStatic: Record = {
  id: 'gold-hour-static',
  album: 'Gold Hour Static',
  artist: 'Mira Vale',
  year: 2022,
  mood: ['warm', 'nostalgic', 'soft'],
  accentColor: '#F7E6C4',
  labelColor: '#D4A854',
  defaultFinish: 'ghs-honey',
  coverVariants: [
    { id: 'ghs-1', label: 'Original', gradient: 'linear-gradient(135deg, #F7E6C4 0%, #E8C890 50%, #D4A854 100%)', pattern: 'sunburst', accentColor: '#D4A854' },
    { id: 'ghs-2', label: 'Amber', gradient: 'linear-gradient(135deg, #F5D0A0 0%, #E8A860 50%, #C88040 100%)', pattern: 'sunburst', accentColor: '#C88040' },
    { id: 'ghs-3', label: 'Honey', gradient: 'linear-gradient(135deg, #FFF0D8 0%, #F7D898 50%, #E8B860 100%)', pattern: 'radial', accentColor: '#E8B860' },
    { id: 'ghs-4', label: 'Vintage', gradient: 'linear-gradient(135deg, #E8D8C0 0%, #D0B898 50%, #B89870 100%)', pattern: 'dots', accentColor: '#B89870' },
    { id: 'ghs-5', label: 'Patina', gradient: 'linear-gradient(160deg, #C8B898 0%, #E0C8A0 33%, #B8A078 66%, #D8C090 100%)', pattern: 'lines', accentColor: '#C8B898' },
  ],
  vinylFinishes: [
    vf('ghs-honey', 'Honey Gold', '#D8B050', 'radial-gradient(circle at 45% 45%, #D8B050 0%, #B89038 60%, #987028 100%)'),
    vf('ghs-sepia', 'Vintage Sepia', '#A08058', 'radial-gradient(circle at 45% 45%, #A08058 0%, #806840 60%, #605030 100%)'),
    vf('ghs-amber-glass', 'Amber Glass', '#C89840', 'radial-gradient(circle at 45% 45%, #C89840cc 0%, #A87828bf 60%, #886020b3 100%)', true),
    vf('ghs-rose-gold', 'Rose Gold', '#D8A088', 'radial-gradient(circle at 45% 45%, #D8A088 0%, #C08870 60%, #A07058 100%)'),
    vf('ghs-wheat', 'Wheat Pearl', '#E8D8C0', 'radial-gradient(circle at 40% 40%, #F0EBE0 0%, #E8D8C0 30%, #D8C8B0 60%, #E0D0B8 100%)'),
  ],
  tracks: [
    t('ghs-t1', 'Golden Window', 3, 35, 'A'),
    t('ghs-t2', 'Film Grain', 4, 8, 'A'),
    t('ghs-t3', 'Static Warmth', 3, 12, 'A'),
    t('ghs-t4', 'Faded Polaroid', 3, 50, 'B'),
    t('ghs-t5', 'Hour Passing', 4, 30, 'B'),
  ],
};

const softMachines: Record = {
  id: 'soft-machines',
  album: 'Soft Machines',
  artist: 'Aero Bloom',
  year: 2024,
  mood: ['futuristic', 'airy', 'minimal'],
  accentColor: '#A9E7D1',
  labelColor: '#E0F5ED',
  defaultFinish: 'sm-seafoam',
  coverVariants: [
    { id: 'sm-1', label: 'Original', gradient: 'linear-gradient(135deg, #A9E7D1 0%, #7FC7F4 50%, #E0F5ED 100%)', pattern: 'waves', accentColor: '#A9E7D1' },
    { id: 'sm-2', label: 'Neural', gradient: 'linear-gradient(135deg, #D0F0E8 0%, #A0D8C8 50%, #70B8A8 100%)', pattern: 'grid', accentColor: '#70B8A8' },
    { id: 'sm-3', label: 'Cloud', gradient: 'linear-gradient(135deg, #F0F8FF 0%, #D8F0F8 50%, #B0E0F0 100%)', pattern: 'radial', accentColor: '#B0E0F0' },
    { id: 'sm-4', label: 'Matrix', gradient: 'linear-gradient(135deg, #70C8A8 0%, #50A888 50%, #308868 100%)', pattern: 'lines', accentColor: '#50A888' },
    { id: 'sm-5', label: 'Vapor', gradient: 'linear-gradient(160deg, #C0E8E0 0%, #A8D8D0 33%, #D8F0F0 66%, #B0E0D8 100%)', pattern: 'dots', accentColor: '#B0E0D8' },
  ],
  vinylFinishes: [
    vf('sm-seafoam', 'Seafoam', '#78C8B0', 'radial-gradient(circle at 45% 45%, #78C8B0 0%, #58A890 60%, #408878 100%)'),
    vf('sm-mint', 'Mint Frost', '#A0E0C8', 'radial-gradient(circle at 45% 45%, #A0E0C8cc 0%, #80C8B0bf 60%, #60B098b3 100%)', true),
    vf('sm-sage', 'Sage Cloud', '#88A898', 'radial-gradient(circle at 45% 45%, #88A898d9 0%, #689080e0 60%, #507868e6 100%)', true),
    vf('sm-eucalyptus', 'Eucalyptus', '#408868', 'radial-gradient(circle at 45% 45%, #408868 0%, #286848 60%, #185038 100%)'),
    vf('sm-dew', 'Dew Drop', '#B0E0D0', 'radial-gradient(circle at 45% 45%, #B0E0D0cc 0%, #90C8B8bf 60%, #78B8A8b3 100%)', true),
  ],
  tracks: [
    t('sm-t1', 'Boot Sequence', 3, 8, 'A'),
    t('sm-t2', 'Soft Reset', 3, 54, 'A'),
    t('sm-t3', 'Cloud Layer', 3, 21, 'A'),
    t('sm-t4', 'Gentle Machine', 4, 27, 'B'),
    t('sm-t5', 'Dissolve', 3, 40, 'B'),
  ],
};

const ceramicSky: Record = {
  id: 'ceramic-sky',
  album: 'Ceramic Sky',
  artist: 'June Harbor',
  year: 2023,
  mood: ['calm', 'coastal', 'atmospheric'],
  accentColor: '#7FC7F4',
  labelColor: '#D0E8F8',
  defaultFinish: 'cs-sky',
  coverVariants: [
    { id: 'cs-1', label: 'Original', gradient: 'linear-gradient(135deg, #7FC7F4 0%, #A0D8F0 50%, #D0E8F8 100%)', pattern: 'waves', accentColor: '#7FC7F4' },
    { id: 'cs-2', label: 'Tide', gradient: 'linear-gradient(135deg, #90B8D8 0%, #6898B8 50%, #486878 100%)', pattern: 'lines', accentColor: '#6898B8' },
    { id: 'cs-3', label: 'Shore', gradient: 'linear-gradient(135deg, #E8E0D8 0%, #C8B8A0 50%, #A09080 100%)', pattern: 'dots', accentColor: '#C8B8A0' },
    { id: 'cs-4', label: 'Reef', gradient: 'linear-gradient(135deg, #4890A8 0%, #60A8C0 50%, #80C8E0 100%)', pattern: 'radial', accentColor: '#60A8C0' },
    { id: 'cs-5', label: 'Driftwood', gradient: 'linear-gradient(160deg, #B0A898 0%, #C8C0B0 33%, #90887C 66%, #D0C8B8 100%)', pattern: 'sunburst', accentColor: '#B0A898' },
  ],
  vinylFinishes: [
    vf('cs-sky', 'Sky Blue', '#78B8E0', 'radial-gradient(circle at 45% 45%, #78B8E0 0%, #5898C0 60%, #3878A0 100%)'),
    vf('cs-tide', 'Tide Pool', '#508898', 'radial-gradient(circle at 45% 45%, #508898cc 0%, #387080bf 60%, #285868b3 100%)', true),
    vf('cs-pearl-shore', 'Pearl Shore', '#D8D0C0', 'radial-gradient(circle at 40% 40%, #E8E0D8 0%, #D8D0C0 30%, #C8C0B0 60%, #D0C8B8 100%)'),
    vf('cs-storm', 'Storm Cloud', '#586878', 'radial-gradient(circle at 45% 45%, #586878d9 0%, #405060e0 60%, #303848e6 100%)', true),
    vf('cs-horizon', 'Horizon', '#68A8C8', 'radial-gradient(circle at 45% 45%, #68A8C8cc 0%, #5090B0bf 60%, #387898b3 100%)', true),
  ],
  tracks: [
    t('cs-t1', 'Tidepool', 4, 2, 'A'),
    t('cs-t2', 'Salt Air', 3, 18, 'A'),
    t('cs-t3', 'Ceramic Blue', 4, 35, 'A'),
    t('cs-t4', 'Harbor Light', 3, 30, 'B'),
    t('cs-t5', 'Low Fog', 4, 15, 'B'),
    t('cs-t6', 'Coastal End', 3, 9, 'B'),
  ],
};

const velvetWeather: Record = {
  id: 'velvet-weather',
  album: 'Velvet Weather',
  artist: 'Luma District',
  year: 2024,
  mood: ['lush', 'colorful', 'editorial'],
  accentColor: '#F5A9C8',
  labelColor: '#F8D8E8',
  defaultFinish: 'vw-velvet-rose',
  coverVariants: [
    { id: 'vw-1', label: 'Original', gradient: 'linear-gradient(135deg, #F5A9C8 0%, #C5A8FF 50%, #F8D8E8 100%)', pattern: 'radial', accentColor: '#F5A9C8' },
    { id: 'vw-2', label: 'Bloom', gradient: 'linear-gradient(135deg, #FF90B0 0%, #E870A0 50%, #C85080 100%)', pattern: 'waves', accentColor: '#E870A0' },
    { id: 'vw-3', label: 'Dusk', gradient: 'linear-gradient(135deg, #E8C8D8 0%, #C8A0B8 50%, #987890 100%)', pattern: 'lines', accentColor: '#C8A0B8' },
    { id: 'vw-4', label: 'Velvet', gradient: 'linear-gradient(135deg, #8B2040 0%, #A03058 50%, #C85080 100%)', pattern: 'dots', accentColor: '#A03058' },
    { id: 'vw-5', label: 'Garden', gradient: 'linear-gradient(160deg, #D098B8 0%, #E8B0D0 33%, #B888A0 66%, #F0C0D8 100%)', pattern: 'sunburst', accentColor: '#D098B8' },
  ],
  vinylFinishes: [
    vf('vw-velvet-rose', 'Velvet Rose', '#A03050', 'radial-gradient(circle at 45% 45%, #A03050 0%, #802038 60%, #601028 100%)'),
    vf('vw-petal', 'Petal Pink', '#E898B0', 'radial-gradient(circle at 45% 45%, #E898B0 0%, #D07898 60%, #B86080 100%)'),
    vf('vw-mauve', 'Mauve Bloom', '#9868A0', 'radial-gradient(circle at 45% 45%, #9868A0cc 0%, #785088bf 60%, #584070b3 100%)', true),
    vf('vw-berry', 'Berry Crush', '#702040', 'radial-gradient(circle at 45% 45%, #702040 0%, #501030 60%, #380820 100%)'),
    vf('vw-orchid', 'Orchid', '#C870B0', 'conic-gradient(from 30deg, #C870B0, #E098D0, #A050A0, #D080C0, #B060A8, #C870B0)', false, true),
  ],
  tracks: [
    t('vw-t1', 'Velvet Morning', 3, 46, 'A'),
    t('vw-t2', 'Weather System', 4, 14, 'A'),
    t('vw-t3', 'Luma Glow', 3, 19, 'A'),
    t('vw-t4', 'District Lights', 4, 1, 'B'),
    t('vw-t5', 'Soft Collapse', 3, 38, 'B'),
  ],
};

// ─── Export ─────────────────────────────────────────────

export const records: Record[] = [
  cannonsUpAllNight,
  cannonsNightDrive,
  cannonsInAHeartbeat,
  cannonsShadows,
  cannonsShadowsMidnight,
  cannonsFeverDream,
  cannonsHeartbeatHighway,
  cannonsEverythingGlows,
  bobMosesDaysGoneBy,
  bobMosesBattleLines,
  bobMosesSilenceInBetween,
  bobMosesBlink,
  lifeInABubble,
  midnightIndex,
  goldHourStatic,
  softMachines,
  ceramicSky,
  velvetWeather,
];
