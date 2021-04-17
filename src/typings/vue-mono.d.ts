// import *   from "vue-mono";

declare module "vue-mono" {
  import PluginInstallFunction from "vue";

  const MonoJS: {
    install(Vue: any, { publicKey: string });
  };

  export = MonoJS;
}
