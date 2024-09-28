export default (
  mainFile: String,
) => `import { load } from '@unimindsoftware/app-loader'
import { useTheme } from 'vuetify'
import {
  hexToRgb,
  initConfigStore,
  initCore,
  useConfigStore,
} from '@unimindsoftware/theme'
import { Suspense, ref, watch, inject, nextTick } from 'vue'
import router from "@unimindsoftware/router/mock";
import * as VUE from 'vue'
// Styles
import '@styles/styles/index.scss'
window._VUE = VUE;

const appLoaderSymbol = Symbol('appReloader')
window._appLoaderSymbol = appLoaderSymbol;

const AppComponent = {
  name: 'Repl',
  setup() {
    const {canLoad} = inject(appLoaderSymbol);
    return {canLoad}
  },
  render() {
    if(this.canLoad && __modules__?.['${mainFile}']?.default) {
      const Comp1 = __modules__['${mainFile}'].default
      Comp1.name = 'Repl';
      
      return <Comp1></Comp1>
    }
    return null;
  },
}

const container = {
  name: 'uc-container',
  props: {
    onAlertRef: {
      type: Function,
      default: () => {},
    },
  },
  errorCaptured(err, vm, info) {
    console.error(err, vm, info)
  },
  setup(props) {
    try{
    const { global } = useTheme()
    initCore()
    initConfigStore()
    const configStore = useConfigStore()
    const isFallbackStateActive = ref(false)
    const refLoadingIndicator = ref(null)

    watch(
      [isFallbackStateActive, refLoadingIndicator],
      () => {
        if (isFallbackStateActive.value && refLoadingIndicator.value)
          refLoadingIndicator.value.fallbackHandle()
        if (!isFallbackStateActive.value && refLoadingIndicator.value)
          refLoadingIndicator.value.resolveHandle()
      },
      { immediate: true },
    )

    return () => (
      <v-app
        style={\`--v-global-theme-primary: \${hexToRgb(global.current.value.colors.primary)}\`}
      >
        <Suspense
          timeout={0}
          onFallback={(e) => (isFallbackStateActive.value = true)}
          onResolve={(e) => (isFallbackStateActive.value = false)}
        >
          <AppComponent></AppComponent>
        </Suspense>
        <uc-alert
          isMain={true}
          ref={(ref) => props.onAlertRef?.(ref)}
        ></uc-alert>
      </v-app>
    )
    } catch (e) {
      console.debug(e);
    }
    
  },
}
const invokeLoader = async (initState, initRoute) =>
  load(async ({ UIConfig, initializeApp, appConfig }) => {
    const uiConfig = {
      ...UIConfig,
      config: {
        ...appConfig,
        authProvider: null,
        notificationProvider: null,
        hooks: UIConfig.config.hooks
      },
      container,
      modules: {...UIConfig.modules},
    };
    uiConfig.modules.router = {
      init: {
        install: app => {
          router.init.install(app, initRoute);
        }
      }
    };
    uiConfig.modules.appReloader = {
      init: {
        install: app => {
            const canLoad = ref(true);
            const reload = async () => {
              canLoad.value = false;
              nextTick(() => {
                canLoad.value = true;
              });
              // setTimeout(() => {
              //   canLoad.value = true;
              // }, 1);
            };
            window._appLoader__reload = reload;
            app.config.errorHandler = (err, instance, info) => {
                console.error(err, instance, info);
            };
            app.config.warnHandler = (msg) => {
              console.debug(msg);
            };
            app.provide(appLoaderSymbol, { reload, canLoad });
        }
      }
    };
    await initializeApp(uiConfig, initState);
    return true;
  });
`
