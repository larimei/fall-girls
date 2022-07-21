namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization

  let time: number = 0;
  let sound: ƒ.ComponentAudio;

  enum JOB {
    IDLE,
    NORMAL,
    AGGRESSIVE,
  }

  export class CannonStateMachine extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number =
      ƒ.Component.registerSubclass(CannonStateMachine);
    private static instructions: ƒAid.StateMachineInstructions<JOB> =
      CannonStateMachine.get();

    private cmpOuter: ƒ.ComponentRigidbody;
    private cmpInner: ƒ.ComponentRigidbody;

    constructor() {
      super();
      this.instructions = CannonStateMachine.instructions; // setup instructions with the static set

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;




      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> =
        new ƒAid.StateMachineInstructions();
      setup.transitDefault = CannonStateMachine.transitDefault;
      setup.setAction(JOB.IDLE, <ƒ.General>this.noShoot);
      setup.setAction(JOB.NORMAL, <ƒ.General>this.shoot);
      setup.setAction(JOB.AGGRESSIVE, <ƒ.General>this.shootAgressive);

      return setup;
    }

    private static transitDefault(_machine: CannonStateMachine): void {
      console.log("Transit to", _machine.stateNext);
    }

    private static async noShoot(_machine: CannonStateMachine): Promise<void> {
      //console.log("Shoot Nothing");
    }

    private static async shoot(_machine: CannonStateMachine): Promise<void> {
      time += ƒ.Loop.timeFrameGame / 1000;

      if (time > 1) {
        let shoot = new CannonShoot("Shoot", cannon.mtxLocal.translation);
        graph.addChild(shoot);
        let direction: ƒ.Vector3 = cannon.mtxLocal.getY();
        direction.x = -direction.x;
        direction.y = -direction.y;
        direction.z = -direction.z;
        direction.scale(2000);
        shoot.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(direction);
        sound.play(true);
        time = 0;
      }
    }

    private static async shootAgressive(_machine: CannonStateMachine): Promise<void> {
      time += ƒ.Loop.timeFrameGame / 1000;

      if (time > 0.3) {
        let shoot = new CannonShoot("Shoot", cannon.mtxLocal.translation);
        graph.addChild(shoot);
        let direction: ƒ.Vector3 = cannon.mtxLocal.getY();
        direction.x = -direction.x;
        direction.y = -direction.y;
        direction.z = -direction.z;
        direction.scale(2000);
        shoot.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(direction);
        sound.play(true);
        time = 0;
      }
    }

    // Activate the functions of this component as response to events
    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.transit(JOB.IDLE);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.cmpOuter = this.node.getChildrenByName("outer")[0].getComponent(ƒ.ComponentRigidbody);
          this.cmpInner = this.node.getChildrenByName("inner")[0].getComponent(ƒ.ComponentRigidbody);

          sound = this.node.getComponent(ƒ.ComponentAudio);

          this.cmpOuter.addEventListener(
            ƒ.EVENT_PHYSICS.TRIGGER_ENTER,
            (_event: ƒ.EventPhysics) => {
              if (_event.cmpRigidbody.node.name == "avatar") {
                this.node.dispatchEvent(
                  new Event("startShooting", { bubbles: true })
                );
                this.transit(JOB.NORMAL);
              }
            }
          );

          this.cmpInner.addEventListener(
            ƒ.EVENT_PHYSICS.TRIGGER_ENTER,
            (_event: ƒ.EventPhysics) => {
              if (_event.cmpRigidbody.node.name == "avatar") {
                this.node.dispatchEvent(
                  new Event("startAggressiveShooting", { bubbles: true })
                );
                this.transit(JOB.AGGRESSIVE);
              }
            }
          );

          break;
      }
    };

    private update = (_event: Event): void => {
      this.act();
    };
  }
}
