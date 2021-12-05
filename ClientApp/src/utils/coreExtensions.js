export const formatFileSize = (fileSize) => {
    if (typeof(fileSize) !== "number"){
        return '0';
    }

    const postfixes = ["GB", "MB", "KB"];
    let currentPostfix = "B";
    const step = 1024;

    while (fileSize > 1024 && postfixes.length !== 0){
        fileSize = fileSize / step;
        currentPostfix = postfixes.pop();
    }

    return `${fileSize.toFixed(2)} ${currentPostfix}`;
}

export const isUrl = (text) =>
    typeof(text) === "string" && text &&
        text.match(/https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?((?:\/\w+)|(?:-\w+))*\/?(?![^<]*(?:<\/\w+>|\/?>))/)
