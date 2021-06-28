import katex from 'katex';

const gravity = 9.80665;
const canvas: HTMLCanvasElement = document.querySelector(`canvas`)!;
let mt: number = 6;
let ps: number = 1;
let dp: number = 2;

const velocity_input: HTMLInputElement = document.querySelector(`input.velocity`)!;
const angle_input: HTMLInputElement = document.querySelector(`input.angle`)!;
const pixel_per_mt_input: HTMLInputElement = document.querySelector(`input.pixel_per_mt`)!;
const pixel_per_mt_input_value: HTMLInputElement = document.querySelector(`span.pixel_per_mt_value`)!;
pixel_per_mt_input.addEventListener(`input`, e => {
    pixel_per_mt_input_value.innerText = pixel_per_mt_input.value;
})
const playback_speed_input: HTMLInputElement = document.querySelector(`input.playback_speed`)!;
const playback_speed_input_value: HTMLInputElement = document.querySelector(`span.playback_speed_value`)!;
playback_speed_input.addEventListener(`input`, e => {
    playback_speed_input_value.innerText = playback_speed_input.value;
})
const decimal_places_input: HTMLInputElement = document.querySelector(`input.decimal_places_input`)!;
const button: HTMLButtonElement = document.querySelector(`button.input_btn`)!;
let board: Board;
button.addEventListener(`click`, submitHandler)

interface IDOM{
    time: HTMLSpanElement,
    x_coordinate: HTMLSpanElement,
    y_coordinate: HTMLSpanElement,
    y_velocity: HTMLSpanElement,
    gravity: HTMLSpanElement,
    vertical_velocity: HTMLSpanElement,
    horizontal_velocity: HTMLSpanElement,
    range: HTMLSpanElement,
    height: HTMLSpanElement,
    time_of_flight: HTMLSpanElement,
}

let DOMCollection: IDOM = {
    time: document.querySelector(`span.time`)!,
    x_coordinate: document.querySelector(`span.x_coordinate`)!,
    y_coordinate: document.querySelector(`span.y_coordinate`)!,
    y_velocity: document.querySelector(`span.v_y`)!,
    gravity: document.querySelector(`span.gravity`)!,
    vertical_velocity: document.querySelector(`span.vertical_velocity`)!,
    horizontal_velocity: document.querySelector(`span.horizontal_velocity`)!,
    range: document.querySelector(`span.range`)!,
    height: document.querySelector(`span.height`)!,
    time_of_flight: document.querySelector(`span.time_of_flight`)!,
}
class Board {
    velocity: number;
    angle: number;
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    
    obj!: Obj;

    bgColor: string = `rgb(42, 42, 42)`;
    fgColor: string = `white`;
    width: number;
    height: number;

    time: number;
    vertical_velocity: number;
    horizontal_velocity: number;
    range: number;
    maxHeight: number;

    trajectoryLocus: Obj;
    trajectory: Obj[];
    projectile: undefined | number;

