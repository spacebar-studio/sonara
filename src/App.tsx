import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from './hooks/useStore';
import { usePlayback } from './hooks/usePlayback';
import TopBar from './components/TopBar';
import Bookshelf from './components/Bookshelf';
import HeroStage from './components/HeroStage';
import OnboardingOverlay, { ONBOARDING_STEP_COUNT } from './components/OnboardingOverlay';
import DesignPresentation from './components/DesignPresentation';
import './styles/design-system.css';

function App() {
  const store = useStore();
  const [loaded, setLoaded] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [presentationActive, setPresentationActive] = useState(false);
  const [captureMode, setCaptureMode] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  const isPlaying = store.appState === 'playing';
  const trackDuration = store.activeTrack?.duration || 200;

  usePlayback(
    isPlaying,
    trackDuration,
    store.playbackProgress,
    store.setProgress,
    store.nextTrack
  );

  const isReceded = !['idle', 'browsing'].includes(store.appState);

  const handleStartTour = useCallback(() => {
    setTourStep(0);
    setTourActive(true);
  }, []);

  const handleCloseTour = useCallback(() => {
    setTourActive(false);
    setTourStep(0);
  }, []);

  const handleStartPresentation = useCallback(() => {
    setPresentationActive(true);
  }, []);

  const handleClosePresentation = useCallback(() => {
    setPresentationActive(false);
  }, []);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: JSZip }] = await Promise.all([
        import('html2canvas-pro'),
        import('jszip'),
      ]);
      const target = appRef.current;
      if (!target) return;

      const zip = new JSZip();
      const stepNames = [
        '00-welcome',
        '01-the-shelf',
        '02-the-record',
        '03-cover-styles',
        '04-the-vinyl',
        '05-vinyl-finishes',
        '06-artifacts',
        '07-the-platter',
        '08-playback-settings',
        '09-conclusion',
      ];

      setCaptureMode(true);
      setTourStep(0);
      setTourActive(true);

      await new Promise(r => setTimeout(r, 200));

      for (let i = 0; i < ONBOARDING_STEP_COUNT; i++) {
        setTourStep(i);
        const settleTime = i <= 1 ? 600 : 2000;
        await new Promise(r => setTimeout(r, settleTime));

        const canvas = await html2canvas(target, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#F5F7FB',
          width: target.scrollWidth,
          height: target.scrollHeight,
        });
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), 'image/png', 1.0)
        );
        zip.file(`${stepNames[i] || `step-${i + 1}`}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sonara-tour-screenshots.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setCaptureMode(false);
      setTourActive(false);
      setTourStep(0);
      store.swapRecord();
      setDownloading(false);
    }
  }, [downloading, store.swapRecord]);

  return (
    <div ref={appRef} style={styles.app}>
      <div style={styles.bgGradient} />

      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{
          opacity: loaded ? 1 : 0,
          filter: loaded ? 'blur(0px)' : 'blur(8px)',
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={styles.appInner}
      >
        <TopBar
          searchQuery={store.searchQuery}
          onSearchChange={store.setSearchQuery}
          hasActiveRecord={store.selectedRecord !== null && isReceded}
          onSwap={store.swapRecord}
          onStartTour={handleStartTour}
          onStartPresentation={handleStartPresentation}
          onDownload={handleDownload}
        />

        <div style={styles.content}>
          <HeroStage
            appState={store.appState}
            panelState={store.panelState}
            record={store.selectedRecord}
            coverIndex={store.selectedCoverIndex}
            finish={store.selectedFinish}
            activeSide={store.activeSide}
            activeTrack={store.activeTrack}
            activeTrackIndex={store.activeTrackIndex}
            progress={store.playbackProgress}
            rpm={store.rpm}
            condition={store.condition}
            tracking={store.tracking}
            antiSkate={store.antiSkate}
            onExtract={store.extractVinyl}
            onPlace={store.placeOnPlatter}
            onTogglePlayback={store.togglePlayback}
            onStartScrub={store.startScrub}
            onEndScrub={store.endScrub}
            onSetProgress={store.setProgress}
            onCoverChange={store.setCoverIndex}
            onFinishChange={store.setFinish}
            onSideChange={store.setSide}
            onTrackSelect={store.setActiveTrack}
            onNextTrack={store.nextTrack}
            onPrevTrack={store.prevTrack}
            onTogglePanel={store.togglePanel}
            onRpmChange={store.setRpm}
            onConditionChange={store.setCondition}
            onTrackingChange={store.setTracking}
            onAntiSkateChange={store.setAntiSkate}
          />

          <Bookshelf
            records={store.filteredRecords}
            selectedRecord={store.selectedRecord}
            onSelect={store.selectRecord}
            isReceded={isReceded}
            recordCustomizations={store.recordCustomizations}
          />
        </div>
      </motion.div>

      <DesignPresentation
        isActive={presentationActive}
        onClose={handleClosePresentation}
        selectRecord={store.selectRecord}
        extractVinyl={store.extractVinyl}
        placeOnPlatter={store.placeOnPlatter}
        togglePanel={store.togglePanel}
        swapRecord={store.swapRecord}
        deselectRecord={store.deselectRecord}
        panelState={store.panelState}
        setCoverIndex={store.setCoverIndex}
        setFinish={store.setFinish}
      />

      <OnboardingOverlay
        isActive={tourActive}
        onClose={handleCloseTour}
        captureMode={captureMode}
        selectRecord={store.selectRecord}
        extractVinyl={store.extractVinyl}
        placeOnPlatter={store.placeOnPlatter}
        startPlayback={store.startPlayback}
        pausePlayback={store.pausePlayback}
        swapRecord={store.swapRecord}
        appState={store.appState}
        step={tourStep}
        onStepChange={setTourStep}
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    height: '100%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  appInner: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
  bgGradient: {
    position: 'fixed',
    inset: 0,
    background: `
      radial-gradient(ellipse at 15% 15%, rgba(142, 165, 255, 0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 85%, rgba(197, 168, 255, 0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 40%, rgba(127, 199, 244, 0.04) 0%, transparent 60%),
      linear-gradient(180deg, #F5F7FB 0%, #EEF2FA 100%)
    `,
    zIndex: 0,
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    gap: '24px',
    paddingTop: '24px',
    paddingBottom: '12px',
  },
};

export default App;
