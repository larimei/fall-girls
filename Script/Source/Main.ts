namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  export let avatar: ƒ.Node;
  let camera: ƒ.ComponentCamera;
  let graph: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>(<unknown>start));

  const speedRotY: number = -0.1;
  const speedRotX: number = 0.2;
  let rotationX: number = 0;
  let ctrlWalk: ƒ.Control = new ƒ.Control("ctrlWalk", 2, ƒ.CONTROL_TYPE.PROPORTIONAL, 300);

  let isGrounded: boolean;
  const jumpForce: number = 600;

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    avatar = graph.getChildrenByName("avatar")[0];
    
    camera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
    camera.mtxPivot.translateZ(-10);
    camera.mtxPivot.translateY(1);
    

    viewport.camera = camera;
    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", hndPointerMove);
    canvas.addEventListener("click", canvas.requestPointerLock);

    document.addEventListener("keydown", hndKeyDown);
        
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
    ƒ.Debug.info(avatar);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
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
      (1.5 * input2 * ƒ.Loop.timeFrameGame) / 20,
      0,
      (ctrlWalk.getOutput() * ƒ.Loop.timeFrameGame) / 20
    );

    vector.transform(avatar.mtxLocal, false);

    avatar.getComponent(ƒ.ComponentRigidbody).setVelocity(vector);
  }

  function hndPointerMove(_event: PointerEvent): void {
    avatar.getComponent(ƒ.ComponentRigidbody).rotateBody(ƒ.Vector3.Y(_event.movementX * speedRotY));

    rotationX += _event.movementY * speedRotX;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function hndKeyDown(_event: KeyboardEvent): void {

    if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
        if (isGrounded) avatar.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(new ƒ.Vector3(0, jumpForce, 0));
    }
}

function checkIfGrounded(): void {
    let hitInfo: ƒ.RayHitInfo;
    hitInfo = ƒ.Physics.raycast(avatar.getComponent(ƒ.ComponentRigidbody).getPosition(), new ƒ.Vector3(0, -1, 0), 1.1);
    isGrounded = hitInfo.hit;
}
}