    DOM: IDOM;
    constructor(velocity: number, angle: number, canvas: HTMLCanvasElement, DOMCollection: IDOM) {
        this.velocity = velocity;
        this.angle = angle;
        this.canvas = canvas;
        this.ctx = canvas.getContext(`2d`)!;
        this.obj = new Obj(this);
        
        this.horizontal_velocity = this.velocity*Math.cos(this.angle*Math.PI/180);
        this.vertical_velocity = this.velocity*Math.sin(this.angle*Math.PI/180);
        this.time = 2*this.vertical_velocity/gravity;
        this.range = this.horizontal_velocity*this.time;
        this.maxHeight = gravity*this.time*this.time/8;

        this.width = this.range*mt;
        this.height = this.maxHeight*mt + 20;
        this.DOM = DOMCollection;
        if(this.angle > 87){
            this.width += 20
        }


        this.trajectoryLocus = new Obj(this, {radius: 1, lineWidth: 0.4});
        this.trajectory = [];
        this.mountCanvas();
        this.renderDisplay();

        setTimeout(() => this.simulateTrajectory(), 500)
    }
    renderDisplay() : void{
        katex.render(`\\text{Gravity (}g\\text{)} = ${gravity.toFixed(dp)}`, this.DOM.gravity);
        katex.render(`v_x = v\\cdot \\cos{\\theta} = ${this.velocity}\\cdot \\cos${this.angle} \\degree \\implies \\boxed{v_x = ${this.horizontal_velocity.toFixed(dp)} \\text{ }[m/s^2]}`, this.DOM.horizontal_velocity);
        katex.render(`v_y = v\\cdot \\sin{\\theta} = ${this.velocity}\\cdot \\sin${this.angle} \\degree \\implies \\boxed{v_y = ${this.vertical_velocity.toFixed(dp)} \\text{ }[m/s^2]}`, this.DOM.vertical_velocity);
        katex.render(`\\text{Time of Flight (}T \\text{)} = \\frac{2\\cdot v_y}{g} \\implies \\boxed{T = ${this.time.toFixed(dp)} \\text{ }[s]}`, this.DOM.time_of_flight);
        katex.render(`\\text{Range} = v_x\\cdot t = ${this.horizontal_velocity.toFixed(dp)}\\times ${this.time.toFixed(dp)} \\implies \\boxed{R = ${this.range.toFixed(dp)} \\text{ }[m]}`, this.DOM.range);
        katex.render(`\\text{Height (}H_{max}\\text{)} = \\frac{g\\cdot (\\frac{T}2)^2}{2} \\implies \\boxed{H_{max} = ${this.maxHeight.toFixed(dp)} \\text{ }[m]}`, this.DOM.height);
    };
    mountCanvas() : void{
        this.canvas.height = this.height;
        this.canvas.width = this.width;
    };
    simulateTrajectory() : void{
        let start: null | number = null, curr: number, t: number, x: number, y: number;
        const animate: FrameRequestCallback = ts => {
            if(start === null){
                start = ts;
            }
            curr = (ts - start)/(1000);
            t = curr*ps;
            x = this.horizontal_velocity*t;
            y = this.vertical_velocity*t - 1/2*gravity*t*t;

            this.obj.x = x;
            this.trajectoryLocus.x = x;
            this.obj.y = y;
            this.trajectoryLocus.y = y;

            this.trajectory.push(Object.assign(Object.create(Object.getPrototypeOf(this.trajectoryLocus)), this.trajectoryLocus));
            this.render();
            this.DOM.time.innerHTML = katex.renderToString(`t = ${t.toFixed(dp)} \\text{ }s`);
            this.DOM.x_coordinate.innerHTML = katex.renderToString(`x = ${this.obj.x.toFixed(dp)} \\text{ }m`);
            this.DOM.y_coordinate.innerHTML = katex.renderToString(`y = ${this.obj.y.toFixed(dp)} \\text{ }m`)
            this.DOM.y_velocity.innerHTML = katex.renderToString(`v_y = ${(this.vertical_velocity - gravity * t).toFixed(dp)} \\text{ }m`)

            if(x > this.range){
                return;
            }
            this.projectile = window.requestAnimationFrame(animate);
        }
        this.projectile = window.requestAnimationFrame(animate);
    }

    render() : void{
        this.drawEnv();
        this.obj.render();
        this.trajectoryLocus.render();
        for(let i = 0; i < this.trajectory.length; i++){
            this.trajectory[i].render();
        }
    };
    drawEnv() : void{
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.fgColor;
        this.ctx.lineWidth = 0.2;
        for(let i = 0; i <= this.width; i += mt){
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.height);
        }
        for(let i = this.height; i >= 0; i -= mt){
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.width, i);
        }
        for(let i = 0; i <= this.width; i += mt*10){
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.height);
        }
        for(let i = this.height; i >= 0; i -= mt*10){
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.width, i);
        }
        this.ctx.stroke();
    };
}

class Obj {
    parentBoard: Board;
    x: number;
    y: number;
    radius: number;
    color: string;
    lineWidth: number;
    constructor(parentBoard: Board, { radius = 10, color = `white`, lineWidth = 2}:
        { radius?: number, color?: string, lineWidth?: number } = {}){
        this.parentBoard = parentBoard;
        this.x = 0;
        this.y = 0;
        this.radius = radius;
        this.color = color;
        this.lineWidth = lineWidth;

    };
    render() : Obj{
        this.draw(this.parentBoard.ctx, this.color);
        return this;
    };
    draw(ctx: CanvasRenderingContext2D, color: string) : Obj{
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x*mt, this.parentBoard.height - this.y*mt, this.radius, 0, 2*Math.PI);
        ctx.stroke();;
        return this; 
    };
}

let velocity: number | string, angle: number | string;

function submitHandler(e: Event){
    e.preventDefault();
    velocity = velocity_input.value;
    angle = angle_input.value;
    if(velocity === "" || angle === ""){
        throw (`Invalid Input`);
    }
    if(isNaN(parseFloat(velocity)) || isNaN(parseFloat(angle))){
        throw (`Invalid Input`);
    }else{
        velocity = parseFloat(velocity);
        angle = parseFloat(angle);
        if(angle > 90 || angle < 0){
            throw (`Invalid Input`);
        }
        if(velocity > 80 || velocity < 0){
            throw (`Invalid Input`);
        }
        mt = parseInt(pixel_per_mt_input.value);
        ps = parseFloat(playback_speed_input.value);
        dp = decimal_places_input.checked ? 0 : 2;
        board = new Board(velocity, angle, canvas, DOMCollection)
    }
};
