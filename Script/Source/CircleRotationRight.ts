namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization

  export class CircleRotationRight extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      ƒ.Component.registerSubclass(CircleRotationRight);
    // Properties may be mutated by users in the editor via the automatically created user interface
    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

      ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));
    }

    private hndTimer(_event: CustomEvent): void {
      let rotation: number = 1000 / 2000;
      this.node.mtxLocal.rotate(new ƒ.Vector3(0, rotation, 0));
    }
  }
}
