const DEFUALT_SCALE = 70;
const DEFAULT_QUALITY = 70;
class ImageCompressor {
    constructor(props) {
        if (!props) {
            throw "ImageCompressor : Please Set The Requirement Properties : [ originalImage , onSuccess ]";
        }
        this.props = props;
        this.props.scale = props.scale || DEFUALT_SCALE;
        this.props.quality = props.quality || DEFAULT_QUALITY;
        this.props.oFileName = props.oFileName || "image.png";

        if (!props.originalImage) {
            throw "ImageCompressor : Please set originalImage";
        }

        if (!props.onSuccess) {
            throw "ImageCompressor :  Please Set OnSucess function to get the compressed image";

            this.props.onSuccess = () => {};
        }

        if (!props.holdCompress) {
            this.compress();
        }
    }

    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    blobToFile(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    dataURLtoFile(dataurl, filename) {
        //将base64转换为文件
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    /*
      Compress The Image
  */
    compress() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let img = new Image();
        img.onload = () => {
            let scale = this.props.scale / 100;
            let width = img.width * scale;
            let height = img.height * scale;
            console.log("width", "height", width, height);

            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            ctx.drawImage(img, 0, 0, width, height);

            let quality = this.props.quality / 100;

            const output = {
                original: this.props.originalImage,
                /*  compressed: this.blobToFile(
                    this.dataURLtoBlob(canvas.toDataURL("image/jpeg", quality)),
                    "image.png"
                ),*/
                compressed: this.dataURLtoFile(
                    canvas.toDataURL("image/jpeg", quality),
                    this.props.oFileName
                ),
            };
            this.props.onSuccess(output);
        };

        img.src = this.props.originalImage;
    }

    // this function will be used if the variable holdCompress is set to true
    startCompress() {
        this.compress();
    }
}

export default ImageCompressor;
