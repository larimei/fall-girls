namespace Script {
    import ƒ = FudgeCore;

    export class CannonShoot extends ƒ.Node { 

        constructor(_name: string, _pos: ƒ.Vector3) {
            super(_name);
            let cube: ƒ.ComponentMesh = new ƒ.ComponentMesh(new ƒ.MeshCube());
            let shader: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(new ƒ.Material("Shoot", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("Purple"))));
            let position: ƒ.Vector3 = _pos;
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            this.addComponent(cube);
            this.addComponent(shader);
            this.addComponent(new ƒ.ComponentRigidbody(100.0, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE));
        }
    }
}