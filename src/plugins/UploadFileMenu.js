import axios from '../utils/axios';

class UploadFileMenu {
    constructor() {
        this.title = 'Upload File';
        this.iconSvg = '<svg t="1684136047021" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2626" width="200" height="200"><path d="M896.28125 138.21875h-217.5c-11.53125 0-22.03125 7.5-26.71875 19.125l-28.875 44.15625c-3.84375 9.375-12.28125 15.46875-21.65625 15.46875H127.71875c-19.59375 0-35.71875 17.8125-35.71875 39.5625v589.78125c0 21.75 16.03125 39.5625 35.71875 39.5625H896.375c19.59375 0 35.71875-17.8125 35.71875-39.5625V177.78125c-0.09375-21.75-16.125-39.5625-35.8125-39.5625zM628.53125 551.9375c-12.84375 14.15625-33.75 14.15625-46.59375 0l-37.03125-40.96875v217.5h-65.8125v-217.5l-37.03125 40.96875c-12.84375 14.15625-33.75 14.15625-46.59375 0s-12.84375-37.40625 0-51.65625L512 362.1875l116.53125 138.09375c12.84375 14.15625 12.84375 37.40625 0 51.65625z" p-id="2627"></path></svg>';
        this.tag = 'button';
        this.showDropPanel = true;
        this.editor = null;

        const elm = document.createElement('input');
        elm.type = 'file';
        elm.name = 'file';
        elm.id = 'file';
        this.elm = elm;
        this.elm.addEventListener('change', this.uploadFile.bind(this));
    }

    isActive(editor) {
        return false
    }

    getValue(editor) {
        return ''
    }

    isDisabled(editor) {
        return false
    }

    exec(editor, value) {}

    getPanelContentElem(editor) {
        this.editor = editor;
        return this.elm;
    }

    uploadFile(e) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`/file/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            const fileName = res.result.path;
            this.editor.dangerouslyInsertHtml(`<p><a href="${window.location.origin}/uploads/${fileName}" target="_blank">${file.name}</a></p>`);
        }).finally(() => {
            this.elm.value = '';
        });
    }
}

const uploadFileMenuConf = {
    key: 'upload-file-menu',
    factory() {
      return new UploadFileMenu();
    },
}

export default uploadFileMenuConf;