import React from 'react';
import { useNav } from "../nav/navSlice";
import { usePaper } from "./paperSlice";

const PaperLoader = React.createContext(null);

const usePaperLoader = () => React.useContext(PaperLoader);

const PaperLoaderProvider = (props) => {

    const { sort, offset, setOffset, search } = useNav();
    const {
        papers,
        addPapers,
        setError,
        setHasNextPage,
        mosaic,
    } = usePaper();


    const loadPaper = (win) => {

        return new Promise( (resolve, reject) => {

            api.axiosGet('/api/paper', {
                offset,
                sort,
                search,
                ...win,
                mosaic,
            })
            .then(response => {
                if (response.data && response.data.papers) {
                    const loadedPaper = response.data.papers;
    
                    if (papers.length + loadedPaper.length >= response.data.total) {
                        setHasNextPage(false);
                    }
                    setOffset(papers.length + response.data.papers.length);
                    addPapers(response.data.papers);
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
                loadPaper,
            }}
        >
            {props.children}
        </PaperLoader.Provider>
    )
}

export { PaperLoaderProvider, usePaperLoader }