var initObj = {
    theme: "fas",
    //支援中文
    language: "zh-TW",
    autoReplace: true,
    showRemove: false,
    previewFileType: "any",
    uploadAsync: true,
    maxFileCount: 1,
    overwriteInitial: true,
    showUploadedThumbs: false,
    initialPreviewShowDelete: false,
    maxFileSize: 2 * 1024,
    //allowedFileExtensions: ["doc", "docx", "ppt", "pptx", "zip", "rar", "pdf"],
    allowedPreviewTypes: ["image", "html", "text"],
    fileActionSettings: {
        showZoom: function (config) {
            if (config.type === "pdf" || config.type === "image") {
                return true;
            }
            return false;
        }
    },
    initialPreviewAsData: true,
    preferIconicPreview: true,
    // configure your icon file extensions
    previewFileIconSettings: {
        doc: '<i class="fas fa-file-word text-primary"></i>',
        xls: '<i class="fas fa-file-excel text-success"></i>',
        ppt: '<i class="fas fa-file-powerpoint text-danger"></i>',
        pdf: '<i class="fas fa-file-pdf text-danger"></i>',
        zip: '<i class="fas fa-file-archive text-muted"></i>',
        rar: '<i class="fas fa-file-archive text-muted"></i>',
        htm: '<i class="fas fa-file-code text-info"></i>',
        txt: '<i class="fas fa-file-alt text-info"></i>',
        mov: '<i class="fas fa-file-video text-warning"></i>',
        mp3: '<i class="fas fa-file-audio text-warning"></i>',
        jpg: '<i class="fas fa-file-image text-danger"></i>',
        gif: '<i class="fas fa-file-image text-muted"></i>',
        png: '<i class="fas fa-file-image text-primary"></i>',
        odt: '<i class="fas fa-file-alt text-primary"></i>',
        ods: '<i class="fas fa-file-alt text-primary"></i>',
        odp: '<i class="fas fa-file-alt text-primary"></i>'
    },
    // configure the logic for determining icon file extensions
    previewFileExtSettings: {
        doc: function (ext) {
            return ext.match(/(doc|docx)$/i);
        },
        xls: function (ext) {
            return ext.match(/(xls|xlsx)$/i);
        },
        ppt: function (ext) {
            return ext.match(/(ppt|pptx)$/i);
        },
        zip: function (ext) {
            return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
        },
        htm: function (ext) {
            return ext.match(/(htm|html)$/i);
        },
        txt: function (ext) {
            return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
        },
        mov: function (ext) {
            return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
        },
        mp3: function (ext) {
            return ext.match(/(mp3|wav)$/i);
        },
        odt: function (ext) {
            return ext.match(/(odt|ods|odp)$/i);
        }
    }
};

