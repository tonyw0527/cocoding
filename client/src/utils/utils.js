// setting a image into canvas
const canvasImgSetting = (canvas, src) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
        canvas.getContext('2d').drawImage(image, 0, 0);
    }
}

// work restoring
class WorkMemory {

    constructor() {
        this.work_stack = [];
        this.tmp_stack = [];
    }

    saving(work) {
        if(this.tmp_stack.length !== 0) {
            this.tmp_stack = [];
        }
        this.work_stack.push(work);
        // max cashing lenth
        if(this.work_stack.length === 6) {
            this.work_stack.shift();
        }
    }

    moveToPrev(callback) {
        if(this.work_stack.length === 1){
            return 'end';
        }
        const popedWork = this.work_stack.pop();
        this.tmp_stack.push(popedWork);
        const prevWork = this.work_stack[this.work_stack.length-1];

        callback(prevWork);
    }

    moveToNext(callback) {
        if(this.tmp_stack.length === 0) {
            return 'end';
        }
        const nextWork = this.tmp_stack.pop();
        this.work_stack.push(nextWork);
        
        callback(nextWork);
    }

    init(init_image) {
        this.work_stack = [init_image];
        this.tmp_stack = [];
    }
}

const scrollToBottom = (ref) => {
    ref.current.scrollTop = ref.current.scrollHeight;
};


export { WorkMemory, canvasImgSetting, scrollToBottom };