import { baseURL } from '../utils/axios';
import { i18nChangeLanguage, Boot, $ } from '@wangeditor/editor';
import uploadFileMenuConf from '../plugins/UploadFileMenu';
import drawingBoardMenuConf from '../plugins/DrawingBoardMenu';

i18nChangeLanguage('en');

Boot.registerMenu(uploadFileMenuConf);
Boot.registerMenu(drawingBoardMenuConf);

const getEditorConfig = () => {
    let Authorization = '';
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
        Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
     
    return {
        placeholder: 'please enter content',
        MENU_CONF: {
            uploadImage: {
                server: `${baseURL}file/upload`,
                fieldName: 'file',
                headers: {
                    Authorization,
                },
                allowedFileTypes: ['image/*'],
                customInsert(res, insertFn) {
                    const url = res.result.path;
                    insertFn(`${window.location.origin}/uploads/${url}`);
                },
            },
            uploadVideo: {
                server: `${baseURL}file/upload`,
                fieldName: 'file',
                headers: {
                    Authorization,
                },
                allowedFileTypes: ['video/*'],
                meta: {
                    type: 3,
                },
                customInsert(res, insertFn) {
                    const url = res.result.path;
                    insertFn(`${window.location.origin}/uploads/${url}`);
                },
            },
        }
    }
}

const toolbarConfig = {
    insertKeys: {
        index: 22,
        keys: ['upload-file-menu', 'drawing-board-menu']
    }
}

export {
    getEditorConfig,
    toolbarConfig
}