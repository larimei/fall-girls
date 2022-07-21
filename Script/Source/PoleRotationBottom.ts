namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
  
    export class PoleRotationBottom extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(PoleRotationBottom);
      // Properties may be mutated by users in the editor via the automatically created user interface

      private isGettingFaster: boolean;
      private startRotationVelocity: number;

      private rotationVelocity: number;
  
      constructor() {
        super();

        this.isGettingFaster = true;
        this.startRotationVelocity = 50;
        this.rotationVelocity = 50;
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;
  
        ƒ.Time.game.setTimer(10, 0, this.hndTimer.bind(this));

      }
  
      private hndTimer(_event: CustomEvent): void  {
        if(this.isGettingFaster && this.rotationVelocity < this.startRotationVelocity * 1000) {
            this.rotationVelocity = Number(this.rotationVelocity) + this.startRotationVelocity / 1000;
        }      

        this.node.mtxLocal.rotate(new ƒ.Vector3(0,0,this.rotationVelocity / 100));
      }
    }
  }