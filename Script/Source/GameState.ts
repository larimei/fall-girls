namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    public time: string = "";
    public loose: boolean = false;
    public win: boolean = false;

    public winImage: HTMLElement;
    public looseImage: HTMLElement

    public constructor() {
      super();
      const domVui: HTMLDivElement = document.querySelector("div#vui");
      this.winImage = document.getElementById("win");
      this.looseImage = document.getElementById("loose");
      console.log("Vui-Controller", new ƒUi.Controller(this, domVui));
    }

    public winGame(audio: ƒ.ComponentAudio) {
      this.winImage.style.display = "block";
      if (!audio.isPlaying) {
         audio.play(true);
      }
    }

    public looseGame(audio: ƒ.ComponentAudio) {
      this.looseImage.style.display = "block";
      if (!audio.isPlaying) {
        audio.play(true);
     }
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {}
  }
}
