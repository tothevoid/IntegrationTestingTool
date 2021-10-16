export const uuidv4 = () => 
    ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

export const formatFileSize = (fileSize) => {
    debugger;
    if (typeof(fileSize) !== "number"){
        return '0';
    }

    const postFixes = ["GB", "MB", "KB"];
    let currentPostfix = "B";
    const step = 1024;

    while (fileSize > 1024 && postFixes.length !== 0){
        fileSize = fileSize / step;
        currentPostfix = postFixes.pop();
    }

    return `${fileSize.toFixed(2)} ${currentPostfix}`;
}