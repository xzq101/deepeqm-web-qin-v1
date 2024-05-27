import axios from '../utils/axios';

class DrawingBoard {
    constructor(editor) {
        this.editor = editor;
        this.isDrawing = false;
        this.isErasing = false;
        this.undoStack = [];
        this.redoStack = [];
        this.brushSize = 3;
        this.brushColor = 'black';
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.initialX = 0;
        this.initialY = 0;
        if (this.isMobile) {
            this.width = window.innerWidth - 100;
            this.height = window.innerHeight - 126;
        } else {
            this.width = 800;
            this.height = 800;
        }

        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.keydown = this.keydown.bind(this);
        this.changeBrushSize = this.changeBrushSize.bind(this);
        this.changeBrushColor = this.changeBrushColor.bind(this);
        this.destroy = this.destroy.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.convertCanvasToFile = this.convertCanvasToFile.bind(this);
        this.setEraserStatus = this.setEraserStatus.bind(this);
        this.modalMoveStart = this.modalMoveStart.bind(this);
        this.modalMoveEnd = this.modalMoveEnd.bind(this);
        this.modalMove = this.modalMove.bind(this);
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = '#fff';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // root
        this.root = document.createElement('div');

        // modal
        this.modal = document.createElement('div');
        this.modal.classList.add('editor-board-modal');

        // mask
        const mask = document.createElement('div');
        mask.classList.add('editor-board-modal-mask');

        // container
        this.container = document.createElement('div');
        this.container.classList.add('editor-board-container');
        if (this.isMobile) {
            this.container.style.top = '0';
        } else {
            this.container.style.top = '20px';
        }
        this.container.style.width = `${this.canvas.width}px`;
        this.container.style.left = `${(window.innerWidth - this.canvas.width) / 2}px`;

        // header
        this.header = document.createElement('div');
        this.header.classList.add('editor-board-header');
        this.header.innerText = 'Drawing Board';

        // cancel
        this.cancelBtn = document.createElement('div');
        this.cancelBtn.classList.add('editor-board-cancel');

        // footer
        const footer = document.createElement('div');
        footer.classList.add('editor-board-footer');

        // setting
        const setting = document.createElement('div');
        setting.classList.add('editor-board-setting');

        // brush size
        this.brushSizeInput = document.createElement('input');
        this.brushSizeInput.classList.add('editor-board-brush-size');
        this.brushSizeInput.type = 'range';
        this.brushSizeInput.min = 1;
        this.brushSizeInput.max = 10;
        this.brushSizeInput.value = this.brushSize;

        // brush color
        this.brushColorInput = document.createElement('input');
        this.brushColorInput.classList.add('editor-board-brush-color');
        this.brushColorInput.type = 'color';
        this.brushColorInput.value = this.brushColor;

        // eraser
        this.eraserBtn = document.createElement('i');
        this.eraserBtn.classList.add('fas', 'fa-eraser', 'editor-board-eraser');

        // btns
        const btns = document.createElement('div');
        btns.classList.add('editor-board-btns');

        // undo
        this.undoBtn = document.createElement('div');
        this.undoBtn.classList.add('editor-board-undo');

        // redo
        this.redoBtn = document.createElement('div');
        this.redoBtn.classList.add('editor-board-redo');

        // download
        this.downloadBtn = document.createElement('div');
        this.downloadBtn.classList.add('editor-board-download', 'btn', 'btn-info', 'btn-sm');
        this.downloadBtn.innerText = 'Download';

        // upload
        this.uploadBtn = document.createElement('div');
        this.uploadBtn.classList.add('editor-board-upload', 'btn', 'btn-primary', 'btn-sm');
        this.uploadBtn.innerText = 'Upload';
        this.unloadInput = document.createElement('input');
        this.unloadInput.classList.add('editor-board-upload-input');
        this.unloadInput.type = 'file';
        this.unloadInput.accept = 'image/*';
        this.uploadBtn.appendChild(this.unloadInput);

        // submit
        this.submitBtn = document.createElement('div');
        this.submitBtn.classList.add('editor-board-submit', 'btn', 'btn-primary', 'btn-sm');
        this.submitBtn.innerText = 'Submit';

        this.root.appendChild(mask);
        this.root.appendChild(this.modal);
        this.modal.appendChild(this.container);
        this.container.appendChild(this.header);
        this.container.appendChild(this.canvas);
        this.container.appendChild(footer);
        this.header.appendChild(this.cancelBtn);
        setting.appendChild(this.brushSizeInput);
        setting.appendChild(this.brushColorInput);
        setting.appendChild(this.eraserBtn);
        btns.appendChild(this.undoBtn);
        btns.appendChild(this.redoBtn);
        btns.appendChild(this.uploadBtn);
        btns.appendChild(this.downloadBtn);
        btns.appendChild(this.submitBtn);
        footer.appendChild(setting);
        footer.appendChild(btns);
        document.body.appendChild(this.root);

        this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));

        this.bind();
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.ctx.beginPath();
        let x;
        let y;
        const offsetLeft = this.container.offsetLeft;
        const offsetTop = this.container.offsetTop + 60;
        if (e.touches) {
            x = e.touches[0].clientX - offsetLeft;
            y = e.touches[0].clientY + this.modal.scrollTop - offsetTop;
        } else {
            x = e.clientX - offsetLeft;
            y = e.clientY + this.modal.scrollTop - offsetTop;
        }
        this.ctx.moveTo(x, y);
    }

    draw(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        const offsetLeft = this.container.offsetLeft;
        const offsetTop = this.container.offsetTop + 60;
        let x;
        let y;
        if (e.touches) {
            x = e.touches[0].clientX - offsetLeft;
            y = e.touches[0].clientY + this.modal.scrollTop - offsetTop;
        } else {
            x = e.clientX - offsetLeft;
            y = e.clientY + this.modal.scrollTop - offsetTop;
        }
        
        if (this.isErasing) {
            this.ctx.beginPath();
            this.ctx.fillStyle = '#ffffff';
            this.ctx.arc(x, y, this.brushSize * 2, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        } else {
            this.ctx.lineTo(x, y);
            this.ctx.lineWidth = this.brushSize;
            this.ctx.strokeStyle = this.brushColor;
            this.ctx.stroke();
        }
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
            this.redoStack = [];
        }
    }

    undo() {
        if (this.undoStack.length > 1) {
            this.redoStack.push(this.undoStack.pop());
            this.ctx.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.undoStack.push(this.redoStack.pop());
            this.ctx.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
        }
    }

    keydown(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.keyCode === 90) {
                this.undo();
            }
            if (e.keyCode === 89) {
                this.redo();
            }
        }
    }

    changeBrushSize(e) {
        this.brushSize = e.target.value;
    }

    changeBrushColor(e) {
        this.brushColor = e.target.value;
    }

    downloadImage() {
        const dataURL = this.canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'board.png';
        a.click();
    }

    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`/file/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            const fileName = res.result.path;
            const node = { type: 'paragraph', children: [{
                type: 'image',
                src: `${window.location.origin}/uploads/${fileName}`,
                children: [{ text: '' }]
            }] }
            this.editor.insertNode(node);
            this.destroy();
        });
    }

    convertCanvasToFile() {
        this.canvas.toBlob((blob) => {
            const file = new File([blob], 'board.png', { type: 'image/png' });
            this.uploadFile(file);
        });
    }

    setEraserStatus() {
        if (this.isErasing) {
            this.isErasing = false;
            this.eraserBtn.classList.remove('active');
            this.canvas.style.cursor = 'crosshair';
        } else {
            this.isErasing = true;
            this.eraserBtn.classList.add('active');
            this.canvas.style.cursor = 'url(/eraser.png) 10 20, auto';
        }
    }

    uploadImage(e) {
        const file = e.target.files[0];
        const img = new Image();
        img.onload = () => {
            const scale = this.canvas.width / img.width;
            const height = img.height * scale;
            if (this.isMobile) {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
            } else {
                this.canvas.height = height;
                this.ctx.drawImage(img, 0, 0, this.canvas.width, height);
                this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, height));
            }
        };
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        this.unloadInput.value = '';
    }

    modalMoveStart(e) {
        this.isMoving = true;
        this.initialX = e.clientX;
        this.initialY = e.clientY;
        document.addEventListener('mousemove', this.modalMove);
        document.addEventListener('mouseup', this.modalMoveEnd);
    }

    modalMove(e) {
        if (!this.isMoving) return;
        const currentX = e.clientX;
        const currentY = e.clientY;
        const offsetX = currentX - this.initialX;
        const offsetY = currentY - this.initialY;

        requestAnimationFrame(() => {
            this.container.style.left = this.container.offsetLeft + offsetX + "px";
            this.container.style.top = this.container.offsetTop + offsetY + "px";
        });

        this.initialX = currentX;
        this.initialY = currentY;
    }

    modalMoveEnd() {
        this.isMoving = false;
        document.removeEventListener("mousemove", this.modalMove);
        document.removeEventListener("mouseup", this.modalMoveEnd);
    }
    

    bind() {
        this.canvas.addEventListener('mousedown', this.startDrawing);
        this.canvas.addEventListener('mousemove', this.draw);
        this.canvas.addEventListener('mouseup', this.stopDrawing);
        this.canvas.addEventListener('touchstart', this.startDrawing);
        this.canvas.addEventListener('touchmove', this.draw);
        this.canvas.addEventListener('touchend', this.stopDrawing);
        document.addEventListener('keydown', this.keydown);
        this.brushSizeInput.addEventListener('change', this.changeBrushSize);
        this.brushColorInput.addEventListener('change', this.changeBrushColor);
        this.cancelBtn.addEventListener('click', this.destroy);
        this.undoBtn.addEventListener('click', this.undo);
        this.redoBtn.addEventListener('click', this.redo);
        this.downloadBtn.addEventListener('click', this.downloadImage);
        this.unloadInput.addEventListener('change', this.uploadImage);
        this.submitBtn.addEventListener('click', this.convertCanvasToFile);
        this.eraserBtn.addEventListener('click', this.setEraserStatus);
        this.header.addEventListener('mousedown', this.modalMoveStart);

        document.body.style.overflow = 'hidden';
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.startDrawing);
        this.canvas.removeEventListener('mousemove', this.draw);
        this.canvas.removeEventListener('mouseup', this.stopDrawing);
        this.canvas.removeEventListener('touchstart', this.startDrawing);
        this.canvas.removeEventListener('touchmove', this.draw);
        this.canvas.removeEventListener('touchend', this.stopDrawing);
        document.removeEventListener('keydown', this.keydown);
        this.brushSizeInput.removeEventListener('change', this.changeBrushSize);
        this.brushColorInput.removeEventListener('change', this.changeBrushColor);
        this.cancelBtn.removeEventListener('click', this.destroy);
        this.undoBtn.removeEventListener('click', this.undo);
        this.redoBtn.removeEventListener('click', this.redo);
        this.downloadBtn.removeEventListener('click', this.downloadImage);
        this.unloadInput.removeEventListener('change', this.uploadImage);
        this.submitBtn.removeEventListener('click', this.convertCanvasToFile);
        this.eraserBtn.removeEventListener('click', this.setEraserStatus);
        this.header.removeEventListener('mousedown', this.modalMoveStart);
        this.root.remove();

        document.body.style.overflow = 'auto';
    }
}

class DrawingBoardMenu {
    constructor() {
        this.title = 'Drawing Board';
        this.iconSvg = '<svg t="1685769777516" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2686" width="200" height="200"><path d="M278.4 651.52c-46.464 80.512-8.96 352 1.024 334.848 80.512-139.52 204.16-34.816 290.432-166.528 46.464-80.512 18.944-183.424-61.568-229.76-80.512-46.592-183.424-19.072-229.888 61.44z" fill="#333333" p-id="2687"></path><path d="M528 555.648c-46.08-26.624-99.456-28.8-145.408-10.88L723.2 69.376c15.744-21.12 45.952-26.624 70.016-12.672 22.912 13.184 33.536 40.064 25.216 63.744L608 665.088c-9.856-44.416-37.504-84.864-80-109.44z" fill="#333333" p-id="2688"></path></svg>';
        this.tag = 'button';
        this.editor = null;
    }

    isActive(editor) {
        return false;
    }

    getValue(editor) {
        return '';
    }

    isDisabled(editor) {
        return false;
    }

    exec(editor, value) {
        this.editor = editor;
        this.drawingBoard = new DrawingBoard(editor);
    }


}

const drawingBoardMenuConf = {
    key: 'drawing-board-menu',
    factory() {
        return new DrawingBoardMenu();
    },
}

export default drawingBoardMenuConf;