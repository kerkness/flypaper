import { useState, useEffect } from "react";
import useDebounce from './useDebounce';

export const useScreen = () => {

    const [screen, setScreen] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
    })
    const windowSize = useWindowSize();
    const size = useDebounce(windowSize);
    
    useEffect(() => {
        if (isNaN(size.width)) return;

        setScreen({
            isMobile: size.width <= 600,
            isTabled: size.width > 600 && size.width <= 1080,
            isDesktop: size.width > 1080,
        })

    }, [])

    return screen;
}

// Hook
export default function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}