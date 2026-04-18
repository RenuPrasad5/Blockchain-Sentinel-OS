import { create } from 'zustand';

const useOnboardingStore = create((set) => ({
    isDemoMode: false,
    showWalkthrough: false,
    walkthroughStep: 0,
    hasCompletedOnboarding: localStorage.getItem('sentinel_onboarding_complete') === 'true',

    setDemoMode: (val) => set({ isDemoMode: val }),
    setShowWalkthrough: (val) => set({ showWalkthrough: val }),
    setWalkthroughStep: (step) => set({ walkthroughStep: step }),
    completeOnboarding: () => {
        localStorage.setItem('sentinel_onboarding_complete', 'true');
        set({ hasCompletedOnboarding: true, showWalkthrough: false });
    },
    resetOnboarding: () => {
        localStorage.removeItem('sentinel_onboarding_complete');
        set({ hasCompletedOnboarding: false, showWalkthrough: false, walkthroughStep: 0 });
    }
}));

export default useOnboardingStore;
