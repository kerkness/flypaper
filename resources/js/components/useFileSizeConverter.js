

export const displayByteSize = (bytes) => {

    let size = bytes; // just init the variables.
    let label = "B";

    // If it's less than meg, show kilobytes
    if (bytes < 1024000 && bytes >= 1024) {
        size = kiloByte(bytes);
        label = "KB";
    }
    else if (bytes >= 1024000) {
        size = megaByte(bytes);
        label = "MB";
    }

    return `${size} ${label}`;
}

export const kiloByte = (bytes) => {
    const megs = bytes / 1024;
    return Math.round(megs * 100)/100;
}

export const megaByte = (bytes) => {
    const megs = bytes / 1000000;
    return Math.round(megs * 100)/100;
}