"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function initAnim() {
        let animseq = new ƒ.AnimationSequence();
        animseq.addKey(new ƒ.AnimationKey(0, 0));
        animseq.addKey(new ƒ.AnimationKey(3000, -100));
        animseq.addKey(new ƒ.AnimationKey(6000, 0));
        let animStructure = {
            components: {
                ComponentTransform: [
                    {
                        "ƒ.ComponentTransform": {
                            mtxLocal: {
                                rotation: {
                                    y: animseq
                                }
                            }
                        }
                    }
                ]
            }
        };
        let fps = 30;
        let animation = new ƒ.Animation("cannonAnimation", animStructure, fps);
        let cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
        cmpAnimator.scale = 1;
        cmpAnimator.addEventListener("event", (_event) => {
            let time = _event.target.time;
            console.log(`Event fired at ${time}`, _event);
        });
        if (Script.cannon.getComponent(ƒ.ComponentAnimator)) {
            Script.cannon.removeComponent(Script.cannon.getComponent(ƒ.ComponentAnimator));
        }
        Script.cannon.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
        console.log("Component", cmpAnimator);
    }
    Script.initAnim = initAnim;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class CannonShoot extends ƒ.Node {
        constructor(_name, _pos) {
            super(_name);
            let cube = new ƒ.ComponentMesh(new ƒ.MeshCube());
            let shader = new ƒ.ComponentMaterial(new ƒ.Material("Shoot", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("Purple"))));
            let position = _pos;
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            this.addComponent(cube);
            this.addComponent(shader);
            this.addComponent(new ƒ.ComponentRigidbody(100.0, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE));
        }
    }
    Script.CannonShoot = CannonShoot;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let time = 0;
    let sound;
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["NORMAL"] = 1] = "NORMAL";
        JOB[JOB["AGGRESSIVE"] = 2] = "AGGRESSIVE";
    })(JOB || (JOB = {}));
    class CannonStateMachine extends ƒAid.ComponentStateMachine {
        constructor() {
            super();
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        this.transit(JOB.IDLE);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        this.cmpOuter = this.node.getChildrenByName("outer")[0].getComponent(ƒ.ComponentRigidbody);
                        this.cmpInner = this.node.getChildrenByName("inner")[0].getComponent(ƒ.ComponentRigidbody);
                        sound = this.node.getComponent(ƒ.ComponentAudio);
                        this.cmpOuter.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, (_event) => {
                            if (_event.cmpRigidbody.node.name == "avatar") {
                                this.node.dispatchEvent(new Event("startShooting", { bubbles: true }));
                                this.transit(JOB.NORMAL);
                            }
                        });
                        this.cmpInner.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, (_event) => {
                            if (_event.cmpRigidbody.node.name == "avatar") {
                                this.node.dispatchEvent(new Event("startAggressiveShooting", { bubbles: true }));
                                this.transit(JOB.AGGRESSIVE);
                            }
                        });
                        break;
                }
            };
            this.update = (_event) => {
                this.act();
            };
            this.instructions = CannonStateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = CannonStateMachine.transitDefault;
            setup.setAction(JOB.IDLE, this.noShoot);
            setup.setAction(JOB.NORMAL, this.shoot);
            setup.setAction(JOB.AGGRESSIVE, this.shootAgressive);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async noShoot(_machine) {
            //console.log("Shoot Nothing");
        }
        static async shoot(_machine) {
            time += ƒ.Loop.timeFrameGame / 1000;
            if (time > 1 && Script.state == Script.Game.PLAY) {
                let shoot = new Script.CannonShoot("Shoot", Script.cannon.mtxLocal.translation);
                Script.graph.addChild(shoot);
                let direction = Script.cannon.mtxLocal.getY();
                direction.x = -direction.x;
                direction.y = -direction.y;
                direction.z = -direction.z;
                direction.scale(2000);
                shoot.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(direction);
                sound.play(true);
                time = 0;
            }
        }
        static async shootAgressive(_machine) {
            time += ƒ.Loop.timeFrameGame / 1000;
            if (time > 0.3 && Script.state == Script.Game.PLAY) {
                let shoot = new Script.CannonShoot("Shoot", Script.cannon.mtxLocal.translation);
                Script.graph.addChild(shoot);
                let direction = Script.cannon.mtxLocal.getY();
                direction.x = -direction.x;
                direction.y = -direction.y;
                direction.z = -direction.z;
                direction.scale(2000);
                shoot.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(direction);
                sound.play(true);
                time = 0;
            }
        }
    }
    CannonStateMachine.iSubclass = ƒ.Component.registerSubclass(CannonStateMachine);
    CannonStateMachine.instructions = CannonStateMachine.get();
    Script.CannonStateMachine = CannonStateMachine;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CircleRotationLeft extends ƒ.ComponentScript {
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            let rotation = 1000 / 2000;
            rotation = rotation * -1;
            this.node.mtxLocal.rotate(new ƒ.Vector3(0, rotation, 0));
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CircleRotationLeft.iSubclass = ƒ.Component.registerSubclass(CircleRotationLeft);
    Script.CircleRotationLeft = CircleRotationLeft;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CircleRotationRight extends ƒ.ComponentScript {
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            let rotation = 1000 / 2000;
            this.node.mtxLocal.rotate(new ƒ.Vector3(0, rotation, 0));
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CircleRotationRight.iSubclass = ƒ.Component.registerSubclass(CircleRotationRight);
    Script.CircleRotationRight = CircleRotationRight;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
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
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super();
            this.time = "";
            this.loose = false;
            this.win = false;
            const domVui = document.querySelector("div#vui");
            this.winImage = document.getElementById("win");
            this.looseImage = document.getElementById("loose");
            console.log("Vui-Controller", new ƒUi.Controller(this, domVui));
        }
        winGame(audio) {
            this.winImage.style.display = "block";
            if (!audio.isPlaying) {
                audio.play(true);
                setTimeout(() => { location.reload(); }, 5000);
            }
        }
        looseGame(audio) {
            this.looseImage.style.display = "block";
            if (!audio.isPlaying) {
                audio.play(true);
                setTimeout(() => { location.reload(); }, 3000);
            }
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    Script.aggressive = false;
    let collider;
    let camera;
    document.addEventListener("interactiveViewportStarted", start);
    let Game;
    (function (Game) {
        Game[Game["PLAY"] = 0] = "PLAY";
        Game[Game["OVER"] = 1] = "OVER";
        Game[Game["WIN"] = 2] = "WIN";
        Game[Game["LOOSE"] = 3] = "LOOSE";
    })(Game = Script.Game || (Script.Game = {}));
    const speedRotY = -0.1;
    const speedRotX = 0.2;
    let rotationX = 0;
    let ctrlWalk = new ƒ.Control("ctrlWalk", 2, 0 /* PROPORTIONAL */, 300);
    let time = 0;
    let gameState;
    let gameType;
    let isGrounded;
    const jumpForce = 600;
    let config;
    let jumpSound;
    let winSound;
    let winTheme;
    let looseTheme;
    let theme;
    async function start(_event) {
        Script.viewport = _event.detail;
        Script.graph = Script.viewport.getBranch();
        Script.avatar = Script.graph.getChildrenByName("avatar")[0];
        collider = Script.avatar.getComponent(ƒ.ComponentRigidbody);
        collider.effectRotation = ƒ.Vector3.ZERO();
        Script.cannon = Script.graph
            .getChildrenByName("levels")[0]
            .getChildrenByName("run")[0]
            .getChildrenByName("cannon")[0];
        jumpSound = Script.avatar.getComponent(ƒ.ComponentAudio);
        camera = Script.avatar.getChild(0).getComponent(ƒ.ComponentCamera);
        camera.mtxPivot.translateZ(-10);
        camera.mtxPivot.translateY(1);
        camera.clrBackground = ƒ.Color.CSS("#65b3ff");
        Script.viewport.camera = camera;
        let canvas = Script.viewport.getCanvas();
        canvas.addEventListener("pointermove", hndPointerMove);
        canvas.addEventListener("click", canvas.requestPointerLock);
        gameType = localStorage.getItem("gameType");
        removeOtherLevel();
        gameState = new Script.GameState();
        Script.state = Game.PLAY;
        const response = await fetch("config.json");
        config = await response.json();
        document.addEventListener("keydown", hndKeyDown);
        //viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        ƒ.Debug.info(Script.avatar);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        Script.initAnim();
        document.body.addEventListener("change", Script.initAnim);
        theme = Script.graph
            .getChildrenByName("sounds")[0]
            .getChildrenByName("theme_play")[0]
            .getComponent(ƒ.ComponentAudio);
        theme.play(true);
        winSound = Script.graph
            .getChildrenByName("sounds")[0]
            .getChildrenByName("woohoho")[0]
            .getComponent(ƒ.ComponentAudio);
        winTheme = Script.graph
            .getChildrenByName("sounds")[0]
            .getChildrenByName("win_theme")[0]
            .getComponent(ƒ.ComponentAudio);
        looseTheme = Script.graph
            .getChildrenByName("sounds")[0]
            .getChildrenByName("loose_theme")[0]
            .getComponent(ƒ.ComponentAudio);
        let hitSound = Script.graph
            .getChildrenByName("sounds")[0]
            .getChildrenByName("hit")[0]
            .getComponent(ƒ.ComponentAudio);
        collider.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, (_event) => {
            if (_event.cmpRigidbody.node.name == "shoot" ||
                _event.cmpRigidbody.node.name == "child") {
                hitSound.play(true);
            }
        });
        if (gameType == "run") {
            let winTrigger = Script.graph
                .getChildrenByName("levels")[0]
                .getChildrenByName("run")[0]
                .getChildrenByName("goalTrigger")[0]
                .getComponent(ƒ.ComponentRigidbody);
            winTrigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, (_event) => {
                theme.play(false);
                showWinScreen();
            });
        }
        let looseTrigger = Script.graph
            .getChildrenByName("levels")[0]
            .getChildrenByName("fallTrigger")[0]
            .getComponent(ƒ.ComponentRigidbody);
        looseTrigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, (_event) => {
            if (_event.cmpRigidbody.node.name == "avatar") {
                theme.play(false);
                showLooseScreen();
            }
        });
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        if (Script.state == Game.OVER || Script.state == Game.WIN || Script.state == Game.LOOSE)
            return;
        time += ƒ.Loop.timeFrameGame / 1000;
        if (time > config.surviveTime && gameType == "survive") {
            theme.play(false);
            showWinScreen();
        }
        gameState.time = time.toFixed(0);
        controlWalk();
        checkIfGrounded();
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controlWalk() {
        const input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrlWalk.setInput(input);
        const input2 = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        const vector = new ƒ.Vector3((config.speed * input2 * ƒ.Loop.timeFrameGame) / 5, 0, (config.speed * ctrlWalk.getOutput() * ƒ.Loop.timeFrameGame) / 5);
        vector.transform(Script.avatar.mtxLocal, false);
        Script.avatar.getComponent(ƒ.ComponentRigidbody).setVelocity(vector);
    }
    function hndPointerMove(_event) {
        Script.avatar
            .getComponent(ƒ.ComponentRigidbody)
            .rotateBody(ƒ.Vector3.Y(_event.movementX * speedRotY));
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        if (camera.mtxPivot.rotation.x + rotationX > -20 &&
            camera.mtxPivot.rotation.x + rotationX < 20)
            camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function hndKeyDown(_event) {
        if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
            if (isGrounded) {
                Script.avatar
                    .getComponent(ƒ.ComponentRigidbody)
                    .applyLinearImpulse(new ƒ.Vector3(0, jumpForce, 0));
                jumpSound.play(true);
            }
        }
    }
    function checkIfGrounded() {
        let hitInfo;
        hitInfo = ƒ.Physics.raycast(Script.avatar.getComponent(ƒ.ComponentRigidbody).getPosition(), new ƒ.Vector3(0, -1, 0), 1.1);
        isGrounded = hitInfo.hit;
    }
    function showWinScreen() {
        console.log("You are too damn good at this game!!!!");
        Script.state = Game.WIN;
        winSound.play(true);
        gameState.winGame(winTheme);
    }
    function showLooseScreen() {
        console.log("You are too damn bad at this game!!!!");
        Script.state = Game.LOOSE;
        gameState.looseGame(looseTheme);
    }
    function removeOtherLevel() {
        const levels = Script.graph.getChildrenByName("levels")[0];
        if (gameType == "survive") {
            levels.removeChild(levels.getChildrenByName("run")[0]);
        }
        else
            levels.removeChild(levels.getChildrenByName("survive")[0]);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PoleRotationBottom extends ƒ.ComponentScript {
        constructor() {
            super();
            this.isGettingFaster = true;
            this.startRotationVelocity = 50;
            this.rotationVelocity = 50;
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            if (this.isGettingFaster && this.rotationVelocity < this.startRotationVelocity * 1000) {
                this.rotationVelocity = Number(this.rotationVelocity) + this.startRotationVelocity / 1000;
            }
            this.node.mtxLocal.rotate(new ƒ.Vector3(0, 0, this.rotationVelocity / 100));
        }
    }
    // Register the script as component for use in the editor via drag&drop
    PoleRotationBottom.iSubclass = ƒ.Component.registerSubclass(PoleRotationBottom);
    Script.PoleRotationBottom = PoleRotationBottom;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PoleRotationTop extends ƒ.ComponentScript {
        constructor() {
            super();
            this.rotationVelocity = 50;
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            this.node.mtxLocal.rotate(new ƒ.Vector3(0, 0, this.rotationVelocity / 100));
        }
    }
    // Register the script as component for use in the editor via drag&drop
    PoleRotationTop.iSubclass = ƒ.Component.registerSubclass(PoleRotationTop);
    Script.PoleRotationTop = PoleRotationTop;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map