import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/print';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/wordcount';

const tinymceOptions = {
    skin_url: '/static/tinymce_skins/lightgray',
    height: '150px',
    width: '570px',
    menubar: true,
    plugins: ['advlist autolink charmap codesample colorpicker contextmenu directionality fullscreen help image imagetools insertdatetime link lists media paste preview print searchreplace table textcolor textpattern wordcount'],
    toolbar: 'bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify  | outdent indent | numlist bullist | removeformat | tiny_mce_wiris_formulaEditor',
    contextmenu: "cut copy paste | link | selectall",
    content_css: [
        '/static/main.css',
        '/static/vendor/prism.css',
    ],
    body_class: 'faded-big editor',
    resize: 'both',
    branding: false,
    elementpath: false,
    block_formats: 'Header 1=h1;Header 2=h2;Paragraph=p;',
    external_plugins: {},
    file_picker_types: 'image',
    file_picker_callback: function(cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = function() {
            var file = this.files[0];

            var reader = new FileReader();
            reader.onload = function () {
                var id = 'blobid' + (new Date()).getTime();
                var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                var base64 = reader.result.split(',')[1];
                var blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }
};

export default tinymceOptions;
