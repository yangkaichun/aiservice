$(function () {
    "use strict";

    // 初始化 SweetAlert2
    //const Swal = window.Swal;

    //// 檢查是否定義 Wt 對象
    //if (typeof Wt === 'undefined') {
    //    window.Wt = {};
    //}

    //// 檢查是否定義 swalCloseEventFinishedCallback 函數
    //if (typeof Wt.swalCloseEventFinishedCallback !== 'function') {
    //    Wt.swalCloseEventFinishedCallback = function () {
    //        console.warn('Wt.swalCloseEventFinishedCallback is not defined');
    //    };
    //}

    // 錯誤訊息(Toast)
    $._toastErrMsg = function(msgStr) {
        var toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: function (toast) {
	            toast.addEventListener("mouseenter", Swal.stopTimer);
	            toast.addEventListener("mouseleave", Swal.resumeTimer);
            }
        });

        toast.fire({
            icon: "error",
            title: msgStr
        });

        return false;
	};
    // 錯誤訊息(Alert)
    $._alertErrMsg = function (msgStr) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: msgStr,
            allowOutsideClick: false
        });
        return false;
    };
    // 警告訊息(Alert)
    $._alertWarningMsg = function (msgStr) {
        Swal.fire({
            icon: "warning",
            title: "警告",
            text: msgStr,
            allowOutsideClick: false
        });

        return false;
    };
    // 成功訊息(Toast)
    $._toastSuccessMsg = function(msgStr) {
        var toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: function (toast) {
	            toast.addEventListener("mouseenter", Swal.stopTimer);
	            toast.addEventListener("mouseleave", Swal.resumeTimer);
            }
        });

        toast.fire({
            icon: "success",
            title: msgStr
        });

        return false;
    };
    // 成功訊息(Alert)
    $._alertSuccessMsg = function (msgStr) {
        Swal.fire({
            icon: "success",
            title: "Success",
            text: msgStr,
            allowOutsideClick: false
        });

        return false;
    };

    // 設定驗証樣式物件
    $._setDefaultsObj = {
        debug: false,
        ignore: "",
        highlight: function (element) {
            if (element.type != 'select-one' && element.type != 'hidden') {
                $(element).addClass("is-invalid");
            }
        },
        unhighlight: function (element) {
            if (element.type != 'select-one' && element.type != 'hidden') {
                // 若信箱欄位仍有 ExistsMmail 錯誤，不加綠勾
                if (element.id === 'RepEmail') {
                    var data = window.repEmailTopicData || [];
                    var selectedTopic = $("#CgIdSelect").find("option:selected").data("topic");
                    var val = $(element).val();
                    var duplicate = data.find(function (item) {
                        return item.email === val && item.topic === selectedTopic;
                    });
                    if (duplicate) {
                        $(element).removeClass("is-valid").addClass("is-invalid");
                        return;
                    }
                }
                $(element).removeClass("is-invalid").addClass("is-valid");
            }
        },
        errorElement: "span",
        errorClass: "invalid-feedback",
        errorPlacement: function(error, element) {
            var parent = element.parents(".mb-3");
            if (parent.length) {
                parent.append(error);
            } else {
                error.insertAfter(element);
            }
        }
    };

    // 設定驗証方法
    $._setValidationMethods = function () {
	    // 手機號碼驗證
        jQuery.validator.addMethod("mobile", function (value, element) {
            return /^0[0-9]{8,9}$/.test(value);
        }, "手機號碼格式錯誤");

        jQuery.validator.addMethod("number", function (value, element) {
            return /^[0-9]*$/.test(value);
        }, "請勿輸入數字外字元");
        jQuery.validator.addMethod("numberEng", function (value, element) {
            return /^[0-9]*$/.test(value);
        }, "Do not enter characters other than numbers");
        jQuery.validator.addMethod("englishAndNumberEng", function (value, element) {
            return /^[0-9a-zA-Z\s\-\+\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]*$/.test(value);
        }, "Text other than English, numbers and punctuation cannot be entered");

        jQuery.validator.addMethod("telnumberEng", function (value, element) {
            return /^[0-9]*-[0-9]*$/.test(value);
        }, "Phone number format is incorrect");

        // 僅接受台灣手機格式：0900123456 或 0900-123456
        jQuery.validator.addMethod("telnumber", function (value, element) {
            return /^[0-9+\- ]{1,20}$/.test(value);
        }, "手機號碼格式錯誤");

		// 檢查密碼驗證
		jQuery.validator.addMethod("checkPassword", function (value, element) {
			return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
		}, "密碼需要含大小寫英文字母及數字並至少8碼");
		jQuery.validator.addMethod("checkPasswordEng", function (value, element) {
			return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
		}, "Incorrect Password Format");

		// 密碼比對驗證
		jQuery.validator.addMethod("passwordMatch", function (value, element) {
			var regPwdVal = $("#RegPwd").val();
			return value === regPwdVal;
		}, "密碼不相符，請重新確認");

        jQuery.validator.addMethod("isEmpty", function (value, element) {
            return !/^[ ]*$/.test(value);
        }, "不能全輸入空白");

        jQuery.validator.addMethod("checkGuiNo", function (value, element) {
            return /^[0-9]{8}$/.test(value);
        }, "統一編號格式錯誤");

        // 電子信箱驗證
        jQuery.validator.addMethod("checkEmail", function (value, element) {
            return /[\w\-\._]+@[\w\-\._]+\.\w{2,10}/.test(value);
        }, "E-mail格式錯誤");
        jQuery.validator.addMethod("checkEmailEng", function (value, element) {
            return /[\w\-\._]+@[\w\-\._]+\.\w{2,10}/.test(value);
        }, "Incorrect E-mail Format");



        jQuery.validator.addMethod("affidavitRequired", function (value, element) {
            // 檢查 #list1 是否包含已上傳的檔案按鈕（參賽同意書）
            var affidavitButton = $("#list1").find(".up-link-af").length > 0;
            return affidavitButton;
        }, "請上傳參賽同意書");

        jQuery.validator.addMethod("supplementaryDocRequired", function (value, element) {
            // 檢查 #list2 是否包含已上傳的檔案按鈕（輔佐資料）
            var supplementaryButton = $("#list2").find(".up-link-sup").length > 0;
            return supplementaryButton;
        }, "請上傳輔佐資料");

        jQuery.validator.addMethod("textExistsSInLinks", function (value, element) {
            var allHaveText = true;
            // 支援 <a> 和 <button> 標籤
            $('a.up-link-sup, button.up-link-sup').each(function () {
                if ($(this).text().trim() === '') {
                    allHaveText = false;
                    return false;
                }
            });
            return allHaveText;
        }, "請上傳輔佐資料");

        //jQuery.validator.addMethod("ExistsMmail", function (value, element) {
        //    if (!value) return true;
        //    var data = window.repEmailTopicData || [];
        //    if (data.length === 0) return true;
        //    var selectedTopic = $("#CgIdSelect").find("option:selected").data("topic");
        //    if (!selectedTopic) return true;
        //    var duplicate = data.find(function (item) {
        //        return item.email === value && item.topic === selectedTopic;
        //    });
        //    return !duplicate;
        //}, "此信箱已於該領域報名過，請更換信箱。");

        // 定義自訂驗證方法 - 檢查日期是否在 2018-01-01 之後（含當日）
        jQuery.validator.addMethod("checkDateAfter20180101", function (value, element) {
            if (!value) return true;
            var inputDate = new Date(value.replace(/-/g, '/'));
            var limitDate = new Date('2018/01/01');
            return inputDate >= limitDate;
        }, "成立日期須為2018年1月1日(2018-01-01)以後");

    };

    $._fileInputSetNoneUploadObj = {
	    theme: "fas",
        //支援中文
        language: "zh-TW",
        autoReplace: true,
        showRemove: false,
        showUpload: true,
	    uploadAsync: true,
        maxFileCount: 1,
        maxFileSize: 6 * 1024,
        enctype: "multipart/form-data",
        showUploadedThumbs: false,
        previewFileType: null,
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
    };

    // 改良預設檔案上傳提示，置中顯示初始畫面，以及拖曳區提示文字
    $._fileInputSetNoneUploadObj.dropZoneTitle = "(選填。每題限上傳一張圖檔，JPEG/JPG <2 MB)";
    $._fileInputSetNoneUploadObj.msgPlaceholder = "(選填。每題限上傳一張圖檔，JPEG/JPG <2 MB)";
    $._fileInputSetNoneUploadObj.defaultPreviewContent = "<div style='text-align:center;color:#999;padding:20px;'>未上傳檔案畫面</div>";

    $._fileInputSetNoneUploadObjNoAjax = {
        theme: "fas",
        //支援中文
        language: "en-US",
        autoReplace: true,
        showRemove: false,
        showUpload: false,
        uploadAsync: true,
        maxFileCount: 1,
        maxFileSize: 3 * 1024,
        enctype: "multipart/form-data",
        showUploadedThumbs: false,
        previewFileType: null,
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
    };

    // 同樣設定 NoAjax 版本的提示文字與預覽初始內容
    $._fileInputSetNoneUploadObjNoAjax.dropZoneTitle = "(選填。每題限上傳一張圖檔，JPEG/JPG <2 MB)";
    $._fileInputSetNoneUploadObjNoAjax.msgPlaceholder = "(選填。每題限上傳一張圖檔，JPEG/JPG <2 MB)";
    $._fileInputSetNoneUploadObjNoAjax.defaultPreviewContent = "<div style='text-align:center;color:#999;padding:20px;'>未上傳檔案畫面</div>";

    //分頁中文化
    $._setDataTableLanguageTranslation = function () {
        return {
            oLanguage: {
                sProcessing: "查詢中...",
                sLengthMenu: "顯示 _MENU_ 筆資料",
                sZeroRecords: "目前沒有資料...",
                sInfo: "顯示第 _START_ 至 _END_ 筆資料，共 _TOTAL_ 筆",
                sInfoEmpty: "顯示第 0 至 0 筆資料，共 0 筆",
                sInfoFiltered: "(從 _MAX_ 筆資料過濾)",
                sSearch: "表格內全文檢索:",
                oPaginate: { sFirst: "第一頁", sPrevious: "上一頁", sNext: "下一頁", sLast: "最後一頁" }
            }
        }
    };

    //分頁設定-如每頁顯示多少筆
    $._setDataTableOpt = function () {
        return {
            lengthMenu: [[-1, 5, 10, 20, 50], ["所有", 5, 10, 20, 50]],
            pageLength: 10,
            ordering: true,
            responsive: false,
            scrollX: true,
            destroy: true,
            processing: true,
            info: true,
            autoWidth: true,
            scrollCollapse: true
        }
    };

    $._setBakDataTableOpt = function () {
        return {
            lengthMenu: [[-1, 5, 10, 20, 50], ["所有", 5, 10, 20, 50]],
            pageLength: -1,
            ordering: true,
            responsive: false,
            destroy: true,
            processing: true,
            info: true,
            autoWidth: true,
            scrollCollapse: true


        }
    };

    //分頁中文化+分頁設定
    $.setDataTableAllOpt = function () {
        var newOpts = $.extend({}, $._setDataTableLanguageTranslation(), $._setDataTableOpt());
        return newOpts;
    };


    //分頁中文化+分頁設定
    $.setBakDataTableAllOpt = function () {
        var newOpts = $.extend({}, $._setDataTableLanguageTranslation(), $._setBakDataTableOpt());
        return newOpts;
    };

    //行事曆中文化
    $._setFullCalendarOpt = function () {
        return {
            header: {
                left: "prev,next",
                center: "title",
                right: "month,agendaWeek,agendaDay"
            },
            defaultView: "month",
            editable: true,
            resizable: true,
            allDaySlot: false,
            selectable: true,
            slotMinutes: 30,
            lang: "zh-tw",
            buttonText: {
                today: "今天",
                month: "月",
                week: "週",
                day: "日"
            },
            allDayText: "整天",
            timeFormat: {
                "": "H:mm{-H:mm}"
            },
            weekMode: "variable",
            columnFormat: {
                month: "dddd",
                week: "dddd M-d",
                day: "dddd M-d"
            },
            titleFormat: {
                month: "yyyy年 MMMM月",
                week: "[yyyy年] MMMM月d日 { '~' [yyyy年] MMMM月d日}",
                day: "yyyy年 MMMM月d日 dddd"
            },
            monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
        }
    };

    // ========== Tempus Dominus Bootstrap 4 DateTimePicker 設定 ==========

    // Tempus Dominus DateTimePicker 基本設定（含日期和時間）
    $._setTempusDominusOpt = {
        locale: 'zh-tw',
        format: 'YYYY-MM-DD HH:mm:ss',
        stepping: 1,
        allowInputToggle: true,
        useCurrent: false,
        sideBySide: false,
        collapse: true,
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto'
        },
        showClear: true,
        showClose: true,
        showTodayButton: true,
        icons: {
            time: 'fas fa-clock',
            date: 'fas fa-calendar',
            up: 'fas fa-arrow-up',
            down: 'fas fa-arrow-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'fas fa-calendar-check',
            clear: 'fas fa-trash',
            close: 'fas fa-times'
        },
        tooltips: {
            today: '今天',
            clear: '清除',
            close: '關閉',
            selectMonth: '選擇月份',
            prevMonth: '上個月',
            nextMonth: '下個月',
            selectYear: '選擇年份',
            prevYear: '上一年',
            nextYear: '下一年',
            selectDecade: '選擇十年',
            prevDecade: '上十年',
            nextDecade: '下十年',
            prevCentury: '上世紀',
            nextCentury: '下世紀',
            pickHour: '選擇小時',
            incrementHour: '增加小時',
            decrementHour: '減少小時',
            pickMinute: '選擇分鐘',
            incrementMinute: '增加分鐘',
            decrementMinute: '減少分鐘',
            pickSecond: '選擇秒',
            incrementSecond: '增加秒',
            decrementSecond: '減少秒',
            togglePeriod: '切換上午/下午',
            selectTime: '選擇時間'
        }
    };

    // 初始化 Tempus Dominus DateTimePicker（支援動態新增元素）
    $._initTempusDominus = function (context) {
        var $ctx = context ? $(context) : $(document);

        $ctx.find('.datetimepicker-wrapper').each(function () {
            var $wrap = $(this);

            // 跳過已初始化的元素
            if ($wrap.hasClass('td-init')) {
                return;
            }

            try {
                // 取得自訂格式
                var fmt = $wrap.data('date-format') || 'YYYY-MM-DD HH:mm:ss';
                var customOpts = $wrap.data('datetimepicker-options') || {};

                // 合併設定
                var options = $.extend({}, $._setTempusDominusOpt, customOpts, { format: fmt });

                // 檢查是否已被初始化
                if ($wrap.data('DateTimePicker')) {
                    try {
                        $wrap.data('DateTimePicker').destroy();
                    } catch (e) {
                        console.warn('Failed to destroy existing datetimepicker:', e);
                    }
                }

                // 初始化
                if (typeof $wrap.datetimepicker === 'function') {
                    $wrap.datetimepicker(options);
                    $wrap.addClass('td-init');
                }
            } catch (e) {
                console.error('Tempus Dominus initialization failed:', e, $wrap[0]);
            }
        });
    };


    // DataTimePickerSetting
    $._setDataTimePickerOpt = {
        locale: "zh-tw",
        autoClose: true,
        defaultDate: new Date(),
        format: "YYYY-MM-DD HH:mm",
        sideBySide: true
    };

    // DataTimePickerSetting
    $._setDataTimePickerOptYYYYMMDD = {
        locale: "zh-tw",
        autoClose: true,
        format: "YYYY-MM-DD"
    };

    //DatePicker(yy-mm-dd)
    $._setDatePickerOpt = {
        dateFormat: "YYYY-MM-DD",
        autoclose: true
    };

    // TinyMce
    $._setTinyMceOpt = {
	    selector: "textarea",
	    language: "zh_TW",
	    height: 150,
	    menubar: false,
	    skin: "lightgray",
	    statusbar: false,
	    plugins: [
		    "advlist autolink lists link image charmap print preview anchor textcolor",
		    "searchreplace visualblocks code fullscreen",
		    "insertdatetime media table contextmenu paste code help wordcount"
	    ],
	    fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
	    font_formats: "Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n",
	    toolbar: "undo redo | formatselect | fontselect fontsizeselect bold italic forecolor backcolor | link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
	    content_css: ["//fonts.googleapis.com/css?family=Lato:300,300i,400,400i"]
    };

    // 監聽預覽與刪除上傳檔案按鈕（委派）
    $(document).on('click', '.btn-alert', function (e) {
        var url = $(this).data('url');
        if (url) {
            window.open(url, '_blank');
        }
    });

});