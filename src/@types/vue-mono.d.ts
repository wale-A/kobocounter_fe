declare module "vue-mono" {
  import PluginInstallFunction from "vue";

  const MonoJS: {
    install(Vue: any, { publicKey: string });
  };

  export = MonoJS;
}
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $launchMono: Record<string, unknown>;
  }
}
