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
import { Suspense, ref, watch } from 'vue'
import router from "@unimindsoftware/router/mock";

// Styles
import '@styles/styles/index.scss'


const container = {
  name: 'uc-container',
  props: {
    onAlertRef: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
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
    const AppComponent = __modules__['${mainFile}'].default
    AppComponent.name = 'Repl'

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
  },
}

export default async initState =>
  load(async ({ UIConfig, initializeApp, appConfig }) => {
    const uiConfig = {
      ...UIConfig,
      config: {
        ...appConfig,
        authProvider: null,
        notificationProvider: null,
        hooks: UIConfig.config.hooks
      },
      container
    };
    uiConfig.modules.router = router;
    await initializeApp(uiConfig, initState);
    return true;
  });
`

