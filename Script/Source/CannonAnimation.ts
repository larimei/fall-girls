namespace Script {
    import ƒ = FudgeCore;

  
  
    export function initAnim(): void {
        
      let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      animseq.addKey(new ƒ.AnimationKey(0, 0));
      animseq.addKey(new ƒ.AnimationKey(3000, -100));
      animseq.addKey(new ƒ.AnimationKey(6000, 0));
  
      let animStructure: ƒ.AnimationStructure = {
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
  
  
      let fps: number = 30;
  
      let animation: ƒ.Animation = new ƒ.Animation("cannonAnimation", animStructure, fps);
  
      let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
      cmpAnimator.scale = 1;
      cmpAnimator.addEventListener("event", (_event: Event) => {
        let time: number = (<ƒ.ComponentAnimator>_event.target).time;
        console.log(`Event fired at ${time}`, _event);
      });
  
  
      if (cannon.getComponent(ƒ.ComponentAnimator)) {
        cannon.removeComponent(cannon.getComponent(ƒ.ComponentAnimator));
      }
  
  
      cannon.addComponent(cmpAnimator);
      cmpAnimator.activate(true);
  
      console.log("Component", cmpAnimator);
    }
}
