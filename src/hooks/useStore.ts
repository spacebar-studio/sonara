import { useState, useCallback, useRef, useEffect } from 'react';
import { records, type Record, type Track } from '../data/records';

export type AppState =
  | 'idle'
  | 'browsing'
  | 'focusedRecord'
  | 'customizing'
  | 'vinylExtracted'
  | 'placing'
  | 'playing'
  | 'paused'
  | 'scrubbing';

export type PanelState = 'none' | 'trackList' | 'settings';

export interface Store {
  appState: AppState;
  panelState: PanelState;
  selectedRecord: Record | null;
  selectedCoverIndex: number;
  selectedFinish: string;
  activeSide: 'A' | 'B';
  activeTrack: Track | null;
  activeTrackIndex: number;
  playbackProgress: number;
  searchQuery: string;
  rpm: 33 | 45 | 78;
  condition: 'mint' | 'warm' | 'worn';
  tracking: number;
  antiSkate: number;
  filteredRecords: Record[];
  recordCustomizations: { [id: string]: { coverIndex: number; finish: string } };

  selectRecord: (record: Record) => void;
  deselectRecord: () => void;
  extractVinyl: () => void;
  placeOnPlatter: () => void;
  startPlayback: () => void;
  pausePlayback: () => void;
  togglePlayback: () => void;
  startScrub: () => void;
  endScrub: () => void;
  setProgress: (p: number) => void;
  setCoverIndex: (i: number) => void;
  setFinish: (f: string) => void;
  setSide: (s: 'A' | 'B') => void;
  setActiveTrack: (track: Track, index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setSearchQuery: (q: string) => void;
  togglePanel: (panel: PanelState) => void;
  setRpm: (r: 33 | 45 | 78) => void;
  setCondition: (c: 'mint' | 'warm' | 'worn') => void;
  setTracking: (t: number) => void;
  setAntiSkate: (a: number) => void;
  swapRecord: () => void;
}

export function useStore(): Store {
  const [appState, setAppState] = useState<AppState>('idle');
  const [panelState, setPanelState] = useState<PanelState>('none');
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState<string>('classic-black');
  const [activeSide, setActiveSide] = useState<'A' | 'B'>('A');
  const [activeTrack, setActiveTrackState] = useState<Track | null>(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [rpm, setRpm] = useState<33 | 45 | 78>(33);
  const [condition, setCondition] = useState<'mint' | 'warm' | 'worn'>('mint');
  const [tracking, setTracking] = useState(50);
  const [antiSkate, setAntiSkate] = useState(50);
  const prevStateRef = useRef<AppState>('idle');
  const [recordCustomizations, setRecordCustomizations] = useState<{ [id: string]: { coverIndex: number; finish: string } }>({});
  const customizationsRef = useRef(recordCustomizations);
  customizationsRef.current = recordCustomizations;
  const selectedRecordRef = useRef<Record | null>(null);
  selectedRecordRef.current = selectedRecord;

  useEffect(() => {
    if (selectedRecord) {
      setRecordCustomizations(prev => ({
        ...prev,
        [selectedRecord.id]: {
          coverIndex: selectedCoverIndex,
          finish: selectedFinish,
        },
      }));
    }
  }, [selectedRecord, selectedCoverIndex, selectedFinish]);

  const filteredRecords = searchQuery
    ? records.filter(
        (r) =>
          r.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.mood.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : records;

  const selectRecord = useCallback((record: Record) => {
    setSelectedRecord(record);
    const saved = customizationsRef.current[record.id];
    setSelectedCoverIndex(saved?.coverIndex ?? 0);
    setSelectedFinish(saved?.finish ?? record.defaultFinish);
    const firstTrack = record.tracks.find((t) => t.side === 'A') || record.tracks[0];
    setActiveTrackState(firstTrack);
    setActiveTrackIndex(0);
    setPlaybackProgress(0);
    setActiveSide('A');
    setAppState('focusedRecord');
    setPanelState('none');
  }, []);

  const deselectRecord = useCallback(() => {
    setAppState('idle');
    setPanelState('none');
    setTimeout(() => {
      setSelectedRecord(null);
      setPlaybackProgress(0);
    }, 500);
  }, []);

  const extractVinyl = useCallback(() => {
    setAppState('vinylExtracted');
  }, []);

  const placeOnPlatter = useCallback(() => {
    setAppState('placing');
    setTimeout(() => {
      setAppState('paused');
    }, 800);
  }, []);

  const startPlayback = useCallback(() => {
    setAppState('playing');
  }, []);

  const pausePlayback = useCallback(() => {
    setAppState('paused');
  }, []);

  const togglePlayback = useCallback(() => {
    setAppState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
  }, []);

  const startScrub = useCallback(() => {
    setAppState((prev) => {
      prevStateRef.current = prev;
      return 'scrubbing';
    });
  }, []);

  const endScrub = useCallback(() => {
    setAppState(prevStateRef.current === 'paused' ? 'paused' : 'playing');
  }, []);

  const setProgress = useCallback((p: number) => {
    setPlaybackProgress(Math.max(0, Math.min(1, p)));
  }, []);

  const setCoverIndex = useCallback((i: number) => {
    setSelectedCoverIndex(i);
  }, []);

  const setFinish = useCallback((f: string) => {
    setSelectedFinish(f);
  }, []);

  const setSide = useCallback((s: 'A' | 'B') => {
    setActiveSide(s);
  }, []);

  const setActiveTrack = useCallback((track: Track, index: number) => {
    setActiveTrackState(track);
    setActiveTrackIndex(index);
    setPlaybackProgress(0);
  }, []);

  const nextTrack = useCallback(() => {
    if (!selectedRecord) return;
    const sideTracks = selectedRecord.tracks.filter((t) => t.side === activeSide);
    const currentIdx = sideTracks.findIndex((t) => t.id === activeTrack?.id);
    const nextIdx = (currentIdx + 1) % sideTracks.length;
    setActiveTrackState(sideTracks[nextIdx]);
    setActiveTrackIndex(nextIdx);
    setPlaybackProgress(0);
  }, [selectedRecord, activeSide, activeTrack]);

  const prevTrack = useCallback(() => {
    if (!selectedRecord) return;
    const sideTracks = selectedRecord.tracks.filter((t) => t.side === activeSide);
    const currentIdx = sideTracks.findIndex((t) => t.id === activeTrack?.id);
    const prevIdx = (currentIdx - 1 + sideTracks.length) % sideTracks.length;
    setActiveTrackState(sideTracks[prevIdx]);
    setActiveTrackIndex(prevIdx);
    setPlaybackProgress(0);
  }, [selectedRecord, activeSide, activeTrack]);

  const togglePanel = useCallback((panel: PanelState) => {
    setPanelState((prev) => (prev === panel ? 'none' : panel));
  }, []);

  const swapRecord = useCallback(() => {
    const record = selectedRecordRef.current;
    if (record) {
      setRecordCustomizations(prev => {
        const next = { ...prev };
        delete next[record.id];
        return next;
      });
    }
    setAppState('idle');
    setPanelState('none');
    setTimeout(() => {
      setSelectedRecord(null);
      setPlaybackProgress(0);
      setActiveTrackState(null);
    }, 500);
  }, []);

  return {
    appState,
    panelState,
    selectedRecord,
    selectedCoverIndex,
    selectedFinish,
    activeSide,
    activeTrack,
    activeTrackIndex,
    playbackProgress,
    searchQuery,
    rpm,
    condition,
    tracking,
    antiSkate,
    filteredRecords,
    recordCustomizations,
    selectRecord,
    deselectRecord,
    extractVinyl,
    placeOnPlatter,
    startPlayback,
    pausePlayback,
    togglePlayback,
    startScrub,
    endScrub,
    setProgress,
    setCoverIndex,
    setFinish,
    setSide,
    setActiveTrack,
    nextTrack,
    prevTrack,
    setSearchQuery,
    togglePanel,
    setRpm,
    setCondition,
    setTracking,
    setAntiSkate,
    swapRecord,
  };
}
