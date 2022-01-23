import React from 'react';
import { useNav } from "../nav/navSlice";
import { removeAllPaper, usePaper } from "./paperSlice";

const PaperLoader = React.createContext(null);

const usePaperLoader = () => React.useContext(PaperLoader);

const PaperLoaderProvider = (props) => {

    const { sort, offset, setOffset, search } = useNav();
    const {
        papers,
        addPapers,
        setPapers,
        setError,
        setHasNextPage,
        mosaic,
    } = usePaper();

    const gridLimit = 120;

    const loadPaper = (win, isGrid = false, page = 0) => {

        return new Promise( (resolve, reject) => {

            const useOffset = isGrid
                ? page * gridLimit
                : offset;

            api.axiosGet('/api/paper', {
                offset: useOffset,
                sort,
                search,
                ...win,
                mosaic,
                ...isGrid ? { limit: gridLimit } : {}
            })
            .then(response => {
                if (response.data && response.data.papers) {
                    const loadedPaper = response.data.papers;
    
                    if (papers.length + loadedPaper.length >= response.data.total) {
                        setHasNextPage(false);
                    }
                    setOffset(papers.length + response.data.papers.length);

                    if (isGrid) {
                        setPapers(response.data.papers);

                        if (papers.length + useOffset + loadedPaper.length >= response.data.total) {
                            setHasNextPage(false);
                        }

                    } else {
                        addPapers(response.data.papers);
                    }

                }    
                resolve(true);

            }).catch(error => {
                setError(true);                
                reject(error);
            });
    

        })


    }

    return (
        <PaperLoader.Provider
            value={{
                gridLimit,
                loadPaper,
            }}
        >
            {props.children}
        </PaperLoader.Provider>
    )
}

export { PaperLoaderProvider, usePaperLoader }