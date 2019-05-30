// You can also require other files to run in this process
feather.replace()

// Tabs data
function showTab(tabName) {
    var i, tabcontent, tablink;
    tabcontent = $(".tab-content")

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablink = $(".tab-link")

    for (i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace(" active", "");
    }

    $("#" + tabName).fadeIn(1000);
    $("#" + tabName).addClass(" active");
}

$(document).ready(function () {
    showTab('decoder')
});

FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

FilePond.create(
    document.getElementById("file"), {
        acceptedFileTypes: ['image/png', 'image/jpg', 'image/jpeg'],
        fileValidateTypeDetectType: (source, type) => new Promise((resolve, reject) => {
            resolve(type);
        }),
        allowDrop: false,
        labelIdle: '<span class="filepond--label-action"> Browse for file</span>'
    }
);

tinymce.init({
    selector: 'textarea',
    height: "280px"
});

function handleFileSelect(evt) {
    var original = document.getElementById("original"),
        stego = document.getElementById("stego"),
        encodedText = document.getElementById("encodedText"),
        alertNotEncoded = document.getElementById("alertNotEncoded"),
        btnGroup = document.getElementById("btnGroup"),
        img = document.getElementById("img"),
        cover = document.getElementById("cover"),
        message = document.getElementById("message"),
        name = document.getElementById('file').value;

    if (!original || !stego) return;

    var files = evt.target.files;

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function (theFile) {

            return function (e) {
                img.src = e.target.result;
                img.title = escape(theFile.name);
                stego.className = "row pt-5 pt-md-3 d-none";
                encodedText.className = "row py-3 d-none"
                alertNotEncoded.className = "alert alert-warning d-none"
                btnGroup.className = "row pt-3 py-md-4 d-flex"
                cover.src = "";
                message.innerHTML = "";
                tinyMCE.get('text').setContent(message.innerHTML);
                updateCapacity();
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function hide() {
    var stego = document.getElementById("stego"),
        img = document.getElementById("img"),
        cover = document.getElementById("cover"),
        message = document.getElementById("message"),
        encodedText = document.getElementById("encodedText"),
        alertNotEncoded = document.getElementById("alertNotEncoded"),
        textarea = tinyMCE.get('text').getContent(),
        download = document.getElementById("download");

    if (img && textarea) {
        encodedText.className = "row py-3 d-none"
        cover.src = steg.encode(textarea, img);
        alertNotEncoded.className = "alert alert-warning d-none"
        stego.className = "row pt-5 pt-md-3 d-block";
        download.href = cover.src.replace("image/png", "image/octet-stream");
    }
}

function read() {
    var img = document.getElementById("img"),
        cover = document.getElementById("cover"),
        message = document.getElementById("message"),
        encodedText = document.getElementById("encodedText"),
        alertNotEncoded = document.getElementById("alertNotEncoded"),
        stego = document.getElementById("stego"),
        textarea = tinyMCE.get('text').getContent();

    if (img) {
        message.innerHTML = steg.decode(img);
        stego.className = "row pt-5 pt-md-3 d-none"

        if (message.innerHTML !== "") {
            alertNotEncoded.className = "alert alert-warning d-none"
            textarea = message.innerHTML;
            tinyMCE.get('text').setContent(message.innerHTML);
            updateCapacity();
        } else {
            alertNotEncoded.className = "alert alert-warning"
        }
    }
}

function updateCapacity() {
    var img = document.getElementById('img'),
        textarea = tinyMCE.get('text').getContent();
    if (img && text)
        document.getElementById('capacity').innerHTML = '(' + textarea.length + '/' + steg
        .getHidingCapacity(
            img) +
        ' chars remaining)';
    $('#bar').attr("aria-valuemax", steg.getHidingCapacity(img));
    $('#bar').attr("aria-valuenow", textarea.length);
    $('#bar').attr("style", "width: " + Math.round(textarea.length / steg.getHidingCapacity(img) * 100) +
        "%;");
}

window.onload = function () {
    tinymce.get('text').on('keyup', function (e) {
        var img = document.getElementById('img'),
            textarea = tinyMCE.get('text').getContent();
        if (img && text)
            document.getElementById('capacity').innerHTML = '(' + textarea.length + '/' + steg
            .getHidingCapacity(
                img) + ' chars remaining)';
        $('#bar').attr("aria-valuemax", steg.getHidingCapacity(img));
        $('#bar').attr("aria-valuenow", textarea.length);
        $('#bar').attr("style", "width: " + Math.round(textarea.length / steg.getHidingCapacity(
            img) * 100) + "%;");
    });
    document.getElementById('file').addEventListener('change', handleFileSelect, false);
    document.getElementById('file').addEventListener('change', read, false);
    document.getElementById('hide').addEventListener('click', hide, false);
    document.getElementById('read').addEventListener('click', read, false);
    document.getElementById('text').addEventListener('keyup', updateCapacity, false);
    updateCapacity();
};
