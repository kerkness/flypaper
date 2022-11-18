import { Button } from '@mui/material';
import React from 'react';


const SavePathButton = (props) => {

    const { category, onSelected } = props;

    const handleSelectDirectory = async() => {

        try {

            let directory = await window.showDirectoryPicker({
                startIn: 'desktop'
            });

            console.log("Selected directory", directory);

            let files = [];

            for await (const entry of directory.values()) {
                if (entry.kind === 'file') {
                    files.push(entry.name);
                }
            }

            onSelected(directory, files);

        } catch( error ) {
            console.log("Error selecting directory", error );
        }
    }


    return <Button variant='contained' onClick={handleSelectDirectory}>
        Select Path
    </Button>
    
}

export default SavePathButton;