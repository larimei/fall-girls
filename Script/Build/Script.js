"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let camera;
    let graph;
    document.addEventListener("interactiveViewportStarted", start);
    const speedRotY = -0.1;
    const speedRotX = 0.2;
    let rotationX = 0;
    let ctrlWalk = new ƒ.Control("ctrlWalk", 2, 0 /* PROPORTIONAL */, 300);
    let isGrounded;
    const jumpForce = 600;
    async function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        Script.avatar = graph.getChildrenByName("avatar")[0];
        camera = Script.avatar.getChild(0).getComponent(ƒ.ComponentCamera);
        camera.mtxPivot.translateZ(-10);
        camera.mtxPivot.translateY(1);
        viewport.camera = camera;
        let canvas = viewport.getCanvas();
        canvas.addEventListener("pointermove", hndPointerMove);
        canvas.addEventListener("click", canvas.requestPointerLock);
        document.addEventListener("keydown", hndKeyDown);
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        ƒ.Debug.info(Script.avatar);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        controlWalk();
        checkIfGrounded();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controlWalk() {
        const input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrlWalk.setInput(input);
        const input2 = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        const vector = new ƒ.Vector3((1.5 * input2 * ƒ.Loop.timeFrameGame) / 20, 0, (ctrlWalk.getOutput() * ƒ.Loop.timeFrameGame) / 20);
        vector.transform(Script.avatar.mtxLocal, false);
        Script.avatar.getComponent(ƒ.ComponentRigidbody).setVelocity(vector);
    }
    function hndPointerMove(_event) {
        Script.avatar.getComponent(ƒ.ComponentRigidbody).rotateBody(ƒ.Vector3.Y(_event.movementX * speedRotY));
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function hndKeyDown(_event) {
        if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
            if (isGrounded)
                Script.avatar.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(new ƒ.Vector3(0, jumpForce, 0));
        }
    }
    function checkIfGrounded() {
        let hitInfo;
        hitInfo = ƒ.Physics.raycast(Script.avatar.getComponent(ƒ.ComponentRigidbody).getPosition(), new ƒ.Vector3(0, -1, 0), 1.1);
        isGrounded = hitInfo.hit;
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PoleRotation extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(PoleRotation);
        // Properties may be mutated by users in the editor via the automatically created user interface
        isGettingFaster;
        startRotationVelocity;
        rotationVelocity;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            if (this.isGettingFaster && this.rotationVelocity < this.startRotationVelocity * 500) {
                this.rotationVelocity = Number(this.rotationVelocity) + this.startRotationVelocity / 500;
                ƒ.Debug.info(this.rotationVelocity);
            }
            this.node.mtxLocal.rotate(new ƒ.Vector3(0, 0, this.rotationVelocity / 100));
        }
    }
    Script.PoleRotation = PoleRotation;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map