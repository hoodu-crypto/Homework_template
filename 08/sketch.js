const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

let engine; //엔진 객체

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  // Matter setting
  engine = Engine.create();

  // Walls
  let margin = 20;
  Composite.add(engine.world, [
    Bodies.rectangle(width / 2, height - margin, width, margin, {
      isStatic: true,
    }),
    Bodies.rectangle(width / 2, margin, width, margin, { isStatic: true }),
    Bodies.rectangle(margin, height / 2, margin, height, {
      isStatic: true,
    }),
    Bodies.rectangle(width - margin, height / 2, margin, height, {
      isStatic: true,
    }),
  ]);
}