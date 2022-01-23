import React from 'react';
import _ from 'lodash';
import PaperLightboxModal from './PaperLightboxModal';
import { usePaper } from '../paperSlice';


export const LightboxContext = React.createContext();


const LightboxProvider = (props) => {

    const { papers } = usePaper();
    const [open, setOpen] = React.useState(false);
    const [currentPaper, setCurrentPaper] = React.useState(null);

    const openPaper = (paper) => {
        setCurrentPaper(paper);
        setOpen(true);
    }

    const nextPaper = () => {
        const count = papers.length;
        const index = _.findIndex(papers, pap => pap.id === currentPaper.id);
        const next = index === count - 1
            ? 0
            : index + 1
        const nextPap = papers[next];
        setCurrentPaper(nextPap);
    }
    const prevPaper = () => {
        const count = papers.length;
        const index = _.findIndex(papers, pap => pap.id === currentPaper.id);
        const prev = index === 0
            ? count - 1
            : index - 1
            const prevPap = papers[prev];
            setCurrentPaper(prevPap);
    }
    const onClose = () => {
        setOpen(false);
    }

    return <LightboxContext.Provider value={{
        open,
        currentPaper: currentPaper || {},
        openPaper,
        nextPaper,
        prevPaper,
        onClose,
    }}>
        {props.children}
        {currentPaper !== null && <PaperLightboxModal />}
    </LightboxContext.Provider>

}

export const useLightbox = () => {
    return React.useContext(LightboxContext);
}

export default LightboxProvider