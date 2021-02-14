import { Vue, Component, Prop } from "nuxt-property-decorator";

@Component({
  name: "_SampleKebabName_"
})
export default class _SamplePascalName_ extends Vue {
  @Prop({ type: String, default: "hello world" }) msg: string | undefined;
}
