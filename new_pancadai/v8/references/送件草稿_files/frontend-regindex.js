$(function () {
    "use strict";

    var PAGE_CODE = ".wrapper",
        FILE_UPLOAD_OBJ = {
            theme: "fas",
            //支援中文
            language: "zh-TW",
            autoReplace: true,
            showRemove: false,
            showUpload: false,
            showPreview: true,
            maxFileCount: 1,
            uploadAsync: true,
            msgPlaceholder: "您尚未上傳檔案。可瀏覽資料夾點選或直接拖曳上傳。",
            enctype: "multipart/form-data",
            showUploadedThumbs: false,
            previewFileType: Image,
            previewFileIconSettings: {
                doc: '<i class="fas fa-file-word-o text-primary"></i>',
                xls: '<i class="fas fa-file-excel-o text-success"></i>',
                ppt: '<i class="fas fa-file-powerpoint-o text-danger"></i>',
                pdf: '<i class="fas fa-file-pdf-o text-danger"></i>',
                zip: '<i class="fas fa-file-archive-o text-muted"></i>',
                rar: '<i class="fas fa-file-archive-o text-muted"></i>',
                htm: '<i class="fas fa-file-code-o text-info"></i>',
                txt: '<i class="fas fa-file-text-o text-info"></i>',
                mov: '<i class="fas fa-file-video-o text-warning"></i>',
                mp3: '<i class="fas fa-file-audio-o text-warning"></i>',
                jpg: '<i class="fas fa-file-image-o text-danger"></i>',
                gif: '<i class="fas fa-file-image-o text-muted"></i>',
                png: '<i class="fas fa-file-image-o text-primary"></i>',
                odt: '<i class="fas fa-file-o text-primary"></i>'
            },
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
            },
            fileActionSettings: {
                showZoom: false
            }
            ,
            // 以 font-awesome icon 替代預設含 <span aria-hidden> 的 remove 符號
            removeIcon: '<i class="fas fa-times"></i>'
        };

    var IMG_UPLOAD_OBJ = {
        theme: "fas",
        language: "zh-TW",
        autoReplace: true,
        showRemove: false,
        showUpload: false,
        showPreview: true,
        maxFileCount: 1,
        uploadAsync: true,
        msgPlaceholder: "選擇圖片",
        // 自訂拖放區文字 (顯示為主要提示)
        dropZoneTitle: "選填。每題限上傳一張圖檔，JPEG/JPG &lt;2 MB",
        dropZoneClickTitle: "或點擊此處以選擇圖片",
        enctype: "multipart/form-data",
        showUploadedThumbs: false,
        previewFileType: "image",
        allowedFileExtensions: ["jpg", "jpeg", "png", "gif"],
        fileActionSettings: {
            showZoom: true
        }
        ,
        // 以 font-awesome icon 替代預設含 <span aria-hidden> 的 remove 符號
        removeIcon: '<i class="fas fa-times"></i>'
    };

    var App = {
        init: function () {
            // 檢查目前頁面是否為系統設定相關頁面
            if ($(PAGE_CODE).length == 0) return;
            // 設定檔載入
            this.configs = null;

            this.loadConfig();
            // 調整檔案上傳/拖放提示的字體大小（不更動提示文字內容）
            try {
                var styleId = 'fr-reg-fontsize';
                if ($('#' + styleId).length === 0) {
                    // determine target font-size from the small "選擇圖片" control (class .btn-file is used elsewhere)
                    var targetSize = $('.btn-file').first().css('font-size') || $('.btn').first().css('font-size') || '12px';
                    // build CSS using the detected size so drop zone text matches the button text size
                    var css = '' +
                        /* apply to all children inside drop zones to catch any nested tags */
                        '.kv-file-drop-zone *, .file-drop-zone * { font-size: ' + targetSize + ' !important; line-height:1.2 !important; }';
                    $('<style>').attr('id', styleId).text(css).appendTo('head');
                }
            } catch (ex) { }
            this.cacheElement();
            this.bindEvent();
            this.activePlugin();
            this._restoreActiveTab();
            this._init();
        },

        // 載入遠端設定的設定檔
        // 設定檔是先建立為 js 檔，並指定存在 window 物件中
        // 如果有設定檔被載入的話，window.mashop.config 就會有值
        loadConfig: function () {
            this.config = (window.config) || null;
        },

        // 恢復之前保存的 active tab
        _restoreActiveTab: function () {
            try {
                // 從 URL 查詢字符串獲取 activeTabButtonId
                var params = new URLSearchParams(window.location.search);
                var activeTabButtonId = params.get('activeTabButtonId');

                if (activeTabButtonId) {
                    // 找到對應 ID 的按鈕並點擊
                    var btn = document.getElementById(activeTabButtonId);
                    if (btn) {
                        btn.click();
                    }
                }
            } catch (e) { }
        },

        // 啟用載入套件
        activePlugin: function () {
            $('.datepicker').datepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-TW',
                clearBtn: true,
                todayBtn: true,
                autoclose: true,
                todayHighlight: true
            });
        },

        // 取得各頁面所需元件
        cacheElement: function () {
            // 區塊

            this.$app = $(PAGE_CODE);

            this.$appBtnSubmit = this.$app.find(".btn-send");
            this.$appBtnSaveDraft = this.$app.find(".btn-savedraft");
            this.$appBtnSave = this.$app.find(".save");


            this.$appCgIdSelect = this.$app.find("#CgIdSelect");

            this.$appUploadData = this.$app.find(".uploadData");
            this.$appWasSubmit = this.$app.find("#wasSubmit");

            this.$appBtnDel = this.$app.find(".btn-deleteFile");

            this.$appKnow_9 = this.$app.find("#know_9");
            this.$appKnowInfoOther = this.$app.find("#KnowInfoOther");

            this.$appRegIdentity = this.$app.find("#RegIdentity");
            this.$appCompany = this.$app.find(".Company");
            this.$appMemberAdd = this.$app.find(".reg-add");
            this.$appMemberDel = this.$app.find(".reg-del");

            this.$appPwd = this.$app.find("#pwd");


            this.$Q1 = this.$app.find("#Q1");
            this.$Q2 = this.$app.find("#Q2");
            this.$Q3 = this.$app.find("#Q3");
            this.$Q4 = this.$app.find("#Q4");
            this.$Q5 = this.$app.find("#Q5");
            this.$Q6 = this.$app.find("#Q6");
            this.$Q7 = this.$app.find("#Q7");
            this.$Q8 = this.$app.find("#Q8");

            this.$Q1_PIC = this.$app.find("#Q1_PIC");
            this.$Q2_PIC = this.$app.find("#Q2_PIC");
            this.$Q3_PIC = this.$app.find("#Q3_PIC");
            this.$Q4_PIC = this.$app.find("#Q4_PIC");
            this.$Q5_PIC = this.$app.find("#Q5_PIC");
            this.$Q6_PIC = this.$app.find("#Q6_PIC");
            this.$Q7_PIC = this.$app.find("#Q7_PIC");
            this.$Q8_PIC = this.$app.find("#Q8_PIC");

            this.$AppNurtureAgreementBlock = this.$app.find("#v-pills-NurtureAgreement-tab");
            this.$AppPresentationBlock = this.$app.find("#v-pills-Presentation-tab");
            this.$AppnavLink = this.$app.find(".nav-link");


            //區塊IP
            this.$fileAffidavit = this.$app.find("#inputAffidavit");

            //區塊Supplementary
            this.$fileSupplementaryDoc = this.$app.find("#inputSupplementaryDoc");

            //育成意願書
            this.$fileinputNurtureAgreement = this.$app.find("#inputNurtureAgreement");
            this.$fileinputPresentation = this.$app.find("#inputPresentation");

            // Award and Accelerator elements
            this.$isAwardRadio = this.$app.find('input[name="IsAwardOption"]');
            this.$isAcceleratorRadio = this.$app.find('input[name="IsAcceleratorOption"]');
            this.$awardInfoContainer = this.$app.find("#awardInfoContainer");
            this.$acceleratorInfoContainer = this.$app.find("#acceleratorInfoContainer");
            this.$btnAddAward = this.$app.find("#btnAddAward");
            this.$btnAddAccelerator = this.$app.find("#btnAddAccelerator");

            // Funding Status elements
            this.$appFundingStatus = this.$app.find("#FundingStatus");
            this.$appFundingOther = this.$app.find("#fundingOther");

            // _RegInfo 文字計數欄位
            this.$Introduction = this.$app.find("#Introduction");
            this.$BriefDescription = this.$app.find("#BriefDescription");
            this.$KeywordTag = this.$app.find("#KeywordTag");
            this.$ProductName = this.$app.find("#ProductName");

            // _RegConcept 文字計數欄位
            this.$ProposalContent = this.$app.find("#ProposalContent");


        },

        // 事件監聽
        bindEvent: function () {
            this.$appBtnSubmit.on("click", this._btnSubmit.bind(this));
            this.$appBtnSaveDraft.on("click", this._btnSaveDraft.bind(this));

            this.$app.on("click", ".reg-add", this._rowAdd.bind(this));
            this.$app.on("click", ".reg-del", this._rowDel.bind(this));

            this.$appKnow_9.on("click", this._showKnowOther.bind(this));
            this.$appPwd.on("change", this._checkPwdRule.bind(this));


            this.$Q1.on("keyup", this._updateCount.bind(this));
            this.$Q2.on("keyup", this._updateCount.bind(this));
            this.$Q3.on("keyup", this._updateCount.bind(this));
            this.$Q4.on("keyup", this._updateCount.bind(this));
            this.$Q5.on("keyup", this._updateCount.bind(this));
            this.$Q6.on("keyup", this._updateCount.bind(this));
            this.$Q7.on("keyup", this._updateCount.bind(this));
            this.$Q8.on("keyup", this._updateCount.bind(this));

            // _RegInfo 文字計數欄位事件
            this.$Introduction.on("keyup", this._updateCount.bind(this));
            this.$BriefDescription.on("keyup", this._updateCount.bind(this));
            this.$KeywordTag.on("keyup", this._updateCount.bind(this));
            this.$ProductName.on("keyup", this._updateCount.bind(this));

            // _RegConcept 文字計數欄位事件
            this.$ProposalContent.on("keyup", this._updateCount.bind(this));

            //this.$app.on("click", ".Pagination", this._checkPagination.bind(this));

            //this.$app.on("click", ".btn-deleteFile", this._btnDeleteFile.bind(this));
            this.$app.on("click", ".up-link-sup", function (e) {
                e.preventDefault();      // 阻止預設行為（如跳頁）
                e.stopPropagation();     // 阻止事件冒泡
                var target = $(e.currentTarget),
                    filetype = target.data("filetype"),
                    regid = target.data("regid"),
                    caid = target.data("caid");
                // 用 GET 開新視窗
                window.open("/Reg/OpenFile?caId=" + caid + "&regId=" + regid + "&fileType=" + filetype, "_blank");
            });

            // 刪除檔案按鈕（使用事件委派，支援動態新增的按鈕）
            this.$app.on("click", ".btn-deleteFile", this._btnDeleteFile.bind(this));

            // 概念圖刪除按鈕
            // 綁定到實際的刪除處理函式 _deleteConceptPic（先前錯誤使用 _updateConceptPic）
            this.$app.on("click", ".btn-delete-concept", this._deleteConceptPic.bind(this));

            // 打開概念圖（向後端查詢檔案 URL 並開新分頁）
            this.$app.on("click", ".btn-open-file", function (e) {
                e.preventDefault();
                e.stopPropagation();
                var target = $(e.currentTarget),
                    regid = target.data('regid'),
                    picField = target.data('picfield');

                if (!regid || !picField) {
                    Swal.fire({ icon: 'error', title: '錯誤', text: '參數不足，無法開啟檔案' });
                    return false;
                }

                $.ajax({
                    type: 'get',
                    url: '/Reg/GetConceptPic',
                    data: { regId: regid, picField: picField },
                    success: function (data) {
                        if (data && data.torF && data.fileUrl) {
                            window.open(data.fileUrl, '_blank');
                        } else {
                            Swal.fire({ icon: 'error', title: '無法取得檔案', text: (data && data.message) ? data.message : '' });
                        }
                    },
                    error: function () {
                        Swal.fire({ icon: 'error', title: '伺服器錯誤', text: '無法取得檔案' });
                    }
                });

                return false;
            });

            this.$app.on("click", ".up-link-af", function (e) {
                e.preventDefault();      // 阻止預設行為（如跳頁）
                e.stopPropagation();     // 阻止事件冒泡
                var target = $(e.currentTarget),
                    filetype = target.data("filetype"),
                    regid = target.data("regid"),
                    caid = target.data("caid");
                // 用 GET 開新視窗
                window.open("/Reg/OpenFile?caId=" + caid + "&regId=" + regid + "&fileType=" + filetype, "_blank");
            });

            this.$app.on("click", ".up-link-Nurture", function (e) {
                e.preventDefault();      // 阻止預設行為（如跳頁）
                e.stopPropagation();     // 阻止事件冒泡
                var target = $(e.currentTarget),
                    filetype = target.data("filetype"),
                    regid = target.data("regid"),
                    caid = target.data("caid");
                // 用 GET 開新視窗
                window.open("/Reg/OpenFile?caId=" + caid + "&regId=" + regid + "&fileType=" + filetype, "_blank");
            });

            // Award info toggle
            this.$isAwardRadio.on("change", this._toggleAwardContainer.bind(this));
            // Accelerator info toggle
            this.$isAcceleratorRadio.on("change", this._toggleAcceleratorContainer.bind(this));
            // Add award entry
            this.$btnAddAward.on("click", this._addAwardEntry.bind(this));
            // Remove award entry
            this.$app.on("click", ".btn-remove-award", this._removeAwardEntry.bind(this));
            // Add accelerator entry
            this.$btnAddAccelerator.on("click", this._addAcceleratorEntry.bind(this));
            // Remove accelerator entry
            this.$app.on("click", ".btn-remove-accelerator", this._removeAcceleratorEntry.bind(this));
            // Funding Status 其他選項事件
            this.$appFundingStatus.on("change", this._toggleFundingOther.bind(this));
            // RegIdentity 團隊身分別變更事件
            this.$appRegIdentity.on("change", this._showComoanyCol.bind(this));
            // 換組別
            this.$appCgIdSelect.on("change", this._changeCgId.bind(this));
        },

        _init: function () {

            if (this.$AppNurtureAgreementBlock.hasClass('active')) {
                this.$appWasSubmit.hide();
                this.$fileinputNurtureAgreement.prop('disabled', false);
                $('.btn-file').removeClass('disabled').removeAttr('disabled');

                this.$fileinputNurtureAgreement.fileinput("destroy").fileinput(this._mergObj("NurtureAgreement", "list3", "inputNurtureAgreement", "up-link-Nurture"))
                    .on("filebatchselected", function (event, files) {
                        if ($(".kv-fileinput-error").text().length == 0) {
                            $(this).fileinput("upload");
                        }
                    })
                    .on("fileuploaded", this._fileuploadedFile);
            }
            else if (this.$AppPresentationBlock.hasClass('active')) {
                this.$appWasSubmit.hide();
                this.$fileinputPresentation.prop('disabled', false);
                $('.btn-file').removeClass('disabled').removeAttr('disabled');

                this.$fileinputPresentation.fileinput("destroy").fileinput(this._mergObj("Presentation", "list4", "inputPresentation", "up-link-Nurture"))
                    .on("filebatchselected", function (event, files) {
                        if ($(".kv-fileinput-error").text().length == 0) {
                            $(this).fileinput("upload");
                        }
                    })
                    .on("fileuploaded", this._fileuploadedFile);
            }
            else {

                this._showComoanyCol();

                var maxLength1 = this.$Q1.attr('maxlength');
                $('#textCount1').text(this.$Q1.val().length + "/" + maxLength1);

                var maxLength2 = this.$Q2.attr('maxlength');
                $('#textCount3').text(this.$Q2.val().length + "/" + maxLength2);

                var maxLength3 = this.$Q3.attr('maxlength');
                $('#textCount4').text(this.$Q3.val().length + "/" + maxLength3);

                var maxLength4 = this.$Q4.attr('maxlength');
                $('#textCount5').text(this.$Q4.val().length + "/" + maxLength4);

                var maxLength5 = this.$Q5.attr('maxlength');
                $('#textCount6').text(this.$Q5.val().length + "/" + maxLength5);

                var maxLength6 = this.$Q6.attr('maxlength');
                $('#textCount7').text(this.$Q6.val().length + "/" + maxLength6);

                var maxLength7 = this.$Q7.attr('maxlength');
                $('#textCount8').text(this.$Q7.val().length + "/" + maxLength7);

                var maxLength8 = this.$Q8.attr('maxlength');
                $('#textCount2').text(this.$Q8.val().length + "/" + maxLength8);

                // _RegConcept: ProposalContent 計數初始化
                if (this.$ProposalContent.length) {
                    var maxLengthPC = this.$ProposalContent.attr('maxlength') || 500;
                    $('#textCountProposalContent').text(this.$ProposalContent.val().length + "/" + maxLengthPC);
                }

                // _RegInfo: 文字計數初始化
                if (this.$Introduction.length) {
                    var maxLengthIntro = this.$Introduction.attr('maxlength') || 150;
                    $('#textCountIntroduction').text(this.$Introduction.val().length + "/" + maxLengthIntro);
                }
                if (this.$BriefDescription.length) {
                    var maxLengthBD = this.$BriefDescription.attr('maxlength') || 50;
                    $('#textCountBriefDescription').text(this.$BriefDescription.val().length + "/" + maxLengthBD);
                }
                if (this.$KeywordTag.length) {
                    var maxLengthKT = this.$KeywordTag.attr('maxlength') || 150;
                    $('#textCountKeywordTag').text(this.$KeywordTag.val().length + "/" + maxLengthKT);
                }
                if (this.$ProductName.length) {
                    var maxLengthPN = this.$ProductName.attr('maxlength') || 50;
                    $('#textCountProductName').text(this.$ProductName.val().length + "/" + maxLengthPN);
                }

                this._initPicUploads();
            }

            this.$fileAffidavit.fileinput("destroy").fileinput($.extend({}, this._mergObj("Affidavit", "list1", "inputAffidavit", "up-link-af"), {
                msgPlaceholder: this.$fileAffidavit.data("has-file") === true
                    ? "您已上傳檔案。如需更新，可直接上傳新檔，即會自動覆蓋原檔。"
                    : FILE_UPLOAD_OBJ.msgPlaceholder
            }))
                .on("filebatchselected", function (event, files) {
                    if ($(".kv-fileinput-error").text().length == 0) {
                        $(this).fileinput("upload");
                    }
                })
                .on("fileuploaded", this._fileuploadedFile);

            this.$fileSupplementaryDoc.fileinput("destroy").fileinput($.extend({}, this._mergObj("SupplementaryDoc", "list2", "inputSupplementaryDoc", "up-link-sup"), {
                msgPlaceholder: this.$fileSupplementaryDoc.data("has-file") === true
                    ? "您已上傳檔案。如需更新，可直接上傳新檔，即會自動覆蓋原檔。"
                    : FILE_UPLOAD_OBJ.msgPlaceholder
            }))
                .on("filebatchselected", function (event, files) {
                    if ($(".kv-fileinput-error").text().length == 0) {
                        $(this).fileinput("upload");
                    }
                })
                .on("fileuploaded", this._fileuploadedFile);




            this._showKnowOther();
            this._toggleFundingOther();

            if (this.$AppNurtureAgreementBlock.hasClass('active')) {
                this.$appWasSubmit.hide();
                this.$fileinputNurtureAgreement.prop('disabled', false);
                $('.btn-file').removeClass('disabled').removeAttr('disabled');
            }
        },

        _changeCgId: function (e) {
            var selectedCgId = $(e.currentTarget).val();
            $('#CgId').val(selectedCgId);
        },

        _checkPwdRule: function (e) {
            var $pwd = $(e.currentTarget);

            // 驗證密碼格式
            var pwdValue = $pwd.val();
            var isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(pwdValue);
            var $parent = $pwd.closest('.mb-3');
            var errorMsg = "密碼需要含大小寫英文字母及數字並至少8碼";

            // 移除現有錯誤訊息
            $parent.find('span.invalid-feedback[for="pwd"]').remove();

            if (pwdValue === '') {
                // 空值時，移除驗證樣式
                $pwd.removeClass("is-valid is-invalid");
            } else if (isValid) {
                // 密碼符合規則
                $pwd.removeClass("is-invalid").addClass("is-valid");
            } else {
                // 密碼不符合規則
                $pwd.removeClass("is-valid").addClass("is-invalid");
                // 添加錯誤訊息
                var $error = $('<span class="invalid-feedback" for="pwd"></span>').text(errorMsg);
                $parent.append($error);
            }
        },

        _checkPresentation: function (e) {
            var target = $(e.currentTarget);
            if (target.is(this.$AppPresentationBlock)) {
                this.$appWasSubmit.hide();
                this.$fileinputPresentation.prop('disabled', false);
                $('.btn-file').removeClass('disabled').removeAttr('disabled');
            } else {
                this.$appWasSubmit.show();
            }
        },

        _toggleAwardContainer: function (e) {
            var $target = $(e.currentTarget);
            if ($target.val() === 'Y') {
                this.$awardInfoContainer.show();
            } else {
                this.$awardInfoContainer.hide();
                // 勾選"無"時清空所有輸入欄位
                $('#awardInfoList input[name="AwardInfoItems"]').val('');
            }
        },

        _toggleAcceleratorContainer: function (e) {
            var $target = $(e.currentTarget);
            if ($target.val() === 'Y') {
                this.$acceleratorInfoContainer.show();
            } else {
                this.$acceleratorInfoContainer.hide();
                // 勾選"無"時清空所有輸入欄位
                $('#acceleratorInfoList input[name="AcceleratorInfoItems"]').val('');
            }
        },

        _addAwardEntry: function () {
            if ($('#awardInfoList .award-item').length < 10) {
                var newItem = '<div class="input-group mb-2 award-item">' +
                    '<input type="text" class="form-control" name="AwardInfoItems" placeholder="年份/單位/項目">' +
                    '<button type="button" class="btn btn-outline-danger btn-remove-award"><i class="fas fa-times"></i></button>' +
                    '</div>';
                $('#awardInfoList').append(newItem);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: '提醒',
                    text: '最多只能新增10筆獲獎經歷',
                    confirmButtonText: '確認'
                });
            }
        },

        _removeAwardEntry: function (e) {
            if ($('#awardInfoList .award-item').length > 1) {
                $(e.currentTarget).closest('.award-item').remove();
            }
        },

        _addAcceleratorEntry: function () {
            if ($('#acceleratorInfoList .accelerator-item').length < 10) {
                var newItem = '<div class="input-group mb-2 accelerator-item">' +
                    '<input type="text" class="form-control" name="AcceleratorInfoItems" placeholder="年份/單位">' +
                    '<button type="button" class="btn btn-outline-danger btn-remove-accelerator"><i class="fas fa-times"></i></button>' +
                    '</div>';
                $('#acceleratorInfoList').append(newItem);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: '提醒',
                    text: '最多只能新增10筆加速器經歷',
                    confirmButtonText: '確認'
                });
            }
        },

        _removeAcceleratorEntry: function (e) {
            if ($('#acceleratorInfoList .accelerator-item').length > 1) {
                $(e.currentTarget).closest('.accelerator-item').remove();
            }
        },

        _toggleFundingOther: function () {
            var selectedValue = this.$appFundingStatus.val();
            if (selectedValue === "其他") {
                this.$appFundingOther.show().prop("disabled", false);
            } else {
                this.$appFundingOther.hide().prop("disabled", true).val("");
            }
        },

        _showComoanyCol: function () {
            var regIdentity = this.$appRegIdentity.val();
            if (regIdentity == "自組團隊" || regIdentity == null || regIdentity == "") {
                // 隱藏公司資訊區塊
                this.$appCompany.hide();
                // 清除公司相關欄位資料
                this.$appCompany.find('input[name="rd.Rooc.GuiNo"]').val('');
                this.$appCompany.find('input[name="rd.Rooc.RegDate"]').val('');
                this.$appCompany.find('input[name="rd.Rooc.RegAddress"]').val('');
                // 隱藏成立日期提示
                $('#regDateHint').hide();
            }
            else {
                // 顯示公司資訊區塊（新創或學研機構）
                this.$appCompany.show();
                // 如果是新創，顯示成立日期提示
                if (regIdentity == "新創") {
                    $('#regDateHint').show();
                } else {
                    $('#regDateHint').hide();
                }
            }
        },

        _showKnowOther: function () {
            if (this.$appKnow_9.is(':checked')) {
                this.$appKnowInfoOther.show();
            } else {
                this.$appKnowInfoOther.hide();
            }
        },


        _updateCount: function (e) {
            var $target = $(e.currentTarget),
                maxLength = $target.attr('maxlength'),
                fieldCountMap = {
                    // _RegConcept 欄位
                    'Q1': 'textCount1',
                    'Q8': 'textCount2',
                    'Q2': 'textCount3',
                    'Q3': 'textCount4',
                    'Q4': 'textCount5',
                    'Q5': 'textCount6',
                    'Q6': 'textCount7',
                    'Q7': 'textCount8',
                    'ProposalContent': 'textCountProposalContent',
                    // _RegInfo 欄位
                    'Introduction': 'textCountIntroduction',
                    'BriefDescription': 'textCountBriefDescription',
                    'KeywordTag': 'textCountKeywordTag',
                    'ProductName': 'textCountProductName'
                },
                countId = fieldCountMap[$target[0].id];

            if (countId) {
                var ml = parseInt(maxLength) || 0;
                $('#' + countId).text($target.val().length + "/" + (ml || maxLength));
                if (ml > 0 && $target.val().length >= ml) {
                    $('#' + countId).append(" 超過上限").css('color', 'red');
                } else {
                    $('#' + countId).css('color', 'black');
                }
            }
        },

        _rowAdd: function (e) {
            $(".date").datepicker("destroy");

            var that = this,
                $target = $(e.currentTarget),
                dataArea = $target.data("area"),
                dataLimit = $target.data("limit"),
                areaName = this.$app.find("." + dataArea),
                memberCnt = areaName.find(".member-card").length,
                memberStyle = areaName.find(".member-card").eq(0).clone(true);

            // 清除樣式與值
            memberStyle.find("input").removeClass("is-valid is-invalid").removeClass("hasDatepicker")
                .removeAttr("aria-invalid").val("");
            memberStyle.find("label.error, span.error").remove();

            // 更新所有欄位的索引，使其符合 rd.RomList[newIndex].Field 的 model binding 格式
            var newIndex = memberCnt;
            memberStyle.find("input, select, textarea").each(function () {
                var $inp = $(this);
                var name = $inp.attr("name");
                var id = $inp.attr("id");
                if (name) {
                    $inp.attr("name", name.replace(/rd\.RomList\[\d+\]/, "rd.RomList[" + newIndex + "]"));
                }
                if (id) {
                    $inp.attr("id", id.replace(/_\d+$/, "_" + newIndex));
                }
            });

            // 重設隱藏欄位（IsRepresent、Id、DisOrder）
            memberStyle.find("input[name$='.Id']").val("0");
            memberStyle.find("input[name$='.IsRepresent']").val("N");
            memberStyle.find("input[name$='.DisOrder']").val("");
            memberStyle.find("[id='temaMember']").find("strong").text("團隊成員");

            // 移除 Line ID 欄位（非代表成員不需要）
            memberStyle.find("input[name*='MwhatsApp'], [id*='MwhatsApp']").closest('.mb-3').remove();

            if (memberCnt < parseInt(dataLimit)) {
                areaName.append(memberStyle);
                // 新增欄位後重新綁定驗證，讓新成員欄位也套用規則
                this._bindInitFormValid();
            } else {
                var identity = this.$appRegIdentity.val();
                var limitMsg = (identity === "自組團隊")
                    ? "若為自組團隊，每隊 3 人至 8 人為限，含團隊代表。"
                    : "每隊最多 8 人為限，含團隊代表。";
                Swal.fire({
                    icon: 'warning',
                    title: '成員數量不符',
                    text: limitMsg,
                    confirmButtonText: '確認'
                });
            }

            $(".date").datepicker({
                uiLibrary: "bootstrap4",
                format: "yyyy-mm-dd",
                todayBtn: true,
                clearBtn: true,
                language: "zh-TW"
            });

            return false;
        },

        _rowDel: function (e) {
            var that = this,
                $target = $(e.currentTarget),
                dataArea = $target.data("area"),
                dataLimit = $target.data("limit"),
                areaName = this.$app.find("." + dataArea),
                memberCnt = areaName.find(".member-card").length,
                memberStyle = $target.parent().parent().parent().parent(),
                memberType = memberStyle.find("#temaMember").find("strong").text();

            if (memberCnt == parseInt(dataLimit)) {
                $._alertErrMsg("最後一筆");
            } else if (memberType == "團隊隊長") {
                $._alertErrMsg("隊長不能刪除");
            } else {
                memberStyle.remove();
            }

            return false;
        },

        _initPicUploads: function () {
            var that = this,
                picUploads = [
                    { $el: that.$Q1_PIC, picField: "Q1_PIC" },
                    { $el: that.$Q2_PIC, picField: "Q2_PIC" },
                    { $el: that.$Q3_PIC, picField: "Q3_PIC" },
                    { $el: that.$Q4_PIC, picField: "Q4_PIC" },
                    { $el: that.$Q5_PIC, picField: "Q5_PIC" },
                    { $el: that.$Q6_PIC, picField: "Q6_PIC" },
                    { $el: that.$Q7_PIC, picField: "Q7_PIC" },
                    { $el: that.$Q8_PIC, picField: "Q8_PIC" }
                ];

            $.each(picUploads, function (i, item) {
                if (item.$el.length) {
                    item.$el.fileinput("destroy").fileinput(that._mergImgObj(item.picField))
                        .on("filebatchselected", function (event, files) {
                            if ($(".kv-fileinput-error").text().length == 0) {
                                $(this).fileinput("upload");
                            }
                        })
                        .on("fileuploaded", function (event, data) {
                            // 支援不同版本或情況：有些情況下伺服器回應會直接在 data 或 data.response 中
                            var resp = (data && data.response) ? data.response : (data || {});

                            if (resp.torF == true) {
                                var $container = item.$el.closest('.col-4');
                                $container.find('a').remove();
                                // 新增預覽按鈕（不使用縮圖），透過 btn-open-file 由前端呼叫後端取得檔案 URL
                                $container.append('<a href="#" class="btn btn-warning btn-open-file" data-regid="' + (resp.regid || '') + '" data-picfield="' + item.picField + '" data-picname="' + (resp.fileName || '') + '">點此預覽目前上傳檔案</a>');
                                // 新增刪除按鈕 (使用 data 屬性供 JS 呼叫 API 刪除)
                                $container.append('<button class="btn btn-danger btn-delete-concept" data-regid="' + (resp.regid || '') + '" data-picfield="' + item.picField + '" data-picname="' + (resp.fileName || '') + '">刪除</button>');
                            }
                            Swal.fire({
                                title: resp.torF == true ? "成功" : "錯誤",
                                text: resp.torF == true ? ("圖片上傳成功！\n" + (resp.fileName || '')) : (resp.message || "圖片上傳失敗"),
                                icon: resp.torF == true ? "success" : "error",
                                confirmButtonText: "OK"
                            }).then(function () {
                                if (resp.torF == true) {
                                    item.$el.fileinput('reset');
                                }
                            });
                        });
                }
            });
        },

        _deleteConceptPic: function (e) {
            e.preventDefault();
            var target = $(e.currentTarget),
                regid = target.data('regid'),
                picField = target.data('picfield'),
                picName = target.data('picname');

            // picName 可選；後端會在未提供時從 DB 取得目前的檔名
            if (!regid || !picField) {
                Swal.fire({ icon: 'error', title: '錯誤', text: '參數不足，無法刪除' });
                return false;
            }

            $.ajax({
                type: 'post',
                url: '/Reg/FileDeleteConceptPic',
                data: { regId: regid, picField: picField, picName: picName },
                success: function (data) {
                    if (data && data.torF) {
                        // 移除預覽按鈕與刪除按鈕
                        var $col = target.closest('.col-4');
                        // 移除由上傳/伺服器回傳建立的預覽按鈕 (btn-open-file) 與其他 a 標籤
                        $col.find('.btn-open-file').remove();
                        // 移除目前的刪除按鈕（target）
                        target.remove();
                        // 若還有其他刪除按鈕，移除之
                        $col.find('.btn-delete-concept').remove();
                        // 重置對應的 fileinput 元件（若存在）
                        var $input = $('#' + picField);
                        if ($input.length && $input.data('fileinput')) {
                            try { $input.fileinput('reset'); } catch (ex) { }
                        }
                        Swal.fire({ icon: 'success', title: '刪除成功' });
                    } else {
                        Swal.fire({ icon: 'error', title: '刪除失敗', text: (data && data.message) ? data.message : '' });
                    }
                },
                error: function (xhr, status, err) {
                    Swal.fire({ icon: 'error', title: '刪除失敗', text: err });
                }
            });

            return false;
        },

        _mergImgObj: function (picField) {
            var regId = $("#RegId").val(),
                regNumber = $("#RegNumber").val(),
                afe = [".jpg", ".jpeg"],
                fileSize = 2 * 1024 * 1024,
                uploadObj = {
                    uploadUrl: "/Reg/FileUploadConceptPic?regId=" + regId + "&regNumber=" + regNumber + "&picField=" + picField,
                    maxFileSize: fileSize
                };
            return $.extend({}, IMG_UPLOAD_OBJ, uploadObj);
        },

        _mergObj: function (idstr, listId, id, linkType) {
            //var inputid = "#" + id;
            var that = this,
                obj = {},
                uploadObj = {},
                afe = ["pdf"],
                fileSize = 5 * 1024 * 1024, // 5MB (bytes)
                caid = $("#CaId").val(),
                cgid = $("#CgId").val(),
                regNumber = $('#RegNumber').val(),
                regid = $("#RegId").val(),
                teamName = $('#TeamName').val(),
                linkType = linkType;

            var uploadObj = {
                uploadUrl: "/reg/UploadFile?caId=" + caid + "&cgId=" + cgid + "&regNumber=" + regNumber + "&teamName=" + teamName + "&regId=" + regid + "&filetype=" + idstr + "&listId=" + listId + "&linkType=" + linkType,
                maxFileSize: fileSize,
                allowedFileExtensions: afe
            };
            obj = $.extend({}, FILE_UPLOAD_OBJ, uploadObj);

            return obj;
        },

        _fileuploadedFile: function (event, data, id, index) {
            var btnIvfo = "點此預覽目前上傳檔案";
            // 建立預覽與刪除按鈕，並使用後端回傳的資訊填入 data-* 屬性
            if (data && data.response && data.response.torF == true) {
                var resp = data.response,
                    listId = "#" + (resp.listId || ''),
                    // preview button: class matches Views/Reg/_RegFile.cshtml
                    previewBtn = '<button class="btn btn-warning up-link-af" data-filetype="' + (resp.filetype || '') + '" data-regid="' + (resp.regid || '') + '" data-caid="' + (resp.caid || '') + '">' + btnIvfo + '</button>',
                    // delete button: include filename and adyear if provided by server
                    deleteBtn = '<button type="button" class="btn btn-danger btn-deleteFile ms-2" data-filetype="' + (resp.filetype || '') + '" data-filename="' + (resp.fileName || '') + '" data-regid="' + (resp.regid || '') + '" data-caid="' + (resp.caid || '') + '" data-adyear="' + (resp.adyear || resp.AdYear || '') + '">刪除</button>';

                $(listId).empty();
                $(listId).append(previewBtn + deleteBtn);

                // 如果是上傳參賽同意書，更新隱藏欄位以通過驗證
                if (resp.filetype == "Affidavit") {
                    $("#AffidavitFile").val(resp.fileName || '');
                }
            }

            // 根據 TCALibrary 驗證結果顯示訊息
            var successMsg = data.response.torF == true ? "上傳成功! \n" + data.response.fileName : data.response.message;

            Swal.fire({
                title: data.response.torF == true ? "Success" : "Error",
                html: successMsg,
                icon: data.response.torF == true ? "success" : "error",
                showCancelButton: false,
                confirmButtonText: "OK"
            }).then(function (result) {
                if (result.value) {
                    if (data.response.torF == true) {
                    } else {
                    }
                }
            });
        },

        _btnDeleteFile: function (e) {
            e.preventDefault();
            var target = $(e.currentTarget),
                filetype = target.data("filetype"),
                filename = target.data("filename"),
                regid = target.data("regid"),
                caid = target.data("caid"),
                adyear = target.data("adyear");

            // 確認刪除
            Swal.fire({
                title: '確認刪除？',
                text: filename || '確定要刪除此檔案嗎？',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '刪除',
                cancelButtonText: '取消'
            }).then(function (result) {
                if (!result.isConfirmed) return;

                var url = '/Reg/DeleteUploadFile';
                var data = {
                    caId: caid || '',
                    regId: regid || '',
                    filetype: filetype || '',
                    fileName: filename || '',
                    adYear: adyear || ''
                };

                // try read anti-forgery token if present
                var token = $('input[name="__RequestVerificationToken"]').val();
                var headers = {};
                if (token) headers['RequestVerificationToken'] = token;

                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    headers: headers,
                    success: function (resp) {
                        if (resp && resp.torF) {
                            // 清空對應容器，依照回傳的 filetype 處理
                            switch (resp.filetype) {
                                case 'Affidavit':
                                    $('#list1').empty();
                                    break;
                                case 'SupplementaryDoc':
                                    $('#list2').empty();
                                    break;
                                default:
                                    // 若沒有對應的 list id，移除按鈕所在容器
                                    target.closest('.uploadData, .col-12, .input-group, .file-input, .kv-fileinput').remove();
                                    break;
                            }
                            Swal.fire({ icon: 'success', title: '刪除成功' });
                        } else {
                            Swal.fire({ icon: 'error', title: '刪除失敗', text: (resp && resp.message) ? resp.message : '' });
                        }
                    },
                    error: function (xhr, status, err) {
                        Swal.fire({ icon: 'error', title: '刪除失敗', text: err || status });
                    }
                });
            });
        },

        _checkRegForm: function () {
            var rules = {},
                rulesGen = {
                    "rd.Reg.TeamName": {
                        required: true
                    },
                    "rd.Reg.CgId": {
                        required: true
                    },
                    "rd.Reg.RegIdentity": {
                        required: true
                    },
                    "rd.Reg.ProductName": {
                        required: true
                    },
                    "rd.Reg.Introduction": {
                        required: true
                    },
                    "rd.Reg.BriefDescription": {
                        required: true
                    },
                    "rd.Reg.KeywordTag": {
                        required: true
                    },
                    "rd.Reg.FundingStatus": {
                        required: true
                    },
                    "rd.Reg.ProposalContent": {
                        required: true
                    },
                    "rd.Rocc.Q1": {
                        required: true
                    },
                    "rd.Rocc.Q8": {
                        required: true
                    },
                    "rd.Rocc.Q2": {
                        required: true
                    },
                    "rd.Rocc.Q3": {
                        required: true
                    },
                    "rd.Rocc.Q4": {
                        required: true
                    },
                    "rd.Rocc.Q5": {
                        required: true
                    },
                    "rd.Rocc.Q6": {
                        required: true
                    },
                    "rd.Rocc.Q7": {
                        required: true
                    },
                    "rd.Rocc.Q8": {
                        required: true
                    },
                    "Mname": {
                        required: true
                    },
                    "Memail": {
                        required: true,
                        checkEmail: true
                    },
                    "Mmobile": {
                        required: true,
                        telnumber: true
                    },
                    "Munit": {
                        required: true
                    },
                    "MTitle": {
                        required: true
                    },
                    "rd.Rooc.IsAward": {
                        required: true
                    },
                    "KnowInfo": {
                        required: true
                    },
                    "AffidavitFile": {
                        affidavitRequired: true
                    },
                    "rd.Reg.RegPwd": {
                        checkPassword: true
                    },
                    "checkPwd": {
                        passwordMatch: true
                    }
                },
                messagesGen = {
                    "rd.Reg.TeamName": {
                        required: "請輸入團隊名稱"
                    },
                    "rd.Reg.CgId": {
                        required: "請選擇報名組別"
                    },
                    "rd.Reg.RegIdentity": {
                        required: "請選擇團隊身分別"
                    },
                    "rd.Reg.ProductName": {
                        required: "請輸入提案名稱"
                    },
                    "rd.Reg.Introduction": {
                        required: "請輸入單位/團隊簡介"
                    },
                    "rd.Reg.BriefDescription": {
                        required: "請輸入一句話描述貴單位/團隊"
                    },
                    "rd.Reg.KeywordTag": {
                        required: "請輸入主要產業應用"
                    },
                    "rd.Reg.FundingStatus": {
                        required: "請選擇 Funding Status"
                    },
                    "rd.Reg.ProposalContent": {
                        required: "請輸入提案內容摘要"
                    },
                    "rd.Rocc.Q1": {
                        required: "請輸入提案整體說明"
                    },
                    "rd.Rocc.Q8": {
                        required: "請輸入團隊介紹、組成與分工"
                    },
                    "rd.Rocc.Q2": {
                        required: "請輸入產業場景痛點，需包含明確定義問題，清楚對應實務需求"
                    },
                    "rd.Rocc.Q3": {
                        required: "請輸入Physical AI 或 Embodied AI 解決方案說明"
                    },
                    "rd.Rocc.Q4": {
                        required: "請輸入可達成幾項具體任務 (可於複審階段中 Demo)"
                    },
                    "rd.Rocc.Q5": {
                        required: "請輸入系統架構與 AI 整合設計說明"
                    },
                    "rd.Rocc.Q6": {
                        required: "請輸入硬體平台與實體驗證規劃"
                    },
                    "rd.Rocc.Q7": {
                        required: "請輸入商業模式與市場發展規劃"
                    },
                    "rd.Rocc.Q8": {
                        required: "請輸入團隊介紹、組成與分工"
                    },
                    "Mname": {
                        required: "請輸入聯絡人姓名"
                    },
                    "Memail": {
                        required: "請輸入聯絡人Email",
                        checkEmail: "Email格式錯誤"
                    },
                    "Mmobile": {
                        required: "請輸入聯絡人電話",
                        telnumber: "輸入的手機號碼不合規定，只能出現數字、+、-、空格"
                    },
                    "Munit": {
                        required: "請輸入服務單位/就讀學校"
                    },
                    "MTitle": {
                        required: "請輸入職稱"
                    },
                    "rd.Rooc.IsAward": {
                        required: "請選擇獲獎經歷及獲得補助"
                    },
                    "KnowInfo": {
                        required: "請選擇競賽資訊來源"
                    },
                    "AffidavitFile": {
                        affidavitRequired: "請上傳參賽同意書"
                    },
                    "rd.Reg.RegPwd": {
                        checkPassword: "密碼需要含大小寫英文字母及數字並至少8碼"
                    },
                    "checkPwd": {
                        passwordMatch: "密碼不相符，請重新確認"
                    }
                };

            // 特殊判斷的欄位（條件式必填）
            if (this.$appRegIdentity.val() != "自組團隊") {
                rulesGen["rd.Rooc.OrgName"] = {
                    required: true
                }
                rulesGen["rd.Rooc.GuiNo"] = {
                    required: true,
                    checkGuiNo: true
                }
                rulesGen["rd.Rooc.RegDate"] = {
                    required: true
                }
                rulesGen["rd.Rooc.RegAddress"] = {
                    required: true
                }
                rulesGen["rd.Rooc.Nationality"] = {
                    required: true
                }

                messagesGen["rd.Rooc.OrgName"] = {
                    required: "請輸入新創/法人/學研機構/研究中心名稱"
                }
                messagesGen["rd.Rooc.GuiNo"] = {
                    required: "請輸入統一編號"
                }
                messagesGen["rd.Rooc.RegDate"] = {
                    required: "請輸入成立日期"
                }
                messagesGen["rd.Rooc.RegAddress"] = {
                    required: "請輸入公司地址"
                }
                messagesGen["rd.Rooc.Nationality"] = {
                    required: "請輸入國別"
                }
            }

            if (this.$appKnow_9.is(':checked')) {
                rulesGen["KnowInfoOther"] = {
                    required: true
                }
                messagesGen["KnowInfoOther"] = {
                    required: "請輸入其他資訊來源"
                }
            }

            // 若某成員為團隊代表 (IsRepresent == 'Y')，則其 Line ID (MwhatsApp) 必填
            this.$app.find('.member-card').each(function () {
                try {
                    var $card = $(this);
                    var $isRep = $card.find("input[name$='.IsRepresent']");
                    if ($isRep.length && $isRep.val() === 'Y') {
                        var $line = $card.find("input[name$='.MwhatsApp']");
                        if ($line.length) {
                            var lineName = $line.attr('name');
                            // 設定驗證規則與訊息
                            rulesGen[lineName] = { required: true };
                            messagesGen[lineName] = { required: '請輸入 Line ID' };
                        }
                    }
                } catch (ex) { }
            });

            // 為每個成員欄位建立對應的驗證規則（欄位在 Razor 中命名為 rd.RomList[i].Field）
            this.$app.find('.member-card').each(function () {
                try {
                    var $card = $(this);
                    var memberFields = [
                        { suf: 'Mname', rule: { required: true }, msg: { required: '請輸入姓名' } },
                        { suf: 'Memail', rule: { required: true, checkEmail: true }, msg: { required: '請輸入信箱', checkEmail: 'Email格式錯誤' } },
                        { suf: 'Mmobile', rule: { required: true, telnumber: true }, msg: { required: '請輸入手機', telnumber: '輸入的手機號碼不合規定，格式:0900-123456' } },
                        { suf: 'Munit', rule: { required: true }, msg: { required: '請輸入服務單位/就讀學校' } },
                        { suf: 'MTitle', rule: { required: true }, msg: { required: '請輸入職稱' } }
                    ];

                    memberFields.forEach(function (f) {
                        var $inp = $card.find("input[name$='." + f.suf + "']");
                        if ($inp.length) {
                            var fname = $inp.attr('name');
                            // only set if not already set (avoid overwriting e.g. line rules)
                            if (!rulesGen[fname]) {
                                rulesGen[fname] = f.rule;
                            }
                            if (!messagesGen[fname]) {
                                messagesGen[fname] = f.msg;
                            }
                        }
                    });
                } catch (ex) { }
            });

            // 條件式必填：團隊成員人數驗證（同時更新隱藏欄位值）
            var memberCount = $('.reg-data .member-card').length;
            var minMember = (this.$appRegIdentity.val() === '自組團隊') ? 3 : 1;
            $('#MemberCountValid').val(
                (memberCount >= minMember && memberCount <= 8) ? 'valid' : ''
            );
            rulesGen["MemberCountValid"] = {
                memberCountValid: true
            }
            messagesGen["MemberCountValid"] = {
                memberCountValid: "團隊成員人數不符規定"
            }

            // 條件式必填：選擇「有」時，需填寫獲獎/補助內容
            if (this.$isAwardRadio.filter(':checked').val() === 'Y') {
                rulesGen["AwardInfoItems"] = {
                    required: true
                }
                messagesGen["AwardInfoItems"] = {
                    required: "請填寫獲獎/補助內容 (年份/單位/項目)"
                }
            }

            // 條件式必填：選擇「有」時，需填寫加速器內容
            if (this.$isAcceleratorRadio.filter(':checked').val() === 'Y') {
                rulesGen["AcceleratorInfoItems"] = {
                    required: true
                }
                messagesGen["AcceleratorInfoItems"] = {
                    required: "請填寫加速器內容 (年份/單位)"
                }
            }

            rules = {
                rules: rulesGen,
                messages: messagesGen
            }

            // Debug: expose generated rules/messages for troubleshooting
            try {
                if (window && window.console && window.console.log) {
                    console.log('DEBUG: generated member validation rules:', rulesGen);
                    console.log('DEBUG: generated member validation messages:', messagesGen);
                }
            } catch (ex) { }

            return rules;
        },

        _setValidationObj: function (rulesObj) {
            var styleObj = $._setDefaultsObj;
            return $.extend(rulesObj, styleObj);
        },

        _bindInitFormValid: function () {
            var rulesObj = {};
            rulesObj = this._checkRegForm();
            $('form').validate().destroy();

            // 自訂驗證方法：團隊成員人數
            if (!$.validator.methods['memberCountValid']) {
                $.validator.addMethod('memberCountValid', function (value) {
                    return value === 'valid';
                }, '團隊成員人數不符規定');
            }

            // 設定驗証樣式
            $.validator.setDefaults(this._setValidationObj(rulesObj));
            // 設定驗証方法
            $._setValidationMethods();

            //$("form").validate(
            //    {
            //        focusInvalid: true
            //    }
            //);

            return false;
        },

        _btnSubmit: function (e) {
            this._bindInitFormValid();
            var validator = $('form').validate();
            var validateState = $('form').valid();

            var torF = false;
            if (validateState == false) {
                try {
                    if (window && window.console && window.console.log) {
                        console.log('DEBUG: validator.errorMap:', validator.errorMap);
                    }
                } catch (ex) { }
                // 獲取按標籤頁分組的錯誤訊息
                var errorsByTab = this._getValidationErrorMessages(validator);

                // 構建分組顯示的 HTML
                var errorHtml = "";
                var errorTextForAlert = "";
                var hasErrors = false;

                // 依 Index.cshtml 頁籤順序排序
                var tabOrder = ["1.註冊資訊", "2.基本資訊", "3.團隊成員", "4.提案內容", "5.同意書上傳"];
                var sortedTabs = Object.keys(errorsByTab).sort(function (a, b) {
                    var ai = tabOrder.indexOf(a);
                    var bi = tabOrder.indexOf(b);
                    if (ai === -1) ai = tabOrder.length;
                    if (bi === -1) bi = tabOrder.length;
                    return ai - bi;
                });

                $.each(sortedTabs, function (i, tab) {
                    var messages = errorsByTab[tab];
                    if (messages && messages.length > 0) {
                        hasErrors = true;
                        errorHtml += "<strong>" + tab + "</strong><br>";
                        errorTextForAlert += tab + "\n";

                        $.each(messages, function (index, msg) {
                            errorHtml += msg + "<br>";
                            errorTextForAlert += msg + "\n";
                        });
                        errorHtml += "<br>";
                        errorTextForAlert += "\n";
                    }
                });

                if (!hasErrors) {
                    errorHtml = "仍有未填寫的欄位";
                    errorTextForAlert = "仍有未填寫的欄位";
                }

                // 顯示頁面上的錯誤訊息容器
                $("#errorMessagesList").html(errorHtml);
                $("#validationErrorContainer").show();

                // 同時顯示 SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "資料未完成",
                    html: "敬請檢查未完成項目，<br>確認資料填寫完畢與必要文件上傳。<br>",
                    confirmButtonText: "OK",
                    showCloseButton: true,
                    allowOutsideClick: false,
                    didOpen: function (modal) {
                        // 將提示內容置中
                        $(modal).find(".swal2-html-container").css({
                            "text-align": "center",
                            "margin": "0 auto"
                        });
                    }
                }).then(function (isConfirm) {
                    if (isConfirm.isConfirmed) {
                        // 滾動到錯誤訊息容器
                        var $errContainer = $("#validationErrorContainer");
                        if ($errContainer.length > 0 && $errContainer.is(":visible")) {
                            $("html,body").animate(
                                {
                                    scrollTop: $errContainer.offset().top - 100
                                },
                                "slow");
                        }
                    }
                });

                torF = false;
            } else {
                // 隱藏錯誤訊息容器
                $("#validationErrorContainer").hide();

                Swal.fire({
                    icon: "warning",
                    title: "提醒",
                    width: "40em",
                    html: "<ol style='text-align:left;padding-left:1.2em;'>" +
                        "<li>請確認，已依照所選身份別用印/簽署，及檢附相關資料。" +
                        "<ol style='list-style-type:none;padding-left:0.5em;'>" +
                        "<li>(1) 以新創/學研機構/研究中心報名：請用印公司大小章（若以學校系所/研究中心/實驗室等身分報名，得用印系所章+提案主要負責人簽署）</li>" +
                        "<li>(2) 以自組團隊報名：團隊所有成員簽名 + 參賽隊伍學生證明（成員如有在校學生則為必要提交文件，無則免附）</li>" +
                        "</ol></li>" +
                        "<li>同意書需用印/簽署後「整份」掃描成 PDF 檔上傳（第1頁至最後簽署頁）。</li>" +
                        //"<li>提交後，您可於 2026年6月30日（二）17:00 報名截止前更新隊伍及提案資料，將以<strong>最後一版提交資料</strong>作為審查文件。</li>" +
                        "<li>請注意，務必以最終提交版本簽署並上傳同意書，以避免資訊不一致。</li>" +
                        "</ol>",
                    showCancelButton: true,
                    confirmButtonText: "確認",
                    cancelButtonText: "取消",
                    allowOutsideClick: false
                }).then(function (result) {
                    if (result.value) {
                        // 送表單
                        var form = $("form");
                        var url = form.attr("action");

                        // Ensure the hidden Submit field is set to "Y" so server treats this as a formal submit
                        try {
                            var $submitField = form.find('#Submit');
                            if ($submitField.length === 0) {
                                // create the hidden input if not present
                                $submitField = $('<input>').attr({ type: 'hidden', id: 'Submit', name: 'Submit', value: 'Y' }).appendTo(form);
                            } else {
                                $submitField.val('Y');
                            }
                        } catch (ex) { }

                        $.ajax({
                            type: "post",
                            url: url,
                            data: form.serialize(),
                            success: function (data) {

                                //回傳
                                Swal.fire({
                                    title: data.torF == true ? "送出成功" : "送出失敗",
                                    html: data.msg,
                                    icon: data.icon,
                                    showCancelButton: false,
                                    confirmButtonText: "確認",
                                    allowOutsideClick: false
                                }).then(function (result) {
                                    if (result.value && data.torF) {
                                        window.location.assign(data.reUrl);
                                    }
                                });
                            }
                        });
                    }

                });
                e.preventDefault();
                torF = true;
            }
            return torF;
        },

        _getValidationErrorMessages: function (validator) {
            var errorsByTab = {};

            // 欄位名稱對應表
            var fieldLabels = {
                "MemberCountValid": "團隊成員人數",
                "AwardInfoItems": "獲獎/補助內容 (年份/單位/項目)",
                "AcceleratorInfoItems": "加速器內容 (年份/單位)",
                "rd.Reg.ProductName": "提案名稱",
                "rd.Reg.Introduction": "單位/團隊簡介",
                "rd.Reg.BriefDescription": "一句話描述貴單位/團隊",
                "rd.Reg.KeywordTag": "主要產業應用",
                "rd.Reg.FundingStatus": "Funding Status",
                "rd.Reg.TeamName": "團隊名稱",
                "rd.Reg.CgId": "報名組別",
                "rd.Reg.RegIdentity": "團隊身分別",
                "rd.Rooc.OrgName": "新創/法人/學研機構/研究中心名稱",
                "rd.Rooc.GuiNo": "統一編號",
                "rd.Rooc.RegDate": "成立日期",
                "rd.Rooc.RegAddress": "公司地址",
                "rd.Rooc.Nationality": "國別",
                "rd.Rooc.IsAward": "獲獎經歷及獲得補助",
                "rd.Reg.ProposalContent": "提案內容摘要",
                "rd.Rocc.Q1": "提案整體說明",
                "rd.Rocc.Q2": "產業場景痛點，需包含明確定義問題，清楚對應實務需求",
                "rd.Rocc.Q3": "Physical AI 或 Embodied AI 解決方案說明",
                "rd.Rocc.Q4": "可達成幾項具體任務 (可於複審階段中 Demo)",
                "rd.Rocc.Q5": "系統架構與 AI 整合設計說明",
                "rd.Rocc.Q6": "硬體平台與實體驗證規劃",
                "rd.Rocc.Q7": "商業模式與市場發展規劃",
                "rd.Rocc.Q8": "團隊介紹、組成與分工",
                "Mname": "聯絡人姓名",
                "Memail": "聯絡人Email",
                "Mmobile": "聯絡人電話",
                "Munit": "服務單位/就讀學校",
                "MTitle": "職稱",
                "MwhatsApp": "Line ID",
                "KnowInfo": "競賽資訊來源",
                "KnowInfoOther": "其他資訊來源",
                "AffidavitFile": "參賽同意書",
                "SupplementaryDoc": "輔佐資料"
            };

            // 欄位與標籤頁的對應關係
            var fieldToTab = {
                // 基本資訊 (2)
                "rd.Reg.TeamName": "2.基本資訊",
                "rd.Reg.CgId": "2.基本資訊",
                "rd.Reg.RegIdentity": "2.基本資訊",
                "rd.Rooc.OrgName": "2.基本資訊",
                "rd.Rooc.GuiNo": "2.基本資訊",
                "rd.Rooc.RegDate": "2.基本資訊",
                "rd.Rooc.RegAddress": "2.基本資訊",
                "rd.Rooc.Nationality": "2.基本資訊",
                "rd.Reg.ProductName": "2.基本資訊",
                "rd.Reg.Introduction": "1.註冊資訊",
                "rd.Reg.BriefDescription": "1.註冊資訊",
                "rd.Reg.KeywordTag": "1.註冊資訊",
                "rd.Reg.FundingStatus": "1.註冊資訊",
                "rd.Rooc.IsAward": "2.基本資訊",
                "AwardInfoItems": "2.基本資訊",
                "AcceleratorInfoItems": "2.基本資訊",
                "rd.Reg.WebUrl": "2.基本資訊",
                "KnowInfo": "2.基本資訊",
                "KnowInfoOther": "2.基本資訊",
                // 團隊成員 (3)
                "MemberCountValid": "3.團隊成員",
                "Mname": "3.團隊成員",
                "Memail": "3.團隊成員",
                "Mmobile": "3.團隊成員",
                "Munit": "3.團隊成員",
                "MTitle": "3.團隊成員",
                "MwhatsApp": "3.團隊成員",
                // 提案內容 (4)
                "rd.Reg.ProposalContent": "4.提案內容",
                "rd.Rocc.Q1": "4.提案內容",
                "rd.Rocc.Q2": "4.提案內容",
                "rd.Rocc.Q3": "4.提案內容",
                "rd.Rocc.Q4": "4.提案內容",
                "rd.Rocc.Q5": "4.提案內容",
                "rd.Rocc.Q6": "4.提案內容",
                "rd.Rocc.Q7": "4.提案內容",
                "rd.Rocc.Q8": "4.提案內容",
                "SupplementaryDoc": "4.提案內容",
                // 同意書上傳 (5)
                "AffidavitFile": "5.同意書上傳"
            };

            // 從驗證器的錯誤物件中獲取所有錯誤訊息
            var errorsByField = {};
            var self = this;
            if (validator.errorMap) {
                $.each(validator.errorMap, function (fieldName, errorMsg) {
                    if (errorMsg) {
                // Normalize field name: validator may return names like "rd.RomList[0].MwhatsApp"
                // Try exact match first, then fallback to the last segment (e.g. "MwhatsApp").
                var normName = fieldName;
                try {
                    // remove array indexes if present
                    normName = normName.replace(/\[\d+\]/g, '');
                    if (normName.indexOf('.') !== -1) {
                        var segs = normName.split('.');
                        normName = segs[segs.length - 1];
                    }
                } catch (ex) { }

                var tab = fieldToTab[fieldName] || fieldToTab[normName] || "其他";
                var fieldLabel = fieldLabels[fieldName] || fieldLabels[normName] || normName;

                        if (!errorsByField[tab]) {
                            errorsByField[tab] = [];
                        }

                        // MemberCountValid 顯示更詳細的人數說明
                        var errorDisplay = fieldLabel;
                        if (fieldName === 'MemberCountValid') {
                            var mc = $('.reg-data .member-card').length;
                            var mm = (self.$appRegIdentity.val() === '自組團隊') ? 3 : 1;
                            errorDisplay = mc < mm
                                ? '團隊成員人數不足（目前 ' + mc + ' 人），若為自組團隊，至少需 ' + mm + ' 人，含團隊代表。'
                                : '團隊成員人數超過上限（目前 ' + mc + ' 人），最多 8 人';
                        }

                        // 避免重複訊息
                        if (!errorsByField[tab].includes(errorDisplay)) {
                            errorsByField[tab].push(errorDisplay);
                        }
                    }
                });
            }

            // 檢查參賽同意書是否已上傳
            if ($("#AffidavitFile").length > 0) {
                var affidavitButton = $("#list1").find(".up-link-af").length;
                if (affidavitButton === 0) {
                    var tab = "5.同意書上傳";
                    var fieldLabel = fieldLabels["AffidavitFile"];

                    if (!errorsByField[tab]) {
                        errorsByField[tab] = [];
                    }
                    if (!errorsByField[tab].includes(fieldLabel)) {
                        errorsByField[tab].push(fieldLabel);
                    }
                }
            }

            // 返回按標籤頁分組的錯誤
            return errorsByField;
        },

        _btnSaveDraft: function () {
            var form = $("form"),
                url = form.attr("action");

            // 獲取當前active的button ID
            var activeTabButtonId = '';
            var $activeTab = $('#v-pills-tab').find('.nav-link.active').first();
            if ($activeTab && $activeTab.length) {
                activeTabButtonId = $activeTab.attr('id');
            }

            // 確保 Submit 欄位為空（暫存標記）
            try {
                var $submitField = form.find('#Submit');
                if ($submitField.length === 0) {
                    $submitField = $('<input>').attr({ type: 'hidden', id: 'Submit', name: 'Submit', value: '' }).appendTo(form);
                } else {
                    $submitField.val('');
                }
            } catch (ex) { }

            // 添加 activeTabButtonId 到表單
            form.find('input[name="activeTabButtonId"]').remove();
            $('<input>').attr({
                type: 'hidden',
                name: 'activeTabButtonId',
                value: activeTabButtonId
            }).appendTo(form);

            // 準備發送表單前，需要包含 CSRF token
            var formData = form.serialize();

            // 送表單
            $.ajax({
                type: "post",
                url: url,
                data: formData,
                dataType: "json",
                headers: {
                    // 從表單中讀取並發送 CSRF token
                    "RequestVerificationToken": form.find('input[name="__RequestVerificationToken"]').val()
                },
                success: function (data) {
                    // 回傳
                    Swal.fire({
                        title: data.torF == true ? "Success" : "Error",
                        html: data.torF == true ? data.msg : "請聯繫團隊，並提供您的資料<br>(截圖、送出的資料、當下時間)並說明所遇到的問題，謝謝!",
                        icon: data.icon,
                        showCancelButton: false,
                        confirmButtonText: "OK",
                        allowOutsideClick: false
                    }).then(function (result) {
                        if (result.value) {
                            if (data.reUrl && data.msg == "暫存成功！") {
                                window.location.assign(data.reUrl);
                            }
                        }
                    });
                },
                error: function (xhr, status, err) {
                    var errorMsg = '無法連接到伺服器，請稍後重試。';
                    if (xhr && xhr.status) {
                        errorMsg = '伺服器錯誤 (' + xhr.status + ')，請稍後重試。';
                        if (xhr.status === 400) {
                            errorMsg = '表單資料驗證失敗，請檢查必填欄位。';
                        } else if (xhr.status === 403) {
                            errorMsg = '無效的請求令牌 (403)，請重新整理頁面。';
                        }
                    }
                    Swal.fire({
                        icon: 'error',
                        title: '存檔失敗',
                        text: errorMsg,
                        confirmButtonText: 'OK'
                    });
                }
            });

            return false;
        }
    };
    App.init();

});

