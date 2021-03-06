namespace FudgeCore {
/** Code generated by CompileShaders.mjs using the information in CompileShaders.json */

export abstract class ShaderLitTextured extends Shader {
  public static readonly iSubclass: number = Shader.registerSubclass(ShaderLitTextured);

  public static define: string[] = [
    "TEXTURE"
];

  public static getCoat(): typeof Coat { return CoatTextured; }

  public static getVertexShaderSource(): string { 
    return this.insertDefines(shaderSources["Source/ShaderUniversal.vert"], this.define);
  }

  public static getFragmentShaderSource(): string { 
    return this.insertDefines(shaderSources["Source/ShaderUniversal.frag"], this.define);
  }

}
}