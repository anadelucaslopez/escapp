$(function(){
    const Delta = Quill.import("delta");
    const BlockEmbed = Quill.import('blots/block/embed');
    var Video = Quill.import('formats/video');

    /* video preload='metadata' controls='controls' poster='http://vishub.org/videos/3566.png?style=170x127%23'>
        <source src='http://vishub.org/videos/3566.flv' type='video/x-flv'>
        <source src='http://vishub.org/videos/3566.mp4' type='video/mp4'>
        Your browser does not support HTML5 video.
        </video> */
    //https://www.youtube.com/embed/iHOZp6cMyMk?autoplay=1


    const createVideo = (node) => {
        let url = node.src;
        if (typeof node === "string") {
            url = node;
        }
        const youtube = url.match(/(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))(.*)/);
        if (youtube && youtube[5]) {
            // var attributes = $(node).prop("attributes");
            // node = $("<iframe>")

            // // loop through <select> attributes and apply them on <div>
            // $.each(attributes, function() {
            //     node.attr(this.name, this.value);
            // });
            if (typeof node === "string") {
                node = $(`<iframe width="560" height="315" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)[0];
            }
            url = "https://www.youtube.com/embed/" + youtube[5];
            if(!url.match("enablejsapi")) {
                if (url.match("\\?")){
                    url += "&enablejsapi=1"
                } else {
                    url += "?enablejsapi=1"
                }
            }
            if (url) {
                node.setAttribute('src', url);
            } else {
                node.removeAttribute('src')
            }
        } else {
            if (typeof node === "string") {
                node = $('<video></video>')[0];
            }
            if (url.match("autoplay=1")) {
                node.setAttribute('autoplay', true);
            }
            if (url) {
                node.setAttribute('src', url);
            } else {
                node.removeAttribute('src')
            }            
            node.setAttribute('class', 'ql-video')
            node.setAttribute('frameborder', node.frameborder || '0');
            node.setAttribute('allowfullscreen', true);
            node.setAttribute('allow', 'autoplay; fullscreen');
            node.setAttribute('controls', '');
            // setTimeout(()=>{try{node.pause()}catch(e){console.error}},1000)
        }
        return node;
    }
    Video.create = (node) => {
        return createVideo(node)
    }

    Video.value = (node) => {
        return node;
    }
    class VideoBlot extends BlockEmbed {
        static create(node) {
           return createVideo(node)
        }
        static value(node) {
            return node;
        }
    }
    VideoBlot.blotName = 'video';
    VideoBlot.tagName = 'video';
    Quill.register(VideoBlot);

    class IframeBlot extends VideoBlot {}
    IframeBlot.blotName = 'iframe';
    IframeBlot.tagName = 'iframe';
    Quill.register(IframeBlot);


    class AudioBlot extends BlockEmbed {
      static create(url) {
        let node = super.create();
        node.setAttribute('src', url);
        node.setAttribute('controls', '');
        return node;
      }
      
      static value(node) {
        return node.getAttribute('src');
      }
    }
    AudioBlot.blotName = 'audio';
    AudioBlot.tagName = 'audio';
    Quill.register(AudioBlot);

    class CountdownBlot extends BlockEmbed {
      static create() {
        let node = super.create();
        // node.innerHTML = "00:00:00";
        // node.setAttribute('draggable', 'draggable');
        node.setAttribute('contenteditable', 'false');
        node.setAttribute('draggable', 'true')
        node.classList.add('draggable-element');
        return node;
      }
    }
    CountdownBlot.blotName = 'countdown';
    CountdownBlot.tagName = 'countdown';
    Quill.register(CountdownBlot);


    class RankingBlot extends BlockEmbed {
      static create() {
        let node = super.create();
        node.setAttribute('contenteditable', 'false');
        node.setAttribute('draggable', 'true');
        node.classList.add('draggable-element');
        node.innerHTML = ` 
            <div class="ranking-table table" style="height: 229px; ">
                <div class="ranking-row ranking-header table-primary" style="top: 0px;" >
                    <div class="ranking-pos">#</div>
                    <div class="ranking-team">Team</div>
                    <div class="ranking-members">Members</div>
                    <div class="ranking-res">Progress</div>
                    <div class="ranking-time">Time</div>
                </div>
                <div class="ranking-row " style="top: 75px;">
                    <div class="ranking-pos">1</div>
                    <div class="ranking-team">Team 1</div>
                    <div class="ranking-members">Student A, Student B</div>
                    <div class="ranking-res">3/3</div>
                    <div class="ranking-time">1h 2min</div>
                </div>
                <div class="ranking-row " style="top: 150px;">
                    <div class="ranking-pos">2</div>
                    <div class="ranking-team">Team 2</div>
                    <div class="ranking-members">Student C, Student D</div>
                    <div class="ranking-res">2/3</div>
                    <div class="ranking-time">---</div>
                </div>
            </div>
         `;
        return node;
      }
    }
    RankingBlot.blotName = 'ranking';
    RankingBlot.tagName = 'ranking';
    Quill.register(RankingBlot);


    class ProgressBlot extends BlockEmbed {
        static create() {
            let node = super.create();
            node.setAttribute('contenteditable', 'false');
            node.setAttribute('draggable', 'true');
            node.classList.add('draggable-element');
            node.innerHTML = ` 
                <div class="col-xs-12 col-md-8 col-md-push-2 col-lg-6 col-lg-push-3" style="margin:auto;">
                    <div class="progress">
                      <div class="progress-bar puzzle-progress bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>`;

            return node;   
        }
    }

    ProgressBlot.blotName = 'progressbar';
    ProgressBlot.tagName = 'progressbar';
    Quill.register(ProgressBlot);
    
    Quill.register("modules/htmlEditButton", htmlEditButton);

    Quill.register('modules/VideoResize', VideoResize);

    const icons = Quill.import('ui/icons');
    icons.preview = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 511.999 511.999"  xml:space="preserve"><g><g><path d="M508.745,246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818,239.784,3.249,246.035    c-4.332,5.936-4.332,13.987,0,19.923c4.569,6.257,113.557,153.206,252.748,153.206s248.174-146.95,252.748-153.201    C513.083,260.028,513.083,251.971,508.745,246.041z M255.997,385.406c-102.529,0-191.33-97.533-217.617-129.418    c26.253-31.913,114.868-129.395,217.617-129.395c102.524,0,191.319,97.516,217.617,129.418    C447.361,287.923,358.746,385.406,255.997,385.406z"/></g></g><g><g><path d="M255.997,154.725c-55.842,0-101.275,45.433-101.275,101.275s45.433,101.275,101.275,101.275    s101.275-45.433,101.275-101.275S311.839,154.725,255.997,154.725z M255.997,323.516c-37.23,0-67.516-30.287-67.516-67.516    s30.287-67.516,67.516-67.516s67.516,30.287,67.516,67.516S293.227,323.516,255.997,323.516z"/></g></g></svg>`;

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link'/*, 'image'*/],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        window.endPoint === "indications" ?  [{ 'header': [2, 3, 4, 5, 6, false] }]:[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        window.endPoint === "indications" ? [] : [{ 'appearance': [ 
            "litera", "cerulean", "journal", "sketchy", "darkly", "cyborg", "cosmo", "flatly", "lumen", "lux", "materia", "minty", "pulse", "sandstone", "simplex", "slate", "solar", "spacelab", "united", "yeti", "superhero"
        ] }],
        [{ 'color': [ 
            "var(--primary)", "var(--secondary)", "var(--success)", "var(--info)", "var(--warning)", "var(--danger)", "var(--light)", "var(--dark)"
        ] }],        
        [{ 'align': [] }],
        ['clean'],                                         // remove formatting button
        ['image']
    ];

    var range, fileSelected, gamificationElementSelected, quill;
    
    function imageHandler() {
        quill = this.quill;
        range = quill.getSelection();
        $( "#dialog-gallery" ).dialog( "open" );
        return false;
    }

    function appearanceHandler(lang, node) {
        $('body link')[2].href = `/stylesheets/vendor/bootswatch/${lang || "cerulean"}.editor.bootstrap.min.css`;
        $('#appearance').val(lang);
        return lang;
    }

    var options = {
        modules: {
            toolbar: { 
                container: toolbarOptions, 
                handlers: {
                    image: imageHandler, 
                    appearance: appearanceHandler
                }
            },
            imageResize: {},
            videoResize: {},
            clipboard: {},
            htmlEditButton: {
                msg: window.editYourText || "Edit your text",
                okText: window.accept || "guardar",
                cancelText: window.cancel || "descartar"
            }
        },
        placeholder: window.placeholder || 'Write here your escape room instructions',
        readOnly: false,
        theme: 'snow' 
    };

    var editor = new Quill('#editor', options);
    $('#editor').css("visibility", "visible");

    $('#instructionsForm').on("submit", e => {
        let content = document.getElementsByClassName('ql-editor')[0].innerHTML;
        $('#instructions').val( (content));
        return true;
    });

    editor.clipboard.addMatcher (Node.ELEMENT_NODE, function (node, delta) {
        if (node && node.id) {
            switch(node.id) {
                case 'ranking':
                case 'progress':
                case 'countdown':
                case 'video':
                case 'iframe':
                return delta;
            }
        }
        const attributes = {
            'font': false,
            'strike': false,
            'direction': false,
            'color': false
        };
        delta.ops = delta.ops.map(op=>{
            return {
                insert: op.insert,
                attributes: {
                    ...op.attributes, ...attributes
                }
            }
        });
        return delta;
    });

    const insertContent = (index, url = "", mime = "", name = "") => {
        if (mime && mime.match("image")) {
            quill.insertEmbed(index, 'image', url, Quill.sources.USER);
            quill.formatText(index, 1, 'width', '30%');
        } else if (mime && mime.match("video")) {
            quill.insertEmbed(index, 'video', url, Quill.sources.USER);
        } else if (mime && mime.match("audio")) {
            quill.insertEmbed(index, 'audio', url, Quill.sources.USER);
        } else {
            quill.insertText(index, "");
            var delta = {
              ops: [
                {retain: index-1},
                {insert: name, attributes: {link: url}}
              ]
            };
            quill.updateContents(delta);
        }
    }
    const imageExt = ["bmp", "jpg", "gif", "jpeg", "png", "svg"];
    const videoExt = ["3gp", "avi", "mp4", "flv", "webm", "wmv", "mp4", "mpeg"];
    const audioExt = ["mp3", "aac", "wav", "aif", "wma", "mid", "mpg", "mp4a", "weba"];

    $("#dialog-gallery").dialog({
      autoOpen: false,
      resizable: false,
      modal: true,
      width: window.innerWidth > 1000 ? 900 : window.innerWidth*0.9,
      height: "auto",
      show: {
        effect: "fade",
        duration: 300
      },
      hide: {
        effect: "fade",
        duration: 300
      },
      appendTo: '.main',
      buttons: {
        [insert]: function () {
            const selected = $('input[name=file-gallery-source]:checked').attr('id');
            switch (selected) {
                case "sourceFile":
                    if (fileSelected && fileSelected.mime) {
                        insertContent(range.index, fileSelected.url, fileSelected.mime, fileSelected.name);
                    } 
                    break;
                case "sourceUrl":
                    let url = $('#urlInput').val().replace("http://","https://");
                    if (url) {
                        const youtube = url.match(/(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))(.*)/);
                        if (youtube && youtube[5]) {
                            quill.insertEmbed(range.index, 'iframe', "https://www.youtube.com/embed/" + youtube[5], Quill.sources.USER);
                            // insertContent(range.index, "https://www.youtube.com/embed/" + youtube[5] , "video/mp4", "video");
                        } else {
                            var xhttp = new XMLHttpRequest();
                            xhttp.open('HEAD', url);

                            var onerror = function () {
                                let parts = url.toString().toLowerCase().split('.');
                                if (parts && parts.length > 0) {
                                    const ext = parts[parts.length - 1];
                                    if (imageExt.indexOf(ext) > -1) {
                                        insertContent(range.index, url, "image/"+ext, "image");
                                    } else if (videoExt.indexOf(ext) > -1) {
                                        insertContent(range.index, url, "video/"+ext, "video");
                                    } else if (audioExt.indexOf(ext) > -1) {
                                        insertContent(range.index, url, "audio/"+ext, "audio");
                                    } else {
                                        insertContent(range.index, url);
                                    }
                                }
                            };
                            xhttp.onreadystatechange = function () {
                                if (this.readyState == this.DONE && this.status < 400) {
                                    const mime = this.getResponseHeader("Content-Type");
                                    insertContent(range.index, url, mime, url);
                                } 
                            };
                            xhttp.onerror = onerror;
                            xhttp.send();
                        }
                    }
                    break;
                case "sourceGamificationElement":
                    if (gamificationElementSelected) {
                        quill.insertEmbed(range.index, gamificationElementSelected, '', Quill.sources.API);
                    }
                    break;
            }
            
            $(".file-selected").removeClass("file-selected");
            $(".gamification-element-selected").removeClass("gamification-element-selected");
            fileSelected = null;
            gamificationElementSelected = null;
            $( "#dialog-gallery" ).dialog("close");
        },
        [cancel]: function () {
            $(".file-selected").removeClass("file-selected");
            $( "#dialog-gallery" ).dialog( "close" );
        }
      }
    });

    /* Insert element by providing URL */
    $(document).on('click','#urlInput', function(){
        $(".file-selected").removeClass("file-selected");
        $(".gamification-element-selected").removeClass("gamification-element-selected");
        $('#sourceUrl').prop('checked', true);
        $('#sourceFile').prop('checked', false);
        $('#sourceGamificationElement').prop('checked', false);

    });

    /* Click on file from gallery */
    $(document).on('click','.dz-preview *', function(){
        $(".file-selected").removeClass("file-selected");
        $(".gamification-element-selected").removeClass("gamification-element-selected");
        let parent = $(this).parent('.dz-preview');
        const idx = $('.dz-preview').index(parent);
        fileSelected = Dropzone.instances[0].files[idx];
        parent.addClass("file-selected");
        $('#sourceUrl').prop('checked', false);
        $('#sourceGamificationElement').prop('checked', false);
        $('#sourceFile').prop('checked', true);
    });

    /* Insert gamification element */
    $(document).on('click','.gamification-element', function(){
        $(".file-selected").removeClass("file-selected");
        $(".gamification-element-selected").removeClass("gamification-element-selected");
        $(this).addClass("gamification-element-selected");
        gamificationElementSelected = this.id;
        $('#sourceGamificationElement').prop('checked', true);
        $('#sourceUrl').prop('checked', false);
        $('#sourceFile').prop('checked', false);
    });

    $($('.ql-appearance .ql-picker-label')[0]).attr('data-value', $('#appearance').val());

    $( ".ql-editor" ).sortable({
        cancel: "h1, h2, h3, h4, h5, h6, p, countdown *, video *, source",
        items: "h1, h2, h3, h4, h5, h6, p, video, audio, iframe, countdown, progressbar, ranking, :not(div):empty, .ql-cursor, img, .ui-sortable-handle",
    });
    $('source').removeClass("ui-sortable-handle")

    /*uncomment*/
     const stopAutoplay = () => {
        $( "[autoplay]" ).each((i,e)=> {
            try {e.pause() } catch(e){}
        });
        $('iframe').each((i,e)=> {
            try {e.pauseVideo() } catch(e){}
        });
    }
    $('.ql-html-popupContainer button').click(stopAutoplay)
        
    stopAutoplay(); 
});

function onYouTubeIframeAPIReady() {
    try {
        $('iframe').each((_i,e) => {
            var player = null;
            player = new YT.Player(e, {
                events: {'onReady': () => player.stopVideo()}
            });
        });
    } catch(e){console.error(e)}
    /*uncomment
    */
    

}
    
try {
    $("document").on("click", '.ql-html-popupContainer button', () => {
        $('iframe').each((_i,e) => {
            try {
                var player = null;
                try { player.stopVideo()} catch (e) {console.error(e)}
                player = new YT.Player(e, {
                    events: { 'onReady': () => player.stopVideo(), }
                });
            } catch (e) {console.error(e)}

        });
    });
} catch(e){console.error(e, 22222)}



