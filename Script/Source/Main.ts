namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let avatar: ƒ.Node;
  export let cannon: ƒ.Node;
  export let aggressive: boolean = false;
  export let graph: ƒ.Node;

  let collider: ƒ.ComponentRigidbody;

  let camera: ƒ.ComponentCamera;

  document.addEventListener(
    "interactiveViewportStarted",
    <EventListener>(<unknown>start)
  );

  interface Config {
    surviveTime: number;
    speed: number;
  }

  export enum Game {
    PLAY,
    OVER,
    WIN,
    LOOSE
  }

  export let state: Game;

  const speedRotY: number = -0.1;
  const speedRotX: number = 0.2;
  let rotationX: number = 0;
  let ctrlWalk: ƒ.Control = new ƒ.Control(
    "ctrlWalk",
    2,
    ƒ.CONTROL_TYPE.PROPORTIONAL,
    300
  );

  let time: number = 0;
  let gameState: GameState;

  let gameType: string;

  let isGrounded: boolean;
  const jumpForce: number = 600;

  let config: Config;
  let jumpSound: ƒ.ComponentAudio;
  let winSound: ƒ.ComponentAudio;

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    avatar = graph.getChildrenByName("avatar")[0];
    collider = avatar.getComponent(ƒ.ComponentRigidbody);
    collider.effectRotation = ƒ.Vector3.ZERO();
    cannon = graph
      .getChildrenByName("levels")[0]
      .getChildrenByName("run")[0]
      .getChildrenByName("cannon")[0];

    jumpSound = avatar.getComponent(ƒ.ComponentAudio);

    camera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
    camera.mtxPivot.translateZ(-10);
    camera.mtxPivot.translateY(1);

    viewport.camera = camera;
    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", hndPointerMove);
    canvas.addEventListener("click", canvas.requestPointerLock);

    gameType = localStorage.getItem("gameType");
    removeOtherLevel();
    gameState = new GameState();

    state = Game.PLAY;

    const response: Response = await fetch("config.json");
    config = await response.json();

    document.addEventListener("keydown", hndKeyDown);

    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
    ƒ.Debug.info(avatar);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    initAnim();
    document.body.addEventListener("change", initAnim);

    let theme = graph
      .getChildrenByName("sounds")[0]
      .getChildrenByName("theme_play")[0];
    let cmpAudio: ƒ.ComponentAudio = theme.getComponent(ƒ.ComponentAudio);
    cmpAudio.play(true);

    winSound = graph
      .getChildrenByName("sounds")[0]
      .getChildrenByName("woohoho")[0]
      .getComponent(ƒ.ComponentAudio);

    let hitSound = graph
      .getChildrenByName("sounds")[0]
      .getChildrenByName("hit")[0]
      .getComponent(ƒ.ComponentAudio);

    collider.addEventListener(
      ƒ.EVENT_PHYSICS.COLLISION_ENTER,
      (_event: ƒ.EventPhysics) => {
        hitSound.play(true);
      }
    );
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate(); // if physics is included and used

    if (state == Game.OVER || state == Game.WIN || state == Game.LOOSE) return;

    time += ƒ.Loop.timeFrameGame / 1000;
    if (time > config.surviveTime && gameType == "survive") showWinScreen();

    gameState.time = time.toFixed(0);
    controlWalk();
    checkIfGrounded();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function controlWalk(): void {
    const input: number = ƒ.Keyboard.mapToTrit(
      [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP],
      [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]
    );

    ctrlWalk.setInput(input);

    const input2: number = ƒ.Keyboard.mapToTrit(
      [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT],
      [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]
    );

    const vector = new ƒ.Vector3(
      (config.speed * input2 * ƒ.Loop.timeFrameGame) / 5,
      0,
      (config.speed * ctrlWalk.getOutput() * ƒ.Loop.timeFrameGame) / 5
    );

    vector.transform(avatar.mtxLocal, false);

    avatar.getComponent(ƒ.ComponentRigidbody).setVelocity(vector);
  }

  function hndPointerMove(_event: PointerEvent): void {
    avatar
      .getComponent(ƒ.ComponentRigidbody)
      .rotateBody(ƒ.Vector3.Y(_event.movementX * speedRotY));

    rotationX += _event.movementY * speedRotX;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    if (
      camera.mtxPivot.rotation.x + rotationX > -20 &&
      camera.mtxPivot.rotation.x + rotationX < 20
    )
      camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function hndKeyDown(_event: KeyboardEvent): void {
    if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
      if (isGrounded) {
        avatar
          .getComponent(ƒ.ComponentRigidbody)
          .applyLinearImpulse(new ƒ.Vector3(0, jumpForce, 0));
        jumpSound.play(true);
      }
    }
  }

  function checkIfGrounded(): void {
    let hitInfo: ƒ.RayHitInfo;
    hitInfo = ƒ.Physics.raycast(
      avatar.getComponent(ƒ.ComponentRigidbody).getPosition(),
      new ƒ.Vector3(0, -1, 0),
      1.1
    );
    isGrounded = hitInfo.hit;
  }

  function showWinScreen() {
    console.log("You are too damn good at this game!!!!");
    state = Game.WIN;
    winSound.play(true);
  }

  function showLooseScreen() {
    console.log("You are too damn bad at this game!!!!");
    state = Game.LOOSE;
  }

  function removeOtherLevel() {
    const levels = graph.getChildrenByName("levels")[0];
    if (gameType == "survive") {
      levels.removeChild(levels.getChildrenByName("run")[0]);
    } else levels.removeChild(levels.getChildrenByName("survive")[0]);
  }
}
