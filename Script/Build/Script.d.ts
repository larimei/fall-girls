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
    let avatar: ƒ.Node;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class PoleRotation extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        private isGettingFaster;
        private startRotationVelocity;
        private rotationVelocity;
        constructor();
        private hndTimer;
    }
}
