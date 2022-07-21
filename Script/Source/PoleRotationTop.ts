namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
  
    export class PoleRotationTop extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(PoleRotationTop);
      // Properties may be mutated by users in the editor via the automatically created user interface

      private rotationVelocity: number;
  
      constructor() {
        super();

        this.rotationVelocity = 50;
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;
  
        ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));

      }
  
      private hndTimer(_event: CustomEvent): void  {   

        this.node.mtxLocal.rotate(new ƒ.Vector3(0,0,this.rotationVelocity / 100));
      }
    }
  }