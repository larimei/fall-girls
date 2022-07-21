declare namespace Script {
    function initAnim(): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CannonShoot extends ƒ.Node {
        constructor(_name: string, _pos: ƒ.Vector3);
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        NORMAL = 1,
        AGGRESSIVE = 2
    }
    export class CannonStateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        private cmpOuter;
        private cmpInner;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static noShoot;
        private static shoot;
        private static shootAgressive;
        private hndEvent;
        private update;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CircleRotationLeft extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        private hndTimer;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CircleRotationRight extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        private hndTimer;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        time: string;
        constructor();
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let avatar: ƒ.Node;
    let cannon: ƒ.Node;
    let aggressive: boolean;
    let graph: ƒ.Node;
    enum Game {
        PLAY = 0,
        OVER = 1,
        WIN = 2,
        LOOSE = 3
    }
    let state: Game;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class PoleRotationBottom extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        private isGettingFaster;
        private startRotationVelocity;
        private rotationVelocity;
        constructor();
        private hndTimer;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class PoleRotationTop extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        private rotationVelocity;
        constructor();
        private hndTimer;
    }
}
